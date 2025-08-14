import React from 'react';
import CustomerForm from './components/CustomerForm';
import SupplierForm from './components/SupplierForm';
import UserForm from './components/UserForm';
import CategoryForm from './components/CategoryForm';
import './App.css';

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <h1>Панель управления LittleShop</h1>
            </header>
            <main className="forms-container">
                <CustomerForm />
                <SupplierForm />
                <UserForm />
                <CategoryForm />
            </main>
        </div>
    );
}

export default App;