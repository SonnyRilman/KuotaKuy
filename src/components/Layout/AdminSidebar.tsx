import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, Box, Divider, Avatar, useMediaQuery, useTheme } from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  People as PeopleIcon, 
  Wifi as PackageIcon, 
  Receipt as TransactionIcon, 
  Logout as LogoutIcon,
  Shield as ShieldIcon
} from '@mui/icons-material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

interface AdminSidebarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ mobileOpen, handleDrawerToggle }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { logoutAdmin } = useAuth();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
    { text: 'Customers', icon: <PeopleIcon />, path: '/admin/customers' },
    { text: 'Data Packages', icon: <PackageIcon />, path: '/admin/packages' },
    { text: 'Transactions', icon: <TransactionIcon />, path: '/admin/transactions' },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/admin/login');
  };

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar disableGutters sx={{ minHeight: 120, px: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#FF7043', borderRadius: 3, width: 44, height: 44, boxShadow: '0 8px 20px rgba(255,112,67,0.2)' }}>
          <ShieldIcon sx={{ fontSize: 24, color: 'white' }} />
        </Avatar>
        <Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: -0.5, lineHeight: 1.2 }}>
            KuotaKuy
          </Typography>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, letterSpacing: 0.5 }}>
            ADMIN PANEL v2.0
          </Typography>
        </Box>
      </Toolbar>

      <Box sx={{ overflow: 'auto', mt: 2 }}>
        <List sx={{ px: 0 }}>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
                <ListItemButton 
                  component={Link} 
                  to={item.path}
                  onClick={isMobile ? handleDrawerToggle : undefined}
                  sx={{
                    borderRadius: 4,
                    py: 1.5,
                    px: 3,
                    transition: '0.2s',
                    position: 'relative',
                    bgcolor: active ? '#FFF3E0' : 'transparent',
                    color: active ? '#FF7043' : '#64748B',
                    '&:hover': { 
                      bgcolor: active ? '#FFF3E0' : '#F8FAFC',
                      color: active ? '#FF7043' : '#1E293B',
                      '& .MuiListItemIcon-root': { color: active ? '#FF7043' : '#1E293B' }
                    },
                  }}
                >
                  {active && (
                    <Box sx={{ position: 'absolute', left: 0, top: '25%', bottom: '25%', width: 4, bgcolor: '#FF7043', borderRadius: '0 4px 4px 0' }} />
                  )}
                  <ListItemIcon sx={{ 
                    minWidth: 40, 
                    color: active ? '#FF7043' : '#94A3B8',
                    transition: '0.2s'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }} />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        <Divider sx={{ my: 4, borderStyle: 'dashed', borderColor: '#E2E8F0' }} />
        
        <Box sx={{ px: 2, mb: 10 }}>
          <ListItem disablePadding>
            <ListItemButton 
              onClick={handleLogout}
              sx={{
                borderRadius: 4,
                py: 1.5,
                color: '#64748B',
                '&:hover': { backgroundColor: '#FFEBEE', color: '#EF4444', '& .MuiListItemIcon-root': { color: '#EF4444' } },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: '#94A3B8' }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText primary="Sign Out" primaryTypographyProps={{ fontWeight: 800, fontSize: '0.9rem' }} />
            </ListItemButton>
          </ListItem>
        </Box>
      </Box>

      <Box sx={{ mt: 'auto', p: 4, textAlign: 'center' }}>
         <Typography variant="caption" sx={{ color: '#CBD5E1', fontWeight: 800, letterSpacing: 1 }}>
            &copy; 2026 KUOTAKUY HUB
         </Typography>
      </Box>
    </Box>
  );

  return (
    <Box component="nav" sx={{ width: { lg: drawerWidth }, flexShrink: { lg: 0 } }}>
      {/* Mobile Drawer (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }} 
        sx={{
          display: { xs: 'block', lg: 'none' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            borderRight: '10px solid #FF7043',
            boxShadow: '20px 0 50px rgba(0,0,0,0.1)'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop Sidebar (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', lg: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth, 
            borderRight: '1px solid #E2E8F0',
            bgcolor: 'white',
            px: 2
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default AdminSidebar;
