import React, { useState, useEffect } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { orderApi } from '../../services/orderApi.js';
import { customerApi } from '../../services/customerApi.js';
import { userApi } from '../../services/userApi.js';
import { offerApi } from '../../services/offerApi.js';

const CreateOrderForm = ({ onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        customerId: '',
        userId: '',
        items: [{ offerId: '', quantity: 1 }]
    });
    const [loading, setLoading] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [users, setUsers] = useState([]);
    const [offers, setOffers] = useState([]);
    const [loadingData, setLoadingData] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            try {
                const [customersResponse, usersResponse, offersResponse] = await Promise.all([
                    customerApi.getCustomers(0, 1000),
                    userApi.getUsers(0, 1000),
                    offerApi.getOffers(0, 1000)
                ]);

                setCustomers(Array.isArray(customersResponse.content) ? customersResponse.content : []);
                setUsers(Array.isArray(usersResponse.content) ? usersResponse.content : []);
                setOffers(Array.isArray(offersResponse.content) ? offersResponse.content : []);
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoadingData(false);
            }
        };

        loadData();
    }, []);

    const addOrderItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { offerId: '', quantity: 1 }]
        });
    };

    const removeOrderItem = (index) => {
        if (formData.items.length > 1) {
            const newItems = formData.items.filter((_, i) => i !== index);
            setFormData({ ...formData, items: newItems });
        }
    };

    const updateOrderItem = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: field === 'quantity' ? parseInt(value) || 1 : value
        };
        setFormData({ ...formData, items: newItems });
    };

    const sanitizeFormData = (data) => {
        return {
            customerId: parseInt(data.customerId) || null,
            userId: parseInt(data.userId) || null,
            items: data.items
                .filter(item => item.offerId && item.quantity > 0)
                .map(item => ({
                    offerId: parseInt(item.offerId),
                    quantity: parseInt(item.quantity) || 1
                }))
        };
    };

    const handleCreateOrder = async (continueCreating = false, goBack = false) => {
        setLoading(true);
        try {
            const sanitizedData = sanitizeFormData(formData);
            await orderApi.createOrder(sanitizedData);

            setFormData({
                customerId: '',
                userId: '',
                items: [{ offerId: '', quantity: 1 }]
            });

            if (goBack || !continueCreating) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating order:', error);
        } finally {
            setLoading(false);
        }
    };

    const isFormValid = () => {
        return formData.customerId &&
            formData.userId &&
            formData.items.length > 0 &&
            formData.items.every(item => item.offerId && item.quantity > 0);
    };

    if (loadingData) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Create Order</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Orders</span>
                    <span className="mx-2">&#62;</span>
                    <span>Create</span>
                </nav>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="space-y-6">
                    {/* Customer Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Customer<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.customerId}
                            onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select a customer</option>
                            {customers.map((customer) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.firstName} {customer.lastName} - {customer.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* User Selection */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            User<span className="text-red-500">*</span>
                        </label>
                        <select
                            value={formData.userId}
                            onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            disabled={loading}
                        >
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.firstName} {user.lastName} - {user.email}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Order Items Section */}
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <label className="block text-sm font-medium text-gray-700">
                                Order Items<span className="text-red-500">*</span>
                            </label>
                            <button
                                type="button"
                                onClick={addOrderItem}
                                disabled={loading}
                                className="flex items-center space-x-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add Item</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {formData.items.map((item, index) => (
                                <div key={index} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                                    <div className="flex justify-between items-start mb-3">
                                        <h4 className="text-sm font-medium text-gray-700">
                                            Item #{index + 1}
                                        </h4>
                                        {formData.items.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOrderItem(index)}
                                                disabled={loading}
                                                className="p-1 text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Offer<span className="text-red-500">*</span>
                                            </label>
                                            <select
                                                value={item.offerId}
                                                onChange={(e) => updateOrderItem(index, 'offerId', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                disabled={loading}
                                            >
                                                <option value="">Select an offer</option>
                                                {offers.map((offer) => (
                                                    <option key={offer.id} value={offer.id}>
                                                        {offer.name} - ${offer.price} ({offer.type})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Quantity<span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="number"
                                                min="1"
                                                value={item.quantity}
                                                onChange={(e) => updateOrderItem(index, 'quantity', e.target.value)}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                                disabled={loading}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4 mt-6">
                    <button
                        onClick={() => handleCreateOrder(true, false)}
                        disabled={!isFormValid() || loading}
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Create and Continue Creating
                    </button>
                    <button
                        onClick={() => handleCreateOrder(false, true)}
                        disabled={!isFormValid() || loading}
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

export default CreateOrderForm;