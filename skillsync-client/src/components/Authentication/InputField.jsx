import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const InputField = ({ icon: Icon, id, type: type_parameter, placeholder, parentOnChange }) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="relative">
            <span className="absolute left-3 top-[30%] text-gray-400">
                <Icon />
            </span>
            <input
                className="bg-white shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 dark:text-white leading-tight focus:outline-none focus:shadow-outline"
                id={id}
                onChange={parentOnChange}
                type={(type_parameter === 'password' && showPassword) ? 'text' : type_parameter}
                placeholder={placeholder}
            />
            {type_parameter === 'password' && (
                <a
                    type="button"
                    className="cursor-pointer absolute right-3 top-[30%] text-gray-400 bg-transparent border-none"
                    onClick={togglePasswordVisibility}
                >
                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                </a>
            )}
        </div>
    );
};

export default InputField;