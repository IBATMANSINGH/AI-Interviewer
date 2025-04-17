import { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  IconButton, 
  Typography,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import ReplayIcon from '@mui/icons-material/Replay';

const TextToSpeechOutput = ({ text, autoPlay = false, onSpeechEnd }) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [volume, setVolume] = useState(1);
  const [rate, setRate] = useState(1);
  const [voice, setVoice] = useState(null);
  const [availableVoices, setAvailableVoices] = useState([]);
  const [error, setError] = useState('');
  const utteranceRef = useRef(null);

  // Initialize available voices
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices.filter(voice => voice.lang.includes('en')));
        // Set a default voice (preferably a female voice for interviewer)
        const defaultVoice = voices.find(v => v.name.includes('Female') && v.lang.includes('en')) || 
                            voices.find(v => v.lang.includes('en-US')) || 
                            voices[0];
        setVoice(defaultVoice);
      }
    };

    if ('speechSynthesis' in window) {
      // Chrome loads voices asynchronously
      if (window.speechSynthesis.getVoices().length) {
        loadVoices();
      }
      window.speechSynthesis.onvoiceschanged = loadVoices;
    } else {
      setError('Text-to-speech is not supported in your browser.');
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Auto-play when text changes if autoPlay is true
  useEffect(() => {
    if (autoPlay && text && !isSpeaking && voice) {
      speak();
    }
  }, [text, autoPlay, voice]);

  const speak = () => {
    if (!('speechSynthesis' in window)) {
      setError('Text-to-speech is not supported in your browser.');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = voice;
    utterance.volume = volume;
    utterance.rate = rate;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      if (onSpeechEnd) {
        onSpeechEnd();
      }
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error', event);
      setError(`Speech synthesis error: ${event.error}`);
      setIsSpeaking(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    if (isSpeaking && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    } else if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const handleVolumeChange = (event, newValue) => {
    setVolume(newValue);
    if (utteranceRef.current) {
      utteranceRef.current.volume = newValue;
    }
  };

  const handleRateChange = (event, newValue) => {
    setRate(newValue);
    if (utteranceRef.current) {
      utteranceRef.current.rate = newValue;
    }
  };

  const handleVoiceChange = (event) => {
    const selectedVoice = availableVoices.find(v => v.name === event.target.value);
    setVoice(selectedVoice);
  };

  return (
    <Box sx={{ mb: 3 }}>
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle2">Text-to-Speech Controls</Typography>
        
        <Box display="flex" alignItems="center">
          <IconButton 
            onClick={speak} 
            disabled={isSpeaking && !isPaused}
            color="primary"
          >
            {isSpeaking && !isPaused ? (
              <CircularProgress size={24} />
            ) : (
              <VolumeUpIcon />
            )}
          </IconButton>
          
          <IconButton 
            onClick={pause} 
            disabled={!isSpeaking}
            color={isPaused ? "primary" : "default"}
          >
            <VolumeOffIcon />
          </IconButton>
          
          <IconButton 
            onClick={speak}
            color="primary"
          >
            <ReplayIcon />
          </IconButton>
        </Box>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <VolumeUpIcon sx={{ mr: 1, color: 'text.secondary' }} />
        <Slider
          value={volume}
          min={0}
          max={1}
          step={0.1}
          onChange={handleVolumeChange}
          aria-labelledby="volume-slider"
          sx={{ mx: 2 }}
        />
        <Typography variant="caption" sx={{ minWidth: 35 }}>
          {Math.round(volume * 100)}%
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography variant="caption" sx={{ mr: 1 }}>Speed:</Typography>
        <Slider
          value={rate}
          min={0.5}
          max={2}
          step={0.1}
          onChange={handleRateChange}
          aria-labelledby="rate-slider"
          sx={{ mx: 2 }}
        />
        <Typography variant="caption" sx={{ minWidth: 35 }}>
          {rate}x
        </Typography>
      </Box>
      
      {availableVoices.length > 0 && (
        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel id="voice-select-label">Voice</InputLabel>
          <Select
            labelId="voice-select-label"
            value={voice?.name || ''}
            label="Voice"
            onChange={handleVoiceChange}
          >
            {availableVoices.map((v) => (
              <MenuItem key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    </Box>
  );
};

export default TextToSpeechOutput;
