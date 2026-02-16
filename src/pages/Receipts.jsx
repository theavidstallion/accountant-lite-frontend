import { useState, useEffect } from 'react';
import { receiptService, incomeHeadService } from '../services/api';

function Receipts() {
  const [incomeHeads, setIncomeHeads] = useState([]);
  const [form, setForm] = useState({
    receipt_number: '', name: '', amount: '', particulars: '', income_head_id: ''
  });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    loadIncomeHeads();
  }, []);

  const loadIncomeHeads = async () => {
    const res = await incomeHeadService.getAll();
    setIncomeHeads(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await receiptService.create(form);
    setForm({ receipt_number: '', name: '', amount: '', particulars: '', income_head_id: '' });
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Record Receipt (Incoming)</h2>
          
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
              Receipt recorded successfully!
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Receipt Number</label>
              <input
                value={form.receipt_number}
                onChange={(e) => setForm({...form, receipt_number: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter receipt number"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({...form, name: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Income Head</label>
              <select
                value={form.income_head_id}
                onChange={(e) => setForm({...form, income_head_id: e.target.value})}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select Income Head</option>
                {incomeHeads.map(head => (
                  <option key={head.id} value={head.id}>{head.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Particulars</label>
              <textarea
                value={form.particulars}
                onChange={(e) => setForm({...form, particulars: e.target.value})}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Additional details..."
              />
            </div>
            <button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200">
              Record Receipt
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Receipts;
