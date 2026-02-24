import React from 'react';
import TimelineEntry from '../components/TimelineEntry';

const Timeline = () => {
    const achievements = [
        {
            id: 1,
            title: 'Reduced production lead time by 15%',
            date: 'October 14, 2024',
            category: 'Internal Project',
            tag: 'Process Optimization',
            impact: 'Streamlined the bioreactor turnaround process, increasing annual yield capacity for key vaccine components.',
            evidenceType: 'pdf'
        },
        {
            id: 2,
            title: 'Excellence in Regulatory Compliance Award',
            date: 'September 12, 2024',
            category: 'Award',
            tag: 'Regulatory Compliance',
            impact: 'Recognized globally across the company for maintaining a 100% spotless FDA audit record during the Q3 inspection.',
            evidenceType: 'image'
        },
        {
            id: 3,
            title: 'Published research on mRNA stability',
            date: 'June 05, 2024',
            category: 'Publication',
            tag: 'Innovation',
            impact: 'Lead author in the Journal of Pharmaceutical Sciences outlining novel lipid nanoparticle stabilization techniques.',
            evidenceType: 'link'
        },
        {
            id: 4,
            title: 'Lead cross-functional scale-up team',
            date: 'March 22, 2024',
            category: 'Leadership',
            tag: 'Drug Manufacturing',
            impact: 'Successfully transitioned product X from Phase II clinical trials to commercial manufacturing scale within 6 months.',
            evidenceType: 'pdf'
        }
    ];

    return (
        <div className="flex-col gap-6" style={{ paddingBottom: 'var(--space-8)' }}>
            <header className="flex-col gap-1">
                <h1 className="text-2xl">Professional Timeline</h1>
                <p className="text-muted text-sm">A narrative of your career impact.</p>
            </header>

            <div style={{ marginTop: 'var(--space-2)' }}>
                {achievements.map((item, index) => (
                    <TimelineEntry
                        key={item.id}
                        title={item.title}
                        date={item.date}
                        category={item.category}
                        tag={item.tag}
                        impact={item.impact}
                        evidenceType={item.evidenceType}
                    />
                ))}
            </div>
        </div>
    );
};

export default Timeline;
