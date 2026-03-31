import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CustomerProtectedRoute, AdminProtectedRoute } from './components/ProtectedRoutes';

// Customer Pages
import LandingPage from './pages/customer/LandingPage';
import PackagesPage from './pages/customer/PackagesPage';
import LoginPage from './pages/customer/LoginPage';
import RegisterPage from './pages/customer/RegisterPage';
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import CustomersPage from './pages/admin/CustomersPage';
import PackagesAdminPage from './pages/admin/PackagesAdminPage';
import TransactionsPage from './pages/admin/TransactionsPage';
import ChatWidget from './components/Common/ChatWidget';

function App() {
  return (
    <AuthProvider>
      <ChatWidget />
      <Routes>
        {/* Public Customer Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/packages" element={<PackagesPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Customer Routes */}
        <Route element={<CustomerProtectedRoute />}>
          <Route path="/dashboard-customer" element={<CustomerDashboard />} />
          <Route path="/dashboard-customer/riwayat" element={<CustomerDashboard />} />
        </Route>

        {/* Admin Public Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Admin Routes */}
        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/customers" element={<CustomersPage />} />
          <Route path="/admin/packages" element={<PackagesAdminPage />} />
          <Route path="/admin/transactions" element={<TransactionsPage />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
