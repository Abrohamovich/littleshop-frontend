import React, { useState } from 'react';
import Infopanel from './components/Infopanel';
import Categories from './components/category/Categories.jsx';
import Customers from './components/customer/Customers.jsx';
import Orders from './components/order/Orders.jsx';
import Offers from './components/offer/Offers.jsx';
import Suppliers from './components/supplier/Suppliers.jsx';
import Users from './components/user/Users.jsx';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

const App = () => {
    const [currentView, setCurrentView] = useState('infopanel');

    const renderMainContent = () => {
        switch (currentView) {
            case 'infopanel':
                return <Infopanel />;
            case 'categories':
                return <Categories />;
            case 'customers':
                return <Customers />;
            case 'orders':
                return <Orders />;
            case 'offers':
                return <Offers />;
            case 'suppliers':
                return <Suppliers />;
            case 'users':
                return <Users />;
            default:
                return <Infopanel />;
        }
    };

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 overflow-auto">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
};

export default App;