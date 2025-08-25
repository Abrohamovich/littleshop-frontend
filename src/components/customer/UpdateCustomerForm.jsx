import React, {useEffect, useState} from 'react';
import {customerApi} from '../../services/customerApi.js';
import ApiError from '../../utils/errorUtil.js';
import {sanitizeFormData} from '../../utils/sanitizeUtil.js';
import ErrorDisplay from '../../components/ErrorDisplay.jsx';

const UpdateCustomerForm = ({customerId, onSuccess, onCancel}) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCustomer = async () => {
            if (!customerId) {
                console.error('No customer ID provided');
                setError({
                    message: 'No customer ID provided',
                    status: 400,
                    timestamp: new Date().toISOString()
                });
                return;
            }

            setInitialLoading(true)
            setError(null);

            try {
                const customer = await customerApi.getCustomerById(customerId);
                setFormData({
                    firstName: customer.firstName || '',
                    lastName: customer.lastName || '',
                    email: customer.email || '',
                    phone: customer.phone || '',
                    address: customer.address || '',
                });
            } catch (error) {
                console.error('Error loading customer:', error);

                if (error instanceof ApiError) {
                    setError({
                        message: error.message,
                        status: error.status,
                        timestamp: error.timestamp
                    });
                } else {
                    setError({
                        message: 'Failed to load customer',
                        status: 500,
                        timestamp: new Date().toISOString()
                    });
                }
            } finally {
                setInitialLoading(false);
            }
        };

        loadCustomer();
    }, [customerId]);

    const handleUpdateCustomer = async (continueCreating = false, goBack = false) => {

        setLoading(true);
        setError(null);

        try {
            const sanitizedData = sanitizeFormData(formData);
            await customerApi.updateCustomer(customerId, sanitizedData);

            if (goBack || !continueCreating) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error updating customer:', error);

            if (error instanceof ApiError) {
                setError({
                    message: error.message,
                    status: error.status,
                    timestamp: error.timestamp
                });
            } else {
                setError({
                    message: 'An unexpected error occurred while updating the customer',
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
                    <h1 className="text-2xl font-bold text-gray-900">Update Customer</h1>
                    <nav className="flex mt-2 text-sm text-gray-600">
                        <span>Customers</span>
                        <span className="mx-2">&#62;</span>
                        <span>Update</span>
                    </nav>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                        <p className="mt-2 text-gray-500">Loading customer...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !loading && (error.status === 404 || error.status >= 500)) {
        return (
            <div className="p-8">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-900">Update Customer</h1>
                    <nav className="flex mt-2 text-sm text-gray-600">
                        <span>Customers</span>
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
                <h1 className="text-2xl font-bold text-gray-900">Update Customer</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Customers</span>
                    <span className="mx-2">&#62;</span>
                    <span>Update</span>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <ErrorDisplay error={error} onDismiss={() => setError(null)}/>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => {
                                setFormData({...formData, firstName: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter customer first name"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Last Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) => {
                                setFormData({...formData, lastName: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter customer last name"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => {
                                setFormData({...formData, email: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter customer email"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Phone<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) => {
                                setFormData({...formData, phone: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter customer phone"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address
                        </label>
                        <textarea
                            value={formData.address}
                            onChange={(e) => {
                                setFormData({...formData, address: e.target.value});
                                if (error) setError(null);
                            }}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Enter customer address"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => handleUpdateCustomer(false, true)}
                        disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || loading}
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

export default UpdateCustomerForm;