import { useState, useEffect } from 'react';
import { recordsService, incomeHeadService, expenseHeadService } from '../services/api';

function Records() {
  const [records, setRecords] = useState([]);
  const [incomeHeads, setIncomeHeads] = useState([]);
  const [expenseHeads, setExpenseHeads] = useState([]);
  const [filters, setFilters] = useState({ 
    startDate: '', 
    endDate: '', 
    type: '',
    headType: '',
    headId: ''
  });

  useEffect(() => {
    loadHeads();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [filters]);

  const loadHeads = async () => {
    const [income, expense] = await Promise.all([
      incomeHeadService.getAll(),
      expenseHeadService.getAll()
    ]);
    setIncomeHeads(income.data);
    setExpenseHeads(expense.data);
  };

  const loadRecords = async () => {
    const res = await recordsService.getAll(filters);
    setRecords(res.data);
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

  const handleTypeChange = (newType) => {
    setFilters({...filters, type: newType, headType: '', headId: ''});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="print-header">
          <h1>Accounts - Jamia Muhammadia</h1>
          <h2>Records Report</h2>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Records</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={filters.startDate}
                onChange={(e) => setFilters({...filters, startDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={filters.endDate}
                onChange={(e) => setFilters({...filters, endDate: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={filters.type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Types</option>
                <option value="receipt">Receipts Only</option>
                <option value="payment">Payments Only</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Head Type</label>
              <select
                value={filters.headType}
                onChange={(e) => setFilters({...filters, headType: e.target.value, headId: ''})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={filters.type !== ''}
              >
                <option value="">All Heads</option>
                <option value="income">Income Head</option>
                <option value="expense">Expense Head</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Specific Head</label>
              <select
                value={filters.headId}
                onChange={(e) => setFilters({...filters, headId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={!filters.headType}
              >
                <option value="">Select Head</option>
                {filters.headType === 'income' && incomeHeads.map(head => (
                  <option key={head.id} value={head.id}>{head.name}</option>
                ))}
                {filters.headType === 'expense' && expenseHeads.map(head => (
                  <option key={head.id} value={head.id}>{head.name}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handlePrint}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition"
          >
            Print Records
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Number</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Head</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {records.map((record, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        record.type === 'receipt' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {record.type === 'receipt' ? 'IN' : 'OUT'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.receipt_number || record.payment_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{record.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{record.head_name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-medium">
                      Rs. {parseFloat(record.amount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {formatDate(record.timestamp)}
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

export default Records;
