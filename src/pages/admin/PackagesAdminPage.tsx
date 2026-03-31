import React, { useEffect, useState } from 'react';
import { Box, Container, Paper, Typography, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert, Grid, Tooltip, InputAdornment, Divider, Skeleton } from '@mui/material';
import { Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon, Wifi as PackageIcon } from '@mui/icons-material';
import AdminLayout from '../../components/Layout/AdminLayout';
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
    <AdminLayout>
        <Container maxWidth="lg">
          <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 4 }, borderRadius: 6, mb: 4, border: '1px solid #F1F5F9', bgcolor: 'white' }}>
            <Grid container spacing={3} alignItems="center" sx={{ mb: 4 }}>
              <Grid size={{ xs: 12, sm: 7 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ p: 1.2, bgcolor: '#FFF3E0', color: '#FF7043', borderRadius: 3, display: 'flex' }}>
                    <PackageIcon />
                  </Box>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#1E293B', letterSpacing: -0.5 }}>Produk Paket Data</Typography>
                    <Typography variant="body2" sx={{ color: '#94A3B8', fontWeight: 600 }}>Katalog produk aktif: {packages.length} varian</Typography>
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
                  Tambah Paket Baru
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
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>NAMA PAKET</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>KUOTA</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>HARGA</TableCell>
                    <TableCell sx={{ fontWeight: 900, color: '#64748B' }}>MASA AKTIF</TableCell>
                    <TableCell align="center" sx={{ fontWeight: 900, color: '#64748B' }}>AKSI</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    [...Array(5)].map((_, i) => (
                      <TableRow key={i}><TableCell colSpan={6}><Skeleton height={50} /></TableCell></TableRow>
                    ))
                  ) : filtered.length > 0 ? (
                    filtered.map((p, i) => (
                      <TableRow key={p.id} sx={{ '&:hover': { bgcolor: '#FFFAF8' } }}>
                        <TableCell sx={{ py: 2, color: '#94A3B8', fontWeight: 700 }}>{i + 1}</TableCell>
                        <TableCell sx={{ fontWeight: 700, color: '#1E293B' }}>{p.name}</TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: 800, color: '#FF7043', bgcolor: '#FFF3E0', px: 1.5, py: 0.5, borderRadius: 2, display: 'inline-block' }}>
                            {p.quota}
                          </Typography>
                        </TableCell>
                        <TableCell sx={{ fontWeight: 800, color: '#FF7043' }}>{formatRupiah(p.price)}</TableCell>
                        <TableCell sx={{ color: '#64748B', fontWeight: 700 }}>{p.validity}</TableCell>
                        <TableCell align="center">
                          <Tooltip title="Edit Harga/Kuota">
                            <IconButton onClick={() => handleOpenEdit(p)} sx={{ mr: 1, bgcolor: '#FFF3E0', color: '#FF7043', borderRadius: 2, '&:hover': { bgcolor: '#FFE0B2' } }}>
                              <EditIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Hapus Paket">
                            <IconButton onClick={() => { setCurrentPkg(p); setOpenConfirm(true); }} sx={{ bgcolor: '#FFEBEE', color: '#EF4444', borderRadius: 2, '&:hover': { bgcolor: '#FFCDD2' } }}>
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: '#94A3B8' }}>Produk paket belum tersedia.</TableCell></TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Container>

      {/* Form Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#1E293B', pb: 1 }}>{currentPkg ? 'Update Informasi Paket' : 'Rilis Paket Data Baru'}</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography variant="caption" sx={{ color: '#94A3B8', fontWeight: 800, mb: 3, display: 'block' }}>INFO HARGA DAN KUOTA AKAN TAMPIL DI SISI CUSTOMER</Typography>
          <Grid container spacing={2.5}>
            <Grid size={12}>
              <TextField label="Nama Paket" fullWidth variant="outlined" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Jumlah Kuota" fullWidth variant="outlined" placeholder="Contoh: 50GB" value={formData.quota} onChange={(e) => setFormData({ ...formData, quota: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField label="Masa Berlaku" fullWidth variant="outlined" placeholder="Contoh: 30 Hari" value={formData.validity} onChange={(e) => setFormData({ ...formData, validity: e.target.value })} 
                InputProps={{ sx: { borderRadius: 3 } }} />
            </Grid>
            <Grid size={12}>
              <TextField 
                label="Harga Jual" 
                type="number" 
                fullWidth 
                variant="outlined" 
                value={formData.price} 
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                InputProps={{
                  startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
                  sx: { borderRadius: 3 }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={handleCloseDialog} sx={{ px: 3, fontWeight: 800, color: '#64748B' }}>Kembali</Button>
          <Button onClick={handleSubmit} variant="contained" sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 900, bgcolor: '#FF7043', '&:hover': { bgcolor: '#F4511E' } }}>Simpan Paket</Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Dialog */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)} PaperProps={{ sx: { borderRadius: 6, p: 1 } }}>
        <DialogTitle sx={{ fontWeight: 900, color: '#EF4444' }}>Konfirmasi Penghapusan</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#475569', fontWeight: 600 }}>Yakin ingin menghapus paket <b>{currentPkg?.name} ({currentPkg?.quota})</b>? Paket ini tidak akan bisa lagi dibeli oleh customer.</Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenConfirm(false)} sx={{ px: 3, fontWeight: 800, color: '#64748B' }}>Tidak, Batal</Button>
          <Button onClick={handleDelete} variant="contained" color="error" sx={{ px: 4, py: 1.2, borderRadius: 3, fontWeight: 900 }}>Ya, Hapus Paket</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 3, fontWeight: 800 }}>{snackbar.message}</Alert>
      </Snackbar>
    </AdminLayout>
  );
};

export default PackagesAdminPage;
