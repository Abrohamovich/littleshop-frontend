import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, MoreVertical, Eye, ChevronDown } from 'lucide-react';
import { supplierApi } from '../../services/supplierApi.js';
import SuppliersTable from './SuppliersTable.jsx';
import CreateSupplierForm from './CreateSupplierForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateSupplierForm from "./UpdateSupplierForm.jsx";

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
    const [suppliers, setSuppliers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField] = useState('name');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedSupplierId, setSelectedSupplierId] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(['name', 'email', 'phone']);
    const [showColumnSelector, setShowColumnSelector] = useState(false);

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
    }, [currentPage, pageSize, searchTerm, searchField]);

    useEffect(() => {
        loadSuppliers();
    }, [loadSuppliers]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

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
        setSelectedSupplierId(supplierId);
        setShowUpdateForm(true);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateForm(false);
        setSelectedSupplierId(null);
        loadSuppliers();
    };

    const toggleColumn = (columnKey) => {
        if (visibleColumns.includes(columnKey)) {
            if (visibleColumns.length > 1) {
                setVisibleColumns(visibleColumns.filter(col => col !== columnKey));
            }
        } else {
            const newColumns = AVAILABLE_COLUMNS
                .filter(col => visibleColumns.includes(col.key) || col.key === columnKey)
                .map(col => col.key);
            setVisibleColumns(newColumns);
        }
    };

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
        loadSuppliers();
    };

    if (showCreateForm) {
        return (
            <CreateSupplierForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateSupplierForm
                supplierId={selectedSupplierId}
                onSuccess={handleUpdateSuccess}
                onCancel={() => {
                    setShowUpdateForm(false);
                    setSelectedSupplierId(null);
                }}
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