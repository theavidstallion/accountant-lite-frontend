import { useState, useEffect } from 'react';
import { paymentService, employeeService } from '../services/api';

function Salaries() {
  const [salaries, setSalaries] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [ledger, setLedger] = useState(null);
  const [showLedger, setShowLedger] = useState(false);
  const [loading, setLoading] = useState(true);
  const [ledgerLoading, setLedgerLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sal, emp] = await Promise.all([
        paymentService.getSalaries(),
        employeeService.getAll()
      ]);
      setSalaries(sal.data);
      setEmployees(emp.data);
    } finally {
      setLoading(false);
    }
  };

  const viewLedger = async (empId) => {
    setLedgerLoading(true);
    try {
      const res = await employeeService.getLedger(empId);
      setLedger(res.data);
      setSelectedEmployee(res.data.employee);
      setShowLedger(true);
    } finally {
      setLedgerLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-PK', { 
      timeZone: 'Asia/Karachi',
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const parseLedgerEntry = (payment) => {
    const particulars = payment.particulars || '';
    const parts = particulars.split('|').map(p => p.trim());
    const employeeName = parts.find(p => p.startsWith('Employee:'))?.replace('Employee:', '').trim() || payment.name;
    const prevBalance = parts.find(p => p.startsWith('Previous Balance:'))?.replace('Previous Balance:', '').trim() || '0';
    const newBalance = parts.find(p => p.startsWith('New Balance:'))?.replace('New Balance:', '').trim() || '0';
    const details = parts[0] || '';
    
    return { employeeName, prevBalance, newBalance, details };
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="print-header">
          <h1>Accounts - Jamia Muhammadia</h1>
          <h2>{showLedger ? `Employee Ledger - ${selectedEmployee?.name}` : 'Salary Records'}</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading...</p>
            </div>
          </div>
        ) : !showLedger ? (
          <>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Salary Records</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {salaries.map(sal => (
                      <tr key={sal.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sal.payment_number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sal.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                          Rs. {parseFloat(sal.amount).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {formatDate(sal.timestamp)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Employees</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Designation</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider no-print">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map(emp => (
                      <tr key={emp.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{emp.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{emp.department}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{emp.designation}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          Rs. {parseFloat(emp.salary).toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                          <span className={`font-medium ${parseFloat(emp.balance_remaining) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            Rs. {parseFloat(emp.balance_remaining).toFixed(2)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm no-print">
                          <button
                            onClick={() => viewLedger(emp.id)}
                            disabled={ledgerLoading}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition disabled:opacity-50"
                          >
                            {ledgerLoading ? 'Loading...' : 'View Ledger'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="mb-6 no-print">
              <button
                onClick={() => setShowLedger(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition mr-4"
              >
                ← Back
              </button>
              <button
                onClick={handlePrint}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition"
              >
                Print Ledger
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Employee Ledger: {selectedEmployee?.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Department</p>
                  <p className="font-medium">{selectedEmployee?.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Designation</p>
                  <p className="font-medium">{selectedEmployee?.designation}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Monthly Salary</p>
                  <p className="font-medium">Rs. {parseFloat(selectedEmployee?.salary).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Current Balance</p>
                  <p className={`font-medium ${parseFloat(selectedEmployee?.balance_remaining) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                    Rs. {parseFloat(selectedEmployee?.balance_remaining).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details/Particulars</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ledger?.payments.map(payment => {
                      const { employeeName, newBalance, details } = parseLedgerEntry(payment);
                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {formatDate(payment.timestamp)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{employeeName}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{details}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                            Rs. {parseFloat(payment.amount).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                            <span className={`font-medium ${parseFloat(newBalance) > 0 ? 'text-red-600' : 'text-green-600'}`}>
                              Rs. {parseFloat(newBalance).toFixed(2)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Salaries;
