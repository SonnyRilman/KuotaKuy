import React from 'react';
import { Box, Typography, Button, Container, Card, CardContent, Grid } from '@mui/material';
import { 
  Wifi as WifiIcon, 
  Speed as SpeedIcon, 
  SignalCellularAlt as SignalIcon 
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';

const LandingPage: React.FC = () => {
  const featuredPackages = [
    { title: 'Paket Hemat', quota: '1GB', price: '10.000', color: '#66BB6A', icon: <WifiIcon sx={{ fontSize: 40 }} /> },
    { title: 'Paket Gaul', quota: '5GB', price: '35.000', color: '#FF7043', icon: <SpeedIcon sx={{ fontSize: 40 }} /> },
    { title: 'Paket Sultan', quota: '20GB', price: '100.000', color: '#FFA726', icon: <SignalIcon sx={{ fontSize: 40 }} /> },
  ];

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#FFF8F5',
      background: 'radial-gradient(circle at 70% 30%, #FFE0B2 0%, #FFF8F5 50%)',
      overflow: 'hidden'
    }}>

      <Navbar />
      
      {/* Hero Section Wrapper */}
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        position: 'relative',
        pt: { xs: '120px', md: '160px' }, // Balanced offset for fixed navbar
        pb: 8
      }}>
        <Container maxWidth="lg" sx={{ 
          position: 'relative',
          zIndex: 2
        }}>
          {/* Decorative Floating Elements */}
          <Box sx={{ 
            position: 'absolute', top: '10%', right: '5%', width: 300, height: 300, 
            bgcolor: 'primary.main', opacity: 0.05, filter: 'blur(80px)', borderRadius: '50%' 
          }} />

          <Grid container spacing={8} alignItems="center">
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ position: 'relative' }}>
                <Typography variant="overline" sx={{ color: 'primary.main', fontWeight: 800, letterSpacing: 3, mb: 1, display: 'block' }}>
                  #1 PLATFORM KUOTA MUDAH
                </Typography>
                <Typography variant="h1" sx={{ 
                  fontWeight: 900, 
                  lineHeight: 1.1, 
                  mb: 3,
                  fontSize: { xs: '3rem', md: '4.5rem' },
                  color: '#3D2C2C'
                }}>
                  Internet Cepat, <br />
                  <Box component="span" sx={{ 
                    color: 'primary.main',
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 10,
                      left: 0,
                      width: '100%',
                      height: 12,
                      bgcolor: 'primary.light',
                      opacity: 0.3,
                      zIndex: -1
                    }
                  }}>Dompet Hemat!</Box>
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 5, fontWeight: 400, maxWidth: 500, lineHeight: 1.6 }}>
                  Temukan paket data internet tercepat dan termurah hanya di KuotaKuy. Aktivasi instan tanpa ribet, 24/7! Bergabunglah dengan Jutaan Pelanggan Lainnya.
                </Typography>
                
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                  <Button 
                    component={Link} to="/packages" 
                    variant="contained" size="large" 
                    sx={{ 
                      px: 5, py: 2, borderRadius: 10, bgcolor: 'primary.main', fontWeight: 700,
                      boxShadow: '0 15px 30px rgba(255, 112, 67, 0.3)',
                      '&:hover': { transform: 'translateY(-3px)', boxShadow: '0 20px 40px rgba(255, 112, 67, 0.4)' }
                    }}
                  >
                    Lihat Paket Sekarang
                  </Button>
                  <Button 
                    component={Link} to="/register" 
                    variant="outlined" size="large" 
                    sx={{ 
                      px: 5, py: 2, borderRadius: 10, border: '2px solid', fontWeight: 700,
                      '&:hover': { border: '2px solid', transform: 'translateY(-3px)' }
                    }}
                  >
                    Daftar Akun
                  </Button>
                </Box>
              </Box>
            </Grid>
            
            <Grid size={{ xs: 12, md: 6 }}>
              <Box sx={{ 
                position: 'relative', 
                textAlign: 'center',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: { xs: 300, md: 550 },
                zIndex: 1
              }}>
                {/* Pulsating Core Background */}
                <Box sx={{ 
                  position: 'absolute',
                  width: '60%',
                  height: '60%',
                  bgcolor: 'primary.main',
                  borderRadius: '50%',
                  opacity: 0.1,
                  filter: 'blur(60px)',
                  animation: 'pulseGlow 4s ease-in-out infinite',
                  '@keyframes pulseGlow': {
                    '0%, 100%': { transform: 'scale(1)', opacity: 0.1 },
                    '50%': { transform: 'scale(1.3)', opacity: 0.2 }
                  }
                }} />

                {/* Floating Connectivity Icons */}
                <Box sx={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2 }}>
                  <WifiIcon sx={{ 
                    position: 'absolute', top: '10%', left: '20%', fontSize: 40, color: 'primary.main', opacity: 0.4,
                    animation: 'floatIcon 5s ease-in-out infinite'
                  }} />
                  <SpeedIcon sx={{ 
                    position: 'absolute', bottom: '15%', right: '10%', fontSize: 50, color: 'primary.main', opacity: 0.4,
                    animation: 'floatIcon 7s ease-in-out infinite -2s'
                  }} />
                  <SignalIcon sx={{ 
                    position: 'absolute', top: '20%', right: '15%', fontSize: 30, color: 'primary.main', opacity: 0.3,
                    animation: 'floatIcon 6s ease-in-out infinite -1s'
                  }} />
                </Box>

                <Box 
                  component="img" 
                  src="/assets/hero.png"
                  alt="3D Illustration"
                  sx={{ 
                    width: '100%', 
                    maxWidth: { xs: 400, md: 550 }, 
                    position: 'relative', 
                    zIndex: 3,
                    borderRadius: 10,
                    boxShadow: '0 40px 80px rgba(255, 112, 67, 0.2)',
                    border: '8px solid white',
                    animation: 'floatingHero 6s ease-in-out infinite',
                    '@keyframes floatingHero': {
                      '0%, 100%': { transform: 'translateY(0) rotate(2deg)' },
                      '50%': { transform: 'translateY(-20px) rotate(-1.5deg)' }
                    },
                    '@keyframes floatIcon': {
                      '0%, 100%': { transform: 'translateY(0) translateX(0)' },
                      '50%': { transform: 'translateY(-20px) translateX(10px)' }
                    }
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 2 }}>
        <Grid container spacing={4}>
          {[
            { label: 'Pelanggan Aktif', value: '1.2M+', color: '#FF7043' },
            { label: 'Transaksi Berhasil', value: '50M+', color: '#66BB6A' },
            { label: 'Wilayah Jangkauan', value: '514 Kota', color: '#42A5F5' },
            { label: 'Dukungan CS 24/7', value: '100%', color: '#FFA726' }
          ].map((stat, i) => (
            <Grid key={i} size={{ xs: 6, md: 3 }}>
              <Box sx={{ 
                textAlign: 'center', 
                p: 3, 
                borderRadius: 8, 
                bgcolor: 'white',
                boxShadow: '0 10px 30px rgba(0,0,0,0.03)',
                border: '1px solid #FFE0B2',
                transition: '0.3s',
                '&:hover': { transform: 'scale(1.05)', borderColor: stat.color }
              }}>
                <Typography variant="h4" sx={{ fontWeight: 900, color: stat.color, mb: 1 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>{stat.label}</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Partners/Operators Bar */}
      <Box sx={{ py: 8, bgcolor: 'white', borderY: '1px solid #FFE0B2', overflow: 'hidden' }}>
        <Container maxWidth="lg">
          <Typography textAlign="center" variant="overline" sx={{ fontWeight: 800, mb: 6, display: 'block', opacity: 0.6, letterSpacing: 2 }}>
            TELAH DIDUKUNG OLEH OPERATOR RESMI
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            gap: 4, 
            alignItems: 'center',
            width: 'max-content',
            animation: 'marqueePartners 40s linear infinite',
            '@keyframes marqueePartners': {
              '0%': { transform: 'translateX(0)' },
              '100%': { transform: 'translateX(-50%)' }
            }
          }}>
            {[
              { id: 'telkomsel', name: 'TELKOMSEL' },
              { id: 'indosat', name: 'INDOSAT' },
              { id: 'xl', name: 'XL AXIATA' },
              { id: 'tri', name: 'TRI' },
              { id: 'smartfren', name: 'SMARTFREN' },
              { id: 'byu', name: 'BY.U' }
            ].map((p, i) => (
              <Box key={i} sx={{ 
                p: 1.5, 
                bgcolor: 'white', 
                borderRadius: 4,
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                minWidth: 140,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFE0B2',
                transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': { transform: 'translateY(-10px) scale(1.05)', boxShadow: '0 15px 35px rgba(255,112,67,0.1)' }
              }}>
                <Box component="img" src={`/assets/logos/${p.id}.png`} alt={p.name} sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </Box>
            ))}
            {/* Repeat for continuous marquee */}
            {[
              { id: 'telkomsel', name: 'TELKOMSEL' },
              { id: 'indosat', name: 'INDOSAT' },
              { id: 'xl', name: 'XL AXIATA' },
              { id: 'tri', name: 'TRI' },
              { id: 'smartfren', name: 'SMARTFREN' },
              { id: 'byu', name: 'BY.U' }
            ].map((p, i) => (
              <Box key={i+6} sx={{ 
                p: 1.5, 
                bgcolor: 'white', 
                borderRadius: 4,
                boxShadow: '0 8px 25px rgba(0,0,0,0.05)',
                minWidth: 140,
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid #FFE0B2',
                transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': { transform: 'translateY(-10px) scale(1.05)', boxShadow: '0 15px 35px rgba(255,112,67,0.1)' }
              }}>
                <Box component="img" src={`/assets/logos/${p.id}.png`} alt={p.name} sx={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* SVG Wave Separator */}
      <Box sx={{ 
        width: '100%', 
        lineHeight: 0, 
        bgcolor: '#FFF8F5',
        '& svg': { fill: 'white' }
      }}>
        <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,96L80,85.3C160,75,320,53,480,53.3C640,53,800,75,960,80C1120,85,1280,75,1360,69.3L1440,64L1440,320L1360,320C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320L0,320Z"></path>
        </svg>
      </Box>

      {/* Featured Section */}
      <Box sx={{ bgcolor: 'white', pb: 12 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 800, mb: 1 }}>
            Paket Terpopuler
          </Typography>
          <Typography variant="h6" align="center" color="text.secondary" paragraph sx={{ mb: 8, opacity: 0.8 }}>
            Pilihan terbaik buat kamu yang pengen tetep eksis tanpa boncos.
          </Typography>
          <Grid container spacing={4}>
            {featuredPackages.map((pkg, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ 
                  textAlign: 'center', 
                  borderRadius: 10,
                  overflow: 'visible',
                  border: '1px solid #FFE0B2',
                  bgcolor: 'white',
                  position: 'relative',
                  transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s',
                  '&:hover': { transform: 'translateY(-20px)', boxShadow: '0 40px 80px rgba(255,112,67,0.15)' }
                }}>
                  {idx === 1 && (
                    <Box sx={{ 
                      position: 'absolute', top: -15, left: '50%', transform: 'translateX(-50%)',
                      bgcolor: 'primary.main', color: 'white', px: 3, py: 0.5, borderRadius: 5,
                      fontWeight: 800, fontSize: '0.7rem', zIndex: 10, boxShadow: '0 10px 20px rgba(255,112,67,0.3)'
                    }}>
                      BEST VALUE
                    </Box>
                  )}
                  <CardContent sx={{ py: 6 }}>
                    <Typography variant="h5" sx={{ fontWeight: 800, mb: 2 }}>{pkg.title}</Typography>
                    <Box sx={{ 
                      bgcolor: pkg.color, 
                      color: 'white', 
                      py: 3, px: 4, 
                      borderRadius: '35% 65% 65% 35% / 30% 30% 70% 70%', 
                      display: 'inline-flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 4,
                      boxShadow: `0 15px 30px ${pkg.color}44`,
                      animation: 'morphing 8s ease-in-out infinite',
                      '@keyframes morphing': {
                        '0%, 100%': { borderRadius: '35% 65% 65% 35% / 30% 30% 70% 70%' },
                        '50%': { borderRadius: '65% 35% 35% 65% / 70% 70% 30% 30%' }
                      }
                    }}>
                      <Box sx={{ mb: 1, color: 'rgba(255,255,255,0.9)' }}>{pkg.icon}</Box>
                      <Typography variant="h3" sx={{ fontWeight: 900 }}>{pkg.quota}</Typography>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 900, mt: 2 }}>Rp {pkg.price}</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 4, opacity: 0.7 }}>Masa aktif 30 hari</Typography>
                    <Button component={Link} to="/packages" variant="contained" fullWidth sx={{ py: 2, borderRadius: 10, bgcolor: pkg.color, fontWeight: 800, '&:hover': { bgcolor: pkg.color, opacity: 0.9 } }}>
                      Beli Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{ py: 8, textAlign: 'center', borderTop: '1px solid #FFE0B2', bgcolor: 'white' }}>
        <Container>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
            <WifiIcon sx={{ fontSize: 32, mr: 1.5, color: 'primary.main' }} />
            <Typography variant="h5" sx={{ fontWeight: 900, color: '#3D2C2C' }}>KuotaKuy</Typography>
          </Box>
          <Typography color="text.secondary" sx={{ mb: 4, fontWeight: 500 }}>Kuota Murah, Hidup Makin Gaul!</Typography>
          <Typography variant="body2" color="text.disabled">
            © 2026 KuotaKuy. Powered by Sonny Rilman.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
