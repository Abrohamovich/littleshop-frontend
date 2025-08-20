import React from 'react';

const Sidebar = ({ currentView, setCurrentView }) => {
    const menuItems = [
        { id: 'infopanel', label: 'Infopanel', icon: '📊' },
        { id: 'categories', label: 'Categories', icon: '📁' },
        { id: 'customers', label: 'Customers', icon: '👥' },
        { id: 'orders', label: 'Orders', icon: '📋' },
        { id: 'offers', label: 'Offers', icon: '🛍️' },
        { id: 'suppliers', label: 'Suppliers', icon: '🏢' },
        { id: 'users', label: 'Users', icon: '👤' }
    ];

    return (
        <div className="w-64 bg-gray-50 border-r border-gray-200 h-screen flex flex-col">
            <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">Order Management System</h2>
            </div>
            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setCurrentView(item.id)}
                        className={`w-full text-left px-4 py-2 rounded-md flex items-center space-x-3 ${
                            currentView === item.id
                                ? 'bg-blue-100 text-blue-700'
                                : 'text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <span>{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;