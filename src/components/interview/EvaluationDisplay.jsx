import { 
  Box, 
  Paper, 
  Typography, 
  Chip, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Rating
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

const EvaluationDisplay = ({ evaluation }) => {
  const { score, feedback, strengths, areas_for_improvement } = evaluation;
  
  return (
    <Paper elevation={2} sx={{ p: 3, mt: 3, borderRadius: 2, bgcolor: '#f8f9fa' }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Answer Evaluation</Typography>
        <Box display="flex" alignItems="center">
          <Typography variant="body1" mr={1}>Score:</Typography>
          <Rating 
            value={score / 2} 
            precision={0.5} 
            readOnly 
            max={5}
          />
          <Chip 
            label={`${score}/10`} 
            color={score >= 7 ? 'success' : score >= 5 ? 'warning' : 'error'} 
            sx={{ ml: 1 }}
          />
        </Box>
      </Box>
      
      <Typography variant="body1" paragraph>
        {feedback}
      </Typography>
      
      <Divider sx={{ my: 2 }} />
      
      <Box>
        <Typography variant="subtitle1" gutterBottom>
          Strengths:
        </Typography>
        <List dense>
          {strengths.map((strength, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircleIcon color="success" fontSize="small" />
              </ListItemIcon>
              <ListItemText primary={strength} />
            </ListItem>
          ))}
        </List>
      </Box>
      
      {areas_for_improvement.length > 0 && (
        <Box mt={2}>
          <Typography variant="subtitle1" gutterBottom>
            Areas for Improvement:
          </Typography>
          <List dense>
            {areas_for_improvement.map((area, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <ErrorIcon color="warning" fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={area} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default EvaluationDisplay;
