import supabase from "./supabaseClient"

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
        alert("Error logging in 🙀")
        console.error('error logging user in - ' + error)
        return { success: false, data: error }
    }

    return { success: true, data: data }
}

export default EmailLogin
