import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  IconButton, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, useMediaQuery, useTheme 
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Wifi as WifiIcon, 
  Login as LoginIcon, 
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  ShoppingBag as PackageIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    logoutCustomer();
    navigate('/');
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Beranda', icon: <HomeIcon />, path: '/' },
    { text: 'Paket', icon: <PackageIcon />, path: '/packages' },
  ];

  const drawer = (
    <Box sx={{ width: 280, height: '100%', bgcolor: 'white', p: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, px: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
          <WifiIcon sx={{ mr: 1 }} />
          <Typography variant="h6" sx={{ fontWeight: 900 }}>KuotaKuy</Typography>
        </Box>
        <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
      </Box>
      
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
            <ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle} sx={{ borderRadius: 3 }}>
              <ListItemIcon sx={{ color: 'primary.main' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700 }} />
            </ListItemButton>
          </ListItem>
        ))}

        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid #F5F5F5' }}>
          {!user ? (
            <>
              <Button fullWidth component={Link} to="/login" onClick={handleDrawerToggle} variant="outlined" startIcon={<LoginIcon />} color="primary" sx={{ borderRadius: 4, mb: 2, py: 1.5 }}>
                Masuk
              </Button>
              <Button fullWidth component={Link} to="/register" onClick={handleDrawerToggle} variant="contained" color="primary" sx={{ borderRadius: 4, py: 1.5, fontWeight: 800 }}>
                Daftar Akun
              </Button>
            </>
          ) : (
            <>
              <Button fullWidth component={Link} to="/dashboard-customer" onClick={handleDrawerToggle} variant="outlined" startIcon={<DashboardIcon />} color="primary" sx={{ borderRadius: 4, mb: 2, py: 1.5 }}>
                Dashboard
              </Button>
              <Button fullWidth onClick={handleLogout} variant="contained" color="error" startIcon={<LogoutIcon />} sx={{ borderRadius: 4, py: 1.5, fontWeight: 800 }}>
                Logout
              </Button>
            </>
          )}
        </Box>
      </List>
    </Box>
  );

  return (
    <Box>
      {/* Global Premium Promo Bar - Lowered zIndex */}
      <Box sx={{ 
        bgcolor: 'primary.main', color: 'white', py: 0.8, overflow: 'hidden', whiteSpace: 'nowrap',
        position: 'fixed', top: 0, left: 0, right: 0, width: '100%', zIndex: 1100, // Below AppBar
        fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: 1.5, boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <Box sx={{ 
          display: 'inline-block', pl: '100%', animation: 'marqueeGlobal 35s linear infinite',
          '@keyframes marqueeGlobal': { '0%': { transform: 'translateX(0)' }, '100%': { transform: 'translateX(-100%)' } }
        }}>
          ⚡ Potongan 50% Untuk Pengguna Baru &nbsp;&nbsp; 💎 Paket Sultan Lagi Diskon Besar &nbsp;&nbsp; Aktivasi Instan Tanpa Ribet &nbsp;&nbsp; 🛠️ Support 24/7 Siap Membantu &nbsp;&nbsp; 🛡️ Transaksi Aman & Terpercaya
        </Box>
      </Box>

      <AppBar position="fixed" color="inherit" elevation={0} sx={{ 
        borderBottom: '1px solid #FFE0B2', bgcolor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(20px)', 
        zIndex: 1200, // Above Promo Bar
        top: '32px'
      }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 80 }}>
            <Box component={Link} to="/" sx={{ display: 'flex', alignItems: 'center', textDecoration: 'none', color: 'primary.main', flexGrow: 1 }}>
              <WifiIcon sx={{ fontSize: 32, mr: 1 }} />
              <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: -0.5 }}>KuotaKuy</Typography>
            </Box>

            {isMobile ? (
              <IconButton 
                color="primary" 
                onClick={handleDrawerToggle} 
                sx={{ 
                  p: 1.5, 
                  bgcolor: '#FFF3E0', 
                  borderRadius: 3,
                  position: 'relative', // Ensure focus
                  zIndex: 1300 // Absolute top priority for clicking
                }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <Button component={Link} to="/" color="inherit" startIcon={<HomeIcon />}>Beranda</Button>
                <Button component={Link} to="/packages" color="inherit" startIcon={<PackageIcon />}>Paket</Button>
                
                {!user ? (
                  <>
                    <Button component={Link} to="/login" variant="outlined" startIcon={<LoginIcon />} color="primary" sx={{ borderRadius: 5 }}>Masuk</Button>
                    <Button component={Link} to="/register" variant="contained" color="primary" sx={{ borderRadius: 5, fontWeight: 700 }}>Daftar</Button>
                  </>
                ) : (
                  <>
                    <Button component={Link} to="/dashboard-customer" startIcon={<DashboardIcon />} color="inherit" sx={{ fontWeight: 700, borderRadius: 3 }}>Dashboard</Button>
                    <Button onClick={handleLogout} variant="outlined" color="primary" startIcon={<LogoutIcon />} sx={{ borderRadius: 5 }}>Logout</Button>
                  </>
                )}
              </Box>
            )}
          </Toolbar>
        </Container>
      </AppBar>

      <Drawer anchor="right" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted: true }} sx={{ zIndex: 1400 }}>
        {drawer}
      </Drawer>
    </Box>
  );
};

export default Navbar;
