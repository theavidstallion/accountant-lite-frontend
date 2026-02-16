import axios from 'axios';

const API_URL = '/api';

export const incomeHeadService = {
  getAll: () => axios.get(`${API_URL}/income-heads`),
  create: (data) => axios.post(`${API_URL}/income-heads`, data),
  delete: (id) => axios.delete(`${API_URL}/income-heads/${id}`)
};

export const expenseHeadService = {
  getAll: () => axios.get(`${API_URL}/expense-heads`),
  create: (data) => axios.post(`${API_URL}/expense-heads`, data),
  delete: (id) => axios.delete(`${API_URL}/expense-heads/${id}`)
};

export const employeeService = {
  getAll: () => axios.get(`${API_URL}/employees`),
  getDepartments: () => axios.get(`${API_URL}/employees/departments`),
  getByDepartment: (dept) => axios.get(`${API_URL}/employees/department/${dept}`),
  getLedger: (id) => axios.get(`${API_URL}/employees/${id}/ledger`),
  create: (data) => axios.post(`${API_URL}/employees`, data),
  update: (id, data) => axios.put(`${API_URL}/employees/${id}`, data),
  delete: (id) => axios.delete(`${API_URL}/employees/${id}`)
};

export const receiptService = {
  getAll: () => axios.get(`${API_URL}/receipts`),
  create: (data) => axios.post(`${API_URL}/receipts`, data)
};

export const paymentService = {
  getAll: () => axios.get(`${API_URL}/payments`),
  getSalaries: () => axios.get(`${API_URL}/payments/salaries`),
  create: (data) => axios.post(`${API_URL}/payments`, data)
};

export const recordsService = {
  getAll: (filters) => axios.get(`${API_URL}/records`, { params: filters })
};
