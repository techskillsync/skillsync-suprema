import supabase from '../../supabase/supabaseClient';
import React, { useState, useEffect } from 'react';
import SuccessfulLoginRedirect from './SuccessfulLoginRedirect';

function ReceiveConfirmEmail() {

  useEffect(() => {
    async function doAsync() {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) { return; }
      SuccessfulLoginRedirect();
    }

    doAsync();
  }, [])
  
  return (
    <div className="h-screen w-screen flex justify-center items-center">
      <h1 className="text-white text-2xl font-semibold">Logging you in</h1>
    </div>);
}

export default ReceiveConfirmEmail;
