import supaClient from "./supabaseClient"

/**
 * Initiate an email confirmation for a user with their name, email, and password.
 * 
 * @param {string} name - The name of the user.
 * @param {string} email - The email of the user.
 * @param {string} password - The password of the user.
 * @returns {Promise<boolean>} - A promise that resolves to true if the user sign up is successful, false otherwise.
 */
async function EmailSignUp(name, email, password) {

    if (!name || !email || !password) {
        console.error("Error - to sign up user must have a valid name, email, and password")
    }

    const { user, session, error } = await supaClient.auth.signUp({
        email: email,
        password: password,
        options: {
            data: {
                name: name
            }
        }
    })

    if (error) { 
        console.log("error - " + error)
        return false 
    }
    
    return true
}

export { EmailSignUp }