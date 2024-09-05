import supabase from '../../supabase/supabaseClient';
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import SuccessfulLoginRedirect from './SuccessfulLoginRedirect';

function ReceiveConfirmEmail() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const token = queryParams.get('token');

  useEffect(() => {
    async function doAsync() {
      try {
        if (!email || !token) { throw Error(); }

        const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email'});
        
        if (error) { throw Error(); }

        alert('about to call successful login redirect');
        SuccessfulLoginRedirect();

      } catch (error) {
          console.warn('Error logging you in 🙀');
          // window.location.href="/";
          return;
      }
    }

    doAsync();
  }, [])
  
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <h1 className="text-white text-2xl font-semibold">Logging you in</h1>
    </div>);
}

export default ReceiveConfirmEmail;
