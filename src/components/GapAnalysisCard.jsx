import React from 'react';
import { Target, AlertTriangle, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

const GapAnalysisCard = ({ year }) => {
    const { profile, achievements } = useGlobalState();
    const targetGoal = profile?.target_goal || "Your Goal";

    // Fallback to empty array if undefined
    const safeAchievements = achievements || [];
    const yearAchievements = safeAchievements.filter(ach => ach.date && ach.date.startsWith(year));

    // Desired criteria for O-1/EB-2 NIW
    const TARGET_CRITERIA = [
        'Original Contribution',
        'Critical Role',
        'High Salary',
        'Display of Work',
        'Publication',
        'Award'
    ];

    // Find what criteria the user has hit
    const hitCriteria = new Set();
    yearAchievements.forEach(ach => {
        if (TARGET_CRITERIA.includes(ach.category)) hitCriteria.add(ach.category);
        if (TARGET_CRITERIA.includes(ach.tag)) hitCriteria.add(ach.tag);
    });

    const missingCriteria = TARGET_CRITERIA.filter(c => !hitCriteria.has(c));
    const metCriteria = TARGET_CRITERIA.filter(c => hitCriteria.has(c));

    const progress = Math.round((metCriteria.length / TARGET_CRITERIA.length) * 100);

    return (
        <div className="card flex-col gap-4">
            <h2 className="font-semibold text-lg" style={{ color: 'var(--color-primary)' }}>Visa/Promotion Gap Analysis</h2>

            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="text-sm font-medium">Pathway Readiness</span>
                    <span className="text-sm font-bold" style={{ color: 'var(--color-primary)' }}>{progress}%</span>
                </div>
                <div style={{ width: '100%', backgroundColor: 'var(--color-surface-hover)', height: '8px', borderRadius: '4px' }}>
                    <div style={{ width: `${progress}%`, backgroundColor: 'var(--color-primary)', height: '100%', borderRadius: '4px', transition: 'width 0.3s ease' }}></div>
                </div>
            </div>

            <div className="flex-col gap-2">
                <h3 className="text-sm font-semibold text-muted">Evidence Gaps</h3>
                {missingCriteria.length === 0 ? (
                    <p className="text-sm flex items-center gap-2" style={{ color: 'var(--color-primary)' }}>
                        <CheckCircle2 size={16} /> All target criteria met for this year!
                    </p>
                ) : (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {missingCriteria.map(c => (
                            <span key={c} className="text-xs flex items-center gap-1" style={{ padding: '4px 8px', borderRadius: '9999px', border: '1px solid var(--color-accent)', color: 'var(--color-accent)' }}>
                                <AlertCircle size={12} /> {c}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {metCriteria.length > 0 && (
                <div className="flex-col gap-2" style={{ marginTop: 'var(--space-2)' }}>
                    <h3 className="text-sm font-semibold text-muted">Strengths Built</h3>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                        {metCriteria.map(c => (
                            <span key={c} className="text-xs" style={{ padding: '4px 8px', borderRadius: '9999px', backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text)' }}>
                                ✓ {c}
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GapAnalysisCard;
