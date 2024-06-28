export interface JobListing {
    id: string;
    created_at: string;
    title: string;
    company: string;
    location: string;
    link: string;
}

export type SavedJobs = Array<{ listing_id: string; date_saved: string }>;