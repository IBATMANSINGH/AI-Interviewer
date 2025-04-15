import { useState } from 'react';
import { 
  Box, 
  TextField, 
  Button, 
  Paper,
  Typography,
  LinearProgress
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const AnswerInput = ({ onSubmitAnswer, isSubmitting }) => {
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!answer.trim()) {
      setError('Please provide an answer');
      return;
    }
    
    onSubmitAnswer(answer);
    setAnswer('');
  };

  const handleChange = (e) => {
    setAnswer(e.target.value);
    if (error) setError('');
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      {isSubmitting && <LinearProgress sx={{ mb: 2 }} />}
      
      <Typography variant="subtitle1" gutterBottom>
        Your Answer:
      </Typography>
      
      <TextField
        fullWidth
        multiline
        rows={4}
        variant="outlined"
        placeholder="Type your answer here..."
        value={answer}
        onChange={handleChange}
        error={!!error}
        helperText={error}
        disabled={isSubmitting}
        sx={{ mb: 2 }}
      />
      
      <Box display="flex" justifyContent="flex-end">
        <Button
          variant="contained"
          color="primary"
          endIcon={<SendIcon />}
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit Answer
        </Button>
      </Box>
    </Paper>
  );
};

export default AnswerInput;
