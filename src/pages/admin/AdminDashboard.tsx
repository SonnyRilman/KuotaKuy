import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, Button, Avatar, Tooltip, Divider, useMediaQuery, useTheme } from '@mui/material';
import { 
  Group as PeopleIcon, 
  Layers as PackageIcon, 
  ReceiptLong as TransactionIcon, 
  Paid as RevenueIcon,
  AutoGraph as TrendIcon,
  VerifiedUser as AdminIcon,
  Download as DownloadIcon,
  AccessTime as ClockIcon,
  CalendarToday as DateIcon,
  BarChart as ChartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/Layout/AdminLayout';
import { customerService, packageService, transactionService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';
import { useAuth } from '../../context/AuthContext';

interface Transaction { id: string; customerId: string; packageId: string; status: string; date: string; customer?: { name: string }; package?: { name: string; price: number }; }
interface SummaryStats { customers: number; packages: number; transactions: number; revenue: number; }
interface EnrichedTransaction extends Transaction { customer?: { name: string }; package?: { name: string; price: number }; }
interface DailySales { day: string; count: number; }

const AdminDashboard: React.FC = () => {
  const { admin } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<SummaryStats>({ customers: 0, packages: 0, transactions: 0, revenue: 0 });
  const [allTransactions, setAllTransactions] = useState<EnrichedTransaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<EnrichedTransaction[]>([]);
  const [dailySales, setDailySales] = useState<DailySales[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  const brandColor = '#FF7043';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersRes, packagesRes, transactionsRes] = await Promise.all([
          customerService.getAll(), packageService.getAll(), transactionService.getAll()
        ]);
        const customers = customersRes.data || [];
        const packages = packagesRes.data || [];
        const transactionsRaw = transactionsRes.data || [];
        const transactions: EnrichedTransaction[] = transactionsRaw.map((tx: Transaction) => ({
          ...tx,
          customer: customers.find((c: { id: string }) => String(c.id) === String(tx.customerId)),
          package: packages.find((p: { id: string }) => String(p.id) === String(tx.packageId))
        }));
        const totalRevenue = transactions.filter((t: EnrichedTransaction) => t.status === 'success' && t.package).reduce((sum: number, t: EnrichedTransaction) => sum + (t.package?.price || 0), 0);
        setStats({ customers: customers.length, packages: packages.length, transactions: transactions.length, revenue: totalRevenue });
        const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
        const chartData: DailySales[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = new Date(); d.setDate(d.getDate() - i);
          const dateStr = d.toISOString().split('T')[0];
          const count = transactions.filter(t => t.date.includes(dateStr)).length;
          chartData.push({ day: dayNames[d.getDay()], count });
        }
        setDailySales(chartData);
        setAllTransactions(transactions);
        setRecentTransactions(transactions.slice(-5).reverse());
      } catch (error) { console.error('Error dashboard', error); } finally { setLoading(false); }
    };
    fetchDashboardData();
  }, []);

  const handleExportCSV = () => {
    if (allTransactions.length === 0) return;
    const headers = ['ID', 'Customer', 'Paket', 'Harga', 'Status', 'Tanggal'];
    const rows = allTransactions.map(tx => [tx.id, tx.customer?.name || 'N/A', tx.package?.name || 'N/A', tx.package?.price || 0, tx.status.toUpperCase(), tx.date]);
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(',') + "\n" + rows.map(r => r.join(',')).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a"); link.setAttribute("href", encodedUri); link.setAttribute("download", `Report_KuotaKuy_${new Date().toISOString().split('T')[0]}.csv`); document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };

  const summaryCards = [
    { title: 'Total Pelanggan', value: stats.customers, icon: <PeopleIcon />, color: brandColor, bg: '#FFF3E0' },
    { title: 'Total Paket Aktif', value: stats.packages, icon: <PackageIcon />, color: '#FB8C00', bg: '#FFF3E0' },
    { title: 'Transaksi Baru', value: stats.transactions, icon: <TransactionIcon />, color: '#F4511E', bg: '#FBE9E7' },
    { title: 'Total Pendapatan', value: formatRupiah(stats.revenue), icon: <RevenueIcon />, color: '#E64A19', bg: '#FBE9E7' },
  ];

  const maxSales = Math.max(...dailySales.map(d => d.count), 1);

  return (
    <AdminLayout>
      <Container maxWidth="xl" sx={{ pb: 6 }}>
        {/* Welcome Banner Responsive Fix */}
        <Box sx={{ 
          p: { xs: 3, md: 5 }, borderRadius: { xs: 5, md: 8 }, 
          background: `linear-gradient(135deg, ${brandColor} 0%, #FFB74D 100%)`, color: 'white', mb: 4, 
          boxShadow: '0 20px 40px rgba(255,112,67,0.15)', position: 'relative', overflow: 'hidden' 
        }}>
          <Grid container spacing={3} alignItems="center">
            <Grid size={{ xs: 12, md: 7 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1.5 }}>
                <AdminIcon sx={{ fontSize: { xs: 28, md: 36 } }} />
                <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: '1.5rem', md: '2.125rem' } }}>Hello, {admin?.name?.split(' ')[0] || 'Admin'}!</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 3 }, opacity: 0.9, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><DateIcon sx={{ fontSize: 16 }} /><Typography variant="body2" sx={{ fontWeight: 700 }}>{new Intl.DateTimeFormat('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }).format(currentTime)}</Typography></Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}><ClockIcon sx={{ fontSize: 16 }} /><Typography variant="body2" sx={{ fontWeight: 900, letterSpacing: 1 }}>{currentTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}</Typography></Box>
              </Box>
            </Grid>
            <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', gap: 1.5, justifyContent: { xs: 'flex-start', md: 'flex-end' }, flexWrap: 'wrap' }}>
              <Button fullWidth={useMediaQuery(useTheme().breakpoints.down('sm'))} onClick={handleExportCSV} variant="contained" startIcon={<DownloadIcon />} sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white', fontWeight: 900, borderRadius: 3, px: 3, py: 1.2, backdropFilter: 'blur(10px)' }}>Export</Button>
              <Button fullWidth={useMediaQuery(useTheme().breakpoints.down('sm'))} onClick={() => navigate('/admin/transactions')} variant="contained" sx={{ bgcolor: 'white', color: brandColor, fontWeight: 900, borderRadius: 3, px: 3, py: 1.2 }}>Laporan</Button>
            </Grid>
          </Grid>
        </Box>

        {/* Summary Cards Responsive Fix */}
        <Grid container spacing={2.5} sx={{ mb: 4 }}>
          {summaryCards.map((card, idx) => (
            <Grid key={idx} size={{ xs: 12, sm: 6, lg: 3 }}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 5, bgcolor: 'white', border: '1px solid #F1F5F9', transition: '0.3s', '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 15px 30px rgba(0,0,0,0.03)' } }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2.5 }}>
                  <Box sx={{ p: 1.2, bgcolor: card.bg, color: card.color, borderRadius: 3, display: 'flex' }}>{card.icon}</Box>
                  <Chip label="+4%" size="small" sx={{ fontWeight: 900, bgcolor: '#E8F5E9', color: '#2E7D32', height: 22, fontSize: '0.65rem' }} />
                </Box>
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8', letterSpacing: 0.5 }}>{card.title.toUpperCase()}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', mt: 0.5 }}>{loading ? <Skeleton width="60%" /> : card.value}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Table Responsive Wrap Fix */}
          <Grid size={{ xs: 12, xl: 8 }}>
            <Paper elevation={0} sx={{ p: { xs: 2.5, md: 4 }, borderRadius: 6, bgcolor: 'white', border: '1px solid #F1F5F9', height: '100%' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E293B', mb: 3 }}>Aktivitas Bisnis Terbaru</Typography>
              <Box sx={{ width: '100%', overflowX: 'auto' }}>
                <Table sx={{ minWidth: 600 }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontWeight: 900, color: '#64748B', py: 2 }}>PELANGGAN</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>PAKET</TableCell>
                      <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>WAKTU</TableCell>
                      <TableCell align="right" sx={{ fontWeight: 900, color: '#64748B' }}>TOTAL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentTransactions.map((tx) => (
                      <TableRow key={tx.id} sx={{ '&:hover': { bgcolor: '#FFFAF8' } }}>
                        <TableCell sx={{ py: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                            <Avatar sx={{ width: 28, height: 28, bgcolor: brandColor, fontSize: '0.7rem', fontWeight: 900 }}>{tx.customer?.name?.charAt(0)}</Avatar>
                            <Typography variant="body2" sx={{ fontWeight: 800 }}>{tx.customer?.name || 'User'}</Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{tx.package?.name || 'Plan'}</TableCell>
                        <TableCell sx={{ color: '#94A3B8', fontSize: '0.75rem', fontWeight: 600 }}>{tx.date.split('T')[0]}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 900, color: brandColor }}>{tx.package ? formatRupiah(tx.package.price) : '-'}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Paper>
          </Grid>
          
          {/* Chart Responsive Wrap Fix */}
          <Grid size={{ xs: 12, xl: 4 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 6, bgcolor: 'white', border: '1px solid #F1F5F9', display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: '#1E293B' }}>Penjualan</Typography>
                <ChartIcon sx={{ color: brandColor }} />
              </Box>
              <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 1, height: 180, mb: 4 }}>
                {dailySales.map((data, idx) => (
                  <Box key={idx} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={`${data.count} Transaksi`} arrow>
                      <Box sx={{ 
                        width: '100%', height: `${(data.count / maxSales) * 100}%`, minHeight: data.count > 0 ? 8 : 4,
                        bgcolor: idx === 6 ? brandColor : '#FFCCBC', borderRadius: '4px 4px 0 0', '&:hover': { bgcolor: brandColor }
                      }} />
                    </Tooltip>
                    <Typography variant="caption" sx={{ fontWeight: 800, color: '#94A3B8', fontSize: '0.6rem' }}>{data.day}</Typography>
                  </Box>
                ))}
              </Box>
              <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
              <Box sx={{ p: 2, borderRadius: 3, bgcolor: '#FFF3E0', border: '1px solid #FFE0B2' }}>
                <Typography variant="body2" sx={{ fontSize: '0.75rem', color: '#546E7A', fontWeight: 800 }}>
                  {loading ? '...' : (dailySales[6]?.count > 0 ? `Bagus! ${dailySales[6].count} penjualan hari ini.` : 'Belum ada penjualan.')}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;
