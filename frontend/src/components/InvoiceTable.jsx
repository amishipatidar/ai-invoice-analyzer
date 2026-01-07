import { Eye, Trash2, FileText } from 'lucide-react';

const InvoiceTable = ({ invoices, onDelete, onView }) => {
  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-alphonse-yellow text-alphonse-charcoal border-2 border-black dark:border-white',
      processing: 'bg-alphonse-blue text-white border-2 border-black dark:border-white',
      completed: 'bg-green-500 text-white border-2 border-black dark:border-white',
      failed: 'bg-alphonse-red text-white border-2 border-black dark:border-white',
    };

    return (
      <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_#ffffff] ${styles[status]}`}>
        {status}
      </span>
    );
  };

  if (invoices.length === 0) {
    return (
      <div className="neo-card py-16 flex flex-col items-center justify-center text-center bg-white dark:bg-alphonse-charcoal">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 border-2 border-black shadow-neo dark:shadow-neo-light mb-4">
          <FileText className="w-8 h-8 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-heading font-bold text-alphonse-charcoal dark:text-alphonse-cream mb-1">No invoices yet</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-sm mx-auto font-sans">
          Upload your first invoice to see the magic happen.
        </p>
      </div>
    );
  }

  return (
    <div className="neo-card overflow-x-auto bg-white dark:bg-alphonse-charcoal p-0">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-black dark:border-white bg-gray-100 dark:bg-gray-800">
            <th className="text-left py-4 px-6 font-heading font-bold uppercase tracking-wider text-sm text-alphonse-charcoal dark:text-alphonse-cream">File Name</th>
            <th className="text-left py-4 px-6 font-heading font-bold uppercase tracking-wider text-sm text-alphonse-charcoal dark:text-alphonse-cream">Type</th>
            <th className="text-left py-4 px-6 font-heading font-bold uppercase tracking-wider text-sm text-alphonse-charcoal dark:text-alphonse-cream">Status</th>
            <th className="text-left py-4 px-6 font-heading font-bold uppercase tracking-wider text-sm text-alphonse-charcoal dark:text-alphonse-cream">Total</th>
            <th className="text-left py-4 px-6 font-heading font-bold uppercase tracking-wider text-sm text-alphonse-charcoal dark:text-alphonse-cream">Date</th>
            <th className="text-right py-4 px-6 font-heading font-bold uppercase tracking-wider text-sm text-alphonse-charcoal dark:text-alphonse-cream">Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((invoice) => (
            <tr key={invoice._id} className="border-b-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
              <td className="py-4 px-6 font-bold text-alphonse-charcoal dark:text-alphonse-cream">{invoice.fileName}</td>
              <td className="py-4 px-6 capitalize font-medium text-gray-600 dark:text-gray-300">{invoice.invoiceType}</td>
              <td className="py-4 px-6">{getStatusBadge(invoice.processingStatus)}</td>
              <td className="py-4 px-6 font-mono font-bold text-alphonse-charcoal dark:text-alphonse-cream">
                {invoice.extractedData?.total
                  ? `${invoice.extractedData.currency || '$'} ${invoice.extractedData.total.toFixed(2)}`
                  : '-'}
              </td>
              <td className="py-4 px-6 text-gray-600 dark:text-gray-400 font-medium">
                {new Date(invoice.createdAt).toLocaleDateString()}
              </td>
              <td className="py-4 px-6">
                <div className="flex justify-end space-x-2">
                  {invoice.processingStatus === 'completed' && (
                    <button
                      onClick={() => onView(invoice)}
                      className="p-2 bg-alphonse-blue text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-blue-700"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => onDelete(invoice._id)}
                    className="p-2 bg-alphonse-red text-white border-2 border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_#ffffff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-red-700"
                    title="Delete Invoice"
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