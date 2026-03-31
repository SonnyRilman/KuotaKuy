import React, { useEffect, useState } from 'react';
import { Box, Container, Typography, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Button, Avatar, Skeleton } from '@mui/material';
import { Receipt as TransactionIcon, AccountBalanceWallet as WalletIcon, AddCircle as AddIcon, EmojiEmotions as WelcomeIcon } from '@mui/icons-material';
import Navbar from '../../components/Layout/Navbar';
import { useAuth } from '../../context/AuthContext';
import { transactionService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';
import { Link } from 'react-router-dom';

interface Transaction {
  id: string;
  status: string;
  date: string;
  package?: { name: string, quota: string, price: number };
}

const CustomerDashboard: React.FC = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, count: 0 });

  useEffect(() => {
    const fetchUserTransactions = async () => {
      try {
        const { data } = await transactionService.getByCustomerId(user!.id);
        setTransactions(data.reverse());
        
        const totalSpent = data
          .filter((t: Transaction) => t.status === 'success' && t.package)
          .reduce((sum: number, t: Transaction) => sum + (t.package?.price || 0), 0);
        
        setStats({ total: totalSpent, count: data.length });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserTransactions();
    }
  }, [user]);

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FDFDFD', pb: 10, pt: '112px' }}>
      <Navbar />
      
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        {/* Modern Welcome Section with Gradient & Glassmorphism */}
        <Box sx={{ 
          p: { xs: 4, md: 6 }, 
          borderRadius: 10, 
          background: 'linear-gradient(135deg, #FF7043 0%, #FF9E80 100%)', 
          color: 'white', 
          mb: 6,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 3,
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(255,112,67,0.25)'
        }}>
          {/* Animated Background Decoration */}
          <Box sx={{ 
            position: 'absolute', width: 300, height: 300, 
            bgcolor: 'rgba(255,255,255,0.15)', borderRadius: '50%', 
            top: -150, right: -50,
            animation: 'pulseWelcome 8s infinite ease-in-out',
            '@keyframes pulseWelcome': {
               '0%, 100%': { transform: 'scale(1)' },
               '50%': { transform: 'scale(1.2)' }
            }
          }} />
          
          <Box sx={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Box sx={{ position: 'relative' }}>
              <Avatar sx={{ 
                width: 100, height: 100, 
                bgcolor: 'white', color: 'primary.main', 
                border: '6px solid rgba(255,255,255,0.3)',
                boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
              }}>
                <WelcomeIcon sx={{ fontSize: 50 }} />
              </Avatar>
              <Box sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: '#66BB6A', color: 'white', p: 0.5, borderRadius: '50%', border: '3px solid white' }}>
                 <Box sx={{ width: 12, height: 12, bgcolor: 'white', borderRadius: '50%' }} />
              </Box>
            </Box>
            <Box>
              <Typography variant="h3" sx={{ fontWeight: 900, mb: 0.5, letterSpacing: -1 }}>Halo, {user?.name}!</Typography>
              <Typography sx={{ opacity: 0.9, fontSize: '1.1rem', fontWeight: 500 }}>Saldo Anda: <b>Rp 150.000</b></Typography>
            </Box>
          </Box>
          
          <Button 
            component={Link} to="/packages" 
            variant="contained" 
            sx={{ 
              bgcolor: 'white', color: 'primary.main', fontWeight: 900, px: 5, py: 2,
              borderRadius: 8, fontSize: '1rem', textTransform: 'none',
              boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
              '&:hover': { bgcolor: '#F5F5F5', transform: 'scale(1.05)' },
              transition: '0.3s'
            }}
            startIcon={<AddIcon />}
          >
            Beli Paket Baru
          </Button>
        </Box>

        {/* Improved Stats with Glassmorphism Cards */}
        <Grid container spacing={4} sx={{ mb: 8 }}>
          {[
            { label: 'Total Transaksi', value: stats.count, icon: <TransactionIcon sx={{ fontSize: 35 }} />, color: '#FF7043', bg: '#FFF3E0' },
            { label: 'Total Pengeluaran', value: formatRupiah(stats.total), icon: <WalletIcon sx={{ fontSize: 35 }} />, color: '#66BB6A', bg: '#E8F5E9' },
            { label: 'Poin Loyalitas', value: '1.250 Poin', icon: <WelcomeIcon sx={{ fontSize: 35 }} />, color: '#42A5F5', bg: '#E3F2FD' }
          ].map((item, i) => (
            <Grid key={i} size={{ xs: 12, md: 4 }}>
              <Paper elevation={0} sx={{ 
                p: 4, borderRadius: 8, 
                display: 'flex', alignItems: 'center', gap: 3,
                border: '1px solid #EEE',
                bgcolor: 'white',
                transition: '0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                '&:hover': { 
                  transform: 'translateY(-12px)', 
                  boxShadow: `0 25px 50px -12px ${item.color}22`,
                  borderColor: item.color
                }
              }}>
                <Box sx={{ p: 2.5, bgcolor: item.bg, borderRadius: 6, color: item.color }}>
                  {item.icon}
                </Box>
                <Box>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>{item.label}</Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, color: '#1A1A1A', mt: 0.5 }}>
                    {loading ? <Skeleton width={100} /> : item.value}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Clean Modern Transaction Table */}
        <Paper elevation={0} sx={{ p: 5, borderRadius: 10, border: '1px solid #EEE', bgcolor: 'white', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 5 }}>
            <Box>
               <Typography variant="h5" sx={{ fontWeight: 900, color: '#1A1A1A' }}>Riwayat Transaksi</Typography>
               <Typography variant="body2" color="text.secondary">Kelola dan monitor penggunaan paket Anda</Typography>
            </Box>
            <Button variant="outlined" sx={{ borderRadius: 4, fontWeight: 700, px: 3, textTransform: 'none' }}>Export PDF</Button>
          </Box>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: '#FAFAFA' }}>
                  <TableCell sx={{ fontWeight: 800, borderBottom: '2px solid #EEE', py: 3 }}>PRODUK</TableCell>
                  <TableCell sx={{ fontWeight: 800, borderBottom: '2px solid #EEE' }}>KUOTA</TableCell>
                  <TableCell sx={{ fontWeight: 800, borderBottom: '2px solid #EEE' }}>NOMINAL</TableCell>
                  <TableCell sx={{ fontWeight: 800, borderBottom: '2px solid #EEE' }}>TANGGAL</TableCell>
                  <TableCell sx={{ fontWeight: 800, borderBottom: '2px solid #EEE' }} align="center">STATUS</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  Array.from(new Array(3)).map((_, i) => (
                    <TableRow key={i}><TableCell colSpan={5} sx={{ py: 3 }}><Skeleton variant="text" /></TableCell></TableRow>
                  ))
                ) : transactions.length > 0 ? (
                  transactions.map((tx) => (
                    <TableRow key={tx.id} sx={{ '&:hover': { bgcolor: '#FDFDFD' } }}>
                      <TableCell sx={{ py: 3 }}>
                         <Typography sx={{ fontWeight: 700, color: '#1A1A1A' }}>{tx.package?.name || 'Paket Tanpa Nama'}</Typography>
                         <Typography variant="caption" color="text.secondary">#{tx.id.substring(0,8).toUpperCase()}</Typography>
                      </TableCell>
                      <TableCell>
                         <Chip label={tx.package?.quota || '-'} size="small" sx={{ fontWeight: 700, bgcolor: '#F0F4F8' }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>{tx.package ? formatRupiah(tx.package.price) : '-'}</TableCell>
                      <TableCell sx={{ color: 'text.secondary', fontWeight: 500 }}>{tx.date}</TableCell>
                      <TableCell align="center">
                        <Chip 
                          label={tx.status === 'success' ? 'Sukses' : tx.status === 'pending' ? 'Pending' : 'Gagal'} 
                          sx={{ 
                            fontWeight: 900, 
                            fontSize: '0.7rem',
                            bgcolor: tx.status === 'success' ? '#E8F5E9' : tx.status === 'pending' ? '#FFF3E0' : '#FFEBEE',
                            color: tx.status === 'success' ? '#2E7D32' : tx.status === 'pending' ? '#EF6C00' : '#C62828',
                            borderRadius: 2
                          }} 
                        />
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow><TableCell colSpan={5} align="center" sx={{ py: 10 }}>
                     <WelcomeIcon sx={{ fontSize: 60, color: '#DDD', mb: 2 }} />
                     <Typography color="text.secondary" sx={{ fontWeight: 600 }}>Belum ada histori transaksi.</Typography>
                  </TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Container>
    </Box>
  );
};

export default CustomerDashboard;
