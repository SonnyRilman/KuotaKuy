import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Tooltip, MenuItem, TextField, Chip, Divider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Receipt as TransactionIcon } from '@mui/icons-material';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import AdminTopbar from '../../components/Layout/AdminTopbar';
import { transactionService, customerService, packageService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';

interface Transaction {
  id: string;
  customerId: string;
  packageId: string;
  date: string;
  status: 'success' | 'pending' | 'failed';
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
        transactionService.getAll({ _expand: ['customer', 'package'] }),
        customerService.getAll(),
        packageService.getAll()
      ]);
      setTransactions(txRes.data);
      setCustomers(custodialRes.data);
      setPackages(packageRes.data);
    } catch (err) {
      console.error(err);
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
    <Box sx={{ display: 'flex' }}>
      <AdminSidebar />
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AdminTopbar />
        <Box sx={{ height: 100 }} />
        <Container maxWidth="lg">
          <Paper sx={{ p: 4, borderRadius: 4, mb: 4, border: '1px solid #FFE0B2' }}>
            <Grid container spacing={2} alignItems="center" sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TransactionIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Pengelolaan Transaksi</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ px: 3, py: 1.2 }}>
                  Tambah Transaksi
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
                startAdornment: <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />,
                sx: { borderRadius: 3, bgcolor: '#FFF8F5' }
              }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'secondary.light' }}>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Paket</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Harga</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Tanggal</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((t, i) => (
                      <TableRow key={t.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{t.customer?.name || 'N/A'}</TableCell>
                        <TableCell>{t.package?.name || 'N/A'} ({t.package?.quota})</TableCell>
                        <TableCell>{t.package ? formatRupiah(t.package.price) : '-'}</TableCell>
                        <TableCell>{t.date}</TableCell>
                        <TableCell>
                          <Chip 
                            label={t.status.toUpperCase()} 
                            size="small"
                            sx={{ 
                              fontWeight: 700,
                              bgcolor: t.status === 'success' ? '#E8F5E9' : t.status === 'pending' ? '#FFF3E0' : '#FFEBEE',
                              color: t.status === 'success' ? 'success.main' : t.status === 'pending' ? 'warning.main' : 'error.main',
                              border: '1px solid',
                              borderColor: t.status === 'success' ? '#A5D6A7' : t.status === 'pending' ? '#FFCC80' : '#EF9A9A'
                            }} 
                          />
                        </TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenEdit(t)} color="info" sx={{ mr: 1, bgcolor: '#E3F2FD' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton onClick={() => { setCurrentTx(t); setOpenConfirm(true); }} color="error" sx={{ bgcolor: '#FFEBEE' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={7} align="center">Data transaksi kosong.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{currentTx ? 'Edit Transaksi' : 'Tambah Transaksi Manual'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField 
                select label="Pilih Customer" fullWidth variant="outlined" 
                value={formData.customerId} 
                onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
              >
                {customers.map((c) => (
                  <MenuItem key={c.id} value={c.id}>{c.name} ({c.email})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={12}>
              <TextField 
                select label="Pilih Paket" fullWidth variant="outlined" 
                value={formData.packageId} 
                onChange={(e) => setFormData({ ...formData, packageId: e.target.value })}
              >
                {packages.map((p) => (
                  <MenuItem key={p.id} value={p.id}>{p.name} - {p.quota} ({formatRupiah(p.price)})</MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                label="Tanggal" type="date" fullWidth variant="outlined" 
                value={formData.date} 
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField 
                select label="Status" fullWidth variant="outlined" 
                value={formData.status} 
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <MenuItem value="success">Sukses</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="failed">Gagal</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Batal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ px: 4 }}>Simpan</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Hapus Transaksi?</DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus record transaksi ID: <b>{currentTx?.id}</b>?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Hapus Record</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default TransactionsPage;
