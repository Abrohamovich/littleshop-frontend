import React, {useCallback, useEffect, useState} from 'react';
import {Filter, Plus} from 'lucide-react';
import {orderApi} from '../../services/orderApi.js';
import {customerApi} from '../../services/customerApi.js';
import {userApi} from '../../services/userApi.js';
import OrdersTable from './OrdersTable.jsx';
import CreateOrderForm from './CreateOrderForm.jsx';
import UpdateOrderForm from './UpdateOrderForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import {createColumnToggleHandler} from '../../utils/columnUtils.js';
import {useTableManagement} from "../../hooks/useTableManagement.js";
import ApiError from '../../utils/errorUtil.js';
import ErrorDisplay from '../../components/ErrorDisplay.jsx';

const AVAILABLE_COLUMNS = [
    {key: 'id', label: 'ID', type: 'number'},
    {key: 'customer', label: 'Customer', type: 'text'},
    {key: 'user', label: 'User', type: 'text'},
    {key: 'status', label: 'Status', type: 'text'},
    {key: 'itemsCount', label: 'Items Count', type: 'number'},
    {key: 'totalAmount', label: 'Total Amount', type: 'currency'},
    {key: 'createdAt', label: 'Created At', type: 'date'},
    {key: 'updatedAt', label: 'Updated At', type: 'date'}
];

