import React, { useEffect } from "react";
import supabase from "../../supabase/supabaseClient";
import { LoadGoogleClient } from '../../supabase/userLogin';

function ArmanLogin() {

	async function handleSignInWithGoogle(response) {
		const { data, error } = await supabase.auth.signInWithIdToken({
			provider: 'google',
			token: response.credential,
		})
	}

	useEffect(() => {
		// Expose the handleSignInWithGoogle function globally for the callback
		window.handleSignInWithGoogle = handleSignInWithGoogle;
	  }, []);

	return (
		<div className="w-[400px] border border-emerald-300 flex flex-col items-center justify-center rounded-md p-4">
			<LoadGoogleClient />
			<div id="g_id_onload"
				data-client_id="527302580782-7a84n93to7556e04leg1f7qi1avklj0e.apps.googleusercontent.com"
				data-context="signup"
				data-ux_mode="popup"
				data-callback="handleSignInWithGoogle"
				data-itp_support="true"
				data-use_fedcm_for_prompt="true">
			</div>

			<div className="g_id_signin"
				data-type="standard"
				data-shape="rectangular"
				data-theme="outline"
				data-text="signin_with"
				data-size="large"
				data-logo_alignment="left">
			</div>
		</div>
	);
}

export { ArmanLogin }