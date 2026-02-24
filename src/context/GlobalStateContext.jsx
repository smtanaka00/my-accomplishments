import React, { createContext, useContext, useState, useEffect } from 'react';

const GlobalStateContext = createContext();

export const useGlobalState = () => useContext(GlobalStateContext);

const initialAchievements = [
    {
        id: 1,
        title: 'Reduced production lead time by 15%',
        date: '2024-10-14',
        displayDate: 'October 14, 2024',
        category: 'Internal Project',
        tag: 'Process Optimization',
        impact: 'Streamlined the bioreactor turnaround process, increasing annual yield capacity for key vaccine components.',
        evidenceType: 'pdf'
    },
    {
        id: 2,
        title: 'Excellence in Regulatory Compliance Award',
        date: '2024-09-12',
        displayDate: 'September 12, 2024',
        category: 'Award',
        tag: 'Regulatory Compliance',
        impact: 'Recognized globally across the company for maintaining a 100% spotless FDA audit record during the Q3 inspection.',
        evidenceType: 'image'
    },
    {
        id: 3,
        title: 'Published research on mRNA stability',
        date: '2024-06-05',
        displayDate: 'June 05, 2024',
        category: 'Publication',
        tag: 'Innovation',
        impact: 'Lead author in the Journal of Pharmaceutical Sciences outlining novel lipid nanoparticle stabilization techniques.',
        evidenceType: 'link'
    },
    {
        id: 4,
        title: 'Lead cross-functional scale-up team',
        date: '2024-03-22',
        displayDate: 'March 22, 2024',
        category: 'Leadership',
        tag: 'Drug Manufacturing',
        impact: 'Successfully transitioned product X from Phase II clinical trials to commercial manufacturing scale within 6 months.',
        evidenceType: 'pdf'
    }
];

const initialFiles = [
    { id: 1, name: 'Patent_Award_Q3.pdf', type: 'pdf', date: 'Oct 14, 2024', size: '2.4 MB' },
    { id: 2, name: 'Compliance_Certificate.jpg', type: 'image', date: 'Sep 12, 2024', size: '1.1 MB' },
    { id: 3, name: 'Nature_Journal_Publication.pdf', type: 'pdf', date: 'Jun 05, 2024', size: '4.8 MB' },
    { id: 4, name: 'Manager_Review_2023.pdf', type: 'pdf', date: 'Jan 15, 2023', size: '800 KB' },
];

const initialDashboardData = {
    '2024': { impactScore: 88, completionRate: '92%', awards: 4 },
    '2023': { impactScore: 75, completionRate: '85%', awards: 2 },
    '2022': { impactScore: 60, completionRate: '80%', awards: 1 }
};

export const GlobalStateProvider = ({ children }) => {
    const [achievements, setAchievements] = useState(() => {
        const saved = localStorage.getItem('my_achievements');
        return saved ? JSON.parse(saved) : initialAchievements;
    });

    const [files, setFiles] = useState(() => {
        const saved = localStorage.getItem('my_files');
        return saved ? JSON.parse(saved) : initialFiles;
    });

    const [dashboardMetrics, setDashboardMetrics] = useState(() => {
        const saved = localStorage.getItem('my_dashboardMetrics');
        return saved ? JSON.parse(saved) : initialDashboardData;
    });

    useEffect(() => {
        localStorage.setItem('my_achievements', JSON.stringify(achievements));
        localStorage.setItem('my_files', JSON.stringify(files));
        localStorage.setItem('my_dashboardMetrics', JSON.stringify(dashboardMetrics));
    }, [achievements, files, dashboardMetrics]);

    const addAchievement = (achievement) => {
        const newAchievement = {
            ...achievement,
            id: Date.now()
        };
        setAchievements(prev => [newAchievement, ...prev]);

        // Automatically update the dashboard metrics based on category
        const year = new Date(achievement.date).getFullYear().toString();

        setDashboardMetrics(prev => {
            const currentYearData = prev[year] || { impactScore: 0, completionRate: '0%', awards: 0 };

            let newImpactScore = currentYearData.impactScore + 5; // Arbitrary increase
            let newAwards = currentYearData.awards;
            if (achievement.category === 'Award') {
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

        // Mock adding to vault
        if (achievement.fileName) {
            addFile({
                name: achievement.fileName,
                type: achievement.evidenceType || 'pdf',
                date: achievement.displayDate,
                size: '1.2 MB'
            });
        }
    };

    const addFile = (file) => {
        const newFile = { ...file, id: Date.now() };
        setFiles(prev => [newFile, ...prev]);
    }

    return (
        <GlobalStateContext.Provider value={{
            achievements,
            files,
            dashboardMetrics,
            addAchievement,
            addFile
        }}>
            {children}
        </GlobalStateContext.Provider>
    );
};
