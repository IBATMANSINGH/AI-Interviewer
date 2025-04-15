import { Box, LinearProgress, Typography } from '@mui/material';

const InterviewProgress = ({ currentQuestion, totalQuestions = 10 }) => {
  const progress = (currentQuestion / totalQuestions) * 100;
  
  return (
    <Box sx={{ mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
        <Typography variant="body2" color="text.secondary">
          Question {currentQuestion} of {totalQuestions}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {Math.round(progress)}% Complete
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={progress} 
        sx={{ height: 8, borderRadius: 4 }}
      />
    </Box>
  );
};

export default InterviewProgress;
