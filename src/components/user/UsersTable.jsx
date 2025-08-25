import React from 'react';
import DataTable from "../DataTable.jsx";

const UsersTable = ({
                             users,
                             loading,
                             visibleColumns,
                             availableColumns,
                             onDeleteUser,
                             onUpdateUser,
                             currentPage,
                             setCurrentPage,
                             pageSize,
                             setPageSize,
                             totalPages,
                             totalElements,
                             error,
                             onRetry
                         }) => {
    return (
        <DataTable
            data={users}
            loading={loading}
            visibleColumns={visibleColumns}
            availableColumns={availableColumns}
            onDelete={onDeleteUser}
            onUpdate={onUpdateUser}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            entityName="users"
            error={error}
            onRetry={onRetry}
        />
    )
};

export default UsersTable;