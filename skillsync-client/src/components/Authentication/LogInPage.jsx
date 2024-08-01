import React, { useState, useEffect } from "react";
import Spacer from "./Spacer";
import { FaGoogle, FaFacebook, FaEnvelope, FaLock } from "react-icons/fa";
import InputField from "./InputField";
import EmailLogin from "../../supabase/userLogin";
import InfoCarousel from "./InfoCarousel";
import supabase from "../../supabase/supabaseClient";
import { LoadGoogleClient } from "../../supabase/userLogin";
import { GetUserId } from "../../supabase/GetUserId";
import { redirectUser } from "../../utilities/redirect_user";

const LogInPage = () => {
  /*
   * Google Sign in code:
   */
  async function handleSignInWithGoogle(response) {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: "google",
      token: response.credential,
    });
    if (error) {
      return;
    }
    window.location.href = "/home";
  }

  useEffect(() => {
	redirectUser("/home", true);
  }, []);

  useEffect(() => {
    // Expose the handleSignInWithGoogle function globally for the callback
    window.handleSignInWithGoogle = handleSignInWithGoogle;
  }, []);
  /*
   * End of Google Sign in code
   */

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleFormSubmit(e) {
    e.preventDefault();
    const loginObject = await EmailLogin(email, password);

    if (!loginObject.success) {
      console.log("Error signing user in - " + loginObject.data);
      return;
    } else {
      window.location.href = "/home";
    }
  }

  return (
    <div className="flex h-screen bg-black">
      <div className="w-1/2 bg-gray-100">
        <InfoCarousel />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-lg w-full">
          <h1 className="text-3xl font-bold text-left mb-2 bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent">
            SkillSync.
          </h1>
          <h2 className="text-3xl font-bold text-left mb-6 dark:text-white">
            Welcome Back!
          </h2>
          <div className="mb-4 md:flex space-x-2">
            <LoadGoogleClient />
            <div
              id="g_id_onload"
              data-client_id="527302580782-7a84n93to7556e04leg1f7qi1avklj0e.apps.googleusercontent.com"
              data-context="signup"
              data-ux_mode="popup"
              data-callback="handleSignInWithGoogle"
              data-itp_support="true"
              data-use_fedcm_for_prompt="true"
            ></div>

            <div
              className="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signin_with"
              data-size="large"
              data-logo_alignment="left"
            ></div>
          </div>
          <Spacer text="or continue with" />
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <InputField
                icon={FaEnvelope}
                id="email"
                type="email"
                placeholder="Enter your email"
                parentOnChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <InputField
                icon={FaLock}
                id="password"
                type="password"
                placeholder="Enter your password"
                parentOnChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="ml-2">Remember me</span>
              </label>
              <a className="cursor-pointer text-gray-500 transition-all duration-150 hover:text-blue-200">
                Forgot password?
              </a>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold py-2 px-4 rounded w-full">
              Log In
            </button>
          </form>
          <div className="mt-4 text-center"></div>
          <p className="text-gray-500">
            Don't have an account?{" "}
            <a
              className="font-semibold bg-clip-text bg-gradient-to-r text-transparent from-green-400 to-blue-500 hover:text-blue-500 transition-all duration-150"
              href="/signup"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LogInPage;
