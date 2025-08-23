import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X } from 'lucide-react';
import { orderApi } from '../../services/orderApi.js';
import { customerApi } from '../../services/customerApi.js';
import { offerApi } from '../../services/offerApi.js';

const UpdateOrderForm = ({ orderId, onSuccess, onCancel }) => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [customers, setCustomers] = useState([]);
    const [offers, setOffers] = useState([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [newItem, setNewItem] = useState({ offerId: '', quantity: 1 });
    const [editingItem, setEditingItem] = useState(null);

    const ORDER_STATUSES = [
        'IN_PROGRESS',
        'COMPLETED',
        'CANCELLED'
    ];

    useEffect(() => {
        const loadData = async () => {
            if (!orderId) {
                console.error('No order ID provided');
                onCancel();
                return;
            }

            setInitialLoading(true);
            try {
                const [orderData, customersResponse, offersResponse] = await Promise.all([
                    orderApi.getOrderById(orderId),
                    customerApi.getCustomers(0, 1000),
                    offerApi.getOffers(0, 1000)
                ]);

                setOrder(orderData);
                setSelectedCustomerId(orderData.customer?.id || '');
                setSelectedStatus(orderData.status || '');
                setCustomers(Array.isArray(customersResponse.content) ? customersResponse.content : []);
                setOffers(Array.isArray(offersResponse.content) ? offersResponse.content : []);
            } catch (error) {
                console.error('Error loading data:', error);
                onCancel();
            } finally {
                setInitialLoading(false);
            }
        };

        loadData();
    }, [orderId, onCancel]);

    const handleChangeCustomer = async () => {
        if (!selectedCustomerId || selectedCustomerId === order.customer?.id.toString()) return;

        setLoading(true);
        try {
            const updatedOrder = await orderApi.changeCustomer(orderId, { customerId: parseInt(selectedCustomerId) });
            setOrder(updatedOrder);
        } catch (error) {
            console.error('Error changing customer:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleChangeStatus = async () => {
        if (!selectedStatus || selectedStatus === order.status) return;

        setLoading(true);
        try {
            const updatedOrder = await orderApi.changeStatus(orderId, { status: selectedStatus });
            setOrder(updatedOrder);
        } catch (error) {
            console.error('Error changing status:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddItem = async () => {
        if (!newItem.offerId || newItem.quantity <= 0) return;

        setLoading(true);
        try {
            const updatedOrder = await orderApi.addOrderItem(orderId, {
                offerId: parseInt(newItem.offerId),
                quantity: parseInt(newItem.quantity)
            });
            setOrder(updatedOrder);
            setNewItem({ offerId: '', quantity: 1 });
        } catch (error) {
            console.error('Error adding item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveItem = async (orderItemId) => {
        if (!window.confirm('Are you sure you want to remove this item?')) return;

        setLoading(true);
        try {
            const updatedOrder = await orderApi.removeOrderItem(orderId, { orderItemId });
            setOrder(updatedOrder);
        } catch (error) {
            console.error('Error removing item:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateItemQuantity = async (orderItemId, newQuantity) => {
        if (newQuantity <= 0) return;

        setLoading(true);
        try {
            const updatedOrder = await orderApi.updateOrderItemQuantity(orderId, {
                orderItemId,
                newQuantity: parseInt(newQuantity)
            });
            setOrder(updatedOrder);
            setEditingItem(null);
        } catch (error) {
            console.error('Error updating item quantity:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(amount);
    };

    const calculateTotalAmount = () => {
        if (!order?.items) return 0;
        return order.items.reduce((total, item) => total + (item.priceAtTimeOfOrder * item.quantity), 0);
    };

    if (initialLoading) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-2 text-gray-500">Loading order...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="p-8">
                <div className="text-center">
                    <p className="text-red-500">Order not found</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Manage Order #{order.id}</h1>
                <nav className="flex mt-2 text-sm text-gray-600">
                    <span>Orders</span>
                    <span className="mx-2">&#62;</span>
                    <span>Manage</span>
                </nav>
            </div>

            <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Information</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Customer
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    value={selectedCustomerId}
                                    onChange={(e) => setSelectedCustomerId(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loading}
                                >
                                    <option value="">Select a customer</option>
                                    {customers.map((customer) => (
                                        <option key={customer.id} value={customer.id}>
                                            {customer.firstName} {customer.lastName} - {customer.email}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleChangeCustomer}
                                    disabled={loading || !selectedCustomerId || selectedCustomerId === order.customer?.id.toString()}
                                    className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                                >
                                    Update
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Status
                            </label>
                            <div className="flex space-x-2">
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loading}
                                >
                                    {ORDER_STATUSES.map((status) => (
                                        <option key={status} value={status}>
                                            {status.replace('_', ' ')}
                                        </option>
                                    ))}
                                </select>
                                <button
                                    onClick={handleChangeStatus}
                                    disabled={loading || !selectedStatus || selectedStatus === order.status}
                                    className="px-3 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-sm"
                                >
                                    Update
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-sm text-gray-600">
                        <p><strong>User:</strong> {order.user?.firstName} {order.user?.lastName}</p>
                        <p><strong>Created:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                        <p><strong>Last Updated:</strong> {new Date(order.updatedAt).toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>

                    <div className="space-y-3 mb-6">
                        {order.items?.map((item) => (
                            <div key={item.id} className="border border-gray-200 rounded-md p-4 bg-gray-50">
                                <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                        <h4 className="font-medium text-gray-900">{item.offer?.name}</h4>
                                        <p className="text-sm text-gray-600">
                                            Price at order: {formatCurrency(item.priceAtTimeOfOrder)} ×
                                            {editingItem === item.id ? (
                                                <input
                                                    type="number"
                                                    min="1"
                                                    defaultValue={item.quantity}
                                                    className="mx-2 w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                                    onBlur={(e) => handleUpdateItemQuantity(item.id, e.target.value)}
                                                    onKeyPress={(e) => {
                                                        if (e.key === 'Enter') {
                                                            handleUpdateItemQuantity(item.id, e.target.value);
                                                        }
                                                    }}
                                                    autoFocus
                                                />
                                            ) : (
                                                <span className="mx-2">{item.quantity}</span>
                                            )}
                                            = {formatCurrency(item.priceAtTimeOfOrder * item.quantity)}
                                        </p>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => setEditingItem(editingItem === item.id ? null : item.id)}
                                            disabled={loading}
                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-md disabled:opacity-50"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleRemoveItem(item.id)}
                                            disabled={loading}
                                            className="p-1 text-red-600 hover:bg-red-100 rounded-md disabled:opacity-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-md font-medium text-gray-900 mb-3">Add New Item</h3>
                        <div className="flex space-x-4">
                            <div className="flex-1">
                                <select
                                    value={newItem.offerId}
                                    onChange={(e) => setNewItem({ ...newItem, offerId: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    disabled={loading}
                                >
                                    <option value="">Select an offer</option>
                                    {offers.map((offer) => (
                                        <option key={offer.id} value={offer.id}>
                                            {offer.name} - {formatCurrency(offer.price)} ({offer.type})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <input
                                    type="number"
                                    min="1"
                                    value={newItem.quantity}
                                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Qty"
                                    disabled={loading}
                                />
                            </div>
                            <button
                                onClick={handleAddItem}
                                disabled={loading || !newItem.offerId || newItem.quantity <= 0}
                                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                <Plus className="w-4 h-4" />
                                <span>Add</span>
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-gray-200 pt-4 mt-4">
                        <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">
                                Total: {formatCurrency(calculateTotalAmount())}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex space-x-4">
                    <button
                        onClick={onSuccess}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Back to Orders
                    </button>
                    <button
                        onClick={onCancel}
                        className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UpdateOrderForm;