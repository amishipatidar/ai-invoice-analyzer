import { useState, useEffect } from 'react';
import axios from 'axios';
import FileUpload from '../components/FileUpload';
import InvoiceTable from '../components/InvoiceTable';
import { Download } from 'lucide-react';

const Dashboard = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  useEffect(() => {
    fetchInvoices();

    // Poll for updates every 5 seconds
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
    setInvoices(invoices.filter(inv => inv._id !== id));
  };

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/invoices/export?format=${format}`, {
        responseType: 'blob'
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="flex space-x-2">
          <button
            onClick={() => handleExport('json')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export JSON</span>
          </button>
          <button
            onClick={() => handleExport('csv')}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      <div className="grid gap-8">
        <FileUpload onUploadSuccess={handleUploadSuccess} />

        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Invoices</h2>
          <InvoiceTable
            invoices={invoices.slice(0, 5)}
            onDelete={handleDelete}
            onView={setSelectedInvoice}
          />
        </div>
      </div>

      {selectedInvoice && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedInvoice(null)}
        >
          <div
            className="card max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold">Invoice Details</h3>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Invoice Number</p>
                  <p className="font-medium">{selectedInvoice.extractedData?.invoiceNumber || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <p className="font-medium">{selectedInvoice.extractedData?.invoiceDate || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Vendor</p>
                  <p className="font-medium">{selectedInvoice.extractedData?.vendorName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer</p>
                  <p className="font-medium">{selectedInvoice.extractedData?.customerName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Subtotal</p>
                  <p className="font-medium">
                    {selectedInvoice.extractedData?.currency || '$'} {selectedInvoice.extractedData?.subtotal?.toFixed(2) || '0.00'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Total</p>
                  <p className="font-medium text-lg">
                    {selectedInvoice.extractedData?.currency || '$'} {selectedInvoice.extractedData?.total?.toFixed(2) || '0.00'}
                  </p>
                </div>
              </div>

              {selectedInvoice.extractedData?.items?.length > 0 && (
                <div>
                  <h4 className="font-bold mb-2">Items</h4>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="text-left p-2">Description</th>
                          <th className="text-right p-2">Qty</th>
                          <th className="text-right p-2">Price</th>
                          <th className="text-right p-2">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedInvoice.extractedData.items.map((item, idx) => (
                          <tr key={idx} className="border-t border-gray-200 dark:border-gray-700">
                            <td className="p-2">{item.description}</td>
                            <td className="text-right p-2">{item.quantity}</td>
                            <td className="text-right p-2">${item.unitPrice?.toFixed(2)}</td>
                            <td className="text-right p-2">${item.amount?.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;