import { useState, useEffect, useCallback } from 'react';
import { 
  Box, 
  Button, 
  Typography, 
  Paper,
  CircularProgress,
  IconButton
} from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';

const SpeechRecognitionInput = ({ onSpeechResult, isListening, setIsListening }) => {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [error, setError] = useState('');

  // Initialize speech recognition
  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setError('Speech recognition is not supported in your browser.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognitionInstance = new SpeechRecognition();
    
    recognitionInstance.continuous = true;
    recognitionInstance.interimResults = true;
    recognitionInstance.lang = 'en-US';
    
    recognitionInstance.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          currentTranscript += event.results[i][0].transcript;
        }
      }
      
      if (currentTranscript) {
        setTranscript((prev) => prev + ' ' + currentTranscript);
      }
    };
    
    recognitionInstance.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setError(`Speech recognition error: ${event.error}`);
      setIsListening(false);
    };
    
    recognitionInstance.onend = () => {
      if (isListening) {
        // If we're still supposed to be listening, restart
        recognitionInstance.start();
      }
    };
    
    setRecognition(recognitionInstance);
    
    return () => {
      if (recognitionInstance) {
        recognitionInstance.stop();
      }
    };
  }, [setIsListening]);

  // Start/stop listening
  useEffect(() => {
    if (!recognition) return;
    
    if (isListening) {
      try {
        recognition.start();
      } catch (e) {
        // Already started, ignore
      }
    } else {
      recognition.stop();
    }
  }, [isListening, recognition]);

  const handleStartListening = () => {
    setTranscript('');
    setIsListening(true);
  };

  const handleStopListening = useCallback(() => {
    setIsListening(false);
    if (transcript.trim()) {
      onSpeechResult(transcript.trim());
    }
  }, [transcript, onSpeechResult, setIsListening]);

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2, position: 'relative' }}>
      <Typography variant="subtitle1" gutterBottom>
        Your Answer:
      </Typography>
      
      <Box 
        sx={{ 
          minHeight: '100px', 
          p: 2, 
          border: '1px solid #e0e0e0', 
          borderRadius: 1,
          mb: 2,
          bgcolor: isListening ? '#f5f5f5' : 'white'
        }}
      >
        {transcript ? (
          <Typography variant="body1">{transcript}</Typography>
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
            {isListening ? 'Listening...' : 'Click the microphone button to start speaking'}
          </Typography>
        )}
      </Box>
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box display="flex" justifyContent="center">
        {isListening ? (
          <IconButton 
            color="primary" 
            size="large" 
            onClick={handleStopListening}
            sx={{ 
              bgcolor: 'error.main', 
              color: 'white',
              '&:hover': { bgcolor: 'error.dark' }
            }}
          >
            <StopIcon fontSize="large" />
          </IconButton>
        ) : (
          <IconButton 
            color="primary" 
            size="large" 
            onClick={handleStartListening}
            sx={{ 
              bgcolor: 'primary.main', 
              color: 'white',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            <MicIcon fontSize="large" />
          </IconButton>
        )}
      </Box>
      
      {isListening && (
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 10, 
            right: 10, 
            display: 'flex', 
            alignItems: 'center' 
          }}
        >
          <CircularProgress size={20} sx={{ mr: 1 }} />
          <Typography variant="caption" color="primary">Recording</Typography>
        </Box>
      )}
    </Paper>
  );
};

export default SpeechRecognitionInput;
