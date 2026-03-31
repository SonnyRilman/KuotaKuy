import React, { useState } from 'react';
import { Box, Container, Paper, Typography, TextField, Button, Link, Alert, IconButton, InputAdornment, Grid } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Wifi as WifiIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../../services/allServices';

const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', username: '', password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await authService.registerCustomer(formData);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch {
      setError('Pendaftaran gagal. Silakan coba lagi.');
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
      <Container maxWidth="sm">
        <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, textAlign: 'center', border: '1px solid #FFE0B2' }}>
          <Box component={RouterLink} to="/" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textDecoration: 'none', mb: 3 }}>
            <WifiIcon sx={{ fontSize: 40, mr: 1, color: 'primary.main' }} />
            <Typography variant="h4" sx={{ fontWeight: 800, color: 'primary.main' }}>KuotaKuy</Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Buat Akun Sekarang!</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>Gabung jadi bagian dari KuotaKuy.</Typography>
          
          {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>Pendaftaran Berhasil! Mengalihkan ke Login...</Alert>}
          
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid size={12}>
                <TextField fullWidth label="Nama Lengkap" name="name" variant="outlined" required value={formData.name} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="Email" type="email" name="email" variant="outlined" required value={formData.email} onChange={handleChange} />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField fullWidth label="No HP" name="phone" variant="outlined" required value={formData.phone} onChange={handleChange} />
              </Grid>
              <Grid size={12}>
                <TextField fullWidth label="Username" name="username" variant="outlined" required value={formData.username} onChange={handleChange} />
              </Grid>
              <Grid size={12}>
                <TextField 
                  fullWidth label="Password" name="password" 
                  type={showPassword ? 'text' : 'password'} 
                  variant="outlined" required 
                  value={formData.password} onChange={handleChange}
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
              </Grid>
            </Grid>
            <Button fullWidth variant="contained" color="primary" size="large" type="submit" sx={{ py: 1.5, mt: 4, mb: 3 }}>
              Daftar Sekarang
            </Button>
            <Typography variant="body2">
              Sudah punya akun? <Link component={RouterLink} to="/login" sx={{ fontWeight: 700, textDecoration: 'none' }}>Masuk Di Sini</Link>
            </Typography>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default RegisterPage;
