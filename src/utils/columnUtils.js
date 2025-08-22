export const toggleColumnVisibility = (columnKey, visibleColumns, availableColumns) => {
    if (visibleColumns.includes(columnKey)) {
        if (visibleColumns.length > 1) {
            return visibleColumns.filter(col => col !== columnKey);
        }
        return visibleColumns;
    } else {
        return availableColumns
            .filter(col => visibleColumns.includes(col.key) || col.key === columnKey)
            .map(col => col.key);
    }
};

export const createColumnToggleHandler = (visibleColumns, setVisibleColumns, availableColumns) => {
    return (columnKey) => {
        const newVisibleColumns = toggleColumnVisibility(columnKey, visibleColumns, availableColumns);
        setVisibleColumns(newVisibleColumns);
    };
};