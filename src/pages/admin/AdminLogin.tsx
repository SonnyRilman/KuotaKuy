import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Alert, IconButton, InputAdornment, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Shield as AdminIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/allServices';

const AdminLogin: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const admin = await authService.loginAdmin(username, password);
      if (admin) {
        loginAdmin({ ...admin, role: 'admin' });
        navigate('/admin/dashboard');
      } else {
        setError('Authentication failed. Invalid pass-key.');
      }
    } catch {
      setError('Core system connection failure.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#F1F5F9', // Soft Slack/Discord type background
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Abstract geometric shapes for professionalism */}
      <Box sx={{ position: 'absolute', width: 600, height: 600, borderRadius: '50%', backgroundColor: '#FF7043', filter: 'blur(300px)', opacity: 0.1, top: -200, right: -200 }} />
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', backgroundColor: '#FB8C00', filter: 'blur(200px)', opacity: 0.05, bottom: -100, left: -100 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 10 }}>
        <Paper elevation={0} sx={{ 
          p: { xs: 4, md: 5 }, 
          borderRadius: 8, 
          textAlign: 'center', 
          bgcolor: 'white', 
          border: '1px solid #E2E8F0',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.05)'
        }}>
          {/* Header Branding */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#FF7043', boxShadow: '0 8px 20px rgba(255,112,67,0.3)' }}>
              <AdminIcon sx={{ fontSize: 32 }} />
            </Avatar>
          </Box>
          
          <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, color: '#1E293B', letterSpacing: -1 }}>Administrator Access</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 5, fontWeight: 600 }}>KUOTAKUY MANAGEMENT SYSTEM</Typography>
          
          {error && (
            <Alert severity="error" variant="standard" sx={{ mb: 4, borderRadius: 3, fontWeight: 700, border: '1px solid #FECACA' }}>
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth placeholder="Username ID" 
              variant="outlined" 
              value={username} onChange={(e) => setUsername(e.target.value)} 
              required
              sx={{ 
                mb: 3,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  bgcolor: '#F8FAFC',
                  fontWeight: 600,
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#4F46E5' },
                }
              }}
            />
            <TextField 
              fullWidth placeholder="System Pass-key" 
              type={showPassword ? 'text' : 'password'} 
              variant="outlined"
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ color: '#94A3B8' }}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ 
                mb: 6,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 4,
                  bgcolor: '#F8FAFC',
                  fontWeight: 600,
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#FF7043' },
                }
              }}
            />
            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              type="submit" 
              disableElevation
              sx={{ 
                py: 2.2, 
                fontSize: '1rem', 
                fontWeight: 900, 
                borderRadius: 4, 
                bgcolor: '#FF7043', 
                textTransform: 'none',
                transition: '0.3s',
                '&:hover': { bgcolor: '#F4511E', transform: 'translateY(-2px)', boxShadow: '0 10px 20px rgba(255,112,67,0.3)' }
              }}
            >
              Authenticate Portal
            </Button>
          </form>

          <Box sx={{ mt: 5, pt: 3, borderTop: '1px solid #F1F5F9' }}>
             <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 700, letterSpacing: 0.5 }}>
                SECURED BY KUOTAKUY AUTH v2.0
             </Typography>
          </Box>
        </Paper>
        <Typography variant="caption" sx={{ textAlign: 'center', display: 'block', mt: 4, color: '#94A3B8', fontWeight: 600 }}>
           Unauthorized access is strictly prohibited and logged.
        </Typography>
      </Container>
    </Box>
  );
};

export default AdminLogin;
