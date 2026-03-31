import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, TextField, InputAdornment, Skeleton, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions, Divider } from '@mui/material';
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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<Package | null>(null);

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
        packageId: selectedPkg.id,
        date: new Date().toISOString().split('T')[0],
        status: 'success'
      };
      await transactionService.create(transaction);
      setOpenConfirm(false);
      setOpenSnackbar(true);
      setTimeout(() => navigate('/dashboard-customer'), 2000);
    } catch (error) {
      console.error('Purchase failed', error);
    }
  };

  const filteredPackages = packages.filter(pkg => 
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.quota.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', pb: 10, pt: '112px' }}>
      <Navbar />
      <Box sx={{ bgcolor: 'secondary.light', py: 8, mb: 6 }}>
        <Container maxWidth="lg">
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 1, textAlign: 'center' }}>
            Pilih Paket Kamu
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ textAlign: 'center', mb: 4 }}>
            Semua paket aktif langsung setelah pembayaran.
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
                    <SearchIcon color="primary" />
                  </InputAdornment>
                ),
                sx: { borderRadius: 10, bgcolor: 'white' }
              }}
            />
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {loading ? (
            Array.from(new Array(6)).map((_, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={250} sx={{ borderRadius: 4 }} />
              </Grid>
            ))
          ) : filteredPackages.length > 0 ? (
            filteredPackages.map((pkg) => (
              <Grid key={pkg.id} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ 
                  height: '100%', 
                  display: 'flex', 
                  flexDirection: 'column',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'scale(1.02)' }
                }}>
                  <CardContent sx={{ flexGrow: 1, p: 3, textAlign: 'center' }}>
                    <Box sx={{ bgcolor: 'secondary.light', p: 2, borderRadius: '50%', display: 'inline-flex', mb: 2 }}>
                      <WifiIcon color="primary" fontSize="large" />
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>{pkg.name}</Typography>
                    <Typography variant="h4" color="primary.main" sx={{ fontWeight: 800, mb: 1 }}>{pkg.quota}</Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, color: 'text.secondary', mb: 2 }}>
                      <TimeIcon fontSize="small" />
                      <Typography variant="body2">{pkg.validity}</Typography>
                    </Box>
                    
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>{formatRupiah(pkg.price)}</Typography>
                    
                    <Button variant="contained" fullWidth color="primary" onClick={() => handleBuy(pkg)}>
                      Beli Sekarang
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Grid size={12}>
              <Typography align="center" color="text.secondary">Paket tidak ditemukan.</Typography>
            </Grid>
          )}
        </Grid>
      </Container>
      
      {/* High-End Professional Checkout Dialog */}
      <Dialog 
        open={openConfirm} 
        onClose={() => !loading && setOpenConfirm(false)}
        maxWidth="xs"
        fullWidth
        slotProps={{
          backdrop: { sx: { backdropFilter: 'blur(8px)', bgcolor: 'rgba(0,0,0,0.4)' } }
        }}
        PaperProps={{ 
          sx: { 
            borderRadius: 8, 
            p: 1, 
            backgroundImage: 'linear-gradient(to bottom, #FFFFFF, #FFFBF9)',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' 
          } 
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', pt: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 900, color: '#1A1A1A', letterSpacing: -0.5 }}>Metode Pembayaran</Typography>
          <Typography variant="body2" color="text.secondary">Satu langkah lagi menuju internet ngebut!</Typography>
        </DialogTitle>
        
        <DialogContent sx={{ mt: 2, px: 3 }}>
          {/* Package Summary Card */}
          <Box sx={{ 
            p: 2.5, 
            bgcolor: 'primary.main', 
            borderRadius: 6, 
            mb: 4, 
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 15px 30px rgba(255,112,67,0.3)'
          }}>
            <Box sx={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
            <Typography variant="overline" sx={{ opacity: 0.8, fontWeight: 700 }}>Paket Data</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 900 }}>{selectedPkg?.quota}</Typography>
                <Typography variant="body2" sx={{ opacity: 0.9 }}>{selectedPkg?.name}</Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>{selectedPkg ? formatRupiah(selectedPkg.price) : ''}</Typography>
            </Box>
          </Box>

          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
             <Box sx={{ width: 4, height: 16, bgcolor: 'primary.main', borderRadius: 2 }} />
             Pilih Saldo / E-Wallet
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 4 }}>
            {[
              { id: 'gopay', name: 'GoPay', color: '#00AED6' },
              { id: 'ovo', name: 'OVO', color: '#4C2A86' },
              { id: 'dana', name: 'DANA', color: '#118EEA' },
              { id: 'va', name: 'VA Bank', color: '#666' }
            ].map((method, idx) => (
              <Grid key={method.id} size={6}>
                <Button 
                  fullWidth
                  variant="outlined"
                  sx={{ 
                    py: 1.8, borderRadius: 5, fontSize: '0.75rem', fontWeight: 800,
                    borderColor: idx === 0 ? method.color : '#EEE', 
                    bgcolor: 'white',
                    color: 'text.primary',
                    display: 'flex', flexDirection: 'column', gap: 1,
                    borderWidth: idx === 0 ? 2 : 1,
                    transition: '0.2s',
                    '&:hover': { bgcolor: '#FDFDFD', borderColor: method.color }
                  }}
                >
                  <Box 
                    component="img" 
                    src={`/assets/payments/${method.id}.png`} 
                    sx={{ height: 28, width: 'auto', objectFit: 'contain', filter: idx === 0 ? 'none' : 'grayscale(100%)', opacity: idx === 0 ? 1 : 0.6 }} 
                  />
                  {method.name}
                </Button>
              </Grid>
            ))}
          </Grid>

          {/* Detailed Price Breakdown */}
          <Box sx={{ bgcolor: '#F9F9F9', p: 2, borderRadius: 5, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Harga Paket</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedPkg ? formatRupiah(selectedPkg.price) : ''}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">Biaya Admin</Typography>
              <Typography variant="body2" sx={{ fontWeight: 600, color: '#66BB6A' }}>Gratis</Typography>
            </Box>
            <Divider sx={{ my: 1.5, borderStyle: 'dashed' }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Total Bayar</Typography>
              <Typography variant="h6" sx={{ fontWeight: 900, color: 'primary.main' }}>{selectedPkg ? formatRupiah(selectedPkg.price) : ''}</Typography>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, opacity: 0.6 }}>
             <WifiIcon sx={{ fontSize: 18 }} />
             <Typography variant="caption" sx={{ fontWeight: 700 }}>Secure 256-bit SSL Payment</Typography>
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 4, pt: 0, flexDirection: 'column', gap: 1.5 }}>
          <Button 
            onClick={confirmPurchase} 
            disabled={loading}
            variant="contained" 
            fullWidth 
            sx={{ 
              py: 2, borderRadius: 6, fontWeight: 900, fontSize: '1rem',
              boxShadow: '0 15px 30px rgba(255,112,67,0.4)',
              textTransform: 'none'
            }}
          >
            {loading ? 'Memproses...' : 'Konfirmasi & Bayar'}
          </Button>
          <Button onClick={() => setOpenConfirm(false)} fullWidth sx={{ color: 'text.secondary', fontWeight: 700, textTransform: 'none' }}>
            Nanti Saja
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Success Notification */}
      <Snackbar open={openSnackbar} autoHideDuration={3000} onClose={() => setOpenSnackbar(false)}>
        <Alert severity="success" sx={{ width: '100%' }}>Pembelian Berhasil! Mengalihkan ke Dashboard...</Alert>
      </Snackbar>
    </Box>
  );
};

export default PackagesPage;
