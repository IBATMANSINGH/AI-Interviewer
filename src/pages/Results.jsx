import { Box } from '@mui/material';
import { Navigate } from 'react-router-dom';
import { useInterview } from '../contexts/InterviewContext';
import FinalEvaluation from '../components/interview/FinalEvaluation';

const Results = () => {
  const { isInterviewCompleted, finalEvaluation } = useInterview();
  
  // Redirect if interview is not completed
  if (!isInterviewCompleted || !finalEvaluation) {
    return <Navigate to="/" />;
  }
  
  return (
    <Box py={4}>
      <FinalEvaluation />
    </Box>
  );
};

export default Results;
