import React, {useCallback, useEffect, useState} from 'react';
import {Plus, Search} from 'lucide-react';
import {customerApi} from '../../services/customerApi.js';
import ApiError from '../../utils/errorUtil.js';
import CustomersTable from './CustomersTable.jsx';
import CreateCustomerForm from './CreateCustomerForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateCustomerForm from "./UpdateCustomerForm.jsx";
import ErrorDisplay from '../../components/ErrorDisplay.jsx';
import {createColumnToggleHandler} from '../../utils/columnUtils.js';
import {useTableManagement} from "../../hooks/useTableManagement.js";

const AVAILABLE_COLUMNS = [
    {key: 'id', label: 'ID', type: 'number'},
    {key: 'firstName', label: 'First Name', type: 'text'},
    {key: 'lastName', label: 'Last Name', type: 'text'},
    {key: 'email', label: 'Email', type: 'text'},
    {key: 'phone', label: 'Phone', type: 'text'},
    {key: 'address', label: 'Address', type: 'text'},
    {key: 'createdAt', label: 'Created At', type: 'date'},
    {key: 'updatedAt', label: 'Updated At', type: 'date'}
];

const Customers = () => {
    const {
        // Data state
        items: customers,
        setItems: setCustomers,
        loading,
        setLoading,

        // Search state
        searchTerm,
        searchField,
        handleSearch,

        // Pagination state
        currentPage,
        setCurrentPage,
        totalPages,
        setTotalPages,
        totalElements,
        setTotalElements,
        pageSize,
        setPageSize,

        // Form state
        showCreateForm,
        setShowCreateForm,
        showUpdateForm,
        selectedItemId: selectedCustomerId,

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
        defaultSearchField: 'firstName',
        defaultVisibleColumns: ['firstName', 'lastName', 'email', 'phone'],
        defaultPageSize: 10
    });

    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const toggleColumn = createColumnToggleHandler(visibleColumns, setVisibleColumns, AVAILABLE_COLUMNS);

    const loadCustomers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const searchParams = {};
            if (searchTerm && searchField === 'firstName') searchParams.firstName = searchTerm;
            if (searchTerm && searchField === 'lastName') searchParams.lastName = searchTerm;
            if (searchTerm && searchField === 'email') searchParams.email = searchTerm;

            const response = await customerApi.getCustomers(currentPage, pageSize, searchParams.firstName, searchParams.lastName, searchParams.email);
            setCustomers(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading customers:', error);

            if (error instanceof ApiError) {
                setError({
                    message: error.message,
                    status: error.status,
                    timestamp: error.timestamp
                });
            } else {
                setError({
                    message: 'Failed to load categories',
                    status: 500,
                    timestamp: new Date().toISOString()
                });
            }

            setCustomers([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, searchField, setLoading, setCustomers, setTotalPages, setTotalElements]);

    useEffect(() => {
        loadCustomers();
    }, [loadCustomers]);

    const handleDeleteCustomer = async (id) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await customerApi.deleteCustomer(id);
                loadCustomers();
            } catch (error) {
                console.error('Error deleting customer:', error);

                if (error instanceof ApiError) {
                    setDeleteError({
                        message: `Failed to delete category: ${error.message}`,
                        status: error.status,
                        timestamp: error.timestamp
                    });
                } else {
                    setDeleteError({
                        message: 'Failed to delete category',
                        status: 500,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }
    };

    const handleUpdateCustomer = (customerId) => {
        handleUpdate(customerId)
    };

    const handleCreateSuccess = () => {
        onCreateSuccess()
        loadCustomers();
    };

    const handleUpdateSuccess = () => {
        onUpdateSuccess();
        loadCustomers();
    };

    const handleRetryLoad = () => {
        setError(null);
        loadCustomers();
    };

    if (showCreateForm) {
        return (
            <CreateCustomerForm
                onSuccess={handleCreateSuccess}
                onCancel={handleCancelCreate}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateCustomerForm
                customerId={selectedCustomerId}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancelUpdate}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
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
                            <div className="relative">
                                <Search
                                    className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                                <input
                                    type="text"
                                    placeholder="Search customers..."
                                    value={searchTerm}
                                    onChange={(e) => {
                                        handleSearch(e);
                                        if (error) setError(null);
                                    }}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loading}
                                />
                            </div>
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

                    {deleteError && (
                        <div className="mb-4">
                            <ErrorDisplay
                                error={deleteError}
                                onDismiss={() => setDeleteError(null)}
                            />
                        </div>
                    )}
                </div>

                <CustomersTable
                    customers={customers}
                    loading={loading}
                    visibleColumns={visibleColumns}
                    availableColumns={AVAILABLE_COLUMNS}
                    onDeleteCustomer={handleDeleteCustomer}
                    onUpdateCustomer={handleUpdateCustomer}
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

export default Customers;