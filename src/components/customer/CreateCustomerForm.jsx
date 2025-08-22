import React, { useState } from 'react';
import { customerApi } from '../../services/customerApi.js';
import { sanitizeFormData } from '../../utils/sanitizeUtil.js';

const CreateCustomerForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: ''
    });
    const [loading, setLoading] = useState(false);

    const handleCreateCustomer = async (continueCreating = false, goBack = false) => {
        setLoading(true);
        try {
            const sanitizedData = sanitizeFormData(formData);
            await customerApi.createCustomer(sanitizedData);

            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                address: ''
            });

            if (goBack || !continueCreating) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating customer:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create Customer</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Categories</span>
                    <span className="mx-2">&#62;</span>
                    <span>Create</span>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            First Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Enter customer address"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => handleCreateCustomer(true, false)}
                        disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Create and Continue Creating
                    </button>
                    <button
                        onClick={() => handleCreateCustomer(false, true)}
                        disabled={!formData.firstName.trim() || !formData.lastName.trim() || !formData.email.trim() || !formData.phone.trim() || loading}
                        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Create and Go Back
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

export default CreateCustomerForm;