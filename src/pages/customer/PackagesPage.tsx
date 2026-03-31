import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, TextField, InputAdornment, Skeleton, Dialog, DialogTitle, DialogContent, DialogActions, Divider, useMediaQuery, useTheme } from '@mui/material';
import { Search as SearchIcon, Wifi as WifiIcon, AccessTime as TimeIcon } from '@mui/icons-material';
import { packageService, transactionService } from '../../services/allServices';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Layout/Navbar';
import { formatRupiah } from '../../utils/formatRupiah';

interface Package {
  id: string;
  name: string;
  quota: string;
  price: number;
  validity: string;
}

const PackagesPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('gopay');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const { data } = await packageService.getAll();
        setPackages(data);
      } catch (error) {
        console.error('Error fetching packages', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPackages();
  }, []);

  const handleBuy = (pkg: Package) => {
    if (!user) {
      navigate('/login');
    } else {
      setSelectedPkg(pkg);
      setOpenConfirm(true);
    }
  };

  const confirmPurchase = async () => {
    if (!selectedPkg || !user) return;
    try {
      const transaction = {
        customerId: user.id,
        status: 'success',
        date: new Date().toISOString(),
        packageId: selectedPkg.id,
        paymentMethod: paymentMethod 
      };
      await transactionService.create(transaction);
      setOpenConfirm(false);
      setOpenSnackbar(true);
    } catch (error) {
      console.error('Purchase failed', error);
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.quota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, pt: { xs: '110px', md: '140px' }, bgcolor: '#F8FAFC' }}>
      <Navbar />
      
      {/* Hero Section - Responsive Typography */}
      <Box sx={{ bgcolor: 'white', py: { xs: 4, md: 8 }, mb: 4, borderBottom: '1px solid #F1F5F9' }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ 
            fontWeight: 900, 
            mb: 1, 
            textAlign: 'center',
            fontSize: { xs: '1.85rem', md: '3rem' },
            letterSpacing: -1.5,
            color: '#1E293B'
          }}>
            Pilih Paket Kamu
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mb: 4, fontWeight: 500 }}>
            Kuota murah, instan aktif, hidup makin gaul bareng KuotaKuy!
          </Typography>
          
          <Box maxWidth="600px" sx={{ mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Cari paket atau kuota..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#FF7043' }} />
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: 5, 
                  bgcolor: '#F8FAFC',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#FF7043' }
                }
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {loading ? (
            [...Array(6)].map((_, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Skeleton variant="rectangular" height={280} sx={{ borderRadius: 6 }} />
              </Grid>
            ))
          ) : filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <Grid key={pkg.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
                <Card elevation={0} sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  borderRadius: 6,
                  border: '1px solid #F1F5F9',
                  transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  '&:hover': { transform: 'translateY(-10px)', boxShadow: '0 20px 40px rgba(0,0,0,0.05)', borderColor: '#FF7043' }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
                    <Box sx={{ bgcolor: '#FFF3E0', p: 2, borderRadius: 5, display: 'inline-flex', mb: 2.5, color: '#FF7043' }}>
                      <WifiIcon fontSize="large" sx={{ fontSize: 32 }} />
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, color: '#94A3B8', mb: 1, letterSpacing: 0.5 }}>{pkg.name.toUpperCase()}</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 900, color: '#FF7043', mb: 1, letterSpacing: -1 }}>{pkg.quota}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: '#64748B', mb: 3 }}>
                      <TimeIcon sx={{ fontSize: 16 }} />
                      <Typography variant="caption" sx={{ fontWeight: 800 }}>{pkg.validity}</Typography>
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 900, mb: 3, color: '#1E293B' }}>{formatRupiah(pkg.price)}</Typography>
                    
                    <Button 
                      variant="contained" 
                      fullWidth 
                      onClick={() => handleBuy(pkg)}
                      sx={{ 
                        borderRadius: 3.5, fontWeight: 900, py: 1.5,
                        bgcolor: '#FF7043', '&:hover': { bgcolor: '#F4511E' },
                        boxShadow: '0 10px 20px rgba(255,112,67,0.2)',
                        textTransform: 'none'
                      }}
                    >
                      Beli Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Box sx={{ py: 10, textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#94A3B8' }}>Duh! Paket Kuotamu Gak Ketemu.</Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
      
      {/* High-End Professional Checkout Dialog */}
      <Dialog 
        open={openConfirm} 
        onClose={() => setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 8, p: { xs: 1, sm: 2 } } }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: -0.5 }}>Konfirmasi Beli</Typography>
          <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>Tentukan metode pembayaranmu.</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ px: { xs: 2, sm: 4 } }}>
          <Paper elevation={0} sx={{ 
            p: 3, bgcolor: '#FF7043', borderRadius: 6, mb: 4, color: 'white',
            boxShadow: '0 15px 30px rgba(255,112,67,0.3)', position: 'relative', overflow: 'hidden'
          }}>
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Typography variant="caption" sx={{ fontWeight: 900, opacity: 0.8, letterSpacing: 1 }}>PAKET DIPILIH</Typography>
              <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>{selectedPkg?.quota}</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPkg?.name}</Typography>
            </Box>
            <WifiIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, opacity: 0.1 }} />
          </Paper>

          <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 2, color: '#1E293B' }}>PILIH E-WALLET</Typography>
          <Grid container spacing={1.5} sx={{ mb: 4 }}>
            {['gopay', 'ovo', 'dana', 'va'].map((id) => (
              <Grid key={id} size={6}>
                <Button 
                  fullWidth
                  variant="outlined"
                  onClick={() => setPaymentMethod(id)}
                  sx={{ 
                    py: 2, borderRadius: 4, border: '2px solid',
                    borderColor: paymentMethod === id ? '#FF7043' : '#F1F5F9',
                    bgcolor: paymentMethod === id ? '#FFF3E0' : 'white',
                    color: '#1E293B', fontWeight: 900, textTransform: 'uppercase', fontSize: '0.65rem'
                  }}
                >
                  {id}
                </Button>
              </Grid>
            ))}
          </Grid>

          <Box sx={{ bgcolor: '#F8FAFC', p: 2, borderRadius: 5 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
              <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>Total Pembayaran</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#FF7043' }}>{selectedPkg ? formatRupiah(selectedPkg.price) : ''}</Typography>
            </Box>
            <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, textAlign: 'center', display: 'block' }}>PAJAK & BIAYA ADMIN: Rp 0</Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0, flexDirection: 'column', gap: 2 }}>
          <Button 
            onClick={confirmPurchase} 
            variant="contained" 
            fullWidth 
            sx={{ py: 2, borderRadius: 4, fontWeight: 900, fontSize: '1.1rem', bgcolor: '#FF7043', boxShadow: '0 10px 20px rgba(255,112,67,0.2)' }}
          >
            Bayar Sekarang
          </Button>
          <Button onClick={() => setOpenConfirm(false)} fullWidth sx={{ color: '#94A3B8', fontWeight: 800 }}>Mungkin Nanti</Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Modal */}
      <Dialog open={openSnackbar} PaperProps={{ sx: { borderRadius: 8, p: 4, textAlign: 'center' } }}>
        <Box sx={{ mb: 2, color: '#4CAF50' }}><WifiIcon sx={{ fontSize: 80 }} /></Box>
        <Typography variant="h4" sx={{ fontWeight: 900, mb: 1 }}>Berhasil!</Typography>
        <Typography variant="body1" sx={{ color: '#64748B', fontWeight: 600, mb: 4 }}>Paket internetmu sudah aktif. Selamat berselancar!</Typography>
        <Button variant="contained" fullWidth onClick={() => navigate('/dashboard-customer')} sx={{ py: 1.5, borderRadius: 4, fontWeight: 900, bgcolor: '#FF7043' }}>Ke Dashboard</Button>
      </Dialog>
    </Box>
  );
};

export default PackagesPage;
