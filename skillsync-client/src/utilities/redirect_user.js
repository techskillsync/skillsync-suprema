import { GetUserId } from "../supabase/GetUserId";

export async function redirectUser(route, isIntendedForAuthenticatedUser) {
    // Redirect to home page if user is already logged in
    try {
        const userId = await GetUserId();
        console.log("Done");
        console.log("user id:",userId);
      alert;
      if (userId && isIntendedForAuthenticatedUser) {
        window.location.href = route;
      } else if (!userId && !isIntendedForAuthenticatedUser) {
        window.location.href = route;
      }
    } catch (error) {
        console.error(error);
    }
  }