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
    date_of_birth: Date;
    gender: string;
    race: string;
    email_confirmed: boolean;
    avatar_url: string;
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
}

export type JobRecord = "saved_jobs" | "applied_jobs";