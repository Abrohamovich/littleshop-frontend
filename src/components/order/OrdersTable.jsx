import React from 'react';
import { MoreVertical, Eye } from 'lucide-react';

const OrdersTable = ({
                         orders,
                         loading,
                         visibleColumns,
                         availableColumns,
                         onDeleteOrder,
                         onUpdateOrder,
                         currentPage,
                         setCurrentPage,
                         pageSize,
                         setPageSize,
                         totalPages,
                         totalElements
                     }) => {

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateTotalAmount = (items) => {
        if (!items || items.length === 0) return 0;
        return items.reduce((total, item) => total + (item.priceAtTimeOfOrder * item.quantity), 0);
    };

    const formatStatus = (status) => {
        // Convert status to readable format and add styling
        const statusMap = {
            'PENDING': { text: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
            'CONFIRMED': { text: 'Confirmed', color: 'bg-blue-100 text-blue-800' },
            'PROCESSING': { text: 'Processing', color: 'bg-purple-100 text-purple-800' },
            'SHIPPED': { text: 'Shipped', color: 'bg-indigo-100 text-indigo-800' },
            'DELIVERED': { text: 'Delivered', color: 'bg-green-100 text-green-800' },
            'CANCELLED': { text: 'Cancelled', color: 'bg-red-100 text-red-800' },
            'REFUNDED': { text: 'Refunded', color: 'bg-gray-100 text-gray-800' }
        };

        const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.text}
            </span>
        );
    };

    const getCellValue = (order, columnKey) => {
        switch (columnKey) {
            case 'createdAt':
            case 'updatedAt':
                return formatDate(order[columnKey]);
            case 'customer':
                return order.customer ? `${order.customer.firstName} ${order.customer.lastName}` : '-';
            case 'user':
                return order.user ? `${order.user.firstName} ${order.user.lastName}` : '-';
            case 'status':
                return formatStatus(order[columnKey]);
            case 'itemsCount':
                return order.items ? order.items.length : 0;
            case 'totalAmount':
                return formatCurrency(calculateTotalAmount(order.items));
            default:
                return order[columnKey] || '-';
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading orders...</p>
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="w-8 px-6 py-3"></th>
                        {visibleColumns.map((columnKey) => {
                            const column = availableColumns.find(col => col.key === columnKey);
                            return (
                                <th key={columnKey} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {column.label}
                                </th>
                            );
                        })}
                        <th className="w-8 px-6 py-3"></th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <input type="checkbox" className="rounded" />
                            </td>
                            {visibleColumns.map((columnKey) => (
                                <td key={columnKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getCellValue(order, columnKey)}
                                </td>
                            ))}
                            <td className="px-6 py-4">
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            const menu = e.currentTarget.nextElementSibling;
                                            menu.classList.toggle('hidden');
                                        }}
                                        className="p-1 rounded-md hover:bg-gray-100"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <div className="hidden absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => {
                                                // TODO: Implement view order details
                                                console.log('View order details:', order.id);
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center space-x-2"
                                        >
                                            <Eye className="w-4 h-4" />
                                            <span>View Details</span>
                                        </button>
                                        <button
                                            onClick={() => onUpdateOrder(order.id)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Manage Order
                                        </button>
                                        <button
                                            onClick={() => onDeleteOrder(order.id)}
                                            className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                    Showing {currentPage * pageSize + 1} to {Math.min((currentPage + 1) * pageSize, totalElements)} of {totalElements} entries
                </div>
                <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-700">per page</span>
                    <select
                        value={pageSize}
                        onChange={(e) => {
                            setPageSize(Number(e.target.value));
                            setCurrentPage(0);
                        }}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </select>
                    <div className="flex space-x-1">
                        <button
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            disabled={currentPage === 0}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Previous
                        </button>
                        <button
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            disabled={currentPage >= totalPages - 1}
                            className="px-3 py-1 border border-gray-300 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OrdersTable;