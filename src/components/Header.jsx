import React from 'react';
import {Bell, Search, Settings, User} from 'lucide-react';

const Header = () => {
    return (
        <header className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
                </div>

                <div className="flex items-center space-x-4">
                    <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"/>
                        <input
                            type="text"
                            placeholder="Search..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64"
                        />
                    </div>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md relative">
                        <Bell className="w-5 h-5"/>
                        <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>

                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md">
                        <Settings className="w-5 h-5"/>
                    </button>

                    <div className="flex items-center space-x-2">
                        <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white"/>
                            </div>
                            <span className="text-sm font-medium text-gray-700">Admin</span>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;