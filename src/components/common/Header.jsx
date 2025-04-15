import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import PsychologyIcon from '@mui/icons-material/Psychology';

const Header = () => {
  return (
    <AppBar position="static" sx={{ mb: 4 }}>
      <Toolbar>
        <PsychologyIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          AI Interviewer
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
