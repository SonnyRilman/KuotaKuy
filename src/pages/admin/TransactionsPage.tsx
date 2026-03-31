import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Tooltip, MenuItem, TextField, Chip, Divider, Skeleton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Receipt as TransactionIcon } from '@mui/icons-material';
import AdminLayout from '../../components/Layout/AdminLayout';
import { transactionService, customerService, packageService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';

interface Transaction {
  id: string;
  customerId: string;
  packageId: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
  paymentMethod?: string;
  customer?: { name: string };
  package?: { name: string, quota: string, price: number };
}

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [customers, setCustomers] = useState<{ id: string, name: string, email: string }[]>([]);
  const [packages, setPackages] = useState<{ id: string, name: string, quota: string, price: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentTx, setCurrentTx] = useState<Transaction | null>(null);
  const [formData, setFormData] = useState({ customerId: '', packageId: '', date: new Date().toISOString().split('T')[0], status: 'pending' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [txRes, custodialRes, packageRes] = await Promise.all([
        transactionService.getAll(),
        customerService.getAll(),
        packageService.getAll()
      ]);

      const rawTransactions = txRes.data || [];
      const customersList = custodialRes.data || [];
      const packagesList = packageRes.data || [];

      const enrichedTransactions: Transaction[] = rawTransactions.map((tx: Transaction) => ({
        ...tx,
        customer: tx.customer || customersList.find((c: { id: string }) => String(c.id) === String(tx.customerId)),
        package: tx.package || packagesList.find((p: { id: string }) => String(p.id) === String(tx.packageId))
      }));

      setTransactions(enrichedTransactions);
      setCustomers(customersList);
      setPackages(packagesList);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCurrentTx(null);
    setFormData({ customerId: '', packageId: '', date: new Date().toISOString().split('T')[0], status: 'pending' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (tx: Transaction) => {
    setCurrentTx(tx);
    setFormData({ customerId: tx.customerId, packageId: tx.packageId, date: tx.date, status: tx.status });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    try {
      if (currentTx) {
        await transactionService.update(currentTx.id, formData);
        setSnackbar({ open: true, message: 'Transaksi berhasil diperbarui!', severity: 'success' });
      } else {
        await transactionService.create(formData);
        setSnackbar({ open: true, message: 'Transaksi baru ditambahkan!', severity: 'success' });
      }
      setOpenDialog(false);
      fetchData();
    } catch {
      setSnackbar({ open: true, message: 'Gagal memproses transaksi.', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      if (currentTx) {
        await transactionService.delete(currentTx.id);
        setSnackbar({ open: true, message: 'Transaksi telah dihapus.', severity: 'success' });
        setOpenConfirm(false);
        fetchData();
      }
    } catch {
      setSnackbar({ open: true, message: 'Gagal menghapus transaksi.', severity: 'error' });
    }
  };

  const filtered = transactions.filter(t => 
    t.customer?.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    t.package?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 6, mb: 4, border: '1px solid #F1F5F9', bgcolor: 'white' }}>
            <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.2, bgcolor: '#FFF3E0', color: '#FF7043', borderRadius: 3, display: 'flex' }}>
                    <TransactionIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: -0.5 }}>Manajemen Transaksi</Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>Total pesanan masuk: {transactions.length} record</Typography>
                  </Box>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 5 }} sx={{ textAlign: { xs: 'left', sm: 'right' } }}>
                <Button 
                  variant="contained" 
                  startIcon={<AddIcon />} 
                  onClick={handleOpenAdd} 
                  sx={{ 
                    px: 3, py: 1.5, borderRadius: 3, fontWeight: 800,
                    bgcolor: '#FF7043', '&:hover': { bgcolor: '#F4511E' },
                    boxShadow: '0 8px 20px rgba(255,112,67,0.2)'
                  }}
                >
                  Transaksi Manual
                </Button>
              </Grid>
            </Grid>

            <TextField
              placeholder="Cari nama customer atau paket..."
              fullWidth
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ mb: 4 }}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: '#FF7043', mr: 1.5 }} />,
                sx: { 
                  borderRadius: 4, 
                  bgcolor: '#F8FAFC',
                  '& fieldset': { borderColor: '#E2E8F0' },
                  '&:hover fieldset': { borderColor: '#FF7043' }
                }
              }}
            />

            <TableContainer sx={{ borderRadius: 3, border: '1px solid #F1F5F9', overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B', py: 2.5 }}>NO</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>CUSTOMER</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>PAKET DATA</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>METODE</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>NOMINAL</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>TANGGAL</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>STATUS</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: '#64748B' }}>AKSI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={8}><Skeleton height={50} /></TableCell></TableRow>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((t, i) => (
                      <TableRow key={t.id} sx={{ '&:hover': { bgcolor: '#FFFAF8' } }}>
                        <TableCell sx={{ py: 2, color: '#94A3B8', fontWeight: 700 }}>{i + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{t.customer?.name || 'N/A'}</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#64748B' }}>{t.package?.name || 'N/A'} <Typography variant="caption" sx={{ color: '#FF7043', fontWeight: 900 }}>[{t.package?.quota}]</Typography></TableCell>
                        <TableCell sx={{ textTransform: 'capitalize', fontWeight: 700, color: '#94A3B8', fontSize: '0.75rem' }}>{t.paymentMethod || 'gopay'}</TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#FF7043' }}>{t.package ? formatRupiah(t.package.price) : '-'}</TableCell>
                        <TableCell sx={{ color: '#64748B', fontWeight: 600, fontSize: '0.8rem' }}>{t.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={t.status.toUpperCase()} 
                            size="small"
                            sx={{ 
                              fontWeight: 900,
                              fontSize: '0.65rem',
                              bgcolor: t.status === 'success' ? '#E8F5E9' : t.status === 'pending' ? '#FFF3E0' : '#FFEBEE',
                              color: t.status === 'success' ? '#2E7D32' : t.status === 'pending' ? '#EF6C00' : '#D32F2F',
                              borderRadius: 1.5
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Update Status">
                            <IconButton onClick={() => handleOpenEdit(t)} sx={{ mr: 1, bgcolor: '#FFF3E0', color: '#FF7043', borderRadius: 2, '&:hover': { bgcolor: '#FFE0B2' } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus Record">
                            <IconButton onClick={() => { setCurrentTx(t); setOpenConfirm(true); }} sx={{ bgcolor: '#FFEBEE', color: '#EF4444', borderRadius: 2, '&:hover': { bgcolor: '#FFCDD2' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={8} align="center" sx={{ py: 6, color: '#94A3B8' }}>Record transaksi tidak ditemukan.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#1E293B', pb: 1 }}>{currentTx ? 'Edit History Transaksi' : 'Input Transaksi Manual'}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, mb: 3, display: 'block' }}>CATATAN: HATI-HATI SAAT MENGUBAH STATUS TRANSAKSI</Typography>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <TextField 
                select label="Pilih Pelanggan" fullWidth variant="outlined" 
                value={formData.customerId} 
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name} ({c.email})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField 
                select label="Pilih Paket Layanan" fullWidth variant="outlined" 
                value={formData.packageId} 
                onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              >
                {packages.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name} - {p.quota} ({formatRupiah(p.price)})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Tanggal Input" type="date" fullWidth variant="outlined" 
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
                InputProps={{ sx: { borderRadius: 3 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select label="Update Status" fullWidth variant="outlined" 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                InputProps={{ sx: { borderRadius: 3 } }}
              >
                <MenuItem value="success">Berhasil (Success)</MenuItem>
                <MenuItem value="pending">Tertunda (Pending)</MenuItem>
                <MenuItem value="failed">Gagal (Failed)</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ px: 3, fontWeight: 800, color: '#64748B' }}>Kembali</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 900, bgcolor: '#FF7043', '&:hover': { bgcolor: '#F4511E' } }}>Simpan Record</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#EF4444' }}>Konfirmasi Hapus Record</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', fontWeight: 600 }}>Yakin ingin menghapus record transaksi <b>#{currentTx?.id}</b>? Data yang dihapus tidak dapat dipulihkan di laporan keuangan.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ px: 3, fontWeight: 800, color: '#64748B' }}>Batal, Simpan</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 900 }}>Ya, Hapus Record</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 800 }}>{snackbar.message}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default TransactionsPage;
