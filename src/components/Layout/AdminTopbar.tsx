import React from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Avatar, Chip, useTheme, useMediaQuery } from '@mui/material';
import { 
  NotificationsNone as NotificationIcon, 
  Search as SearchIcon,
  Menu as MenuIcon,
  VerifiedUser as AdminIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const drawerWidth = 280;

interface AdminTopbarProps {
  onMenuClick?: () => void;
}

const AdminTopbar: React.FC<AdminTopbarProps> = ({ onMenuClick }) => {
  const { admin } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

  const brandColor = '#FF7043';

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`, 
        ml: isMobile ? 0 : `${drawerWidth}px`,
        bgcolor: 'rgba(255, 255, 255, 0.8)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid #F1F5F9',
        zIndex: 1100,
        left: isMobile ? 0 : 'auto',
        right: 0
      }}
    >
      <Toolbar sx={{ 
        height: 100, 
        px: { xs: 1.5, sm: 4 }, 
        display: 'flex', 
        justifyContent: 'space-between',
        maxWidth: '100%',
        boxSizing: 'border-box'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isMobile && (
            <IconButton 
              color="inherit" 
              onClick={onMenuClick} 
              sx={{ mr: 0.5, bgcolor: '#FFF3E0', color: brandColor, borderRadius: 3, p: 1.2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          
          {!isMobile ? (
            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: '#F8FAFC', px: 2, py: 1, borderRadius: 4, width: 300 }}>
              <SearchIcon sx={{ color: '#94A3B8', mr: 1, fontSize: 20 }} />
              <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 500 }}>Cari data atau laporan...</Typography>
            </Box>
          ) : (
            <Typography variant="subtitle1" sx={{ fontWeight: 900, color: brandColor, ml: 1 }}>KuotaKuy</Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 3 } }}>
          <IconButton sx={{ bgcolor: '#F8FAFC', borderRadius: 3, display: { xs: 'none', sm: 'flex' } }}>
            <NotificationIcon sx={{ color: '#64748B' }} />
          </IconButton>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, borderLeft: { xs: 'none', sm: '1px solid #E2E8F0' }, pl: { xs: 0, sm: 3 } }}>
            {!isMobile && (
              <Box sx={{ textAlign: 'right' }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 900, color: '#1E293B', lineHeight: 1 }}>
                  {admin?.name || 'Administrator'}
                </Typography>
                <Chip 
                  label="Super Admin" 
                  size="small" 
                  icon={<AdminIcon style={{ fontSize: 14, color: brandColor }} />}
                  sx={{ 
                    mt: 0.5, height: 20, fontSize: '0.65rem', fontWeight: 900, bgcolor: '#FFF3E0', color: brandColor,
                    '& .MuiChip-icon': { color: brandColor }
                  }} 
                />
              </Box>
            )}
            <Avatar 
              sx={{ 
                bgcolor: brandColor, 
                width: { xs: 40, sm: 48 }, 
                height: { xs: 40, sm: 48 }, 
                borderRadius: { xs: 2.5, sm: 4 },
                boxShadow: '0 10px 20px rgba(255,112,67,0.2)',
                fontWeight: 900,
                fontSize: { xs: '0.9rem', sm: '1rem' }
              }}
            >
              {admin?.name?.charAt(0) || 'A'}
            </Avatar>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminTopbar;
