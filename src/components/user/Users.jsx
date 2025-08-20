import React, { useState, useEffect, useCallback } from 'react';
import { Search, Plus, MoreVertical, Eye, ChevronDown } from 'lucide-react';
import { userApi } from '../../services/userApi.js';
import UsersTable from './UsersTable.jsx';
import CreateUserForm from './CreateUserForm.jsx';
import ColumnSelector from '../ColumnSelector.jsx';
import UpdateUserForm from "./UpdateUserForm.jsx";

const AVAILABLE_COLUMNS = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'firstName', label: 'First Name', type: 'text' },
    { key: 'lastName', label: 'Last Name', type: 'text' },
    { key: 'email', label: 'Email', type: 'text' },
    { key: 'role', label: 'Role', type: 'text' },
    { key: 'phone', label: 'Phone', type: 'text' },
    { key: 'createdAt', label: 'Created At', type: 'date' },
    { key: 'updatedAt', label: 'Updated At', type: 'date' }
];

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchField] = useState('firstName');
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [pageSize, setPageSize] = useState(10);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [showUpdateForm, setShowUpdateForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [visibleColumns, setVisibleColumns] = useState(['firstName', 'lastName', 'email', 'role']);
    const [showColumnSelector, setShowColumnSelector] = useState(false);

    const loadUsers = useCallback(async () => {
        setLoading(true);
        try {
            const searchParams = {};
            if (searchTerm && searchField === 'firstName') searchParams.firstName = searchTerm;
            if (searchTerm && searchField === 'lastName') searchParams.lastName = searchTerm;
            if (searchTerm && searchField === 'email') searchParams.email = searchTerm;

            const response = await userApi.getUsers(currentPage, pageSize, searchParams.firstName, searchParams.lastName, searchParams.email);
            setUsers(Array.isArray(response.content) ? response.content : []);
            setTotalPages(response.totalPages || 0);
            setTotalElements(response.totalElements || 0);
        } catch (error) {
            console.error('Error loading users:', error);
            setUsers([]);
        } finally {
            setLoading(false);
        }
    }, [currentPage, pageSize, searchTerm, searchField]);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(0);
    };

    const handleDeleteUser = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await userApi.deleteUser(id);
                loadUsers();
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    const handleUpdateUser = (userId) => {
        setSelectedUserId(userId);
        setShowUpdateForm(true);
    };

    const handleUpdateSuccess = () => {
        setShowUpdateForm(false);
        setSelectedUserId(null);
        loadUsers();
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
        loadUsers();
    };

    if (showCreateForm) {
        return (
            <CreateUserForm
                onSuccess={handleCreateSuccess}
                onCancel={() => setShowCreateForm(false)}
            />
        );
    }

    if (showUpdateForm) {
        return (
            <UpdateUserForm
                userId={selectedUserId}
                onSuccess={handleUpdateSuccess}
                onCancel={() => {
                    setShowUpdateForm(false);
                    setSelectedUserId(null);
                }}
            />
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6 border-b border-gray-200">
                    <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center space-x-4">
                            <div className="relative">
                                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search users..."
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

                <UsersTable
                    users={users}
                    loading={loading}
                    visibleColumns={visibleColumns}
                    availableColumns={AVAILABLE_COLUMNS}
                    onDeleteUser={handleDeleteUser}
                    onUpdateUser={handleUpdateUser}
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

export default Users;