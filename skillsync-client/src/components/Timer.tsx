import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../supabase/supabaseClient';

const Timer = ({ Component, ...props }) => {
    const location = useLocation();
    const pageName = location.pathname;

    useEffect(() => {
        const startTime = Date.now();

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                const endTime = Date.now();
                const duration = endTime - startTime;
                savePageVisitDuration(pageName, duration);
            }
        };

        const handleBeforeUnload = () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            savePageVisitDuration(pageName, duration);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            const endTime = Date.now();
            const duration = endTime - startTime;
            savePageVisitDuration(pageName, duration);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [pageName]);

    return <Component {...props} />;
};

const savePageVisitDuration = async (pageName, duration) => {
    const session = await supabase.auth.getSession();
    const user = session.data.session?.user;

    if (user) {
        const { error } = await supabase
            .from('page_visits')
            .insert([{ id: user.id, page_name: pageName, duration }]);

        if (error) {
            console.error('Error saving page visit duration:', error);
        }
    }
};

export { Timer };
