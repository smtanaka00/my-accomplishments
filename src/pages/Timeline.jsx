import React from 'react';
import TimelineEntry from '../components/TimelineEntry';
import { useGlobalState } from '../context/GlobalStateContext';

const Timeline = () => {
    const { achievements } = useGlobalState();
    // Removing local mock data array    
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
