import api from './api';

export const packageService = {
  getAll: () => api.get('/packages'),
  getById: (id: string) => api.get(`/packages/${id}`),
  create: (data: any) => api.post('/packages', data),
  update: (id: string, data: any) => api.put(`/packages/${id}`, data),
  delete: (id: string) => api.delete(`/packages/${id}`),
};

export const customerService = {
  getAll: () => api.get('/customers'),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

export const transactionService = {
  getAll: (params?: any) => api.get('/transactions', { params }),
  getByCustomerId: (customerId: string) => api.get(`/transactions?customerId=${customerId}&_expand=package`),
  create: (data: any) => api.post('/transactions', data),
  update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
  delete: (id: string) => api.delete(`/transactions/${id}`),
};

export const authService = {
  loginCustomer: async (username: string, password: string) => {
    const { data } = await api.get(`/customers?username=${username}&password=${password}`);
    return data[0];
  },
  loginAdmin: async (username: string, password: string) => {
    const { data } = await api.get(`/admins?username=${username}&password=${password}`);
    return data[0];
  },
  registerCustomer: (data: any) => api.post('/customers', data),
};
