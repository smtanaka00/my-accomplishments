import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
    const [achievements, setAchievements] = useState([]);
    const [files, setFiles] = useState([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({});
    const [profile, setProfile] = useState(null);

    // Auth State
    const [session, setSession] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        // Initial session check
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoadingAuth(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (!session) {
                // clear local state on logout
                setAchievements([]);
                setDashboardMetrics({});
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Load user data when session exists
    useEffect(() => {
        if (!session?.user) return;

        const loadData = async () => {
            try {
                // Fetch profile
                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', session.user.id)
                    .single();

                if (profileError) throw profileError;
                setProfile(profileData);

                // Fetch achievements
                const { data: achievementsData, error: acError } = await supabase
                    .from('achievements')
                    .select('*')
                    .order('date', { ascending: false });

                if (acError) throw acError;

                if (achievementsData) {
                    setAchievements(achievementsData);

                    // Simple logic to recalculate dashboard metrics based on achievements
                    const newMetrics = {};
                    achievementsData.forEach(ach => {
                        const year = new Date(ach.date).getFullYear().toString();
                        if (!newMetrics[year]) {
                            newMetrics[year] = { impactScore: 0, completionRate: '100%', awards: 0 };
                        }

                        let newImpactScore = newMetrics[year].impactScore + 5;
                        let newAwards = newMetrics[year].awards;
                        if (ach.category === 'Award') {
                            newAwards++;
                            newImpactScore += 10;
                        }

                        newMetrics[year].impactScore = newImpactScore > 100 ? 100 : newImpactScore;
                        newMetrics[year].awards = newAwards;
                    });
                    setDashboardMetrics(newMetrics);
                }
            } catch (error) {
                console.error("Error loading user data:", error.message);
            }
        };

        loadData();
    }, [session]);

    const refreshProfile = async () => {
        if (!session?.user) return;
        const { data } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
        if (data) setProfile(data);
    };

    const addAchievement = async (achievement) => {
        if (!session?.user) return;

        try {
            const { data, error } = await supabase
                .from('achievements')
                .insert([
                    {
                        user_id: session.user.id,
                        title: achievement.title,
                        date: achievement.date,
                        display_date: achievement.displayDate,
                        category: achievement.category,
                        tag: achievement.tag,
                        impact: achievement.impact,
                        evidence_type: achievement.evidenceType || 'pdf',
                        file_name: achievement.fileName || null
                    }
                ])
                .select();

            if (error) throw error;

            if (data && data.length > 0) {
                const newAchievement = data[0];
                setAchievements(prev => [newAchievement, ...prev]);

                // Update metrics locally
                const year = new Date(newAchievement.date).getFullYear().toString();
                setDashboardMetrics(prev => {
                    const currentYearData = prev[year] || { impactScore: 0, completionRate: '100%', awards: 0 };
                    let newImpactScore = currentYearData.impactScore + 5;
                    let newAwards = currentYearData.awards;

                    if (newAchievement.category === 'Award') {
                        newAwards++;
                        newImpactScore += 10;
                    }

                    return {
                        ...prev,
                        [year]: {
                            ...currentYearData,
                            impactScore: newImpactScore > 100 ? 100 : newImpactScore,
                            awards: newAwards
                        }
                    };
                });
            }

            // Mock adding to vault (ignoring cloud storage for now)
            if (achievement.fileName) {
                addFile({
                    name: achievement.fileName,
                    type: achievement.evidenceType || 'pdf',
                    date: achievement.displayDate,
                    size: '1.2 MB'
                });
            }
        } catch (error) {
            console.error("Error inserting achievement:", error.message);
        }
    };

    const addFile = (file) => {
        const newFile = { ...file, id: Date.now() };
        setFiles(prev => [newFile, ...prev]);
    }

    return (
        <GlobalStateContext.Provider value={{
            session,
            loadingAuth,
            profile,
            achievements,
            files,
            dashboardMetrics,
            addAchievement,
            addFile,
            refreshProfile
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
