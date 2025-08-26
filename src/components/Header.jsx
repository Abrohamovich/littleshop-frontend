import React, { useState } from 'react';
import { Bell, Search, Settings, User, LogOut, ChevronDown } from 'lucide-react';

const Header = ({ userInfo, onLogout }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {
        setIsDropdownOpen(false);
        onLogout();
    };

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

                    <div className="flex items-center space-x-2 relative">
                        <button
                            onClick={toggleDropdown}
                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md"
                        >
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-white"/>
                            </div>
                            <div className="text-left">
                                <span className="text-sm font-medium text-gray-700">
                                    {userInfo?.email?.split('@')[0] || 'Admin'}
                                </span>
                                {userInfo?.role && (
                                    <div className="text-xs text-gray-500 capitalize">
                                        {userInfo.role.toLowerCase()}
                                    </div>
                                )}
                            </div>
                            <ChevronDown className="w-4 h-4 text-gray-400"/>
                        </button>

                        {isDropdownOpen && (
                            <div className="origin-top-right absolute right-0 top-full mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                <div className="py-1">
                                    <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100">
                                        <p className="font-medium">{userInfo?.email}</p>
                                        <p className="text-xs text-gray-500 capitalize mt-1">
                                            Role: {userInfo?.role?.toLowerCase() || 'User'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                                    >
                                        <LogOut className="w-4 h-4 text-gray-400"/>
                                        <span>Sign out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {isDropdownOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsDropdownOpen(false)}
                />
            )}
        </header>
    );
};

export default Header;