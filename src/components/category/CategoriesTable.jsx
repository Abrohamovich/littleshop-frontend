import React from 'react';
import DataTable from '../DataTable.jsx';

const CategoriesTable = ({
                             categories,
                             loading,
                             visibleColumns,
                             availableColumns,
                             onDeleteCategory,
                             onUpdateCategory,
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
            data={categories}
            loading={loading}
            visibleColumns={visibleColumns}
            availableColumns={availableColumns}
            onDelete={onDeleteCategory}
            onUpdate={onUpdateCategory}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            entityName="categories"
            error={error}
            onRetry={onRetry}
        />
    )
};

export default CategoriesTable;