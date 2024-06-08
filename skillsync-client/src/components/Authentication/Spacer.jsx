import React from 'react';

const Spacer = ({ text }) => {
    return (
        <div className="flex items-center my-8">
            <hr className="flex-grow border-t border-gray-300" />
            <span className="px-4 text-gray-500">{text}</span>
            <hr className="flex-grow border-t border-gray-300" />
        </div>
    );
};

export default Spacer;