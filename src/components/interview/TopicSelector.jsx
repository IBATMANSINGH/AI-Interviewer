import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Container,
  ToggleButtonGroup,
  ToggleButton,
  Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import { useInterview, INTERVIEW_MODES } from '../../contexts/InterviewContext';

const TopicSelector = () => {
  const { startInterview } = useInterview();
  const [topicInput, setTopicInput] = useState('');
  const [error, setError] = useState('');
  const [interviewMode, setInterviewMode] = useState(INTERVIEW_MODES.TEXT);

  const handleStartInterview = () => {
    if (!topicInput.trim()) {
      setError('Please enter an interview topic');
      return;
    }

    startInterview(topicInput.trim(), interviewMode);
  };

  const handleModeChange = (event, newMode) => {
    if (newMode !== null) {
      setInterviewMode(newMode);
    }
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

          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Typography variant="subtitle1" sx={{ mr: 2, alignSelf: 'center' }}>
              Interview Mode:
            </Typography>
            <ToggleButtonGroup
              value={interviewMode}
              exclusive
              onChange={handleModeChange}
              aria-label="interview mode"
            >
              <ToggleButton value={INTERVIEW_MODES.TEXT} aria-label="text mode">
                <Tooltip title="Text-based Interview">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ChatIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Text</Typography>
                  </Box>
                </Tooltip>
              </ToggleButton>
              <ToggleButton value={INTERVIEW_MODES.VOICE} aria-label="voice mode">
                <Tooltip title="Voice Interview with Speech Recognition">
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <MicIcon sx={{ mr: 1 }} />
                    <Typography variant="body2">Voice</Typography>
                  </Box>
                </Tooltip>
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <Button
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleStartInterview}
            startIcon={interviewMode === INTERVIEW_MODES.VOICE ? <MicIcon /> : <PlayArrowIcon />}
            sx={{ py: 1.5 }}
          >
            Start {interviewMode === INTERVIEW_MODES.VOICE ? 'Voice' : ''} Interview
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default TopicSelector;
