import React, { useState } from 'react';
import { Search, Filter, Folder, Image as ImageIcon, FileText, ArrowRight, UploadCloud } from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';

const Vault = () => {
    const { files } = useGlobalState();
    const [activeTab, setActiveTab] = useState('folders'); // 'folders' or 'files'
    const [searchQuery, setSearchQuery] = useState('');

    const folders = ['2024', '2023', '2022', 'Certifications', 'Performance Reviews'];

    // Removing local files array    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return (
        <div className="flex-col gap-6" style={{ paddingBottom: 'var(--space-8)' }}>
            <header className="flex-col gap-1 text-center" style={{ marginTop: 'var(--space-2)' }}>
                <h1 className="text-2xl">Evidence Vault</h1>
                <p className="text-muted text-sm">Your secure document library.</p>
            </header>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    type="text"
                    placeholder="Search documents by keywords..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-full)',
                        color: 'var(--color-text)', outline: 'none'
                    }}
                />
                <div style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', padding: '8px', cursor: 'pointer', backgroundColor: 'var(--color-surface-hover)', borderRadius: '50%' }}>
                    <Filter size={16} color="var(--color-text)" />
                </div>
            </div>

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => setActiveTab('folders')}
                    style={{
                        flex: 1, padding: 'var(--space-3)', fontWeight: '500',
                        color: activeTab === 'folders' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        borderBottom: activeTab === 'folders' ? '2px solid var(--color-primary)' : '2px solid transparent'
                    }}
                >
                    Folders Structure
                </button>
                <button
                    onClick={() => setActiveTab('files')}
                    style={{
                        flex: 1, padding: 'var(--space-3)', fontWeight: '500',
                        color: activeTab === 'files' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        borderBottom: activeTab === 'files' ? '2px solid var(--color-primary)' : '2px solid transparent'
                    }}
                >
                    All Files
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'folders' && !searchQuery ? (
                <div className="flex-col gap-3">
                    {folders.map(folder => (
                        <div key={folder} className="card flex justify-between items-center" style={{ padding: 'var(--space-3)', cursor: 'pointer' }}>
                            <div className="flex gap-3 items-center">
                                <Folder size={24} color="#3b82f6" />
                                <span className="font-medium text-base">{folder}</span>
                            </div>
                            <ArrowRight size={18} color="var(--color-text-muted)" />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-col gap-3">
                    {filteredFiles.map(file => (
                        <div key={file.id} className="card flex justify-between items-center" style={{ padding: 'var(--space-3)' }}>
                            <div className="flex gap-3 items-center">
                                <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--border-radius-md)' }}>
                                    {file.type === 'pdf' ? <FileText size={20} color="var(--color-text-muted)" /> : <ImageIcon size={20} color="var(--color-text-muted)" />}
                                </div>
                                <div className="flex-col gap-1">
                                    <span className="font-medium text-sm text-ellipsis" style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden' }}>{file.name}</span>
                                    <div className="flex gap-2">
                                        <span className="text-xs text-muted">{file.date}</span>
                                        <span className="text-xs text-muted">&bull;</span>
                                        <span className="text-xs text-muted">{file.size}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredFiles.length === 0 && (
                        <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                            No documents matched your search.
                        </div>
                    )}
                </div>
            )}

            {/* Quick Upload FAB */}
            <button
                style={{
                    position: 'fixed', bottom: '80px', right: 'calc(50% - 240px + 20px)', // Adapting to the max-width 480px container constraint
                    backgroundColor: 'var(--color-primary)', color: 'var(--color-base)',
                    width: '56px', height: '56px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)', zIndex: 100
                }}
                // Small hack for accurate right offset in desktop window resizing, max to right 20px if purely mobile
                className="fab"
            >
                <UploadCloud size={24} />
            </button>

            <style>{`
        @media (max-width: 480px) {
          .fab {
            right: 20px !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Vault;
