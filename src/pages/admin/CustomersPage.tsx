import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Tooltip, Divider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, People as PeopleIcon } from '@mui/icons-material';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import AdminTopbar from '../../components/Layout/AdminTopbar';
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
                  <PeopleIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Daftar Customer</Typography>
                </Box>
              </Grid>
            <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ px: 3, py: 1.2 }}>
                  Tambah Customer
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
                startAdornment: <SearchIcon sx={{ color: 'primary.main', mr: 1 }} />,
                sx: { borderRadius: 3, bgcolor: '#FFF8F5' }
              }}
            />

            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'secondary.light' }}>
                    <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Nama Lengkap</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>No HP</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Username</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((c, i) => (
                      <TableRow key={c.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{c.name}</TableCell>
                        <TableCell>{c.email}</TableCell>
                        <TableCell>{c.phone}</TableCell>
                        <TableCell>{c.username}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenEdit(c)} color="info" sx={{ mr: 1, bgcolor: '#E3F2FD' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton onClick={() => { setCurrentCustomer(c); setOpenConfirm(true); }} color="error" sx={{ bgcolor: '#FFEBEE' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} align="center">Data customer kosong.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{currentCustomer ? 'Edit Customer' : 'Tambah Customer Baru'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Nama Lengkap" fullWidth variant="outlined" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Email" type="email" fullWidth variant="outlined" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="No HP" fullWidth variant="outlined" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Username" fullWidth variant="outlined" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} />
            </Grid>
            {!currentCustomer && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField label="Password" type="password" fullWidth variant="outlined" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog} color="inherit">Batal</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ px: 4 }}>Simpan</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Hapus Customer?</DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus customer <b>{currentCustomer?.name}</b>? Tindakan ini tidak dapat dibatalkan.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Hapus Sekarang</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CustomersPage;
