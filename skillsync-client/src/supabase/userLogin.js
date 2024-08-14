import supabase from "./supabaseClient"
import { useEffect } from 'react';

// Import this component to give a component access to Google's Client library.
// We need this library for login/signup with google.
function LoadGoogleClient() {
	useEffect(() => {
		if (!document.querySelector('script[src="https://accounts.google.com/gsi/client"]')) {
			const script = document.createElement('script');
			script.src = 'https://accounts.google.com/gsi/client';
			script.async = true;
			document.body.appendChild(script);

			// Cleanup script
			return () => {
				document.body.removeChild(script);
			};
		}
	}, [])

	return null;
}

/**
 * Sign a user in with email and password.
 * @returns {Promise<object>} - A promise that resolves to an object
 *                              with a status field and a data field
 *                              if successful.
 */
async function EmailLogin(email, password) {

	if (!email || !password) {
		console.error("error - need email and password to login")
		return
	}

	const { data, error } = await supabase.auth.signInWithPassword({
		email: email,
		password: password,
	})

	if (error) {
		// alert("Error logging in 🙀")
		console.error('error logging user in - ' + error)
		return { success: false, data: error }
	}

	return { success: true, data: data }
}

export default EmailLogin
export { LoadGoogleClient }