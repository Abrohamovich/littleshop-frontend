import {useState} from 'react';

export const useTableManagement = ({
                                       defaultSearchField = 'name',
                                       defaultVisibleColumns = [],
                                       defaultPageSize = 10
                                   } = {}) => {
    // Data state
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search state
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField] = useState(defaultSearchField);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(defaultPageSize);

    // Form state
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);

    // Column visibility state
    const [visibleColumns, setVisibleColumns] = useState(defaultVisibleColumns);
    const [showColumnSelector, setShowColumnSelector] = useState(false);

    // Handlers
    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    const handleCreateSuccess = () => {
        setShowCreateForm(false);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateForm(false);
        setSelectedItemId(null);
    };

    const handleUpdate = (itemId) => {
        setSelectedItemId(itemId);
        setShowUpdateForm(true);
    };

    const handleCancelCreate = () => {
        setShowCreateForm(false);
    };

    const handleCancelUpdate = () => {
        setShowUpdateForm(false);
        setSelectedItemId(null);
    };

    const resetToFirstPage = () => {
        setCurrentPage(0);
    };

    return {
        // Data state
        items,
        setItems,
        loading,
        setLoading,

        // Search state
        searchTerm,
        setSearchTerm,
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
        resetToFirstPage,

        // Form state
        showCreateForm,
        setShowCreateForm,
        showUpdateForm,
        setShowUpdateForm,
        selectedItemId,
        setSelectedItemId,

        // Column visibility state
        visibleColumns,
        setVisibleColumns,
        showColumnSelector,
        setShowColumnSelector,

        // Handlers
        handleCreateSuccess,
        handleUpdateSuccess,
        handleUpdate,
        handleCancelCreate,
        handleCancelUpdate
    };
};