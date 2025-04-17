import { AppBar, Toolbar, Typography, Box, Chip } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';
import MicIcon from '@mui/icons-material/Mic';
import ChatIcon from '@mui/icons-material/Chat';
import { useInterview, INTERVIEW_MODES } from '../../contexts/InterviewContext';

const Header = () => {
  const { isInterviewStarted, interviewMode } = useInterview();

  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <PsychologyIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Interviewer
        </Typography>

        {isInterviewStarted && (
          <Chip
            icon={interviewMode === INTERVIEW_MODES.VOICE ? <MicIcon /> : <ChatIcon />}
            label={interviewMode === INTERVIEW_MODES.VOICE ? 'Voice Mode' : 'Text Mode'}
            color={interviewMode === INTERVIEW_MODES.VOICE ? 'secondary' : 'primary'}
            variant="outlined"
            sx={{ color: 'white', borderColor: 'white' }}
          />
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
