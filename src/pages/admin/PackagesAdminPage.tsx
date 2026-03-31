import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Tooltip, InputAdornment, Divider } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Wifi as PackageIcon } from '@mui/icons-material';
import AdminSidebar from '../../components/Layout/AdminSidebar';
import AdminTopbar from '../../components/Layout/AdminTopbar';
import { packageService } from '../../services/allServices';
import { formatRupiah } from '../../utils/formatRupiah';

interface Package {
  id: string;
  name: string;
  quota: string;
  price: number;
  validity: string;
}

const PackagesAdminPage: React.FC = () => {
  const [packages, setPackages] = useState<Package[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [currentPkg, setCurrentPkg] = useState<Package | null>(null);
  const [formData, setFormData] = useState({ name: '', quota: '', price: 0, validity: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    fetchPackages();
  }, []);

  const fetchPackages = async () => {
    try {
      const { data } = await packageService.getAll();
      setPackages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setCurrentPkg(null);
    setFormData({ name: '', quota: '', price: 0, validity: '' });
    setOpenDialog(true);
  };

  const handleOpenEdit = (pkg: Package) => {
    setCurrentPkg(pkg);
    setFormData({ ...pkg });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    try {
      if (currentPkg) {
        await packageService.update(currentPkg.id, formData);
        setSnackbar({ open: true, message: 'Paket berhasil diperbarui!', severity: 'success' });
      } else {
        await packageService.create(formData);
        setSnackbar({ open: true, message: 'Paket baru berhasil ditambahkan!', severity: 'success' });
      }
      setOpenDialog(false);
      fetchPackages();
    } catch {
      setSnackbar({ open: true, message: 'Gagal memproses data paket.', severity: 'error' });
    }
  };

  const handleDelete = async () => {
    try {
      if (currentPkg) {
        await packageService.delete(currentPkg.id);
        setSnackbar({ open: true, message: 'Paket telah dihapus.', severity: 'success' });
        setOpenConfirm(false);
        fetchPackages();
      }
    } catch {
      setSnackbar({ open: true, message: 'Gagal menghapus paket.', severity: 'error' });
    }
  };

  const filtered = packages.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.quota.toLowerCase().includes(searchTerm.toLowerCase())
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
                  <PackageIcon sx={{ color: 'primary.main', fontSize: 32 }} />
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>Daftar Paket Kuota</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }} sx={{ textAlign: 'right' }}>
                <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenAdd} sx={{ px: 3, py: 1.2 }}>
                  Tambah Paket
                </Button>
              </Grid>
            </Grid>

            <TextField
              placeholder="Cari nama paket atau kuota..."
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
                    <TableCell sx={{ fontWeight: 700 }}>Nama Paket</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Kuota</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Harga</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Masa Aktif</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 700 }}>Aksi</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.length > 0 ? (
                    filtered.map((p, i) => (
                      <TableRow key={p.id}>
                        <TableCell>{i + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: 'primary.main', bgcolor: 'secondary.light', px: 1, py: 0.5, borderRadius: 1, display: 'inline-block' }}>
                            {p.quota}
                          </Typography>
                        </TableCell>
                        <TableCell>{formatRupiah(p.price)}</TableCell>
                        <TableCell>{p.validity}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit">
                            <IconButton onClick={() => handleOpenEdit(p)} color="info" sx={{ mr: 1, bgcolor: '#E3F2FD' }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus">
                            <IconButton onClick={() => { setCurrentPkg(p); setOpenConfirm(true); }} color="error" sx={{ bgcolor: '#FFEBEE' }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} align="center">Data paket kosong.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>
      </Box>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 800 }}>{currentPkg ? 'Edit Paket' : 'Tambah Paket Baru'}</DialogTitle>
        <Divider />
        <DialogContent sx={{ mt: 2 }}>
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField label="Nama Paket" fullWidth variant="outlined" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Kuota" fullWidth variant="outlined" placeholder="Contoh: 10GB, Unlimited" value={formData.quota} onChange={(e) => setFormData({ ...formData, quota: e.target.value })} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Masa Aktif" fullWidth variant="outlined" placeholder="Contoh: 30 Hari, Selamanya" value={formData.validity} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} />
            </Grid>
            <Grid size={12}>
              <TextField 
                label="Harga" 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>
                }}
              />
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
        <DialogTitle sx={{ fontWeight: 700 }}>Hapus Paket?</DialogTitle>
        <DialogContent>
          <Typography>Yakin ingin menghapus paket <b>{currentPkg?.name} ({currentPkg?.quota})</b>?</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error">Hapus Sekarang</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PackagesAdminPage;
