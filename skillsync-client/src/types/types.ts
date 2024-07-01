export interface JobListing {
    id: string;
    created_at: string;
    title: string;
    company: string;
    location: string;
    link: string;
}

export type JobRecord = "saved_jobs" | "applied_jobs";