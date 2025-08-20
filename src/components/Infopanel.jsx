import React from 'react';

const Infopanel = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-8">Infopanel</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Customers</h3>
                    <p className="text-3xl font-bold text-blue-600">6</p>
                    <p className="text-sm text-gray-500">Total customers</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Products/Services</h3>
                    <p className="text-3xl font-bold text-green-600">9</p>
                    <p className="text-sm text-gray-500">Total Products + Services</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Orders</h3>
                    <p className="text-3xl font-bold text-purple-600">5</p>
                    <p className="text-sm text-gray-500">Total orders</p>
                </div>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Customer Activity</h3>
                <div className="h-64 flex items-center justify-center text-gray-500">
                    Chart placeholder - Customer activity over time
                </div>
            </div>
        </div>
    );
};

export default Infopanel;