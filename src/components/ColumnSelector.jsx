import React from 'react';
import { Eye, ChevronDown } from 'lucide-react';

const ColumnSelector = ({
                            availableColumns,
                            visibleColumns,
                            onToggleColumn,
                            showSelector,
                            setShowSelector
                        }) => {
    return (
        <div className="relative">
            <button
                onClick={() => setShowSelector(!showSelector)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
                <Eye className="w-4 h-4" />
                <span>Columns</span>
                <ChevronDown className="w-4 h-4" />
            </button>
            {showSelector && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                    {availableColumns.map((column) => (
                        <label
                            key={column.key}
                            className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={visibleColumns.includes(column.key)}
                                onChange={() => onToggleColumn(column.key)}
                                className="mr-2"
                            />
                            <span className="text-sm">{column.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;