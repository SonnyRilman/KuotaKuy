import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Skeleton, Card, CardContent, Divider } from '@mui/material';
import { People as PeopleIcon, Wifi as PackageIcon, Receipt as TransactionIcon, TrendingUp as RevenueIcon } from '@mui/icons-material';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import AdminTopbar from '../../components/Layout/AdminTopbar';
import { customerService, packageService, transactionService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';

interface Transaction {
  id: string;
  status: string;
  date: string;
  customer?: { name: string };
  package?: { name: string; price: number };
}

interface SummaryStats {
  customers: number;
  packages: number;
  transactions: number;
  revenue: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<SummaryStats>({ customers: 0, packages: 0, transactions: 0, revenue: 0 });
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [customersRes, packagesRes, transactionsRes] = await Promise.all([
          customerService.getAll(),
          packageService.getAll(),
          transactionService.getAll({ _expand: ['customer', 'package'], _sort: 'id', _order: 'desc' })
        ]);

        const transactions = transactionsRes.data;
        const totalRevenue = transactions
          .filter((t: Transaction) => t.status === 'success' && t.package)
          .reduce((sum: number, t: Transaction) => sum + (t.package?.price || 0), 0);

        setStats({
          customers: customersRes.data.length,
          packages: packagesRes.data.length,
          transactions: transactions.length,
          revenue: totalRevenue
        });
        setRecentTransactions(transactions.slice(0, 5));
      } catch (error) {
        console.error('Error fetching dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const summaryCards = [
    { title: 'Total Customers', value: stats.customers, icon: <PeopleIcon />, color: '#4FC3F7' },
    { title: 'Paket Tersedia', value: stats.packages, icon: <PackageIcon />, color: '#FF7043' },
    { title: 'Total Transaksi', value: stats.transactions, icon: <TransactionIcon />, color: '#66BB6A' },
    { title: 'Total Pendapatan', value: formatRupiah(stats.revenue), icon: <RevenueIcon />, color: '#FFA726' },
  ];

  return (
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AdminTopbar />
        
        <ToolbarOffset /> {/* Placeholder to push content below topbar */}
        
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, color: 'text.primary' }}>
            System Overview
          </Typography>

          <Grid container spacing={3} sx={{ mb: 6 }}>
            {summaryCards.map((card, idx) => (
              <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
                <Card sx={{ 
                  borderRadius: 4, 
                  border: '1px solid #FFE0B2',
                  transition: '0.3s',
                  '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 30px rgba(255, 112, 67, 0.1)' }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Box>
                        <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 600, mb: 0.5 }}>{card.title}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 800 }}>
                          {loading ? <Skeleton width={60} /> : card.value}
                        </Typography>
                      </Box>
                      <Box sx={{ bgcolor: `${card.color}15`, p: 1.5, borderRadius: 3, display: 'flex', color: card.color }}>
                        {card.icon}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Paper sx={{ p: 3, borderRadius: 4, border: '1px solid #FFE0B2' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Recent Transactions</Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Paket</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tanggal</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    Array.from(new Array(5)).map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={5}><Skeleton /></TableCell></TableRow>
                    ))
                  ) : recentTransactions.length > 0 ? (
                    recentTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>#{tx.id}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{tx.customer?.name || 'Unknown'}</TableCell>
                        <TableCell>{tx.package?.name || 'Deleted Package'}</TableCell>
                        <TableCell>{tx.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={tx.status.toUpperCase()} 
                            size="small"
                            sx={{ 
                              fontWeight: 700,
                              bgcolor: tx.status === 'success' ? '#E8F5E9' : tx.status === 'pending' ? '#FFF3E0' : '#FFEBEE',
                              color: tx.status === 'success' ? 'success.main' : tx.status === 'pending' ? 'warning.main' : 'error.main',
                              border: `1px solid`,
                              borderColor: tx.status === 'success' ? '#A5D6A7' : tx.status === 'pending' ? '#FFCC80' : '#EF9A9A'
                            }} 
                          />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} align="center">No transactions yet.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

const ToolbarOffset = () => <Box sx={{ height: 80 }} />;

export default AdminDashboard;
