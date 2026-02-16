import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg no-print">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-white font-bold text-xl hover:text-blue-100 transition">
              Accounts - Jamia Muhammadia
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link to="/receipts" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                Receipts
              </Link>
              <Link to="/payments" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                Payments
              </Link>
              <Link to="/records" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                Records
              </Link>
              <Link to="/salaries" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                Salaries
              </Link>
              <Link to="/settings" className="text-white hover:bg-blue-500 px-3 py-2 rounded-md transition">
                Settings
              </Link>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm">{user?.name}</span>
            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md transition text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
