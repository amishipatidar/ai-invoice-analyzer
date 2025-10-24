import { useState, useEffect } from 'react';
import axios from 'axios';
import InvoiceTable from '../components/InvoiceTable';

const History = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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

  const handleDelete = (id) => {
    setInvoices(invoices.filter(inv => inv._id !== id));
  };

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    return inv.processingStatus === filter;
  });

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
        <h1 className="text-3xl font-bold">Invoice History</h1>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="input-field max-w-xs"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      <InvoiceTable
        invoices={filteredInvoices}
        onDelete={handleDelete}
        onView={() => {}}
      />
    </div>
  );
};

export default History;