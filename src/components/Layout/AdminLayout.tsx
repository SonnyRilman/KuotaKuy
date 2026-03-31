import React, { useState } from 'react';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import AdminSidebar from './AdminSidebar';
import AdminTopbar from './AdminTopbar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const drawerWidth = 280;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      bgcolor: '#FAFAFA', 
      minHeight: '100vh',
      maxWidth: '100vw',
      overflowX: 'hidden' // Force block any horizontal scroll of the body
    }}>
      <AdminSidebar 
        mobileOpen={mobileOpen} 
        handleDrawerToggle={handleDrawerToggle} 
      />
      <Box sx={{ 
        flexGrow: 1, 
        width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflowX: 'hidden' // Ensure content doesn't overflow
      }}>
        <AdminTopbar onMenuClick={handleDrawerToggle} />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: { xs: 2, sm: 3, md: 4, lg: 5 }, // Adaptive padding: tighter on mobile
            pt: { xs: 2, sm: 3 }, // Adjust top padding for title density
            width: '100%',
            boxSizing: 'border-box'
          }}
        >
          <Box sx={{ height: 100 }} /> {/* Topbar offset */}
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;
