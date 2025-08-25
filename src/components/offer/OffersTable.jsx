import React from 'react';
import { formatDate } from '../../utils/dateUtil.js';
import DataTable from '../DataTable.jsx'

const OffersTable = ({
                         offers,
                         loading,
                         visibleColumns,
                         availableColumns,
                         onDeleteOffer,
                         onUpdateOffer,
                         currentPage,
                         setCurrentPage,
                         pageSize,
                         setPageSize,
                         totalPages,
                         totalElements,
                         error,
                         onRetry
                     }) => {
    const formatOfferValue = (offer, columnKey) => {
        switch (columnKey) {
            case 'createdAt':
            case 'updatedAt':
                return formatDate(offer[columnKey]);
            case 'price':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD'
                }).format(offer[columnKey]);
            case 'category':
                return offer.category?.name || '-';
            case 'supplier':
                return offer.supplier?.name || '-';
            case 'type':
                return offer[columnKey] === 'PRODUCT' ? 'Product' : 'Service';
            default:
                return offer[columnKey] || '-';
        }
    };

    return (
        <DataTable
            data={offers}
            loading={loading}
            visibleColumns={visibleColumns}
            availableColumns={availableColumns}
            onDelete={onDeleteOffer}
            onUpdate={onUpdateOffer}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            pageSize={pageSize}
            setPageSize={setPageSize}
            totalPages={totalPages}
            totalElements={totalElements}
            entityName="offers"
            customFormatter={formatOfferValue}
            error={error}
            onRetry={onRetry}
        />
    );
};

export default OffersTable;