import React, { useRef, useState, useEffect } from 'react';

const GradientTab = ({ title, description, number, photo, isExpanded, onClick }) => {
    const contentRef = useRef(null);
    const [maxHeight, setMaxHeight] = useState('0px');

    useEffect(() => {
        if (isExpanded) {
            setMaxHeight(`${contentRef.current.scrollHeight}px`);
        } else {
            setMaxHeight('0px');
        }
    }, [isExpanded]);

    return (
        <div className="flex flex-col items-center w-full mb-4">
            <div
                className="rounded-md p-1 w-full bg-gradient-to-r from-[#03BD6C] to-[#36B7FE] cursor-pointer"
                onClick={onClick}
            >
                <div className={`flex flex-col items-left justify-between p-4 rounded-md transition-all duration-300 ${isExpanded ? "bg-[#fff] text-[#1E1E1E]" : "bg-[#1E1E1E] text-[white]"}`}>
                    <div className="flex items-center">
                        <div className={`w-12 h-12 ${isExpanded ? "bg-[#03BD6C] text-[white]" : "bg-[#3A3A3A]"} rounded-full flex items-center justify-center text-xl font-bold`}>
                            {number}
                        </div>
                        <div className="ml-4">
                            <h1 className="font-bold text-lg">{title}</h1>
                        </div>
                    </div>
                    <div
                        ref={contentRef}
                        style={{ maxHeight }}
                        className="transition-max-height duration-300 ease-in-out overflow-hidden"
                    >
                        {isExpanded && (
                            <div className="flex flex-col md:flex-row items-center mt-4">
                                <p className="text-[#1E1E1E] mt-2 md:mt-0 text-center md:text-left">{description}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GradientTab;
