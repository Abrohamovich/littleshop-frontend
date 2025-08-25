import React, {useEffect, useRef} from 'react';
import {ChevronDown, Eye} from 'lucide-react';

const ColumnSelector = ({
                            availableColumns,
                            visibleColumns,
                            onToggleColumn,
                            showSelector,
                            setShowSelector
                        }) => {
    const selectorRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (selectorRef.current && !selectorRef.current.contains(event.target)) {
                setShowSelector(false);
            }
        };

        if (showSelector) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showSelector, setShowSelector]);

    return (
        <div className="relative" ref={selectorRef}>
            <button
                onClick={() => setShowSelector(!showSelector)}
                className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
                <Eye className="w-4 h-4"/>
                <span>Columns</span>
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showSelector ? 'rotate-180' : ''}`}/>
            </button>
            {showSelector && (
                <div
                    className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                    <div className="p-2 border-b border-gray-200">
                        <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Show Columns
                        </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                        {availableColumns.map((column) => (
                            <label
                                key={column.key}
                                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={visibleColumns.includes(column.key)}
                                    onChange={() => onToggleColumn(column.key)}
                                    className="mr-2 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                                />
                                <span className="text-sm text-gray-700">{column.label}</span>
                                <span className="ml-auto text-xs text-gray-400">
                                    {column.type}
                                </span>
                            </label>
                        ))}
                    </div>
                    <div className="p-2 border-t border-gray-200">
                        <div className="flex justify-between">
                            <button
                                onClick={() => {
                                    availableColumns.forEach(col => {
                                        if (!visibleColumns.includes(col.key)) {
                                            onToggleColumn(col.key);
                                        }
                                    });
                                }}
                                className="text-xs text-blue-600 hover:text-blue-800"
                            >
                                Select All
                            </button>
                            <button
                                onClick={() => {
                                    visibleColumns.forEach(colKey => {
                                        onToggleColumn(colKey);
                                    });
                                }}
                                className="text-xs text-red-600 hover:text-red-800"
                            >
                                Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ColumnSelector;