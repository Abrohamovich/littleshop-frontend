import React from 'react';
import DataTable from "../DataTable.jsx";

const SuppliersTable = ({
                             suppliers,
                             loading,
                             visibleColumns,
                             availableColumns,
                             onDeleteSupplier,
                             onUpdateSupplier,
                             currentPage,
                             setCurrentPage,
                             pageSize,
                             setPageSize,
                             totalPages,
                             totalElements
                         }) => {
    return (
        <DataTable
            data={suppliers}
            loading={loading}
            visibleColumns={visibleColumns}
            availableColumns={availableColumns}
            onDelete={onDeleteSupplier}
            onUpdate={onUpdateSupplier}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            entityName="suppliers"
        />
    )
};

export default SuppliersTable;