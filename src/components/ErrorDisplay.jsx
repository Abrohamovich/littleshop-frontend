import React from 'react';

const ErrorDisplay = ({error, onDismiss}) => {
    if (!error) return null;

    const getErrorSeverity = (status) => {
        if (status >= 400 && status < 500) return 'warning';
        if (status >= 500) return 'error';
        return 'info';
    };

    const getErrorStyles = (severity) => {
        switch (severity) {
            case 'error':
                return 'bg-red-50 border-red-200 text-red-800';
            case 'warning':
                return 'bg-yellow-50 border-yellow-200 text-yellow-800';
            default:
                return 'bg-blue-50 border-blue-200 text-blue-800';
        }
    };

    const getIconColor = (severity) => {
        switch (severity) {
            case 'error':
                return 'text-red-400';
            case 'warning':
                return 'text-yellow-400';
            default:
                return 'text-blue-400';
        }
    };

    const severity = getErrorSeverity(error.status);

    return (
        <div className={`mb-4 p-4 rounded-md border ${getErrorStyles(severity)}`}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {severity === 'error' ? (
                        <svg className={`h-5 w-5 ${getIconColor(severity)}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                  clipRule="evenodd"/>
                        </svg>
                    ) : (
                        <svg className={`h-5 w-5 ${getIconColor(severity)}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"/>
                        </svg>
                    )}
                </div>
                <div className="ml-3 flex-1">
                    <div className="flex items-start justify-between">
                        <div>
                            <h3 className="text-sm font-medium">
                                Error {error.status}
                            </h3>
                            <div className="mt-1 text-sm">
                                {error.message}
                            </div>
                            {error.timestamp && (
                                <div className="mt-1 text-xs opacity-75">
                                    {new Date(error.timestamp).toLocaleString()}
                                </div>
                            )}
                        </div>
                        {onDismiss && (
                            <button
                                onClick={onDismiss}
                                className={`ml-3 flex-shrink-0 ${getIconColor(severity)} hover:opacity-75`}
                            >
                                <span className="sr-only">Dismiss</span>
                                <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd"
                                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                          clipRule="evenodd"/>
                                </svg>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ErrorDisplay;