const Orders = () => {
    const {
        // Data state
        items: orders,
        setItems: setOrders,
        loading,
        setLoading,

        // Pagination state
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        totalElements,
        setTotalElements,
        pageSize,
        setPageSize,
        resetToFirstPage,

        // Form state
        showCreateForm,
        setShowCreateForm,
        showUpdateForm,
        selectedItemId: selectedOrderId,

        // Column visibility state
        visibleColumns,
        setVisibleColumns,
        showColumnSelector,
        setShowColumnSelector,

        // Handlers
        handleCreateSuccess: onCreateSuccess,
        handleUpdateSuccess: onUpdateSuccess,
        handleUpdate,
        handleCancelCreate,
        handleCancelUpdate
    } = useTableManagement({
        defaultSearchField: '',
        defaultVisibleColumns: ['id', 'customer', 'user', 'status', 'itemsCount', 'totalAmount'],
        defaultPageSize: 10
    });

    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);
    const [filters, setFilters] = useState({
        customerId: '',
        userId: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);

    const toggleColumn = createColumnToggleHandler(visibleColumns, setVisibleColumns, AVAILABLE_COLUMNS);

    useEffect(() => {
        const loadFilterData = async () => {
            setError(null);
            try {
                const [customersResponse, usersResponse] = await Promise.all([
                    customerApi.getCustomers(0, 1000),
                    userApi.getUsers(0, 1000)
                ]);

                setCustomers(Array.isArray(customersResponse.content) ? customersResponse.content : []);
                setUsers(Array.isArray(usersResponse.content) ? usersResponse.content : []);
            } catch (error) {
                console.error('Error loading filter data:', error);

                if (error instanceof ApiError) {
                    setError({
                        message: error.message,
                        status: error.status,
                        timestamp: error.timestamp
                    });
                } else {
                    setError({
                        message: 'Error loading filter data',
                        status: 500,
                        timestamp: new Date().toISOString()
                    });
                }

            }
        };

        loadFilterData();
    }, []);

    const loadOrders = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {};
            if (filters.customerId) params.customerId = parseInt(filters.customerId);
            if (filters.userId) params.userId = parseInt(filters.userId);

            const response = await orderApi.getOrders(currentPage, pageSize, params.customerId, params.userId);
            setOrders(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading orders:', error);

            if (error instanceof ApiError) {
                setError({
                    message: error.message,
                    status: error.status,
                    timestamp: error.timestamp
                });
            } else {
                setError({
                    message: 'Error loading orders',
                    status: 500,
                    timestamp: new Date().toISOString()
                });
            }

            setOrders([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, filters, setLoading, setOrders, setTotalPages, setTotalElements]);

    useEffect(() => {
        loadOrders();
    }, [loadOrders]);

    const handleFilterChange = (filterKey, value) => {
        setFilters(prev => ({...prev, [filterKey]: value}));
        resetToFirstPage();
    };

    const clearFilters = () => {
        setFilters({customerId: '', userId: ''});
        resetToFirstPage();
    };

    const handleDeleteOrder = async (id) => {
        if (window.confirm('Are you sure you want to delete this order?')) {
            try {
                await orderApi.deleteOrder(id);
                loadOrders();
            } catch (error) {
                console.error('Error deleting order:', error);

                if (error instanceof ApiError) {
                    setError({
                        message: error.message,
                        status: error.status,
                        timestamp: error.timestamp
                    });
                } else {
                    setError({
                        message: 'Failed to delete order',
                        status: 500,
                        timestamp: new Date().toISOString()
                    });
                }

            }
        }
    };

    const handleUpdateOrder = (orderId) => {
        handleUpdate(orderId);
    };

    const handleCreateSuccess = () => {
        onCreateSuccess();
        loadOrders();
    };

    const handleUpdateSuccess = () => {
        onUpdateSuccess();
        loadOrders();
    };

    const handleRetryLoad = () => {
        setError(null);
        loadOrders();
    };

    if (showCreateForm) {
        return (
            <CreateOrderForm
                onSuccess={handleCreateSuccess}
                onCancel={handleCancelCreate}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateOrderForm
                orderId={selectedOrderId}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancelUpdate}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {error && (
                    <div className="p-6 border-b border-gray-200">
                        <ErrorDisplay
                            error={error}
                            onDismiss={() => setError(null)}
                        />
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={handleRetryLoad}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className={`flex items-center space-x-2 px-3 py-2 border rounded-md text-sm ${
                                    showFilters || Object.values(filters).some(f => f)
                                        ? 'bg-blue-50 border-blue-300 text-blue-700'
                                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <Filter className="w-4 h-4"/>
                                <span>Filters</span>
                                {Object.values(filters).some(f => f) && (
                                    <span className="bg-blue-500 text-white rounded-full px-2 py-0.5 text-xs">
                                        {Object.values(filters).filter(f => f).length}
                                    </span>
                                )}
                            </button>

                            <ColumnSelector
                                availableColumns={AVAILABLE_COLUMNS}
                                visibleColumns={visibleColumns}
                                onToggleColumn={toggleColumn}
                                showSelector={showColumnSelector}
                                setShowSelector={setShowColumnSelector}
                            />
                        </div>
                        <button
                            onClick={() => setShowCreateForm(true)}
                            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            disabled={loading}
                        >
                            <Plus className="w-4 h-4"/>
                            <span>Create</span>
                        </button>
                    </div>

                    {showFilters && (
                        <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Customer
                                    </label>
                                    <select
                                        value={filters.customerId}
                                        onChange={(e) => handleFilterChange('customerId', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    >
                                        <option value="">All customers</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.firstName} {customer.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        User
                                    </label>
                                    <select
                                        value={filters.userId}
                                        onChange={(e) => handleFilterChange('userId', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        disabled={loading}
                                    >
                                        <option value="">All users</option>
                                        {users.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.firstName} {user.lastName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-end">
                                    <button
                                        onClick={clearFilters}
                                        className="px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                    >
                                        Clear Filters
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {deleteError && (
                        <div className="mb-4">
                            <ErrorDisplay
                                error={deleteError}
                                onDismiss={() => setDeleteError(null)}
                            />
                        </div>
                    )}
                </div>

                <OrdersTable
                    orders={orders}
                    loading={loading}
                    visibleColumns={visibleColumns}
                    availableColumns={AVAILABLE_COLUMNS}
                    onDeleteOrder={handleDeleteOrder}
                    onUpdateOrder={handleUpdateOrder}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    totalPages={totalPages}
                    totalElements={totalElements}
                    error={error}
                    onRetry={handleRetryLoad}
                />
            </div>

            {showColumnSelector && (
                <div
                    className="fixed inset-0 z-5"
                    onClick={() => setShowColumnSelector(false)}
                />
            )}
        </div>
    );
};

export default Orders;