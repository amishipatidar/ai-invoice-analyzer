import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { FileText, Moon, Sun, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white dark:bg-alphonse-charcoal border-b-2 border-black sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-alphonse-yellow border-2 border-black shadow-neo group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-none transition-all">
              <FileText className="w-6 h-6 text-alphonse-charcoal" />
            </div>
            <span className="text-2xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream tracking-tight">
              AI Invoice Analyzer
            </span>
          </Link>

          <div className="flex items-center space-x-6">
            {user && (
              <>
                <Link
                  to="/dashboard"
                  className="font-bold text-gray-600 dark:text-gray-300 hover:text-alphonse-blue dark:hover:text-alphonse-yellow transition-colors uppercase tracking-wider text-sm"
                >
                  Dashboard
                </Link>
                <Link
                  to="/history"
                  className="font-bold text-gray-600 dark:text-gray-300 hover:text-alphonse-blue dark:hover:text-alphonse-yellow transition-colors uppercase tracking-wider text-sm"
                >
                  History
                </Link>
                <div className="px-3 py-1 border-2 border-gray-300 dark:border-gray-600 rounded-none font-mono text-sm text-gray-600 dark:text-gray-300">
                  {user.name}
                </div>
              </>
            )}

            <button
              onClick={toggleTheme}
              className="p-2 border-2 border-transparent hover:border-black hover:bg-gray-100 dark:hover:bg-gray-800 transition-all rounded-none"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-5 h-5 text-alphonse-yellow" />
              ) : (
                <Moon className="w-5 h-5 text-alphonse-blue" />
              )}
            </button>

            {user && (
              <button
                onClick={handleLogout}
                className="neo-btn bg-alphonse-red text-white px-4 py-2 text-sm flex items-center space-x-2 hover:bg-red-600"
                aria-label="Logout"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;