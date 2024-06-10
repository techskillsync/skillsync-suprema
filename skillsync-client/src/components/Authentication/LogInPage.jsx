import React, { useState } from "react";
import { useDispatch } from 'react-redux'
import Spacer from "./Spacer";

import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from "react-icons/fa";
import InputField from "./InputField";
import EmailLogin from '../../supabase/userLogin'
import { setData } from '../../redux/userSlice'

const LogInPage = () => {
  const dispatch = useDispatch()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function handleFormSubmit(e) {
    e.preventDefault()
    const loginObject = await EmailLogin(email, password)

    if (!loginObject.success) {
      console.log("Error signing user in - " + loginObject.data)
    }
    
    dispatch(setData(loginObject.data))
    // window.location.href = "/";
}

  return (
    <div className="flex h-screen dark:bg-black">
      <div className="w-1/2 bg-gray-100">{/* Empty box */}</div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-left mb-2 bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent">
            SkillSync.
          </h1>
          <h2 className="text-3xl font-bold text-left mb-6 dark:text-white">
            Welcome Back!
          </h2>
          <div className="mb-4 md:flex space-x-2">
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white text-lg py-2 px-4 rounded w-full md:mb-0 mb-2 flex items-center justify-center">
              <FaGoogle className="mr-3" /> Google
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white text-lg py-2 px-4 rounded w-full md:mb-0 mb-2 flex items-center justify-center">
              <FaFacebook /> Facebook
            </button>
          </div>
          <Spacer text="or continue with" />
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <InputField
                icon={FaEnvelope}
                id="email"
                type="email"
                placeholder="Enter your email"
                parentOnChange={e => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <InputField
                icon={FaLock}
                id="password"
                type="password"
                placeholder="Enter your password"
                parentOnChange={e => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
                <label className="flex items-center">
                    <input type="checkbox" className="form-checkbox" />
                    <span className="ml-2">Remember me</span>
                </label>
                <a className="cursor-pointer text-gray-500 transition-all duration-150 hover:text-blue-200">Forgot password?</a>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold py-2 px-4 rounded w-full">
              Log In
            </button>
          </form>
        <div className="mt-4 text-center"></div>
            <p className="text-gray-500">Don't have an account? <a className="font-semibold bg-clip-text bg-gradient-to-r text-transparent from-green-400 to-blue-500 hover:text-blue-500 transition-all duration-150" href="/signup">Create an account</a></p>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
