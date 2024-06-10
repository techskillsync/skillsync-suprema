import supabase from "./supabaseClient"
import { useDispatch } from 'react-redux'
import { setData } from '../redux/userSlice'

/**
 * Sign in a user using email and password.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user is successfully signed in, or false otherwise.
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
        return false
    }

    // Store data in redux
    dispatch(setData(data))

    return true
}

export default EmailLogin
