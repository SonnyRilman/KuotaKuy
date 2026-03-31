import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Avatar, Skeleton, Divider, IconButton, useMediaQuery, useTheme } from '@mui/material';
import { 
  ReceiptLong as TransactionIcon, 
  AccountBalanceWallet as WalletIcon, 
  AddCircle as AddIcon, 
  NotificationsActive as NotifIcon,
  Timeline as StatsIcon,
  ArrowForward as ArrowIcon
} from '@mui/icons-material';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { packageService } from '../../services/allServices';
import api from '../../services/api';
import { formatRupiah } from '../../utils/formatRupiah';
import { Link } from 'react-router-dom';

interface Transaction {
  id: string;
  customerId: string;
  status: string;
  date: string;
  packageId?: string;
  paymentMethod?: string;
  package?: { name: string, quota: string, price: number };
}

interface Package {
  id: string;
  name: string;
  quota: string;
  price: number;
  validity: string;
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [packages, setPackages] = useState<Package[]>([]);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const { data } = await packageService.getAll();
        setPackages(data || []);
      } catch (err) {
        console.error('Failed to fetch packages', err);
      }
    };
    fetchProps();
  }, []);

  useEffect(() => {
    const fetchUserTransactions = async () => {
      if (!user || packages.length === 0) return;
      setLoading(true);
      try {
        const response = await api.get('/transactions');
        const allTransactions: Transaction[] = response.data || [];
        const filtered = allTransactions.filter(t => String(t.customerId) === String(user.id));
        
        const enriched = filtered.map(tx => ({
          ...tx,
          package: tx.package || packages.find(p => String(p.id) === String(tx.packageId))
        }));

        setTransactions([...enriched].reverse());
        const totalSpent = enriched
          .filter(t => t.status === 'success')
          .reduce((sum, t) => sum + (t.package?.price || 0), 0);
        
        setStats({ total: totalSpent, count: enriched.length });
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserTransactions();
  }, [user, packages]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', pb: 10, pt: { xs: '110px', md: '140px' } }}>
      <Navbar />
      
      <Container maxWidth="lg">
        <Grid container spacing={3}>
          {/* Dashboard Header - Responsive Stacking */}
          <Grid size={{ xs: 12 }}>
            <Box sx={{ 
              display: 'flex', 
              flexDirection: { xs: 'column', sm: 'row' }, 
              justifyContent: 'space-between', 
              alignItems: { xs: 'flex-start', sm: 'center' }, 
              gap: 2,
              mb: 2 
            }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: -1.5, fontSize: { xs: '1.8rem', md: '2.25rem' } }}>
                  Dashboard Member KuotaKuy
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 600 }}>Selamat datang kembali, kendalikan paket data Anda.</Typography>
              </Box>
              <IconButton sx={{ bgcolor: 'white', border: '1px solid #E2E8F0', borderRadius: 3, display: { xs: 'none', sm: 'flex' } }}>
                <NotifIcon sx={{ color: '#FF7043' }} />
              </IconButton>
            </Box>
          </Grid>

          {/* LEFT: Profile & Wallet Summary */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Wallet Card - Fixed Height for Mobile Visibility */}
              <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 4 }, borderRadius: 6, 
                background: 'linear-gradient(135deg, #1E293B 0%, #334155 100%)', 
                color: 'white',
                boxShadow: '0 20px 40px rgba(30,41,59,0.25)',
                position: 'relative',
                overflow: 'hidden'
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                    <Box>
                      <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 800, letterSpacing: 1.5 }}>SALDO TERSEDIA</Typography>
                      <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5, letterSpacing: -1 }}>Rp 150.000</Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.1)', color: 'white' }}>
                      <WalletIcon />
                    </Avatar>
                  </Box>
                  <Grid container spacing={1.5}>
                    <Grid size={{ xs: 6 }}>
                      <Button fullWidth component={Link} to="/packages" variant="contained" sx={{ bgcolor: '#FF7043', '&:hover': { bgcolor: '#F4511E' }, fontWeight: 800, borderRadius: 3, textTransform: 'none', py: 1 }}>Beli Paket</Button>
                    </Grid>
                    <Grid size={{ xs: 6 }}>
                      <Button fullWidth variant="outlined" sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)', fontWeight: 800, borderRadius: 3, textTransform: 'none', py: 1 }}>Top Up</Button>
                    </Grid>
                  </Grid>
                </Box>
                <WalletIcon sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 120, opacity: 0.05 }} />
              </Paper>

              <Paper elevation={0} sx={{ p: 4, borderRadius: 6, bgcolor: 'white', border: '1px solid #F1F5F9' }}>
                <Box sx={{ textAlign: 'center', mb: 3 }}>
                  <Avatar sx={{ width: 80, height: 80, mx: 'auto', mb: 2, bgcolor: '#FF7043', fontWeight: 900, fontSize: '2rem', boxShadow: '0 10px 20px rgba(255,112,67,0.2)' }}>
                    {user?.name?.charAt(0).toUpperCase()}
                  </Avatar>
                   <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B' }}>{user?.name}</Typography>
                   <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>Elite Member KuotaKuy</Typography>
                </Box>
                <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>ID PENGGUNA</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 900, color: '#1E293B' }}>#{user?.id?.substring(0,8).toUpperCase()}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: '#64748B', fontWeight: 700 }}>VERIFIKASI</Typography>
                  <Chip label="Terverifikasi" size="small" sx={{ height: 22, fontSize: '0.65rem', fontWeight: 900, bgcolor: '#E8F5E9', color: '#2E7D32', px: 1 }} />
                </Box>
              </Paper>

              <Paper elevation={0} sx={{ p: 4, borderRadius: 6, bgcolor: 'white', border: '1px solid #F1F5F9' }}>
                 <Typography variant="subtitle2" sx={{ fontWeight: 900, mb: 3, color: '#1E293B', letterSpacing: 1 }}>SUMMARY</Typography>
                 <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: '#F0F9FF', color: '#0EA5E9', borderRadius: 2, display: 'flex' }}><StatsIcon font-size="small" /></Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>Total Belanja</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 900, color: '#1E293B' }}>{stats.count}x</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                        <Box sx={{ p: 1, bgcolor: '#F8FAFC', color: '#64748B', borderRadius: 2, display: 'flex' }}><TransactionIcon font-size="small" /></Box>
                        <Typography variant="body2" sx={{ fontWeight: 700, color: '#475569' }}>Total Pengeluaran</Typography>
                      </Box>
                      <Typography sx={{ fontWeight: 900, color: '#FF7043' }}>{formatRupiah(stats.total)}</Typography>
                    </Box>
                 </Box>
              </Paper>
            </Box>
          </Grid>

          {/* RIGHT: Activity Section */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Promo Banner - Responsive Scaling */}
              <Paper elevation={0} sx={{ 
                p: { xs: 3, md: 4.5 }, borderRadius: 8, overflow: 'hidden', position: 'relative',
                background: 'linear-gradient(135deg, #FF7043 0%, #FFB74D 100%)',
                color: 'white', display: 'flex', alignItems: 'center'
              }}>
                <Box sx={{ position: 'relative', zIndex: 1, maxWidth: { xs: '100%', sm: '70%' } }}>
                  <Typography variant="h5" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>Nikmati Unlimited Malam Seharga Rp 1.000!</Typography>
                  <Typography variant="body2" sx={{ mb: 3, opacity: 0.9, fontWeight: 500 }}>Streaming, download, dan scroll sepuasnya tanpa batas kuota.</Typography>
                  <Button variant="contained" sx={{ bgcolor: 'white', color: '#FF7043', fontWeight: 900, borderRadius: 3, textTransform: 'none', px: 4, py: 1.2 }}>Ambil Sekarang</Button>
                </Box>
                <AddIcon sx={{ fontSize: 160, position: 'absolute', right: -30, bottom: -30, opacity: 0.15 }} />
              </Paper>

              <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 8, bgcolor: 'white', border: '1px solid #F1F5F9' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                   <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E293B' }}>Riwayat Transaksi</Typography>
                   {!isMobile && <Button endIcon={<ArrowIcon />} sx={{ fontWeight: 800, textTransform: 'none', color: '#FF7043' }}>Semua</Button>}
                </Box>

                <Box sx={{ width: '100%', overflowX: 'auto' }}>
                  <Table sx={{ minWidth: 600 }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 900, color: '#64748B', py: 2 }}>NAMA PAKET</TableCell>
                        <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>METODE</TableCell>
                        <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>HARGA</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 900, color: '#64748B' }}>STATUS</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        [...Array(3)].map((_, i) => (
                          <TableRow key={i}><TableCell colSpan={4}><Skeleton height={50} /></TableCell></TableRow>
                        ))
                      ) : transactions.length > 0 ? (
                        transactions.slice(0, 5).map((tx) => (
                          <TableRow key={tx.id} sx={{ '&:hover': { bgcolor: '#FFFAF8' } }}>
                            <TableCell sx={{ py: 2.5 }}>
                              <Typography sx={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>{tx.package?.name || 'Paket Data'}</Typography>
                              <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 700 }}>{tx.package?.quota}</Typography>
                            </TableCell>
                            <TableCell>
                              <Typography variant="caption" sx={{ fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{tx.paymentMethod || 'GOPAY'}</Typography>
                            </TableCell>
                            <TableCell sx={{ fontWeight: 900, color: '#FF7043' }}>{tx.package ? formatRupiah(tx.package.price) : '-'}</TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={tx.status === 'success' ? 'BERHASIL' : 'PENDING'} 
                                size="small"
                                sx={{ 
                                  fontWeight: 900, 
                                  fontSize: '0.65rem',
                                  bgcolor: tx.status === 'success' ? '#E8F5E9' : '#FFF3E0',
                                  color: tx.status === 'success' ? '#2E7D32' : '#EF6C00',
                                  borderRadius: 1.5
                                }} 
                              />
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow><TableCell colSpan={4} align="center" sx={{ py: 6, color: '#94A3B8' }}>Belum ada histori transaksi.</TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </Box>
                {isMobile && (
                  <Button fullWidth endIcon={<ArrowIcon />} sx={{ mt: 2, fontWeight: 800, textTransform: 'none', color: '#FF7043' }}>Lihat Seluruh Aktivitas</Button>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;
