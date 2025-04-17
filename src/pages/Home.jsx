import { Container, Box } from '@mui/material';
import TopicSelector from '../components/interview/TopicSelector';
import { useInterview, INTERVIEW_MODES } from '../contexts/InterviewContext';
import { Navigate } from 'react-router-dom';

const Home = () => {
  const { isInterviewStarted, isInterviewCompleted, interviewMode } = useInterview();

  // Redirect to interview page if interview is started
  if (isInterviewStarted) {
    return interviewMode === INTERVIEW_MODES.VOICE ?
      <Navigate to="/voice-interview" /> :
      <Navigate to="/interview" />;
  }

  // Redirect to results page if interview is completed
  if (isInterviewCompleted) {
    return <Navigate to="/results" />;
  }

  return (
    <Container>
      <Box py={4}>
        <TopicSelector />
      </Box>
    </Container>
  );
};

export default Home;
