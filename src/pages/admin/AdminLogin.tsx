import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Alert, IconButton, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { AdminPanelSettings as AdminIcon, Visibility, VisibilityOff } from '@mui/icons-material';
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
        setError('Admin credentials invalid.');
      }
    } catch (err) {
      setError('Connection failed.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: '#1a1a1a', // Darker background for admin
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative pulse */}
      <Box sx={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', backgroundColor: 'primary.main', filter: 'blur(100px)', opacity: 0.1, top: -100, right: -100 }} />
      <Box sx={{ position: 'absolute', width: 300, height: 300, borderRadius: '50%', backgroundColor: 'primary.main', filter: 'blur(100px)', opacity: 0.05, bottom: -50, left: -50 }} />

      <Container maxWidth="xs" sx={{ position: 'relative', zIndex: 1 }}>
        <Paper elevation={24} sx={{ p: 5, borderRadius: 4, textAlign: 'center', bgcolor: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)' }}>
          <AdminIcon sx={{ fontSize: 64, mb: 2, color: 'primary.main' }} />
          <Typography variant="h5" sx={{ fontWeight: 800, mb: 1, letterSpacing: -0.5 }}>PANEL ADMIN</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>KUOTAKUY MANAGEMENT SYSTEM</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth label="Admin Username" 
              variant="outlined" sx={{ mb: 2.5 }} 
              value={username} onChange={(e) => setUsername(e.target.value)} 
              required
              InputLabelProps={{ shrink: true }}
            />
            <TextField 
              fullWidth label="Password" 
              type={showPassword ? 'text' : 'password'} 
              variant="outlined" sx={{ mb: 4 }} 
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button fullWidth variant="contained" color="primary" size="large" type="submit" sx={{ py: 1.8, fontSize: '1rem', fontWeight: 700, borderRadius: 2 }}>
              DASHBOARD LOGIN
            </Button>
          </form>
          <Typography variant="caption" sx={{ mt: 4, display: 'block', color: 'grey.500' }}>
            Authorized Personnel Only
          </Typography>
        </Paper>
      </Container>
    </Box>
  );
};

export default AdminLogin;
