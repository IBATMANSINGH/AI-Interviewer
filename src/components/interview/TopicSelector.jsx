import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Paper,
  Container
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useInterview } from '../../contexts/InterviewContext';

const TopicSelector = () => {
  const { startInterview } = useInterview();
  const [topicInput, setTopicInput] = useState('');
  const [error, setError] = useState('');

  const handleStartInterview = () => {
    if (!topicInput.trim()) {
      setError('Please enter an interview topic');
      return;
    }
    
    startInterview(topicInput.trim());
  };

  const handleInputChange = (e) => {
    setTopicInput(e.target.value);
    if (error) setError('');
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          AI-Powered Interview Practice
        </Typography>
        
        <Typography variant="body1" paragraph align="center">
          Enter a topic for your interview, and our AI will conduct a professional interview session.
          You'll receive questions, feedback, and a final evaluation to help improve your skills.
        </Typography>
        
        <Box component="form" noValidate sx={{ mt: 3 }}>
          <TextField
            fullWidth
            label="Interview Topic"
            variant="outlined"
            placeholder="e.g., JavaScript Development, Data Science, Product Management"
            value={topicInput}
            onChange={handleInputChange}
            error={!!error}
            helperText={error}
            sx={{ mb: 3 }}
          />
          
          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartInterview}
            startIcon={<PlayArrowIcon />}
            sx={{ py: 1.5 }}
          >
            Start Interview
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TopicSelector;
