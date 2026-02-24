import React from 'react';
import { FileText, Image, Paperclip } from 'lucide-react';

const TimelineEntry = ({ title, date, category, tag, impact, evidenceType }) => {
    // Determine evidence icon based on type
    const renderEvidenceIcon = () => {
        switch (evidenceType) {
            case 'pdf': return <FileText size={16} className="text-muted" />;
            case 'image': return <Image size={16} className="text-muted" />;
            default: return <Paperclip size={16} className="text-muted" />;
        }
    };

    return (
        <div className="flex gap-4" style={{ position: 'relative', marginBottom: 'var(--space-6)' }}>
            {/* Timeline Line & Dot */}
            <div className="flex-col items-center" style={{ minWidth: '24px' }}>
                <div style={{
                    width: '12px', height: '12px', borderRadius: '50%',
                    backgroundColor: 'var(--color-primary)', zIndex: 2,
                    boxShadow: '0 0 0 4px var(--color-base)'
                }}></div>
                <div style={{
                    flex: 1, width: '2px', backgroundColor: 'var(--color-border)',
                    position: 'absolute', top: '12px', bottom: '-24px', left: '5px', zIndex: 1
                }}></div>
            </div>

            {/* Content Card */}
            <div className="card flex-col gap-2" style={{ flex: 1 }}>
                <div className="flex justify-between items-start">
                    <div className="flex-col gap-1">
                        <h3 className="font-semibold text-base">{title}</h3>
                        <span className="text-xs text-muted">{date}</span>
                    </div>
                    {evidenceType && (
                        <div style={{ padding: '4px', backgroundColor: 'var(--color-base)', borderRadius: 'var(--border-radius-sm)' }}>
                            {renderEvidenceIcon()}
                        </div>
                    )}
                </div>

                <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{
                        fontSize: 'var(--font-size-xs)', padding: '2px 8px', borderRadius: 'var(--border-radius-full)',
                        backgroundColor: 'var(--color-surface-hover)', border: '1px solid var(--color-border)', color: 'var(--color-text)'
                    }}>
                        {category}
                    </span>
                    <span style={{
                        fontSize: 'var(--font-size-xs)', padding: '2px 8px', borderRadius: 'var(--border-radius-full)',
                        backgroundColor: '#3b82f620', border: '1px solid #3b82f650', color: '#60a5fa'
                    }}>
                        {tag}
                    </span>
                </div>

                <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)', lineHeight: '1.4' }}>
                    {impact}
                </p>
            </div>
        </div>
    );
};

export default TimelineEntry;
