import React, { useEffect, useState } from "react";
import Spacer from "./Spacer";
import { EmailSignUp } from "../../supabase/userSignUp.js";
import { LoadGoogleClient } from "../../supabase/userLogin";
import supabase from "../../supabase/supabaseClient";

import {
  FaGoogle,
  FaFacebook,
  FaEnvelope,
  FaLock,
  FaUser,
} from "react-icons/fa";
import InputField from "./InputField";
import InfoCarousel from "./InfoCarousel.jsx";
import { redirectUser } from "../../utilities/redirect_user.js";

const SignUpPage = () => {
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
  const [name, setName] = useState("");

  async function handleFormSubmit(e) {
    e.preventDefault();
    const userGotSignedUp = await EmailSignUp(name, email, password);

    if (userGotSignedUp) {
      window.location.href = "/confirm";
    } else {
      alert("Error signing up 😵");
    }
  }

  useEffect(() => {
    redirectUser("/home", true);
  }, []);

  return (
    <div className="flex h-screen bg-black">
      <div className="w-1/2 bg-gray-100">
        <InfoCarousel />
      </div>
      <div className="w-1/2 flex items-center justify-center">
        <div className="max-w-md w-full">
          <h1 className="text-3xl font-bold text-left mb-2 bg-clip-text bg-gradient-to-r from-green-400 to-blue-700 text-transparent">
            SkillSync.
          </h1>
          <h2 className="text-3xl font-bold text-left mb-6 dark:text-white">
            Create your account
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
            <div class="g_id_signin"
              data-type="standard"
              data-shape="rectangular"
              data-theme="outline"
              data-text="signup_with"
              data-size="large"
              data-logo_alignment="left">
            </div>
          </div>
          <Spacer text="or continue with" />
          <form onSubmit={handleFormSubmit}>
            <div className="mb-4">
              <InputField
                icon={FaUser}
                parentOnChange={(e) => setName(e.target.value)}
                id="name"
                type="name"
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <InputField
                icon={FaEnvelope}
                parentOnChange={(e) => setEmail(e.target.value)}
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <InputField
                icon={FaLock}
                parentOnChange={(e) => setPassword(e.target.value)}
                id="password"
                type="password"
                placeholder="Enter your password"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <label className="flex items-center">
              <input type="checkbox" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"/>
                <span className="ml-2">Remember me</span>
              </label>
            </div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 transition-all duration-300 text-white font-semibold py-2 px-4 rounded w-full"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-4 text-center"></div>
          <p className="text-gray-500">
            Already have an account?{" "}
            <a
              className="font-semibold bg-clip-text bg-gradient-to-r text-transparent from-green-400 to-blue-500 hover:text-blue-500 transition-all duration-150"
              href="/login"
            >
              Log In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
