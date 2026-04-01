import React, { useState } from 'react';
import { 
  AppBar, Toolbar, Typography, Button, Box, Container, 
  IconButton, Drawer, List, ListItem, ListItemButton, 
  ListItemIcon, ListItemText, useMediaQuery, useTheme 
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Wifi as WifiIcon, 
  Login as LoginIcon, 
  Dashboard as DashboardIcon,
  Home as HomeIcon,
  ShoppingBag as PackageIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  Close as CloseIcon,
  ElectricBolt as BoltIcon,
  Diamond as DiamondIcon,
  SupportAgent as SupportIcon,
  VerifiedUser as ShieldIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logoutCustomer } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ fontSize: 16 }} /> Potongan 50% Untuk Pengguna Baru
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DiamondIcon sx={{ fontSize: 16 }} /> Paket Sultan Lagi Diskon Besar
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <SupportIcon sx={{ fontSize: 16 }} /> Support 24/7 Siap Membantu
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <ShieldIcon sx={{ fontSize: 16 }} /> Transaksi 100% Aman & Terpercaya
            </Box>
            {/* Repeat for seamless marquee */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BoltIcon sx={{ fontSize: 16 }} /> Potongan 50% Untuk Pengguna Baru
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <DiamondIcon sx={{ fontSize: 16 }} /> Paket Sultan Lagi Diskon Besar
            </Box>
          </Box>
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

      <Drawer 
        anchor="bottom" 
        open={mobileOpen} 
        onClose={handleDrawerToggle} 
        ModalProps={{ keepMounted: true }} 
        PaperProps={{ 
          sx: { 
            borderTopLeftRadius: 32, 
            borderTopRightRadius: 32, 
            overflow: 'hidden',
            maxHeight: '85vh',
            bgcolor: 'white',
            boxShadow: '0 -20px 40px rgba(0,0,0,0.1)'
          } 
        }}
        sx={{ zIndex: 2000 }}
      >
        <Box sx={{ p: 4, pt: 1, pb: 6 }}>
          {/* Bottom Sheet Handle */}
          <Box sx={{ 
            width: 40, height: 4, bgcolor: '#E0E0E0', borderRadius: 2, 
            mx: 'auto', mt: 1.5, mb: 4 
          }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
              <Box sx={{ 
                width: 40, height: 40, bgcolor: 'primary.main', borderRadius: 2, 
                display: 'flex', alignItems: 'center', justifyContent: 'center', mr: 2,
                boxShadow: '0 8px 16px rgba(59, 130, 246, 0.2)'
              }}>
                <WifiIcon sx={{ color: 'white', fontSize: 24 }} />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1 }}>KuotaKuy</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                  {user ? `Halo, ${user.name}` : 'Pilihan Paket Hemat'}
                </Typography>
              </Box>
            </Box>
            <IconButton onClick={handleDrawerToggle} sx={{ bgcolor: '#F5F5F5' }}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          <List sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2, mb: 4 }}>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <ListItem key={item.text} disablePadding>
                  <ListItemButton 
                    component={Link} 
                    to={item.path} 
                    onClick={handleDrawerToggle} 
                    sx={{ 
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 4,
                      pt: 3, pb: 2,
                      bgcolor: isActive ? 'primary.main' : '#FBFBFB',
                      border: '1px solid',
                      borderColor: isActive ? 'primary.main' : '#F0F0F0',
                      color: isActive ? 'white' : 'text.primary',
                      transition: 'all 0.2s',
                      '&:hover': { 
                        bgcolor: isActive ? 'primary.dark' : '#F0F7FF', 
                        borderColor: isActive ? 'primary.dark' : 'primary.light' 
                      }
                    }}
                  >
                    <ListItemIcon sx={{ 
                      color: isActive ? 'white' : 'primary.main', mb: 1.5, minWidth: 0,
                      '& svg': { fontSize: 28 }
                    }}>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.text} 
                      primaryTypographyProps={{ 
                        fontWeight: 700, 
                        textAlign: 'center',
                        fontSize: '0.9rem'
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>

          <Box sx={{ pt: 4, borderTop: '1px solid #F5F5F5' }}>
            {!user ? (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  fullWidth 
                  component={Link} 
                  to="/login" 
                  onClick={handleDrawerToggle} 
                  variant="outlined" 
                  startIcon={<LoginIcon />} 
                  color="primary" 
                  sx={{ borderRadius: 4, py: 2, fontWeight: 700 }}
                >
                  Masuk
                </Button>
                <Button 
                  fullWidth 
                  component={Link} 
                  to="/register" 
                  onClick={handleDrawerToggle} 
                  variant="contained" 
                  color="primary" 
                  sx={{ 
                    borderRadius: 4, py: 2, fontWeight: 800,
                    boxShadow: '0 8px 24px rgba(59, 130, 246, 0.25)'
                  }}
                >
                  Daftar
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  fullWidth 
                  component={Link} 
                  to="/dashboard-customer" 
                  onClick={handleDrawerToggle} 
                  variant="outlined" 
                  startIcon={<DashboardIcon />} 
                  color="primary" 
                  sx={{ borderRadius: 4, py: 2, fontWeight: 700 }}
                >
                  Dashboard
                </Button>
                <Button 
                  fullWidth 
                  onClick={handleLogout} 
                  variant="contained" 
                  color="error" 
                  startIcon={<LogoutIcon />} 
                  sx={{ 
                    borderRadius: 4, py: 2, fontWeight: 800,
                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  Logout
                </Button>
              </Box>
            )}
          </Box>
        </Box>
      </Drawer>
    </Box>
  );
};

export default Navbar;
