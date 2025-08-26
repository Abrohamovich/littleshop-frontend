import React, { useState, useEffect } from 'react';
import { authService } from './services/authService';
import Login from './components/Login';
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
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentView, setCurrentView] = useState('infopanel');
    const [userInfo, setUserInfo] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            if (authService.isAuthenticated()) {
                setIsAuthenticated(true);
                setUserInfo(authService.getUserData());
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleLoginSuccess = () => {
        console.log('Login successful, user authenticated');
        setIsAuthenticated(true);
        setUserInfo(authService.getUserData());
        setCurrentView('infopanel');
    };

    const handleLogout = () => {
        authService.logout();
        setIsAuthenticated(false);
        setUserInfo(null);
        setCurrentView('infopanel');
        console.log('User logged out');
    };

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

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="flex flex-col items-center space-y-4">
                    <svg className="animate-spin h-8 w-8 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Login onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
            <div className="flex-1 flex flex-col">
                <Header userInfo={userInfo} onLogout={handleLogout} />
                <main className="flex-1 overflow-auto">
                    {renderMainContent()}
                </main>
            </div>
        </div>
    );
};

export default App;