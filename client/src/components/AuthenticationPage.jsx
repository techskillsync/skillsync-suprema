import React, { useState } from 'react';

const AuthenticationPage = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    });
    const [signupData, setSignupData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleLoginSubmit = (e) => {
        e.preventDefault();
        // Handle login form submission
        console.log('Logging in with:', loginData);
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
        // Handle signup form submission
        console.log('Signing up with:', signupData);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <div className="flex space-x-2 bg-blue-200 rounded p-6">
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabChange('login')}
                >
                    Log In Tab
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabChange('signup')}
                >
                    Sign Up Tab
                </button>
            </div>
            {activeTab === 'login' && (
                <form className="mt-4 " onSubmit={handleLoginSubmit}>
                    <div className="flex flex-col space-y-2">
                        <input
                            className="px-4 py-2 mb-2 rounded border border-gray-300"
                            type="email"
                            placeholder="Email"
                            value={loginData.email}
                            onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        />
                        <input
                            className="px-4 py-2 mb-2 rounded border border-gray-300"
                            type="password"
                            placeholder="Password"
                            value={loginData.password}
                            onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        />
                        <button
                            className="px-4 py-2 rounded bg-blue-500 text-white"
                            type="submit"
                        >
                            Log In
                        </button>
                    </div>
                </form>
            )}
            {activeTab === 'signup' && (
                <form className="mt-4" onSubmit={handleSignupSubmit}>
                    <div className="flex flex-col space-y-2">
                        <input
                            className="px-4 py-2 mb-2 rounded border border-gray-300"
                            type="email"
                            placeholder="Email"
                            value={signupData.email}
                            onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        />
                        <input
                            className="px-4 py-2 mb-2 rounded border border-gray-300"
                            type="password"
                            placeholder="Password"
                            value={signupData.password}
                            onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        />
                        <input
                            className="px-4 py-2 mb-2 rounded border border-gray-300"
                            type="password"
                            placeholder="Confirm Password"
                            value={signupData.confirmPassword}
                            onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                        />
                        <button
                            className="px-4 py-2 rounded bg-blue-500 text-white"
                            type="submit"
                        >
                            Sign Up
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default AuthenticationPage;