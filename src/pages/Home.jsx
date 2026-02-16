function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to Accounts System</h1>
          <p className="text-xl text-gray-600">Jamia Muhammadia Educational Institute</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📥</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Receipts</h3>
            <p className="text-gray-600">Record incoming transactions and manage income heads</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Payments</h3>
            <p className="text-gray-600">Record outgoing transactions and salary payments</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Records</h3>
            <p className="text-gray-600">View all transactions with advanced filters and print reports</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Salaries</h3>
            <p className="text-gray-600">Manage employee salaries, view ledgers and payment history</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
