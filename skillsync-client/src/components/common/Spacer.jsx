import React from 'react';

const Spacer = ({className}) => {
    return (
        <div className={className + " w-[80%] mx-auto h-1 rounded bg-white opacity-50"}></div>
    );
};

export default Spacer;