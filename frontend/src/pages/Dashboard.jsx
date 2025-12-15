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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await axios.delete(`/invoices/${id}`);
      setInvoices(invoices.filter((inv) => inv._id !== id));
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete invoice');
    }
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
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-alphonse-cream dark:bg-alphonse-charcoal">
        <div className="w-12 h-12 border-4 border-alphonse-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-alphonse-cream dark:bg-alphonse-charcoal pt-10 px-4 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream uppercase tracking-tight">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1 font-sans font-medium">
              Overview of your financial documents
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => handleExport('json')}
              className="neo-btn bg-white text-alphonse-charcoal px-4 py-2 text-sm flex items-center space-x-2 hover:bg-gray-50"
            >
              <Download className="w-4 h-4" />
              <span>JSON</span>
            </button>
            <button
              onClick={() => handleExport('csv')}
              className="neo-btn bg-alphonse-blue text-white px-4 py-2 text-sm flex items-center space-x-2 hover:bg-blue-700"
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
            <div className="neo-card bg-alphonse-yellow text-alphonse-charcoal">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold uppercase tracking-wider text-sm">Total Spent</h3>
                <div className="p-2 bg-black text-alphonse-yellow border-2 border-black shadow-sm">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-heading font-bold">${totalSpent.toFixed(2)}</p>
              <p className="text-sm font-bold mt-2 flex items-center opacity-80">
                <TrendingUp className="w-4 h-4 mr-1" /> Lifetime Spending
              </p>
            </div>

            <div className="neo-card bg-alphonse-blue text-white">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold uppercase tracking-wider text-sm text-white/90">Total Invoices</h3>
                <div className="p-2 bg-white text-alphonse-blue border-2 border-black shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
              <p className="text-4xl font-heading font-bold">{invoices.length}</p>
              <p className="text-sm font-bold mt-2 opacity-80">Processed Documents</p>
            </div>
          </div>

          {/* Right Column: Chart */}
          <div className="lg:col-span-2 neo-card bg-white dark:bg-alphonse-surface">
            <h3 className="text-xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream mb-6 uppercase">
              Spending Overview
            </h3>
            <div className="h-64 w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#9CA3AF" opacity={0.3} />
                    <XAxis
                      dataKey="name"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6B7280', fontSize: 12, fontWeight: 'bold' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{
                        backgroundColor: '#282E31',
                        border: '2px solid #000',
                        boxShadow: '4px 4px 0px 0px rgba(0,0,0,1)',
                        color: '#E5E1D4',
                        fontFamily: 'Space Grotesk, sans-serif'
                      }}
                    />
                    <Bar dataKey="amount" radius={[0, 0, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={index % 2 === 0 ? '#5252C5' : '#E1A424'}
                          stroke="#000"
                          strokeWidth={2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                  <BarChart className="w-12 h-12 mb-2 opacity-20" />
                  <p className="font-bold uppercase">No data to display yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Upload Section */}
        <div className="neo-card bg-white dark:bg-alphonse-surface">
          <h2 className="text-xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream mb-6 uppercase">
            Upload New Invoice
          </h2>
          <FileUpload onUploadSuccess={handleUploadSuccess} />
        </div>

        {/* Recent Invoices */}
        <div>
          <h2 className="text-xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream mb-6 uppercase">
            Recent Invoices
          </h2>
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
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="neo-card bg-white dark:bg-alphonse-charcoal w-full max-w-2xl max-h-[85vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-6 border-b-2 border-black pb-4">
              <div>
                <h3 className="text-2xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream">Invoice Details</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">
                  {selectedInvoice.fileName}
                </p>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-2 border-2 border-black hover:bg-alphonse-red hover:text-white transition-colors shadow-neo active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Invoice Number</p>
                <p className="font-heading font-bold text-lg text-alphonse-charcoal dark:text-alphonse-cream">{selectedInvoice.extractedData?.invoiceNumber || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Date</p>
                <p className="font-heading font-bold text-lg text-alphonse-charcoal dark:text-alphonse-cream">{selectedInvoice.extractedData?.invoiceDate || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Vendor</p>
                <p className="font-heading font-bold text-lg text-alphonse-charcoal dark:text-alphonse-cream">{selectedInvoice.extractedData?.vendorName || '-'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">Customer</p>
                <p className="font-heading font-bold text-lg text-alphonse-charcoal dark:text-alphonse-cream">{selectedInvoice.extractedData?.customerName || '-'}</p>
              </div>
            </div>

            <div className="bg-alphonse-cream dark:bg-alphonse-surface border-2 border-black p-4 mb-6 shadow-neo">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-mono font-bold text-alphonse-charcoal dark:text-alphonse-cream">
                  {selectedInvoice.extractedData?.currency || '$'}{' '}
                  {selectedInvoice.extractedData?.subtotal?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center mb-4 pb-4 border-b-2 border-gray-300 dark:border-gray-600">
                <span className="font-bold text-gray-600 dark:text-gray-400">Tax</span>
                <span className="font-mono font-bold text-alphonse-charcoal dark:text-alphonse-cream">
                  {selectedInvoice.extractedData?.currency || '$'}{' '}
                  {selectedInvoice.extractedData?.tax?.toFixed(2) || '0.00'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream">Total</span>
                <span className="text-2xl font-mono font-bold text-alphonse-blue dark:text-alphonse-yellow">
                  {selectedInvoice.extractedData?.currency || '$'}{' '}
                  {selectedInvoice.extractedData?.total?.toFixed(2) || '0.00'}
                </span>
              </div>
            </div>

            {selectedInvoice.extractedData?.items?.length > 0 && (
              <div>
                <h4 className="font-heading font-bold text-lg mb-3 text-alphonse-charcoal dark:text-alphonse-cream">Line Items</h4>
                <div className="border-2 border-black overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100 dark:bg-gray-800 border-b-2 border-black">
                      <tr>
                        <th className="text-left p-3 font-bold text-gray-600 dark:text-gray-400 uppercase">Description</th>
                        <th className="text-right p-3 font-bold text-gray-600 dark:text-gray-400 uppercase">Qty</th>
                        <th className="text-right p-3 font-bold text-gray-600 dark:text-gray-400 uppercase">Price</th>
                        <th className="text-right p-3 font-bold text-gray-600 dark:text-gray-400 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.extractedData.items.map((item, idx) => (
                        <tr
                          key={idx}
                          className="border-b border-gray-200 dark:border-gray-700 last:border-0"
                        >
                          <td className="p-3 font-medium text-alphonse-charcoal dark:text-alphonse-cream">{item.description}</td>
                          <td className="text-right p-3 font-mono text-gray-600 dark:text-gray-400">{item.quantity}</td>
                          <td className="text-right p-3 font-mono text-gray-600 dark:text-gray-400">
                            ${item.unitPrice?.toFixed(2)}
                          </td>
                          <td className="text-right p-3 font-mono font-bold text-alphonse-charcoal dark:text-alphonse-cream">
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
