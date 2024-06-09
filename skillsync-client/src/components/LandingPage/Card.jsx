import React from "react";

const SmallCard = ({ index, heading, text, icon }) => {
return (
    <div className="small-card  rounded-lg bg-white p-8 min-h-[120px] flex flex-row space-x-3">
        <div className="small-card-icon flex-col w-auto">
            {icon || (
                <div className="rounded-full bg-gradient-to-b from-green-500 to-blue-500 text-white text-2xl font-bold flex items-center h-[60px] w-[60px] justify-center">
                    {index}
                </div>
            )}
        </div>
        <div className="small-card-content flex-col">
            <h3 className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-blue-600">{heading}</h3>
            <p>{text}</p>
        </div>
    </div>
);
};

export default SmallCard;
