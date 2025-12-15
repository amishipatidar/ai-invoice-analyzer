import { useState, useEffect } from 'react';
import axios from 'axios';
import InvoiceTable from '../components/InvoiceTable';

const History = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();
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

  const filteredInvoices = invoices.filter((inv) => {
    if (filter === 'all') return true;
    return inv.processingStatus === filter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-alphonse-cream dark:bg-alphonse-charcoal">
        <div className="w-12 h-12 border-4 border-alphonse-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-alphonse-cream dark:bg-alphonse-charcoal px-4 py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream mb-2">
              Invoice History
            </h1>
            <p className="text-gray-600 dark:text-gray-400 font-sans">
              Track and manage your processed documents
            </p>
          </div>

          <div className="relative">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="neo-input w-48 cursor-pointer font-bold uppercase tracking-wider dark:bg-alphonse-surface dark:text-alphonse-cream"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        <InvoiceTable
          invoices={filteredInvoices}
          onDelete={handleDelete}
          onView={setSelectedInvoice}
        />
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

export default History;
