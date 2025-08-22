import React, { useEffect, useCallback } from 'react';
import { Search, Plus } from 'lucide-react';
import { supplierApi } from '../../services/supplierApi.js';
import SuppliersTable from './SuppliersTable.jsx';
import CreateSupplierForm from './CreateSupplierForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateSupplierForm from "./UpdateSupplierForm.jsx";
import { createColumnToggleHandler } from '../../utils/columnUtils.js';
import { useTableManagement } from '../../hooks/useTableManagement.js';

const AVAILABLE_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'address', label: 'Address', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'createdAt', label: 'Created At', type: 'date' },
    { key: 'updatedAt', label: 'Updated At', type: 'date' }
];

const Suppliers = () => {
    const {
        // Data state
        items: suppliers,
        setItems: setSuppliers,
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
        selectedItemId: selectedSupplierId,

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
        defaultSearchField: 'name',
        defaultVisibleColumns: ['name', 'email', 'phone'],
        defaultPageSize: 10
    });

    const toggleColumn = createColumnToggleHandler(visibleColumns, setVisibleColumns, AVAILABLE_COLUMNS);

    const loadSuppliers = useCallback(async () => {
        setLoading(true);
        try {
            const searchParams = {};
            if (searchTerm && searchField === 'name') searchParams.name = searchTerm;
            if (searchTerm && searchField === 'email') searchParams.email = searchTerm;
            if (searchTerm && searchField === 'phone') searchParams.phone = searchTerm;

            const response = await supplierApi.getSuppliers(currentPage, pageSize, searchParams.name, searchParams.email, searchParams.phone);
            setSuppliers(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading suppliers:', error);
            setSuppliers([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, searchField, setLoading, setSuppliers, setTotalPages, setTotalElements]);

    useEffect(() => {
        loadSuppliers();
    }, [loadSuppliers]);

    const handleDeleteSupplier = async (id) => {
        if (window.confirm('Are you sure you want to delete this supplier?')) {
            try {
                await supplierApi.deleteSupplier(id);
                loadSuppliers();
            } catch (error) {
                console.error('Error deleting supplier:', error);
            }
        }
    };

    const handleUpdateSupplier = (supplierId) => {
        handleUpdate(supplierId);
    };

    const handleCreateSuccess = () => {
        onCreateSuccess();
        loadSuppliers();
    };

    const handleUpdateSuccess = () => {
        onUpdateSuccess();
        loadSuppliers();
    };

    if (showCreateForm) {
        return (
            <CreateSupplierForm
                onSuccess={handleCreateSuccess}
                onCancel={handleCancelCreate}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateSupplierForm
                supplierId={selectedSupplierId}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancelUpdate}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search suppliers..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                        >
                            <Plus className="w-4 h-4" />
                            <span>Create</span>
                        </button>
                    </div>
                </div>

                <SuppliersTable
                    suppliers={suppliers}
                    loading={loading}
                    visibleColumns={visibleColumns}
                    availableColumns={AVAILABLE_COLUMNS}
                    onDeleteSupplier={handleDeleteSupplier}
                    onUpdateSupplier={handleUpdateSupplier}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    totalPages={totalPages}
                    totalElements={totalElements}
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

export default Suppliers;