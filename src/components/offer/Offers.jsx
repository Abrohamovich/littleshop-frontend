import React, {useCallback, useEffect, useState} from 'react';
import {Plus, Search} from 'lucide-react';
import {offerApi} from '../../services/offerApi.js';
import ApiError from '../../utils/errorUtil.js';
import OffersTable from './OffersTable.jsx';
import CreateOfferForm from './CreateOfferForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateOfferForm from "./UpdateOfferForm.jsx";
import ErrorDisplay from '../../components/ErrorDisplay.jsx';
import {createColumnToggleHandler} from '../../utils/columnUtils.js';
import {useTableManagement} from "../../hooks/useTableManagement.js";

const AVAILABLE_COLUMNS = [
    {key: 'id', label: 'ID', type: 'number'},
    {key: 'name', label: 'Name', type: 'text'},
    {key: 'price', label: 'Price', type: 'number'},
    {key: 'type', label: 'Type', type: 'text'},
    {key: 'category', label: 'Category', type: 'text'},
    {key: 'supplier', label: 'Supplier', type: 'text'},
    {key: 'description', label: 'Description', type: 'text'},
    {key: 'createdAt', label: 'Created At', type: 'date'},
    {key: 'updatedAt', label: 'Updated At', type: 'date'}
];

const Offers = () => {
    const {
        // Data state
        items: offers,
        setItems: setOffers,
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
        selectedItemId: selectedOfferId,

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
        defaultVisibleColumns: ['name', 'price', 'type', 'category', 'supplier'],
        defaultPageSize: 10
    });

    const [error, setError] = useState(null);
    const [deleteError, setDeleteError] = useState(null);

    const toggleColumn = createColumnToggleHandler(visibleColumns, setVisibleColumns, AVAILABLE_COLUMNS);

    const loadOffers = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const searchParams = {};
            if (searchTerm && searchField === 'name') searchParams.name = searchTerm;

            const response = await offerApi.getOffers(currentPage, pageSize, searchParams.name);
            setOffers(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading offers:', error);

            if (error instanceof ApiError) {
                setError({
                    message: error.message,
                    status: error.status,
                    timestamp: error.timestamp
                });
            } else {
                setError({
                    message: 'Failed to load offers',
                    status: 500,
                    timestamp: new Date().toISOString()
                });
            }

            setOffers([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, searchField, setLoading, setOffers, setTotalPages, setTotalElements]);

    useEffect(() => {
        loadOffers();
    }, [loadOffers]);

    const handleDeleteOffer = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await offerApi.deleteOffer(id);
                loadOffers();
            } catch (error) {
                console.error('Error deleting offer:', error);

                if (error instanceof ApiError) {
                    setDeleteError({
                        message: `Failed to delete offer: ${error.message}`,
                        status: error.status,
                        timestamp: error.timestamp
                    });
                } else {
                    setDeleteError({
                        message: 'Failed to delete offer',
                        status: 500,
                        timestamp: new Date().toISOString()
                    });
                }
            }
        }
    };

    const handleUpdateOffer = (offerId) => {
        handleUpdate(offerId)
    };

    const handleCreateSuccess = () => {
        onCreateSuccess();
        loadOffers();
    };

    const handleUpdateSuccess = () => {
        onUpdateSuccess();
        loadOffers();
    };

    const handleRetryLoad = () => {
        setError(null);
        loadOffers();
    };

    if (showCreateForm) {
        return (
            <CreateOfferForm
                onSuccess={handleCreateSuccess}
                onCancel={handleCancelCreate}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateOfferForm
                offerId={selectedOfferId}
                onSuccess={handleUpdateSuccess}
                onCancel={handleCancelUpdate}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
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
                                    placeholder="Search offers..."
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

                <OffersTable
                    offers={offers}
                    loading={loading}
                    visibleColumns={visibleColumns}
                    availableColumns={AVAILABLE_COLUMNS}
                    onDeleteOffer={handleDeleteOffer}
                    onUpdateOffer={handleUpdateOffer}
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

export default Offers;