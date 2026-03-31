import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wifi as WifiIcon, 
  Login as LoginIcon, 
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  ShoppingBag as PackageIcon,
  Logout as LogoutIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logoutCustomer } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutCustomer();
    navigate('/');
  };

  return (
    <Box>
      {/* Global Premium Promo Bar */}
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 0.8, 
        overflow: 'hidden', 
        whiteSpace: 'nowrap',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1201, // Above AppBar
        fontSize: '0.75rem',
        fontWeight: 800,
        textTransform: 'uppercase',
        letterSpacing: 1.5,
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          display: 'inline-block',
          pl: '100%',
          animation: 'marqueeGlobal 35s linear infinite',
          '@keyframes marqueeGlobal': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-100%)' }
          }
        }}>
          ⚡ Potongan 50% Untuk Pengguna Baru &nbsp;&nbsp; 💎 Paket Sultan Lagi Diskon Besar &nbsp;&nbsp; Aktivasi Instan Tanpa Ribet &nbsp;&nbsp; 🛠️ Support 24/7 Siap Membantu &nbsp;&nbsp; 🛡️ Transaksi Aman & Terpercaya &nbsp;&nbsp;&nbsp;&nbsp; ⚡ Potongan 50% Untuk Pengguna Baru &nbsp;&nbsp; 💎 Paket Sultan Lagi Diskon Besar &nbsp;&nbsp; Aktivasi Instan Tanpa Ribet &nbsp;&nbsp; 🛠️ Support 24/7 Siap Membantu &nbsp;&nbsp; 🛡️ Transaksi Aman & Terpercaya
        </Box>
      </Box>

      <AppBar position="fixed" color="inherit" elevation={0} sx={{ 
        borderBottom: '1px solid #FFE0B2',
        bgcolor: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        zIndex: 1100,
        top: '32px'
      }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 80 }}>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main', flexGrow: 1 }}>
              <WifiIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>
                KuotaKuy
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button component={Link} to="/" color="inherit" startIcon={<HomeIcon />}>Beranda</Button>
              <Button component={Link} to="/packages" color="inherit" startIcon={<PackageIcon />}>Paket</Button>
              
              {!user ? (
                <>
                  <Button component={Link} to="/login" variant="outlined" startIcon={<LoginIcon />} color="primary" sx={{ borderRadius: 5 }}>
                    Masuk
                  </Button>
                  <Button component={Link} to="/register" variant="contained" color="primary" sx={{ borderRadius: 5, fontWeight: 700 }}>
                    Daftar
                  </Button>
                </>
              ) : (
                <>
                  <Button component={Link} to="/dashboard-customer" startIcon={<DashboardIcon />} color="inherit" sx={{ fontWeight: 700 }}>
                    Dashboard
                  </Button>
                  <Button onClick={handleLogout} variant="outlined" color="primary" startIcon={<LogoutIcon />} sx={{ borderRadius: 5 }}>
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </Box>
  );
};

export default Navbar;
