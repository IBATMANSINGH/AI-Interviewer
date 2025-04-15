import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Create axios instance with default configuration
const openRouterApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${API_KEY}`
  }
});

/**
 * Generate a question based on the interview topic
 * @param {string} topic - The interview topic
 * @param {number} questionNumber - The current question number
 * @param {Array} previousQuestionsAnswers - Previous questions and answers
 * @returns {Promise} - The response from the API
 */
export const generateQuestion = async (topic, questionNumber, previousQuestionsAnswers = []) => {
  try {
    const response = await openRouterApi.post('', {
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        { role: 'system', content: `You are an expert interviewer for ${topic}. Ask challenging but fair questions. This is question number ${questionNumber} of a short 3-question interview. Make each question count and cover different aspects of ${topic}.

The questions should be specific enough that it would be obvious if a candidate gives an unrelated or generic answer. Design questions that test actual knowledge of ${topic} rather than allowing for generic responses.` },
        ...previousQuestionsAnswers.map(qa => [
          { role: 'assistant', content: qa.question },
          { role: 'user', content: qa.answer }
        ]).flat(),
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'interview_question',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              question: {
                type: 'string',
                description: 'The interview question to ask the candidate'
              },
              context: {
                type: 'string',
                description: 'Additional context or information about why this question is relevant'
              }
            },
            required: ['question', 'context'],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.data.choices[0].message.content;

    // Check if the response is JSON or plain text
    try {
      // Try to parse as JSON first
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (parseError) {
      // If it's not valid JSON, create a structured object from the text
      console.log('Response is not in JSON format, creating structured object:', content);
      return {
        question: content.replace(/^Here's your first question:\s*\n\n\*\*Question \d+:\*\*\s*/i, ''),
        context: 'Generated from unstructured response'
      };
    }
  } catch (error) {
    console.error('Error generating question:', error);
    throw error;
  }
};

/**
 * Evaluate the user's answer to a question
 * @param {string} topic - The interview topic
 * @param {string} question - The question asked
 * @param {string} answer - The user's answer
 * @returns {Promise} - The response from the API
 */
export const evaluateAnswer = async (topic, question, answer) => {
  try {
    const response = await openRouterApi.post('', {
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        { role: 'system', content: `You are an expert evaluator for ${topic} interviews. Evaluate the candidate's answer fairly and provide constructive feedback.

IMPORTANT SCORING GUIDELINES:
- Score from 1-10 where 10 is excellent
- Give scores of 1-2 for answers that are completely unrelated to the question or topic
- Give scores of 3-4 for answers that are somewhat related but miss the main point
- Give scores of 5-6 for average answers that address the question but lack depth
- Give scores of 7-8 for good answers with solid understanding
- Give scores of 9-10 for excellent answers with comprehensive understanding

If the answer is completely off-topic or unrelated to the question, you MUST give a very low score (1-2) and clearly explain why in the feedback.` },
        { role: 'user', content: `Question: ${question}\n\nCandidate's Answer: ${answer}` }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'answer_evaluation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              score: {
                type: 'number',
                description: 'Score from 1-10 where 10 is excellent. Give scores of 1-2 for completely unrelated answers.'
              },
              feedback: {
                type: 'string',
                description: 'Constructive feedback on the answer. If the answer is unrelated, clearly state this fact.'
              },
              strengths: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Key strengths of the answer. For completely unrelated answers, this may be empty or minimal.'
              },
              areas_for_improvement: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Areas where the answer could be improved. For unrelated answers, include "Answer is unrelated to the question" as the first item.'
              }
            },
            required: ['score', 'feedback', 'strengths', 'areas_for_improvement'],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.data.choices[0].message.content;

    // Check if the response is JSON or plain text
    try {
      // Try to parse as JSON first
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (parseError) {
      // If it's not valid JSON, create a structured object from the text
      console.log('Response is not in JSON format, creating structured object:', content);
      return {
        score: 2, // Default low score for parsing errors
        feedback: content,
        strengths: ['Unable to identify strengths due to response format issue'],
        areas_for_improvement: ['Answer may be unrelated to the question', 'Response format issue - please retry']
      };
    }
  } catch (error) {
    console.error('Error evaluating answer:', error);
    throw error;
  }
};

/**
 * Generate a final evaluation of the entire interview
 * @param {string} topic - The interview topic
 * @param {Array} questionsAnswers - All questions and answers from the interview
 * @param {Array} evaluations - All evaluations for each answer
 * @returns {Promise} - The response from the API
 */
export const generateFinalEvaluation = async (topic, questionsAnswers, evaluations) => {
  try {
    const interviewSummary = questionsAnswers.map((qa, index) => {
      return `Question ${index + 1}: ${qa.question}\nAnswer: ${qa.answer}\nEvaluation: Score ${evaluations[index].score}/10 - ${evaluations[index].feedback}`;
    }).join('\n\n');

    const response = await openRouterApi.post('', {
      model: 'meta-llama/llama-4-maverick:free',
      messages: [
        { role: 'system', content: `You are an expert interviewer for ${topic}. Provide a comprehensive evaluation of the candidate's performance in this short interview of 3 questions. Even though this is a brief assessment, try to provide meaningful insights.

IMPORTANT SCORING GUIDELINES:
- Overall score should be from 1-100 where 100 is excellent
- If ANY answers were completely unrelated to the questions, the overall score should not exceed 30
- If MOST answers were unrelated or off-topic, the overall score should be below 20
- Weight the relevance of answers heavily in your scoring
- Be strict but fair in your assessment
- For completely irrelevant or nonsensical answers, recommend 'Reject'
- Only recommend 'Hire' for candidates who demonstrate clear understanding of the topic

Your evaluation must accurately reflect the candidate's actual knowledge of ${topic}.` },
        { role: 'user', content: `Interview Summary:\n\n${interviewSummary}` }
      ],
      response_format: {
        type: 'json_schema',
        json_schema: {
          name: 'interview_evaluation',
          strict: true,
          schema: {
            type: 'object',
            properties: {
              overall_score: {
                type: 'number',
                description: 'Overall score from 1-100 where 100 is excellent. If answers were unrelated to questions, score should not exceed 30.'
              },
              summary: {
                type: 'string',
                description: 'Summary of the candidate\'s performance'
              },
              key_strengths: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Key strengths demonstrated in the interview'
              },
              areas_for_improvement: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Areas where the candidate could improve'
              },
              recommendation: {
                type: 'string',
                description: 'Overall recommendation (e.g., "Hire", "Consider", "Reject"). Use "Reject" for candidates with mostly unrelated answers.'
              }
            },
            required: ['overall_score', 'summary', 'key_strengths', 'areas_for_improvement', 'recommendation'],
            additionalProperties: false
          }
        }
      }
    });

    const content = response.data.choices[0].message.content;

    // Check if the response is JSON or plain text
    try {
      // Try to parse as JSON first
      return typeof content === 'string' ? JSON.parse(content) : content;
    } catch (parseError) {
      // If it's not valid JSON, create a structured object from the text
      console.log('Response is not in JSON format, creating structured object:', content);
      return {
        overall_score: 15, // Default low score for parsing errors
        summary: content,
        key_strengths: ['Unable to identify strengths due to response format issue'],
        areas_for_improvement: ['Answers may be unrelated to the questions', 'Response format issue - please retry'],
        recommendation: 'Reject'
      };
    }
  } catch (error) {
    console.error('Error generating final evaluation:', error);
    throw error;
  }
};

export default {
  generateQuestion,
  evaluateAnswer,
  generateFinalEvaluation
};
