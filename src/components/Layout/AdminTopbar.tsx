import React from 'react';
import { AppBar, Toolbar, Typography, Avatar, Box, IconButton, Badge } from '@mui/material';
import { Notifications as NotificationsIcon, Person as PersonIcon } from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const AdminTopbar: React.FC = () => {
  const { admin } = useAuth();

  return (
    <AppBar position="fixed" elevation={0} sx={{ width: `calc(100% - 240px)`, ml: `240px`, backgroundColor: '#FFFFFF', borderBottom: '1px solid #FFE0B2', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={4} color="error">
            <NotificationsIcon color="primary" />
          </Badge>
        </IconButton>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}>
          <Box sx={{ textAlign: 'right', display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              {admin?.name || 'Administrator'}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Admin KuotaKuy
            </Typography>
          </Box>
          <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
            <PersonIcon />
          </Avatar>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminTopbar;
