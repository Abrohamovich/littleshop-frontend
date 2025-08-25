import React, {useEffect, useState} from 'react';
import {categoryApi} from '../../services/categoryApi.js';
import ApiError from '../../utils/errorUtil.js';
import {sanitizeFormData} from '../../utils/sanitizeUtil.js';
import ErrorDisplay from '../../components/ErrorDisplay.jsx';

const UpdateCategoryForm = ({categoryId, onSuccess, onCancel}) => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCategory = async () => {
            if (!categoryId) {
                console.error('No category ID provided');
                setError({
                    message: 'No category ID provided',
                    status: 400,
                    timestamp: new Date().toISOString()
                });
                return;
            }

            setInitialLoading(true);
            setError(null);

            try {
                const category = await categoryApi.getCategoryById(categoryId);
                setFormData({
                    name: category.name || '',
                    description: category.description || ''
                });
            } catch (error) {
                console.error('Error loading category:', error);

                if (error instanceof ApiError) {
                    setError({
                        message: error.message,
                        status: error.status,
                        timestamp: error.timestamp
                    });
                } else {
                    setError({
                        message: 'Failed to load category',
                        status: 500,
                        timestamp: new Date().toISOString()
                    });
                }
            } finally {
                setInitialLoading(false);
            }
        };

        loadCategory();
    }, [categoryId]);

    const handleUpdateCategory = async (continueCreating = false, goBack = false) => {
        setLoading(true);
        setError(null);

        try {
            const sanitizedData = sanitizeFormData(formData);
            await categoryApi.updateCategory(categoryId, sanitizedData);

            if (goBack || !continueCreating) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error updating category:', error);

            if (error instanceof ApiError) {
                setError({
                    message: error.message,
                    status: error.status,
                    timestamp: error.timestamp
                });
            } else {
                setError({
                    message: 'An unexpected error occurred while updating the category',
                    status: 500,
                    timestamp: new Date().toISOString()
                });
            }
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Update Category</h1>
                    <nav className="flex mt-2 text-sm text-gray-600">
                        <span>Categories</span>
                        <span className="mx-2">&#62;</span>
                        <span>Update</span>
                    </nav>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading category...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !loading && (error.status === 404 || error.status >= 500)) {
        return (
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Update Category</h1>
                    <nav className="flex mt-2 text-sm text-gray-600">
                        <span>Categories</span>
                        <span className="mx-2">&#62;</span>
                        <span>Update</span>
                    </nav>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <ErrorDisplay error={error} onDismiss={() => setError(null)}/>

                    <div className="flex space-x-4 mt-6">
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                        >
                            Retry
                        </button>
                        <button
                            onClick={onCancel}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Update Category</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Categories</span>
                    <span className="mx-2">&#62;</span>
                    <span>Update</span>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ErrorDisplay error={error} onDismiss={() => setError(null)}/>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => {
                                setFormData({...formData, name: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter category name"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => {
                                setFormData({...formData, description: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Enter category description"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => handleUpdateCategory(false, true)}
                        disabled={!formData.name.trim() || loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Updating...' : 'Update and Go Back'}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={loading}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateCategoryForm;