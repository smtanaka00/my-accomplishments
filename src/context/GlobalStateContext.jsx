import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

export const GlobalStateProvider = ({ children }) => {
    const [achievements, setAchievements] = useState([]);
    const [files, setFiles] = useState([]);
    const [dashboardMetrics, setDashboardMetrics] = useState({});
    const [profile, setProfile] = useState(null);
    const [goals, setGoals] = useState([]);

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

                // --- DATA MIGRATION ---
                const localData = localStorage.getItem('achievements');
                if (localData) {
                    try {
                        const parsedData = JSON.parse(localData);
                        if (Array.isArray(parsedData) && parsedData.length > 0) {
                            console.log("Migrating local achievements to cloud...");
                            const recordsToMigrate = parsedData.map(ach => ({
                                user_id: session.user.id,
                                title: ach.title,
                                date: ach.date,
                                display_date: ach.displayDate || ach.display_date,
                                category: ach.category,
                                tag: ach.tag,
                                impact: ach.impact || 'No impact statement provided.',
                                evidence_type: ach.evidenceType || ach.evidence_type || 'pdf',
                                file_name: ach.fileName || ach.file_name || null
                            }));

                            const { error: migrationError } = await supabase
                                .from('achievements')
                                .insert(recordsToMigrate);

                            if (!migrationError) {
                                localStorage.removeItem('achievements');
                                console.log("Migration successful!");
                            } else {
                                console.error("Migration failed:", migrationError);
                            }
                        } else {
                            localStorage.removeItem('achievements');
                        }
                    } catch (e) {
                        console.error("Error parsing local data, clearing it.", e);
                        localStorage.removeItem('achievements');
                    }
                }
                // --- END DATA MIGRATION ---

                const { data: achievementsData, error: acError } = await supabase
                    .from('achievements')
                    .select('*')
                    .order('date', { ascending: false });

                if (acError) throw acError;

                // Fetch goals
                const { data: goalsData, error: goalsError } = await supabase
                    .from('goals')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (!goalsError && goalsData) {
                    setGoals(goalsData);
                }

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

                // --- FETCH FILES ---
                const { data: storageFiles, error: storageError } = await supabase
                    .storage
                    .from('evidence_vault')
                    .list(session.user.id, {
                        limit: 100,
                        offset: 0,
                        sortBy: { column: 'created_at', order: 'desc' }
                    });

                if (storageError) {
                    console.error("Error fetching files:", storageError);
                } else if (storageFiles) {
                    const mappedFiles = storageFiles.map(f => {
                        const ext = f.name.split('.').pop();
                        return {
                            id: f.id,
                            name: f.name,
                            type: ['pdf'].includes(ext?.toLowerCase()) ? 'pdf' : 'image',
                            date: new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                            size: f.metadata ? (f.metadata.size / 1024 / 1024).toFixed(2) + ' MB' : '0 MB',
                            path: `${session.user.id}/${f.name}`
                        };
                    });
                    setFiles(mappedFiles.filter(f => f.name !== '.emptyFolderPlaceholder'));
                }
                // --- END FETCH FILES ---

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
            let uploadedFileName = achievement.fileName || null;

            if (achievement.fileData) {
                const fileExt = achievement.fileData.name.split('.').pop();
                const fileName = achievement.fileData.name;
                const filePath = `${session.user.id}/${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('evidence_vault')
                    .upload(filePath, achievement.fileData, { upsert: true });

                if (uploadError) {
                    console.error("Error uploading file:", uploadError);
                } else {
                    uploadedFileName = fileName;
                    // Optimistically add to file state
                    addFile({
                        name: fileName,
                        type: ['pdf'].includes(fileExt?.toLowerCase()) ? 'pdf' : 'image',
                        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                        size: (achievement.fileData.size / 1024 / 1024).toFixed(2) + ' MB',
                        path: filePath
                    });
                }
            }

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
                        file_name: uploadedFileName,
                        is_public: achievement.isPublic || false
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
        } catch (error) {
            console.error("Error inserting achievement:", error.message);
        }
    };

    const addFile = (file) => {
        const newFile = { ...file, id: Date.now() };
        setFiles(prev => [newFile, ...prev]);
    };

    const deleteFile = async (file) => {
        if (!session?.user || !file.path) return;
        try {
            const { error } = await supabase.storage
                .from('evidence_vault')
                .remove([file.path]);
            if (error) throw error;
            setFiles(prev => prev.filter(f => f.id !== file.id));
        } catch (error) {
            console.error('Error deleting file:', error.message);
        }
    };

    const deleteAchievement = async (id) => {
        if (!session?.user) return;
        try {
            const { error } = await supabase.from('achievements').delete().eq('id', id);
            if (error) throw error;
            const deleted = achievements.find(a => a.id === id);
            setAchievements(prev => prev.filter(a => a.id !== id));
            // Update metrics
            if (deleted) {
                const year = new Date(deleted.date).getFullYear().toString();
                setDashboardMetrics(prev => {
                    const yd = prev[year];
                    if (!yd) return prev;
                    let score = yd.impactScore - 5;
                    let awards = yd.awards;
                    if (deleted.category === 'Award') { awards--; score -= 10; }
                    return { ...prev, [year]: { ...yd, impactScore: Math.max(0, score), awards: Math.max(0, awards) } };
                });
            }
        } catch (error) {
            console.error('Error deleting achievement:', error.message);
        }
    };

    const updateAchievement = async (id, updates) => {
        if (!session?.user) return;
        try {
            const dbUpdates = {
                title: updates.title,
                date: updates.date,
                display_date: updates.displayDate,
                category: updates.category,
                tag: updates.tag,
                impact: updates.impact,
                is_public: updates.isPublic,
            };
            const { error } = await supabase.from('achievements').update(dbUpdates).eq('id', id);
            if (error) throw error;
            setAchievements(prev => prev.map(a => a.id === id ? { ...a, ...dbUpdates } : a));
        } catch (error) {
            console.error('Error updating achievement:', error.message);
        }
    };

    const addGoal = async (goal) => {
        if (!session?.user) return;
        try {
            const { data, error } = await supabase
                .from('goals')
                .insert([{ ...goal, user_id: session.user.id }])
                .select();
            if (error) throw error;
            if (data && data.length > 0) {
                setGoals(prev => [data[0], ...prev]);
            }
        } catch (error) {
            console.error("Error inserting goal:", error.message);
        }
    };

    const updateGoal = async (id, updates) => {
        if (!session?.user) return;
        try {
            const { error } = await supabase
                .from('goals')
                .update(updates)
                .eq('id', id);
            if (error) throw error;
            setGoals(prev => prev.map(g => g.id === id ? { ...g, ...updates } : g));
        } catch (error) {
            console.error("Error updating goal:", error.message);
        }
    };

    const deleteGoal = async (id) => {
        if (!session?.user) return;
        try {
            const { error } = await supabase
                .from('goals')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setGoals(prev => prev.filter(g => g.id !== id));
        } catch (error) {
            console.error("Error deleting goal:", error.message);
        }
    };

    return (
        <GlobalStateContext.Provider value={{
            session,
            loadingAuth,
            profile,
            achievements,
            files,
            dashboardMetrics,
            goals,
            addAchievement,
            addFile,
            deleteFile,
            deleteAchievement,
            updateAchievement,
            addGoal,
            updateGoal,
            deleteGoal,
            refreshProfile
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
