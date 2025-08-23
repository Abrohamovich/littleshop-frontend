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
                             totalElements
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
        />
    )
};

export default CategoriesTable;