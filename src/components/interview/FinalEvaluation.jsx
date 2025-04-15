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
  Button,
  Container
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import ReplayIcon from '@mui/icons-material/Replay';
import { useInterview } from '../../contexts/InterviewContext';

const FinalEvaluation = () => {
  const { finalEvaluation, resetInterview } = useInterview();
  
  if (!finalEvaluation) return null;
  
  const { 
    overall_score, 
    summary, 
    key_strengths, 
    areas_for_improvement, 
    recommendation 
  } = finalEvaluation;
  
  // Determine color based on score
  const getScoreColor = (score) => {
    if (score >= 80) return 'success';
    if (score >= 60) return 'warning';
    return 'error';
  };
  
  // Determine color based on recommendation
  const getRecommendationColor = (rec) => {
    if (rec.toLowerCase().includes('hire')) return 'success';
    if (rec.toLowerCase().includes('consider')) return 'warning';
    return 'error';
  };
  
  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom align="center">
          Interview Results
        </Typography>
        
        <Box display="flex" justifyContent="center" mb={3}>
          <Chip 
            label={`Score: ${overall_score}/100`} 
            color={getScoreColor(overall_score)}
            sx={{ fontSize: '1.2rem', py: 2, px: 3 }}
          />
        </Box>
        
        <Box display="flex" justifyContent="center" mb={4}>
          <Chip 
            label={`Recommendation: ${recommendation}`} 
            color={getRecommendationColor(recommendation)}
            variant="outlined"
            sx={{ fontSize: '1rem', py: 1 }}
          />
        </Box>
        
        <Typography variant="h6" gutterBottom>
          Summary
        </Typography>
        <Typography variant="body1" paragraph>
          {summary}
        </Typography>
        
        <Divider sx={{ my: 3 }} />
        
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            Key Strengths
          </Typography>
          <List>
            {key_strengths.map((strength, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="success" />
                </ListItemIcon>
                <ListItemText primary={strength} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Areas for Improvement
          </Typography>
          <List>
            {areas_for_improvement.map((area, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <ErrorIcon color="warning" />
                </ListItemIcon>
                <ListItemText primary={area} />
              </ListItem>
            ))}
          </List>
        </Box>
        
        <Box display="flex" justifyContent="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ReplayIcon />}
            onClick={resetInterview}
          >
            Start New Interview
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default FinalEvaluation;
