import React from 'react';
import { MoreVertical, RefreshCw } from 'lucide-react';
import { formatDate } from '../utils/dateUtil.js';

const DataTable = ({
                       data,
                       loading,
                       visibleColumns,
                       availableColumns,
                       onDelete,
                       onUpdate,
                       currentPage,
                       setCurrentPage,
                       pageSize,
                       setPageSize,
                       totalPages,
                       totalElements,
                       entityName = 'items',
                       customFormatter = null,
                       customActions = null,
                       updateButtonText = 'Update',
                       error = null,
                       onRetry = null
                   }) => {

    if (loading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-2 text-gray-500">Loading {entityName}...</p>
            </div>
        );
    }

    if (error && (!data || data.length === 0)) {
        return (
            <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500 mb-4">Unable to load {entityName}</p>
                {onRetry && (
                    <button
                        onClick={onRetry}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        <span>Try Again</span>
                    </button>
                )}
            </div>
        );
    }

    if (!data || data.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="text-gray-400 mb-4">
                    <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                </div>
                <p className="text-gray-500">No {entityName} found</p>
            </div>
        );
    }

    const formatCellValue = (item, columnKey) => {
        if (customFormatter) {
            return customFormatter(item, columnKey);
        }

        const value = item[columnKey];
        if (columnKey === 'createdAt' || columnKey === 'updatedAt') {
            return formatDate(value);
        }
        return value || '-';
    };

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
                    {data.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4">
                                <input type="checkbox" className="rounded" />
                            </td>
                            {visibleColumns.map((columnKey) => (
                                <td key={columnKey} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {formatCellValue(item, columnKey)}
                                </td>
                            ))}
                            <td className="px-6 py-4">
                                <div className="relative">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                                                if (menu !== e.currentTarget.nextElementSibling) {
                                                    menu.classList.add('hidden');
                                                }
                                            });
                                            const menu = e.currentTarget.nextElementSibling;
                                            menu.classList.toggle('hidden');
                                        }}
                                        className="p-1 rounded-md hover:bg-gray-100"
                                    >
                                        <MoreVertical className="w-4 h-4 text-gray-400" />
                                    </button>
                                    <div className={`dropdown-menu hidden absolute right-0 top-full mt-1 ${customActions ? 'w-48' : 'w-32'} bg-white border border-gray-200 rounded-md shadow-lg z-10`}>
                                        {customActions && customActions.map((action, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    action.onClick(item);
                                                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                                                        menu.classList.add('hidden');
                                                    });
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${action.className || ''} ${action.icon ? 'flex items-center space-x-2' : ''}`}
                                            >
                                                {action.icon && action.icon}
                                                <span>{action.label}</span>
                                            </button>
                                        ))}
                                        <button
                                            onClick={() => {
                                                onUpdate(item.id);
                                                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                                                    menu.classList.add('hidden');
                                                });
                                            }}
                                            className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50"
                                        >
                                            {updateButtonText}
                                        </button>
                                        <button
                                            onClick={() => {
                                                onDelete(item.id);
                                                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                                                    menu.classList.add('hidden');
                                                });
                                            }}
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

            {data && data.length > 0 && (
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
            )}
        </>
    );
};

if (typeof document !== 'undefined') {
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.relative')) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.add('hidden');
            });
        }
    });
}

export default DataTable;