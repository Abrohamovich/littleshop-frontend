import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, MoreVertical, Eye, ChevronDown } from 'lucide-react';
import { offerApi } from '../../services/offerApi.js';
import OffersTable from './OffersTable.jsx';
import CreateOfferForm from './CreateOfferForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateOfferForm from "./UpdateOfferForm.jsx";

const AVAILABLE_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name', type: 'text' },
    { key: 'price', label: 'Price', type: 'number' },
    { key: 'type', label: 'Type', type: 'text' },
    { key: 'category', label: 'Category', type: 'text' },
    { key: 'supplier', label: 'Supplier', type: 'text' },
    { key: 'description', label: 'Description', type: 'text' },
    { key: 'createdAt', label: 'Created At', type: 'date' },
    { key: 'updatedAt', label: 'Updated At', type: 'date' }
];

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField] = useState('name');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedOfferId, setSelectedOfferId] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(['name', 'price', 'type', 'category', 'supplier']);
    const [showColumnSelector, setShowColumnSelector] = useState(false);

    const loadOffers = useCallback(async () => {
        setLoading(true);
        try {
            const searchParams = {};
            if (searchTerm && searchField === 'name') searchParams.name = searchTerm;

            const response = await offerApi.getOffers(currentPage, pageSize, searchParams.name);
            setOffers(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading offers:', error);
            setOffers([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, searchField]);

    useEffect(() => {
        loadOffers();
    }, [loadOffers]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    const handleDeleteOffer = async (id) => {
        if (window.confirm('Are you sure you want to delete this offer?')) {
            try {
                await offerApi.deleteOffer(id);
                loadOffers();
            } catch (error) {
                console.error('Error deleting offer:', error);
            }
        }
    };

    const handleUpdateOffer = (offerId) => {
        setSelectedOfferId(offerId);
        setShowUpdateForm(true);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateForm(false);
        setSelectedOfferId(null);
        loadOffers();
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
        loadOffers();
    };

    if (showCreateForm) {
        return (
            <CreateOfferForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateOfferForm
                offerId={selectedOfferId}
                onSuccess={handleUpdateSuccess}
                onCancel={() => {
                    setShowUpdateForm(false);
                    setSelectedOfferId(null);
                }}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Offers</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search offers..."
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