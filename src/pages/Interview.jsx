import { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import QuestionDisplay from '../components/interview/QuestionDisplay';
import AnswerInput from '../components/interview/AnswerInput';
import InterviewProgress from '../components/interview/InterviewProgress';
import EvaluationDisplay from '../components/interview/EvaluationDisplay';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { generateQuestion, evaluateAnswer, generateFinalEvaluation } from '../services/openRouter';

// TEMPORARY TESTING MODE: Interview reduced to 3 questions instead of 10 to save OpenRouter credits
// TO RESTORE: Change all instances of '3' back to '10' in this file and update the system prompts in openRouter.js

const Interview = () => {
  const {
    topic,
    isInterviewStarted,
    isInterviewCompleted,
    currentQuestionNumber,
    questionsAnswers,
    evaluations,
    addQuestionAnswer,
    addEvaluation,
    completeInterview,
    setCurrentQuestionNumber,
    setIsLoading,
    isLoading,
    error,
    setError
  } = useInterview();

  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentEvaluation, setCurrentEvaluation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate the first question when the interview starts
  useEffect(() => {
    const fetchFirstQuestion = async () => {
      if (isInterviewStarted && currentQuestionNumber === 1 && !currentQuestion) {
        setIsLoading(true);
        try {
          const questionData = await generateQuestion(topic, 1, []);
          setCurrentQuestion(questionData);
        } catch (err) {
          setError(err.message || 'Failed to generate question');
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchFirstQuestion();
  }, [isInterviewStarted, currentQuestionNumber, topic]);

  // Handle answer submission
  const handleSubmitAnswer = async (answer) => {
    if (!currentQuestion) return;

    setIsSubmitting(true);

    try {
      // Save the question and answer
      addQuestionAnswer(currentQuestion.question, answer);

      // Evaluate the answer
      const evaluation = await evaluateAnswer(topic, currentQuestion.question, answer);
      setCurrentEvaluation(evaluation);
      addEvaluation(evaluation);

      // Check if this was the last question (3rd for testing, normally 10th)
      if (currentQuestionNumber === 3) { // Temporarily reduced from 10 to 3 for testing
        // Generate final evaluation
        const updatedQuestionsAnswers = [...questionsAnswers, {
          question: currentQuestion.question,
          answer
        }];

        const updatedEvaluations = [...evaluations, evaluation];

        const finalEvaluation = await generateFinalEvaluation(
          topic,
          updatedQuestionsAnswers,
          updatedEvaluations
        );

        completeInterview(finalEvaluation);
      } else {
        // Prepare for next question
        setTimeout(() => {
          setCurrentQuestionNumber(currentQuestionNumber + 1);
          generateNextQuestion(currentQuestionNumber + 1, [
            ...questionsAnswers,
            { question: currentQuestion.question, answer }
          ]);
        }, 3000); // Give user time to read evaluation before next question
      }
    } catch (err) {
      setError(err.message || 'Failed to process answer');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Generate the next question
  const generateNextQuestion = async (questionNumber, previousQA) => {
    setIsLoading(true);
    setCurrentEvaluation(null);

    try {
      const questionData = await generateQuestion(topic, questionNumber, previousQA);
      setCurrentQuestion(questionData);
    } catch (err) {
      setError(err.message || 'Failed to generate next question');
    } finally {
      setIsLoading(false);
    }
  };

  // Retry generating the current question
  const handleRetryQuestion = async () => {
    setError(null);
    setIsLoading(true);

    try {
      const questionData = await generateQuestion(
        topic,
        currentQuestionNumber,
        questionsAnswers
      );
      setCurrentQuestion(questionData);
    } catch (err) {
      setError(err.message || 'Failed to generate question');
    } finally {
      setIsLoading(false);
    }
  };


  // Redirect if not in interview mode
  if (!isInterviewStarted && !isLoading) {
    return <Navigate to="/" />;
  }

  // Redirect if interview is completed
  if (isInterviewCompleted) {
    return <Navigate to="/results" />;
  }

  return (
    <Container maxWidth="md">
      <Box py={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Interview: {topic}
          </Typography>

          <InterviewProgress
            currentQuestion={currentQuestionNumber}
            totalQuestions={3} // Temporarily reduced from 10 to 3 for testing
          />

          {error && (
            <ErrorDisplay
              error={{ message: error }}
              onRetry={handleRetryQuestion}
            />
          )}

          {isLoading ? (
            <Loading message="Preparing next question..." />
          ) : (
            currentQuestion && (
              <QuestionDisplay
                question={currentQuestion.question}
                context={currentQuestion.context}
                questionNumber={currentQuestionNumber}
              />
            )
          )}

          {!isLoading && currentQuestion && !currentEvaluation && (
            <AnswerInput
              onSubmitAnswer={handleSubmitAnswer}
              isSubmitting={isSubmitting}
            />
          )}

          {currentEvaluation && (
            <EvaluationDisplay evaluation={currentEvaluation} />
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default Interview;
