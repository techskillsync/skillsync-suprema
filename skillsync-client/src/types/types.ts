/*
 * START OF RESUME BUILDER TYPES
 */
export interface EducationSection {
    institution: string;
    end_date: string;
    degree: string;
    // Highlights should be able to have 
    // as many sub arrays as neccessary.
    highlights: string[];
}

export interface ExperienceSection {
    job_title: string;
    company: string;
    start_day: string;
    end_day: string;
    location: string;
    // Highlights should be able to have 
    // as many sub arrays as neccessary.
    highlights: string[];
}

export interface ProjectsSection {
    name: string;
    github_url: string;
    technologies: string;
    highlights: string[];
    start_day: string;
    end_day: string;
}

export interface SkillsSection {
    category: string;
    skills: string;
}


export interface Resume {
    label: string; // Shown to the user to identify resume
    full_name: string;
    phone_number: string;
    email: string;
    personal_website: string;
    linkedin: string;
    github: string;
    education: EducationSection[];
    experience: ExperienceSection[];
    projects: ProjectsSection[];
    technical_skills: SkillsSection[];
}

/*
 * END OF RESUME BUILDER TYPES
 */

// Interface for view public_user_profiles
export interface PublicUserProfiles {
    name: string;
    email: string;
    avatar_url: string;
    id: string;
}

export interface UserProfile {
    name: string;
    last_name: string;
    email: string;
    location: string;
    school: string;
    grad_year: string;
    program: string;
    specialization: string;
    industry: string;
    skill_sets: JSON;
    linkedin: string;
    github: string;
    work_eligibility: JSON;
    date_of_birth: Date;
    gender: string;
    race: string;
    email_confirmed: boolean;
    avatar_url: string;
    phone_number: string;
    zip_code: string;
    city: string;
    state: string;
    country: string;
    address: string;
    personal_website: string;
}

export interface JobListing {
    id: string;
    created_at: string | null;
    title: string | null;
    company: string | null;
    location: string | null;
    link: string | null;
    description: string | null;
    due_date: string | null;
    salary: string | null;
    logo_url: string | null;
    date_posted: string | null;
    num_applicants: string | null;
    apply_url: string | null;
    status: 'saved' | 'applied' | 'testing' | 'interviewing' | 'offer' | null;
}

export interface WorkExperience {
    id: string;
    title: string;
    company: string;
    description: string | null;
    startDate: string | null;
    endDate: string | null;
    location: string | null;
}

export interface Message {
    id: string | null;
    sender: string;
    receiver: string;
    // Todo: add more types
    content: {
        type: "text" | "job description" ;
        payload: string;
    };
    timestamp: Date;
    is_read: boolean;
}

export type JobRecord = "saved_jobs" | "applied_jobs";
