import supabase from './supabaseClient';
import { PublicUserProfiles } from '../types/types';

/*
 * Returns public profile information about 
 * user with matching email.
 * @param {string} email - the email of the profile you want
 * @returns {Promise<PublicUserProfiles | null>} - an object 
 * with the public information of the user or null on error.
 */
async function FindUser(email: string): Promise<PublicUserProfiles | null> {
	try {
		let { data: public_user_profiles, error } = await supabase
			.from('public_user_profiles')
			.select('*')
			.eq('email', email)
			.select('*')
			.single()

		if (error) { throw error }

		return public_user_profiles as PublicUserProfiles;

	} catch (error) {
		console.warn('unable to search users')
		return null
	}
}

async function FindAvatar(avatar_url: string): Promise<string | null> {
	try {
		const { data: image, error: downloadError } = await supabase
			.storage
			.from('avatars')
			.download(avatar_url)

		if (downloadError) { console.warn(downloadError.message); return ''; }

		return URL.createObjectURL(image)
	} catch (error) {
		return null;
	}
}

export { FindUser, FindAvatar }