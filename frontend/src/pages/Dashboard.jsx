import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import InvoiceTable from '../components/InvoiceTable';
import { Download, TrendingUp, DollarSign, FileText } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
    const interval = setInterval(fetchInvoices, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchInvoices = async () => {
    try {
      const { data } = await axios.get('/invoices');
      setInvoices(data.invoices);
    } catch (error) {
      console.error('Fetch invoices error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    fetchInvoices();
  };

  const handleDelete = (id) => {
    setInvoices(invoices.filter((inv) => inv._id !== id));
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/invoices/export?format=${format}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoices.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export error:', error);
      alert('Failed to export invoices');
    }
  };

  // --- Chart Data Preparation ---
  const chartData = invoices
    .filter(inv => inv.processingStatus === 'completed' && inv.extractedData?.total)
    .slice(0, 7) // Last 7 invoices
    .reverse() // Show oldest to newest
    .map(inv => ({
      name: inv.extractedData.vendorName?.split(' ')[0] || 'Unknown', // Shorten vendor name
      amount: inv.extractedData.total
    }));

  const totalSpent = invoices.reduce((sum, inv) => sum + (inv.extractedData?.total || 0), 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-24 px-4 pb-12 transition-colors duration-200">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your invoices and track expenses.</p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('json')}
              className="flex items-center space-x-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 px-4 py-2 rounded-lg transition duration-200 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition duration-200 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>CSV Export</span>
            </button>
          </div>
        </div>

        {/* Stats & Chart Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column: Stats Cards */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Spent</h3>
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">${totalSpent.toFixed(2)}</p>
              <p className="text-sm text-green-600 dark:text-green-400 mt-2 flex items-center">
                <TrendingUp className="w-4 h-4 mr-1" /> +12.5% from last month
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-500 dark:text-gray-400 font-medium">Total Invoices</h3>
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">All time processed</p>
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Spending Overview</h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.1} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12 }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px', color: '#fff' }}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#4F46E5' : '#818CF8'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <BarChart className="w-12 h-12 mb-2 opacity-20" />
                  <p>No data to display yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Upload New Invoice</h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Recent Invoices */}
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Recent Invoices</h2>
          <InvoiceTable
            invoices={invoices.slice(0, 5)}
            onDelete={handleDelete}
            onView={setSelectedInvoice}
          />
        </div>
      </div>

      {/* Invoice Modal */}
      {selectedInvoice && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b border-gray-100 dark:border-gray-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Details</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">View extracted information</p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice Number</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.extractedData?.invoiceNumber || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.extractedData?.invoiceDate || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.extractedData?.vendorName || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</p>
                <p className="font-semibold text-gray-900 dark:text-white">{selectedInvoice.extractedData?.customerName || '-'}</p>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedInvoice.extractedData?.currency || '$'}{' '}
                  {selectedInvoice.extractedData?.subtotal?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                <span className="text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {selectedInvoice.extractedData?.currency || '$'}{' '}
                  {selectedInvoice.extractedData?.tax?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedInvoice.extractedData?.currency || '$'}{' '}
                  {selectedInvoice.extractedData?.total?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {selectedInvoice.extractedData?.items?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 text-gray-900 dark:text-white">Line Items</h4>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="text-left p-3 font-medium text-gray-500">Description</th>
                        <th className="text-right p-3 font-medium text-gray-500">Qty</th>
                        <th className="text-right p-3 font-medium text-gray-500">Price</th>
                        <th className="text-right p-3 font-medium text-gray-500">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.extractedData.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-t border-gray-200 dark:border-gray-700"
                        >
                          <td className="p-3 text-gray-900 dark:text-gray-200">{item.description}</td>
                          <td className="text-right p-3 text-gray-600 dark:text-gray-400">{item.quantity}</td>
                          <td className="text-right p-3 text-gray-600 dark:text-gray-400">
                            ${item.unitPrice?.toFixed(2)}
                          </td>
                          <td className="text-right p-3 font-medium text-gray-900 dark:text-gray-200">
                            ${item.amount?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
