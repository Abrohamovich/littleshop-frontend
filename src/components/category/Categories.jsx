import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, MoreVertical, Eye, ChevronDown } from 'lucide-react';
import { categoryApi } from '../../services/categoryApi.js';
import ApiError from '../../utils/errorUtil.js';
import CategoriesTable from './CategoriesTable.jsx';
import CreateCategoryForm from './CreateCategoryForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateCategoryForm from "./UpdateCategoryForm.jsx";
import ErrorDisplay from '../../components/ErrorDisplay.jsx';
import { createColumnToggleHandler } from '../../utils/columnUtils.js';
import {useTableManagement} from "../../hooks/useTableManagement.js";

const AVAILABLE_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'createdAt', label: 'Created At', type: 'date' },
    { key: 'updatedAt', label: 'Updated At', type: 'date' }
];

const Categories = () => {
    const {
        // Data state
        items: categories,
        setItems: setCategories,
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
        selectedItemId: selectedCategoryId,

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
        defaultVisibleColumns: ['name', 'description'],
        defaultPageSize: 10
    });

    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const toggleColumn = createColumnToggleHandler(visibleColumns, setVisibleColumns, AVAILABLE_COLUMNS);

    const loadCategories = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const searchParams = {};
            if (searchTerm && searchField === 'name') searchParams.name = searchTerm;
            if (searchTerm && searchField === 'description') searchParams.description = searchTerm;

            const response = await categoryApi.getCategories(currentPage, pageSize, searchParams.name, searchParams.description);
            setCategories(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading categories:', error);

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

            setCategories([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, searchField, setLoading, setCategories, setTotalPages, setTotalElements]);

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const handleDeleteCategory = async (id) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            setDeleteError(null);

            try {
                await categoryApi.deleteCategory(id);
                loadCategories();
            } catch (error) {
                console.error('Error deleting category:', error);

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

    const handleUpdateCategory = (categoryId) => {
        handleUpdate(categoryId)
    };

    const handleCreateSuccess = () => {
        onCreateSuccess()
        loadCategories();
    };

    const handleUpdateSuccess = () => {
        onUpdateSuccess();
        loadCategories();
    };

    const handleRetryLoad = () => {
        setError(null);
        loadCategories();
    };

    if (showCreateForm) {
        return (
            <CreateCategoryForm
                onSuccess={handleCreateSuccess}
                onCancel={handleCancelCreate}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateCategoryForm
                categoryId={selectedCategoryId}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancelUpdate}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
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
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search categories..."
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
                            <Plus className="w-4 h-4" />
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

                <CategoriesTable
                    categories={categories}
                    loading={loading}
                    visibleColumns={visibleColumns}
                    availableColumns={AVAILABLE_COLUMNS}
                    onDeleteCategory={handleDeleteCategory}
                    onUpdateCategory={handleUpdateCategory}
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

export default Categories;