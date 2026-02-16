import { useState, useEffect } from 'react';
import { incomeHeadService, expenseHeadService, employeeService } from '../services/api';

function Settings() {
  const [incomeHeads, setIncomeHeads] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [newIncome, setNewIncome] = useState('');
  const [newExpense, setNewExpense] = useState('');
  const [newEmployee, setNewEmployee] = useState({
    name: '', age: '', designation: '', department: '', salary: '', balance_remaining: ''
  });
  const [showEmployeeForm, setShowEmployeeForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '', age: '', designation: '', department: '', salary: '', balance_remaining: ''
  });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [income, expense, emp] = await Promise.all([
        incomeHeadService.getAll(),
        expenseHeadService.getAll(),
        employeeService.getAll()
      ]);
      setIncomeHeads(income.data);
      setExpenseHeads(expense.data);
      setEmployees(emp.data);
    } finally {
      setPageLoading(false);
    }
  };

  const addIncomeHead = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await incomeHeadService.create({ name: newIncome });
      setNewIncome('');
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const addExpenseHead = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await expenseHeadService.create({ name: newExpense });
      setNewExpense('');
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeeService.create(newEmployee);
      setNewEmployee({ name: '', age: '', designation: '', department: '', salary: '', balance_remaining: '' });
      setShowEmployeeForm(false);
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (emp) => {
    setEditingEmployee(emp.id);
    setEditForm({
      name: emp.name,
      age: emp.age,
      designation: emp.designation,
      department: emp.department,
      salary: emp.salary,
      balance_remaining: emp.balance_remaining
    });
    setShowEmployeeForm(false);
  };

  const cancelEdit = () => {
    setEditingEmployee(null);
    setEditForm({ name: '', age: '', designation: '', department: '', salary: '', balance_remaining: '' });
  };

  const updateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await employeeService.update(editingEmployee, editForm);
      cancelEdit();
      await loadData();
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Settings</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Income Heads</h3>
            <form onSubmit={addIncomeHead} className="flex gap-2 mb-4">
              <input
                value={newIncome}
                onChange={(e) => setNewIncome(e.target.value)}
                placeholder="New income head"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50" disabled={loading}>
                {loading ? 'Adding...' : 'Add'}
              </button>
            </form>
            <ul className="space-y-2">
              {incomeHeads.map(head => (
                <li key={head.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="text-gray-900">{head.name}</span>
                  <button 
                    onClick={() => { incomeHeadService.delete(head.id); loadData(); }} 
                    className="text-red-600 hover:text-red-800 font-bold text-xl"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Expense Heads</h3>
            <form onSubmit={addExpenseHead} className="flex gap-2 mb-4">
              <input
                value={newExpense}
                onChange={(e) => setNewExpense(e.target.value)}
                placeholder="New expense head"
                required
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition disabled:opacity-50" disabled={loading}>
                {loading ? 'Adding...' : 'Add'}
              </button>
            </form>
            <ul className="space-y-2">
              {expenseHeads.map(head => (
                <li key={head.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <span className="text-gray-900">{head.name}</span>
                  <button 
                    onClick={() => { expenseHeadService.delete(head.id); loadData(); }} 
                    className="text-red-600 hover:text-red-800 font-bold text-xl"
                  >
                    ×
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-800">Employees</h3>
            <button 
              onClick={() => setShowEmployeeForm(!showEmployeeForm)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition"
            >
              {showEmployeeForm ? 'Cancel' : 'Add Employee'}
            </button>
          </div>

          {showEmployeeForm && !editingEmployee && (
            <form onSubmit={addEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-6 bg-gray-50 rounded-lg">
              <input value={newEmployee.name} onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})} placeholder="Name" required className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={newEmployee.age} onChange={(e) => setNewEmployee({...newEmployee, age: e.target.value})} placeholder="Age" type="number" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={newEmployee.designation} onChange={(e) => setNewEmployee({...newEmployee, designation: e.target.value})} placeholder="Designation" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={newEmployee.department} onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})} placeholder="Department" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={newEmployee.salary} onChange={(e) => setNewEmployee({...newEmployee, salary: e.target.value})} placeholder="Salary" type="number" step="0.01" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={newEmployee.balance_remaining} onChange={(e) => setNewEmployee({...newEmployee, balance_remaining: e.target.value})} placeholder="Balance Remaining" type="number" step="0.01" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <button type="submit" className="md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50" disabled={loading}>
                {loading ? 'Creating...' : 'Create Employee'}
              </button>
            </form>
          )}

          {editingEmployee && (
            <form onSubmit={updateEmployee} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-6 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="md:col-span-2">
                <h4 className="text-lg font-semibold text-blue-800 mb-2">Edit Employee</h4>
              </div>
              <input value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} placeholder="Name" required className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={editForm.age} onChange={(e) => setEditForm({...editForm, age: e.target.value})} placeholder="Age" type="number" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={editForm.designation} onChange={(e) => setEditForm({...editForm, designation: e.target.value})} placeholder="Designation" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={editForm.department} onChange={(e) => setEditForm({...editForm, department: e.target.value})} placeholder="Department" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={editForm.salary} onChange={(e) => setEditForm({...editForm, salary: e.target.value})} placeholder="Salary" type="number" step="0.01" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <input value={editForm.balance_remaining} onChange={(e) => setEditForm({...editForm, balance_remaining: e.target.value})} placeholder="Balance Remaining" type="number" step="0.01" className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <div className="md:col-span-2 flex gap-3">
                <button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition disabled:opacity-50" disabled={loading}>
                  {loading ? 'Updating...' : 'Update Employee'}
                </button>
                <button type="button" onClick={cancelEdit} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg transition" disabled={loading}>
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {employees.map(emp => (
                  <tr key={emp.id} className={`hover:bg-gray-50 ${editingEmployee === emp.id ? 'bg-blue-50' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{emp.department}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{emp.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">Rs. {emp.salary}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <span className={`font-medium ${parseFloat(emp.balance_remaining) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                        Rs. {emp.balance_remaining}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <button
                        onClick={() => startEdit(emp)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-md transition"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;

