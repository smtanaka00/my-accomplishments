import React, { useState } from 'react';
import { FileText, Image, Paperclip, MoreVertical, Trash2, Edit3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TimelineEntry = ({ item, onDelete }) => {
    const { id, title, date, display_date, category, tag, impact, evidence_type } = item;
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const renderEvidenceIcon = () => {
        switch (evidence_type) {
            case 'pdf': return <FileText size={16} className="text-muted" />;
            case 'image': return <Image size={16} className="text-muted" />;
            default: return <Paperclip size={16} className="text-muted" />;
        }
    };

    const handleEdit = () => {
        setMenuOpen(false);
        navigate('/log', { state: { editItem: item } });
    };

    const handleDelete = async () => {
        setMenuOpen(false);
        const confirmed = window.confirm(
            `Delete "${title}"?\n\nThis cannot be undone.`
        );
        if (confirmed && onDelete) {
            await onDelete(id);
        }
    };

    const displayedDate = display_date || (date ? new Date(date + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : '');

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
                    <div className="flex-col gap-1" style={{ flex: 1, minWidth: 0 }}>
                        <h3 className="font-semibold text-base">{title}</h3>
                        <span className="text-xs text-muted">{displayedDate}</span>
                    </div>

                    <div className="flex gap-2 items-center" style={{ flexShrink: 0 }}>
                        {evidence_type && (
                            <div style={{ padding: '4px', backgroundColor: 'var(--color-base)', borderRadius: 'var(--border-radius-sm)' }}>
                                {renderEvidenceIcon()}
                            </div>
                        )}

                        {/* ⋯ More Options Menu */}
                        <div style={{ position: 'relative' }}>
                            <button
                                onClick={() => setMenuOpen(v => !v)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: 'var(--color-text-muted)', display: 'flex',
                                    padding: '4px', borderRadius: 'var(--border-radius-sm)'
                                }}
                                title="Options"
                            >
                                <MoreVertical size={16} />
                            </button>

                            {menuOpen && (
                                <>
                                    {/* Backdrop to close menu */}
                                    <div
                                        onClick={() => setMenuOpen(false)}
                                        style={{ position: 'fixed', inset: 0, zIndex: 10 }}
                                    />
                                    <div style={{
                                        position: 'absolute', right: 0, top: '28px',
                                        backgroundColor: 'var(--color-surface)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--border-radius-md)',
                                        boxShadow: 'var(--shadow-lg)',
                                        zIndex: 20, minWidth: '120px', overflow: 'hidden'
                                    }}>
                                        <button
                                            onClick={handleEdit}
                                            className="flex gap-2 items-center"
                                            style={{
                                                width: '100%', padding: '10px 14px',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--color-text)', fontSize: 'var(--font-size-sm)',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <Edit3 size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={handleDelete}
                                            className="flex gap-2 items-center"
                                            style={{
                                                width: '100%', padding: '10px 14px',
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: '#ef4444', fontSize: 'var(--font-size-sm)',
                                                textAlign: 'left',
                                                borderTop: '1px solid var(--color-border)'
                                            }}
                                        >
                                            <Trash2 size={14} /> Delete
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: '4px' }}>
                    <span style={{
                        fontSize: 'var(--font-size-xs)', padding: '2px 8px',
                        borderRadius: 'var(--border-radius-full)',
                        backgroundColor: 'var(--color-surface-hover)',
                        border: '1px solid var(--color-border)', color: 'var(--color-text)'
                    }}>
                        {category}
                    </span>
                    <span style={{
                        fontSize: 'var(--font-size-xs)', padding: '2px 8px',
                        borderRadius: 'var(--border-radius-full)',
                        backgroundColor: '#3b82f620', border: '1px solid #3b82f650', color: '#60a5fa'
                    }}>
                        {tag}
                    </span>
                </div>

                <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: '1.4', marginTop: '4px' }}>
                    {impact}
                </p>
            </div>
        </div>
    );
};

export default TimelineEntry;
