import React, { useState } from 'react';
import Infopanel from './components/Infopanel';
import Categories from './components/Categories';
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
                return <PlaceholderView title="Customers" />;
            case 'orders':
                return <PlaceholderView title="Orders" />;
            case 'offers':
                return <PlaceholderView title="Offers" />;
            case 'suppliers':
                return <PlaceholderView title="Suppliers" />;
            case 'users':
                return <PlaceholderView title="Users" />;
            default:
                return <Infopanel />;
        }
    };

    const PlaceholderView = ({ title }) => (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">{title}</h1>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <p className="text-gray-500">This section is not implemented yet.</p>
            </div>
        </div>
    );

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