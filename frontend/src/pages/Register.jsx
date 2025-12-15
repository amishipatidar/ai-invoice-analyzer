import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, AlertCircle } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      await register(name, email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 transition-colors duration-300">
      <div className="neo-card w-full max-w-md relative overflow-hidden bg-white dark:bg-alphonse-charcoal">

        <div className="text-center mb-8 mt-4">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-alphonse-blue border-2 border-black shadow-neo rounded-none mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl text-alphonse-charcoal dark:text-alphonse-cream mb-2">Create Account</h2>
          <p className="text-gray-600 dark:text-gray-400 font-sans">Join us and start analyzing invoices</p>
        </div>

        {error && (
          <div className="bg-alphonse-red/10 border-2 border-alphonse-red text-alphonse-red p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="neo-input dark:bg-alphonse-surface dark:text-alphonse-cream"
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="neo-input dark:bg-alphonse-surface dark:text-alphonse-cream"
              placeholder="name@company.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="neo-input dark:bg-alphonse-surface dark:text-alphonse-cream"
              placeholder="••••••••"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-600 dark:text-gray-400 mb-2 uppercase tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="neo-input dark:bg-alphonse-surface dark:text-alphonse-cream"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full neo-btn-primary py-3 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Create Account
                <UserPlus className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t-2 border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-alphonse-blue hover:text-alphonse-red font-bold transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
