import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link, Alert, IconButton, InputAdornment } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Wifi as WifiIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/allServices';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { loginCustomer } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = await authService.loginCustomer(username, password);
      if (user) {
        loginCustomer({ ...user, role: 'customer' });
        navigate('/dashboard-customer');
      } else {
        setError('Username atau password salah.');
      }
    } catch (err) {
      setError('Terjadi kesalahan server.');
    }
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      bgcolor: 'secondary.light',
      background: 'linear-gradient(135deg, #FFE0B2 0%, #FFF3E0 100%)'
    }}>
      <Container maxWidth="xs">
        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, textAlign: 'center', border: '1px solid #FFE0B2' }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', mb: 3 }}>
            <WifiIcon sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>KuotaKuy</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Selamat Datang!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Silakan masuk ke akun KuotaKuy kamu.</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          
          <form onSubmit={handleSubmit}>
            <TextField 
              fullWidth label="Username" 
              variant="outlined" sx={{ mb: 2 }} 
              value={username} onChange={(e) => setUsername(e.target.value)} 
              required
            />
            <TextField 
              fullWidth label="Password" 
              type={showPassword ? 'text' : 'password'} 
              variant="outlined" sx={{ mb: 3 }} 
              value={password} onChange={(e) => setPassword(e.target.value)}
              required
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
            <Button fullWidth variant="contained" color="primary" size="large" type="submit" sx={{ py: 1.5, mb: 3 }}>
              Masuk
            </Button>
            <Typography variant="body2">
              Belum punya akun? <Link component={RouterLink} to="/register" sx={{ fontWeight: 700, textDecoration: 'none' }}>Daftar Sekarang</Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
