export interface UserProfile {
    name: string;
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
    date_of_birth: string;
    gender: string;
    race: string;
    email_confirmed: boolean;
    avatar_url: string;
}

export interface JobListing {
    id: string;
    created_at: string;
    title: string;
    company: string;
    location: string;
    link: string;
}

export type JobRecord = "saved_jobs" | "applied_jobs";