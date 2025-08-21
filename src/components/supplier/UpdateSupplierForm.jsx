import React, { useState, useEffect } from 'react';
import { supplierApi } from '../../services/supplierApi.js';

const UpdateSupplierForm = ({ supplierId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        description: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    useEffect(() => {
        const loadSupplier = async () => {
            if (!supplierId) {
                console.error('No supplier ID provided');
                onCancel();
                return;
            }

            setInitialLoading(true);
            try {
                const supplier = await supplierApi.getSupplierById(supplierId);
                setFormData({
                    name: supplier.name || '',
                    email: supplier.email || '',
                    phone: supplier.phone || '',
                    address: supplier.address || '',
                    description: supplier.description || '',
                });
            } catch (error) {
                console.error('Error loading supplier:', error);
                // Handle error - maybe show a message or go back
                onCancel();
            } finally {
                setInitialLoading(false);
            }
        };

        loadSupplier();
    }, [supplierId, onCancel]);

    const handleUpdateSupplier = async (continueCreating = false, goBack = false) => {
        setLoading(true);
        try {
            await supplierApi.updateSupplier(supplierId, formData);

            if (goBack || !continueCreating) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error updating supplier:', error);
        } finally {
            setLoading(false);
        }
    };

    if (initialLoading) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading supplier...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Update Supplier</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Categories</span>
                    <span className="mx-2">&#62;</span>
                    <span>Update</span>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter supplier name"
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
                            placeholder="Enter supplier email"
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
                            placeholder="Enter supplier phone"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Address<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter supplier address"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            rows={4}
                            placeholder="Enter supplier description"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => handleUpdateSupplier(false, true)}
                        disabled={!formData.name.trim() || !formData.email.trim() || !formData.phone.trim() || loading}
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

export default UpdateSupplierForm;