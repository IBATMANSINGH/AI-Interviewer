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
        { role: 'system', content: `You are an expert interviewer for ${topic}. Ask challenging but fair questions. This is question number ${questionNumber} of the interview.` },
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
        { role: 'system', content: `You are an expert evaluator for ${topic} interviews. Evaluate the candidate's answer fairly and provide constructive feedback.` },
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
                description: 'Score from 1-10 where 10 is excellent'
              },
              feedback: {
                type: 'string',
                description: 'Constructive feedback on the answer'
              },
              strengths: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Key strengths of the answer'
              },
              areas_for_improvement: {
                type: 'array',
                items: {
                  type: 'string'
                },
                description: 'Areas where the answer could be improved'
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
        score: 5, // Default middle score
        feedback: content,
        strengths: ['Response format issue - please retry'],
        areas_for_improvement: ['Response format issue - please retry']
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
        { role: 'system', content: `You are an expert interviewer for ${topic}. Provide a comprehensive evaluation of the candidate's performance in the interview.` },
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
                description: 'Overall score from 1-100 where 100 is excellent'
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
                description: 'Overall recommendation (e.g., "Hire", "Consider", "Reject")'
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
        overall_score: 50, // Default middle score
        summary: content,
        key_strengths: ['Response format issue - please retry'],
        areas_for_improvement: ['Response format issue - please retry'],
        recommendation: 'Consider'
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
