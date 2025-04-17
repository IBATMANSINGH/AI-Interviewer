import { useEffect, useState, useCallback } from 'react';
import { Container, Box, Typography, Paper, Button } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import VideoCallUI from '../components/voice/VideoCallUI';
import SpeechRecognitionInput from '../components/voice/SpeechRecognitionInput';
import TextToSpeechOutput from '../components/voice/TextToSpeechOutput';
import InterviewProgress from '../components/interview/InterviewProgress';
import EvaluationDisplay from '../components/interview/EvaluationDisplay';
import Loading from '../components/common/Loading';
import ErrorDisplay from '../components/common/ErrorDisplay';
import { generateQuestion, evaluateAnswer, generateFinalEvaluation } from '../services/openRouter';

const VoiceInterview = () => {
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
  const [isListening, setIsListening] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [showEvaluation, setShowEvaluation] = useState(false);

  // Redirect if interview is not started
  if (!isInterviewStarted) {
    return <Navigate to="/" />;
  }

  // Redirect if interview is completed
  if (isInterviewCompleted) {
    return <Navigate to="/results" />;
  }

  // Generate first question when component mounts
  useEffect(() => {
    if (currentQuestionNumber === 0) {
      setCurrentQuestionNumber(1);
      generateNextQuestion(1, []);
    } else if (!currentQuestion && !isLoading) {
      generateNextQuestion(currentQuestionNumber, questionsAnswers);
    }
  }, [currentQuestionNumber]);

  // Handle speech recognition result
  const handleSpeechResult = useCallback((result) => {
    setTranscript(result);
    handleSubmitAnswer(result);
  }, [currentQuestion]);

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
      setShowEvaluation(true);

      // Check if this was the last question
      if (currentQuestionNumber >= 3) { // Temporarily reduced from 10 to 3 for testing
        // Generate final evaluation
        const finalEvaluation = await generateFinalEvaluation(
          topic,
          [...questionsAnswers, { question: currentQuestion.question, answer }],
          [...evaluations, evaluation]
        );
        
        completeInterview(finalEvaluation);
      }
    } catch (err) {
      setError(err.message || 'Failed to process answer');
    } finally {
      setIsSubmitting(false);
      setIsListening(false);
    }
  };

  // Generate the next question
  const generateNextQuestion = async (questionNumber, previousQA) => {
    setIsLoading(true);
    setCurrentEvaluation(null);
    setShowEvaluation(false);
    setTranscript('');

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

  // Handle TTS speech end
  const handleSpeechEnd = () => {
    setIsAiSpeaking(false);
    // Auto-start listening when AI finishes speaking
    if (currentQuestion && !currentEvaluation && !isSubmitting) {
      setIsListening(true);
    }
  };

  // Handle continue to next question
  const handleContinue = () => {
    setCurrentQuestionNumber(currentQuestionNumber + 1);
    generateNextQuestion(currentQuestionNumber + 1, [
      ...questionsAnswers,
      { question: currentQuestion.question, answer: transcript }
    ]);
  };

  // Toggle microphone
  const handleToggleMic = () => {
    setIsListening(!isListening);
  };

  return (
    <Container maxWidth="lg">
      <Box py={4}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2, mb: 4 }}>
          <Typography variant="h5" gutterBottom>
            Voice Interview: {topic}
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
            <>
              {currentQuestion && !showEvaluation && (
                <>
                  <VideoCallUI 
                    isUserSpeaking={isListening}
                    isAiSpeaking={isAiSpeaking}
                    currentQuestion={currentQuestion.question}
                    transcript={transcript}
                    onToggleMic={handleToggleMic}
                    micEnabled={isListening}
                  />
                  
                  <Box sx={{ mt: 3 }}>
                    <TextToSpeechOutput 
                      text={currentQuestion.question}
                      autoPlay={true}
                      onSpeechEnd={handleSpeechEnd}
                    />
                    
                    <SpeechRecognitionInput 
                      onSpeechResult={handleSpeechResult}
                      isListening={isListening}
                      setIsListening={setIsListening}
                    />
                  </Box>
                </>
              )}

              {showEvaluation && currentEvaluation && (
                <>
                  <EvaluationDisplay evaluation={currentEvaluation} />
                  
                  {currentQuestionNumber < 3 && ( // Temporarily reduced from 10 to 3 for testing
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleContinue}
                      >
                        Continue to Next Question
                      </Button>
                    </Box>
                  )}
                  
                  <Box sx={{ mt: 3 }}>
                    <TextToSpeechOutput 
                      text={currentEvaluation.feedback}
                      autoPlay={true}
                      onSpeechEnd={() => setIsAiSpeaking(false)}
                    />
                  </Box>
                </>
              )}
            </>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default VoiceInterview;
