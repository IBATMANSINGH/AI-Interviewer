import { useState, useEffect } from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Avatar, 
  IconButton, 
  Grid,
  Tooltip,
  Badge
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import VideocamIcon from '@mui/icons-material/Videocam';
import VideocamOffIcon from '@mui/icons-material/VideocamOff';
import PsychologyIcon from '@mui/icons-material/Psychology';
import PersonIcon from '@mui/icons-material/Person';

const VideoCallUI = ({ 
  isUserSpeaking, 
  isAiSpeaking, 
  currentQuestion,
  transcript,
  onToggleMic,
  micEnabled
}) => {
  const [showControls, setShowControls] = useState(true);
  
  // Hide controls after 3 seconds of inactivity
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowControls(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [showControls]);
  
  return (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 2, 
        borderRadius: 2, 
        bgcolor: '#1a1a1a', 
        color: 'white',
        position: 'relative',
        height: '70vh',
        overflow: 'hidden',
        '&:hover': {
          '& .video-controls': {
            opacity: 1
          }
        }
      }}
      onMouseMove={() => setShowControls(true)}
    >
      <Grid container spacing={2} sx={{ height: '100%' }}>
        {/* AI Video Panel */}
        <Grid item xs={12} md={8} sx={{ height: '100%' }}>
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              bgcolor: '#2a2a2a',
              borderRadius: 2,
              p: 2
            }}
          >
            <Avatar 
              sx={{ 
                width: 120, 
                height: 120, 
                bgcolor: isAiSpeaking ? 'primary.main' : 'grey.700',
                mb: 2,
                border: isAiSpeaking ? '4px solid #1976d2' : 'none'
              }}
            >
              <PsychologyIcon sx={{ fontSize: 80 }} />
            </Avatar>
            
            <Typography variant="h5" align="center" gutterBottom>
              AI Interviewer
            </Typography>
            
            {isAiSpeaking && (
              <Badge 
                color="error" 
                variant="dot"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.5)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }
                }}
              >
                <Typography variant="body2" color="primary" sx={{ fontWeight: 'bold' }}>
                  Speaking...
                </Typography>
              </Badge>
            )}
            
            {currentQuestion && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  p: 2, 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{currentQuestion}"
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
        
        {/* User Video Panel */}
        <Grid item xs={12} md={4} sx={{ height: '100%' }}>
          <Box 
            sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              bgcolor: '#2a2a2a',
              borderRadius: 2,
              p: 2
            }}
          >
            <Avatar 
              sx={{ 
                width: 80, 
                height: 80, 
                bgcolor: isUserSpeaking ? 'success.main' : 'grey.700',
                mb: 2,
                border: isUserSpeaking ? '4px solid #2e7d32' : 'none'
              }}
            >
              <PersonIcon sx={{ fontSize: 50 }} />
            </Avatar>
            
            <Typography variant="body1" align="center" gutterBottom>
              You
            </Typography>
            
            {isUserSpeaking && (
              <Badge 
                color="success" 
                variant="dot"
                sx={{ 
                  '& .MuiBadge-badge': { 
                    animation: 'pulse 1.5s infinite',
                    '@keyframes pulse': {
                      '0%': { transform: 'scale(1)' },
                      '50%': { transform: 'scale(1.5)' },
                      '100%': { transform: 'scale(1)' }
                    }
                  }
                }}
              >
                <Typography variant="body2" color="success.main" sx={{ fontWeight: 'bold' }}>
                  Speaking...
                </Typography>
              </Badge>
            )}
            
            {transcript && (
              <Box 
                sx={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  left: 0, 
                  right: 0, 
                  p: 2, 
                  bgcolor: 'rgba(0,0,0,0.7)',
                  borderBottomLeftRadius: 8,
                  borderBottomRightRadius: 8,
                  maxHeight: '30%',
                  overflow: 'auto'
                }}
              >
                <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                  "{transcript}"
                </Typography>
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>
      
      {/* Video Call Controls */}
      <Box 
        className="video-controls"
        sx={{ 
          position: 'absolute', 
          bottom: 16, 
          left: 0, 
          right: 0, 
          display: 'flex', 
          justifyContent: 'center',
          opacity: showControls ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out'
        }}
      >
        <Paper 
          elevation={4} 
          sx={{ 
            display: 'flex', 
            p: 1, 
            borderRadius: 4, 
            bgcolor: 'rgba(0,0,0,0.7)' 
          }}
        >
          <Tooltip title={micEnabled ? "Mute Microphone" : "Unmute Microphone"}>
            <IconButton 
              color={micEnabled ? "primary" : "default"}
              onClick={onToggleMic}
              sx={{ mx: 1 }}
            >
              {micEnabled ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Camera is disabled">
            <IconButton 
              disabled
              sx={{ mx: 1, color: 'grey.500' }}
            >
              <VideocamOffIcon />
            </IconButton>
          </Tooltip>
        </Paper>
      </Box>
    </Paper>
  );
};

export default VideoCallUI;
