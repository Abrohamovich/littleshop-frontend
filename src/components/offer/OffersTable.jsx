import React from 'react';
import { MoreVertical } from 'lucide-react';

const OffersTable = ({
                         offers,
                         loading,
                         visibleColumns,
                         availableColumns,
                         onDeleteOffer,
                         onUpdateOffer,
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(price);
    };

    const getCellValue = (offer, columnKey) => {
        switch (columnKey) {
            case 'createdAt':
            case 'updatedAt':
                return formatDate(offer[columnKey]);
            case 'price':
                return formatPrice(offer[columnKey]);
            case 'category':
                return offer.category?.name || '-';
            case 'supplier':
                return offer.supplier?.name || '-';
            case 'type':
                return offer[columnKey] === 'PRODUCT' ? 'Product' : 'Service';
            default:
                return offer[columnKey] || '-';
        }
    };

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading offers...</p>
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
                    {offers.map((offer) => (
                        <tr key={offer.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <input type="checkbox" className="rounded" />
                            </td>
                            {visibleColumns.map((columnKey) => (
                                <td key={columnKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {getCellValue(offer, columnKey)}
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
                                    <div className="hidden absolute right-0 top-full mt-1 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                                        <button
                                            onClick={() => onUpdateOffer(offer.id)}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                        >
                                            Update
                                        </button>
                                        <button
                                            onClick={() => onDeleteOffer(offer.id)}
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

export default OffersTable;