import { useState, useEffect } from 'react';
import { paymentService, expenseHeadService, employeeService } from '../services/api';

function Payments() {
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    payment_number: '', name: '', amount: '', particulars: '', expense_head_id: '', employee_id: ''
  });
  const [selectedDept, setSelectedDept] = useState('');
  const [isSalaryExpense, setIsSalaryExpense] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [heads, depts] = await Promise.all([
      expenseHeadService.getAll(),
      employeeService.getDepartments()
    ]);
    setExpenseHeads(heads.data);
    setDepartments(depts.data);
  };

  const handleExpenseHeadChange = (e) => {
    const selectedId = e.target.value;
    setForm({...form, expense_head_id: selectedId, employee_id: ''});
    const selectedHead = expenseHeads.find(h => h.id == selectedId);
    setIsSalaryExpense(selectedHead?.name === 'Salary');
    setSelectedDept('');
  };

  const handleDepartmentChange = async (e) => {
    const dept = e.target.value;
    setSelectedDept(dept);
    if (dept) {
      const res = await employeeService.getByDepartment(dept);
      setEmployees(res.data);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await paymentService.create(form);
    setForm({ payment_number: '', name: '', amount: '', particulars: '', expense_head_id: '', employee_id: '' });
    setIsSalaryExpense(false);
    setSelectedDept('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Record Payment (Outgoing)</h2>
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Payment recorded successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Number</label>
              <input
                value={form.payment_number}
                onChange={(e) => setForm({...form, payment_number: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter payment number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <input
                type="number"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({...form, amount: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Expense Head</label>
              <select
                value={form.expense_head_id}
                onChange={handleExpenseHeadChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                <option value="">Select Expense Head</option>
                {expenseHeads.map(head => (
                  <option key={head.id} value={head.id}>{head.name}</option>
                ))}
              </select>
            </div>
            
            {isSalaryExpense && (
              <div className="p-6 bg-blue-50 border border-blue-200 rounded-lg space-y-4">
                <h4 className="font-semibold text-blue-900 mb-4">Salary Payment Details</h4>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDept}
                    onChange={handleDepartmentChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                {selectedDept && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employee</label>
                    <select
                      value={form.employee_id}
                      onChange={(e) => setForm({...form, employee_id: e.target.value})}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Employee</option>
                      {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>
                          {emp.name} - Balance: Rs. {emp.balance_remaining}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Particulars</label>
              <textarea
                value={form.particulars}
                onChange={(e) => setForm({...form, particulars: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="Additional details..."
              />
            </div>
            <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
              Record Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Payments;
