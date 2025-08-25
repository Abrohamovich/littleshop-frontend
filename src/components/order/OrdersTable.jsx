import React from 'react';
import { Eye } from 'lucide-react';
import { formatDate } from '../../utils/dateUtil.js';
import DataTable from "../DataTable.jsx";

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
                         totalElements,
                         error,
                         onRetry
                     }) => {

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
        const statusMap = {
            'IN_PROGRESS': { text: 'In Progress', color: 'bg-yellow-100 text-yellow-800' },
            'COMPLETED': { text: 'Completed', color: 'bg-purple-100 text-purple-800' },
            'CANCELLED': { text: 'Cancelled', color: 'bg-red-100 text-red-800' }
        };

        const statusInfo = statusMap[status] || { text: status, color: 'bg-gray-100 text-gray-800' };

        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                {statusInfo.text}
            </span>
        );
    };

    const formatOrderValue = (order, columnKey) => {
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

    const customActions = [
        {
            label: 'View Details',
            icon: <Eye className="w-4 h-4" />,
            onClick: (order) => {
                // TODO: Implement view order details
                console.log('View order details:', order.id);
            }
        }
    ];

    return (
        <DataTable
            data={orders}
            loading={loading}
            visibleColumns={visibleColumns}
            availableColumns={availableColumns}
            onDelete={onDeleteOrder}
            onUpdate={onUpdateOrder}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            entityName="orders"
            customFormatter={formatOrderValue}
            customActions={customActions}
            updateButtonText="Manage Order"
            error={error}
            onRetry={onRetry}
        />
    );
};

export default OrdersTable;