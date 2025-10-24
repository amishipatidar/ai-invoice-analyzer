import { Trash2, Eye } from 'lucide-react';
import axios from 'axios';

const InvoiceTable = ({ invoices, onDelete, onView }) => {
  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await axios.delete(`/invoices/${id}`);
      onDelete(id);
      alert('Invoice deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete invoice');
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
      processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
      completed: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (invoices.length === 0) {
    return (
      <div className="card text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">No invoices yet. Upload your first invoice!</p>
      </div>
    );
  }

  return (
    <div className="card overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4">File Name</th>
            <th className="text-left py-3 px-4">Type</th>
            <th className="text-left py-3 px-4">Status</th>
            <th className="text-left py-3 px-4">Total</th>
            <th className="text-left py-3 px-4">Date</th>
            <th className="text-right py-3 px-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
              <td className="py-3 px-4">{invoice.fileName}</td>
              <td className="py-3 px-4 capitalize">{invoice.invoiceType}</td>
              <td className="py-3 px-4">{getStatusBadge(invoice.processingStatus)}</td>
              <td className="py-3 px-4">
                {invoice.extractedData?.total
                  ? `${invoice.extractedData.currency || '$'} ${invoice.extractedData.total.toFixed(2)}`
                  : '-'}
              </td>
              <td className="py-3 px-4">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </td>
              <td className="py-3 px-4">
                <div className="flex justify-end space-x-2">
                  {invoice.processingStatus === 'completed' && (
                    <button
                      onClick={() => onView(invoice)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(invoice._id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvoiceTable;