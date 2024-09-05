import { GetProfileInfo } from '../../supabase//ProfileInfo';
import { GetJobPreferences } from '../../supabase/JobPreferences';
import { GetResumeCount } from '../../supabase/Resumes';

/*
 * Returns true if we should show the user the "/welcome"
 * slideshow. False otherwise.
 * @returns {bool} false if >60% of profile is setup.
 */
async function UserNeedsOnboard():Promise<boolean> {
  // Preferences are: name, lastName, resume, email, location, workAuthorization,
  //                  startDate, level, selectedNewRoleOptions
  // We need at least 5 of these to not show the onboarding page
  const profile_preferences = await GetProfileInfo("name, last_name, email, location");
  const job_preferences = await GetJobPreferences("job_mode, keywords, salary_range, desired_culture, work_authorization, start_time, experience_level");
  const resume_count = await GetResumeCount();
  let num_fields = 0;
  for (const key in profile_preferences) {
    if (profile_preferences[key]) { num_fields+=1; }
  }
  for (const key in job_preferences) {
    if (Array.isArray(job_preferences[key])) {
      if (job_preferences[key].length !== 0) {
        num_fields +=1;
      }
      continue;
    }
    
    if (job_preferences[key] !== "" && job_preferences[key] !== null) {
      num_fields+=1;
    }
  }

  if (resume_count && resume_count > 0) { num_fields+=1; }

  if (num_fields < 5) { return true; }
  
  return false;
}

async function SuccessfulLoginRedirect() {
  if (await UserNeedsOnboard()) {
    window.location.href = "/welcome";
  } else {
    window.location.href = "/home";
  }
}

export default SuccessfulLoginRedirect;
