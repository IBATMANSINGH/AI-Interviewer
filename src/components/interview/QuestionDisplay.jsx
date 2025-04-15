import { Box, Paper, Typography, Chip } from '@mui/material';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

const QuestionDisplay = ({ question, context, questionNumber }) => {
  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mb: 3, 
        borderRadius: 2,
        backgroundColor: '#f5f5f5'
      }}
    >
      <Box display="flex" alignItems="center" mb={1}>
        <QuestionAnswerIcon color="primary" sx={{ mr: 1 }} />
        <Chip 
          label={`Question ${questionNumber}`} 
          color="primary" 
          size="small" 
          sx={{ fontWeight: 'bold' }}
        />
      </Box>
      
      <Typography variant="h6" gutterBottom>
        {question}
      </Typography>
      
      {context && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          <strong>Context:</strong> {context}
        </Typography>
      )}
    </Paper>
  );
};

export default QuestionDisplay;
