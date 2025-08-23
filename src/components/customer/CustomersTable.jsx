import React from 'react';
import DataTable from "../DataTable.jsx";

const CustomersTable = ({
                             customers,
                             loading,
                             visibleColumns,
                             availableColumns,
                             onDeleteCustomer,
                             onUpdateCustomer,
                             currentPage,
                             setCurrentPage,
                             pageSize,
                             setPageSize,
                             totalPages,
                             totalElements
                         }) => {
    return (
        <DataTable
            data={customers}
            loading={loading}
            visibleColumns={visibleColumns}
            availableColumns={availableColumns}
            onDelete={onDeleteCustomer}
            onUpdate={onUpdateCustomer}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            entityName="customers"
        />
    )
};

export default CustomersTable;