import { createContext, useContext, useState } from 'react';

// Create the context
const InterviewContext = createContext();

// Interview modes
export const INTERVIEW_MODES = {
  TEXT: 'text',
  VOICE: 'voice'
};

// Custom hook to use the interview context
export const useInterview = () => {
  const context = useContext(InterviewContext);
  if (!context) {
    throw new Error('useInterview must be used within an InterviewProvider');
  }
  return context;
};

// Provider component
export const InterviewProvider = ({ children }) => {
  // State for the interview
  const [topic, setTopic] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(0);
  const [questionsAnswers, setQuestionsAnswers] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [finalEvaluation, setFinalEvaluation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [interviewMode, setInterviewMode] = useState(INTERVIEW_MODES.TEXT);

  // Start a new interview
  const startInterview = (selectedTopic, mode = INTERVIEW_MODES.TEXT) => {
    setTopic(selectedTopic);
    setInterviewMode(mode);
    setIsInterviewStarted(true);
    setIsInterviewCompleted(false);
    setCurrentQuestionNumber(1);
    setQuestionsAnswers([]);
    setEvaluations([]);
    setFinalEvaluation(null);
    setError(null);
  };

  // Add a question and answer to the interview
  const addQuestionAnswer = (question, answer) => {
    setQuestionsAnswers([...questionsAnswers, { question, answer }]);
  };

  // Add an evaluation for an answer
  const addEvaluation = (evaluation) => {
    setEvaluations([...evaluations, evaluation]);
  };

  // Complete the interview
  const completeInterview = (evaluation) => {
    setFinalEvaluation(evaluation);
    setIsInterviewCompleted(true);
    setIsInterviewStarted(false);
  };

  // Reset the interview
  const resetInterview = () => {
    setTopic('');
    setIsInterviewStarted(false);
    setIsInterviewCompleted(false);
    setCurrentQuestionNumber(0);
    setQuestionsAnswers([]);
    setEvaluations([]);
    setFinalEvaluation(null);
    setError(null);
    setInterviewMode(INTERVIEW_MODES.TEXT);
  };

  // Value object to be provided to consumers
  const value = {
    topic,
    isInterviewStarted,
    isInterviewCompleted,
    currentQuestionNumber,
    questionsAnswers,
    evaluations,
    finalEvaluation,
    isLoading,
    error,
    interviewMode,
    startInterview,
    addQuestionAnswer,
    addEvaluation,
    completeInterview,
    resetInterview,
    setIsLoading,
    setError,
    setCurrentQuestionNumber,
    setInterviewMode
  };

  return (
    <InterviewContext.Provider value={value}>
      {children}
    </InterviewContext.Provider>
  );
};

export default InterviewContext;
