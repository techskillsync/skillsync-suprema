import React from 'react';

const HomePage = () => {
    return (
        <div className="bg-gray-100">
            <nav className="bg-blue-500 p-4">
                <div className="container mx-auto">
                    <a href="#" className="text-white font-bold text-xl">Logo</a>
                    <ul className="flex space-x-4">
                        <li><a href="#" className="text-white">Home</a></li>
                        <li><a href="#" className="text-white">About</a></li>
                        <li><a href="#" className="text-white">Contact</a></li>
                    </ul>
                </div>
            </nav>
            <div className="container mx-auto mt-8">
                <h1 className="text-4xl font-bold text-center">Welcome Back</h1>
            </div>
        </div>
    );
};

export default HomePage;