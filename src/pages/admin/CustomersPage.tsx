import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Tooltip, Divider, Skeleton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, People as PeopleIcon } from '@mui/icons-material';
import AdminLayout from '../../components/Layout/AdminLayout';
import { customerService } from '../../services/allServices';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  username: string;
  password?: string;
}

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', username: '', password: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const { data } = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCurrentCustomer(null);
    setFormData({ name: '', email: '', phone: '', username: '', password: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setCurrentCustomer(customer);
    setFormData({ ...customer, password: customer.password || '' });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    try {
      if (currentCustomer) {
        await customerService.update(currentCustomer.id, formData);
        setSnackbar({ open: true, message: 'Customer berhasil diperbarui!', severity: 'success' });
      } else {
        await customerService.create(formData);
        setSnackbar({ open: true, message: 'Customer baru berhasil ditambahkan!', severity: 'success' });
      }
      setOpenDialog(false);
      fetchCustomers();
    } catch (err) {
      setSnackbar({ open: true, message: 'Terjadi kesalahan sistem.', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      if (currentCustomer) {
        await customerService.delete(currentCustomer.id);
        setSnackbar({ open: true, message: 'Customer telah dihapus.', severity: 'success' });
        setOpenConfirm(false);
        fetchCustomers();
      }
    } catch (err) {
      setSnackbar({ open: true, message: 'Gagal menghapus customer.', severity: 'error' });
    }
  };

  const filtered = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 6, mb: 4, border: '1px solid #F1F5F9', bgcolor: 'white' }}>
            <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.2, bgcolor: '#FFF3E0', color: '#FF7043', borderRadius: 3, display: 'flex' }}>
                    <PeopleIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: -0.5 }}>Kelola Pelanggan</Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>Total data: {customers.length} pengguna</Typography>
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
                  Tambah Pelanggan
                </Button>
              </Grid>
            </Grid>

            <TextField
              placeholder="Cari nama atau email..."
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
              <Table sx={{ minWidth: 800 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B', py: 2.5 }}>NO</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>NAMA LENGKAP</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>EMAIL</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>NO HP</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>USERNAME</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: '#64748B' }}>AKSI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={6}><Skeleton height={50} /></TableCell></TableRow>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((c, i) => (
                      <TableRow key={c.id} sx={{ '&:hover': { bgcolor: '#FFFAF8' } }}>
                        <TableCell sx={{ py: 2, color: '#94A3B8', fontWeight: 700 }}>{i + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{c.name}</TableCell>
                        <TableCell sx={{ color: '#64748B', fontWeight: 600 }}>{c.email}</TableCell>
                        <TableCell sx={{ color: '#64748B', fontWeight: 600 }}>{c.phone}</TableCell>
                        <TableCell sx={{ color: '#94A3B8', fontWeight: 700 }}>@{c.username}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit Data">
                            <IconButton onClick={() => handleOpenEdit(c)} sx={{ mr: 1, bgcolor: '#FFF3E0', color: '#FF7043', borderRadius: 2, '&:hover': { bgcolor: '#FFE0B2' } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus Data">
                            <IconButton onClick={() => { setCurrentCustomer(c); setOpenConfirm(true); }} sx={{ bgcolor: '#FFEBEE', color: '#EF4444', borderRadius: 2, '&:hover': { bgcolor: '#FFCDD2' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94A3B8' }}>Data customer tidak ditemukan.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#1E293B', pb: 1 }}>{currentCustomer ? 'Edit Data Pelanggan' : 'Registrasi Pelanggan Baru'}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, mb: 3, display: 'block' }}>PASTIKAN SELURUH DATA TERISI DENGAN BENAR</Typography>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <TextField label="Nama Lengkap" fullWidth variant="outlined" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 12 }}>
              <TextField label="Email Address" type="email" fullWidth variant="outlined" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Nomor WhatsApp" fullWidth variant="outlined" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Username" fullWidth variant="outlined" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            {!currentCustomer && (
              <Grid size={12}>
                <TextField label="Password Keamanan" type="password" fullWidth variant="outlined" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                  InputProps={{ sx: { borderRadius: 3 } }} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ px: 3, fontWeight: 800, color: '#64748B' }}>Batalkan</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 900, bgcolor: '#FF7043', '&:hover': { bgcolor: '#F4511E' } }}>Simpan Data</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#EF4444' }}>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', fontWeight: 600 }}>Yakin ingin menghapus akun <b>{currentCustomer?.name}</b>? Seluruh riwayat transaksi juga akan terpengaruh.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ px: 3, fontWeight: 800, color: '#64748B' }}>Tidak, Simpan</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 900 }}>Ya, Hapus Data</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 800 }}>{snackbar.message}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default CustomersPage;
