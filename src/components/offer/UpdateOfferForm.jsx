import React, { useState, useEffect } from 'react';
import { offerApi } from '../../services/offerApi.js';
import { categoryApi } from '../../services/categoryApi.js';
import { supplierApi } from '../../services/supplierApi.js';

const UpdateOfferForm = ({ offerId, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        type: 'PRODUCT',
        description: '',
        categoryId: '',
        supplierId: '',
    });
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            if (!offerId) {
                console.error('No offer ID provided');
                onCancel();
                return;
            }

            setInitialLoading(true);
            try {
                const [offer, categoriesResponse, suppliersResponse] = await Promise.all([
                    offerApi.getOfferById(offerId),
                    categoryApi.getCategories(0, 1000),
                    supplierApi.getSuppliers(0, 1000)
                ]);

                setFormData({
                    name: offer.name || '',
                    price: offer.price || '',
                    type: offer.type || 'PRODUCT',
                    description: offer.description || '',
                    categoryId: offer.category?.id || '',
                    supplierId: offer.supplier?.id || '',
                });

                setCategories(Array.isArray(categoriesResponse.content) ? categoriesResponse.content : []);
                setSuppliers(Array.isArray(suppliersResponse.content) ? suppliersResponse.content : []);
            } catch (error) {
                console.error('Error loading data:', error);
                onCancel();
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, [offerId, onCancel]);

    const sanitizeFormData = (data) => {
        const sanitized = {};
        Object.keys(data).forEach(key => {
            const value = data[key];
            if (key === 'price') {
                sanitized[key] = parseFloat(value) || 0;
            } else if (key === 'categoryId' || key === 'supplierId') {
                sanitized[key] = value ? parseInt(value) : null;
            } else {
                sanitized[key] = (typeof value === 'string' && value.trim() === '') ? null : value;
            }
        });
        return sanitized;
    };

    const handleUpdateOffer = async (continueCreating = false, goBack = false) => {
        setLoading(true);
        try {
            const sanitizedData = sanitizeFormData(formData);
            await offerApi.updateOffer(offerId, sanitizedData);

            if (goBack || !continueCreating) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error updating offer:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.name.trim() &&
            formData.price &&
            parseFloat(formData.price) > 0 &&
            formData.categoryId &&
            formData.supplierId;
    };

    if (initialLoading) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading offer...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Update Offer</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Offers</span>
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
                            placeholder="Enter offer name"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter price"
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Type<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="PRODUCT">Product</option>
                            <option value="SERVICE">Service</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Supplier<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.supplierId}
                            onChange={(e) => setFormData({ ...formData, supplierId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select a supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
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
                            placeholder="Enter offer description"
                            disabled={loading}
                        />
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => handleUpdateOffer(false, true)}
                        disabled={!isFormValid() || loading}
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

export default UpdateOfferForm;