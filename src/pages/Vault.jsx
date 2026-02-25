import React, { useState, useRef } from 'react';
import {
    Search, Filter, Folder, Image as ImageIcon, FileText, ArrowRight,
    UploadCloud, ExternalLink, CheckCircle, Trash2, ChevronRight, X
} from 'lucide-react';
import { useGlobalState } from '../context/GlobalStateContext';
import { supabase } from '../supabase';

const NAMED_FOLDERS = ['Certifications', 'Performance Reviews', 'Awards', 'Publications'];

const Vault = () => {
    const { files, session, addFile, deleteFile } = useGlobalState();
    const [activeTab, setActiveTab] = useState('folders');
    const [searchQuery, setSearchQuery] = useState('');
    const [activeFolder, setActiveFolder] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const fabInputRef = useRef(null);

    // Dynamic folder list — current year + 5 previous years + named folders
    const currentYear = new Date().getFullYear();
    const yearFolders = Array.from({ length: 6 }, (_, i) => String(currentYear - i));
    const folders = [...yearFolders, ...NAMED_FOLDERS];

    // Filter files by search query and active folder
    const filteredFiles = files.filter(file => {
        const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (!activeFolder) return matchesSearch;
        const isYearFolder = /^\d{4}$/.test(activeFolder);
        if (isYearFolder) return matchesSearch && file.date.includes(activeFolder);
        // Named folder: match by folder tag or by whether the file path includes the folder name
        return matchesSearch && (
            file.folder === activeFolder ||
            (file.path && file.path.toLowerCase().includes(activeFolder.toLowerCase()))
        );
    });

    const handleFolderClick = (folder) => {
        setActiveFolder(folder);
        setActiveTab('files');
    };

    const clearFolderFilter = () => {
        setActiveFolder(null);
        setActiveTab('folders');
        setSearchQuery('');
    };

    const handleFileClick = async (file) => {
        if (!file.path) return;
        const { data } = supabase.storage.from('evidence_vault').getPublicUrl(file.path);
        if (data?.publicUrl) window.open(data.publicUrl, '_blank');
    };

    const handleDeleteFile = async (e, file) => {
        e.stopPropagation(); // don't open file on delete click
        const confirmed = window.confirm(
            `Delete "${file.name}"?\n\nThis action cannot be undone.`
        );
        if (!confirmed) return;
        await deleteFile(file);
    };

    const handleFabUpload = async (e) => {
        const file = e.target.files[0];
        if (!file || !session?.user) return;
        setUploading(true);

        // If a named folder is active, prefix the path with the folder name
        const folderPrefix = activeFolder && !/^\d{4}$/.test(activeFolder)
            ? `${activeFolder}/`
            : '';
        const filePath = `${session.user.id}/${folderPrefix}${file.name}`;

        const { error } = await supabase.storage
            .from('evidence_vault')
            .upload(filePath, file, { upsert: true });

        if (!error) {
            const ext = file.name.split('.').pop();
            addFile({
                name: file.name,
                type: ['pdf'].includes(ext?.toLowerCase()) ? 'pdf' : 'image',
                date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
                size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                path: filePath,
                folder: activeFolder || null
            });
            setUploadSuccess(true);
            setTimeout(() => setUploadSuccess(false), 2500);
            setActiveTab('files');
        }
        setUploading(false);
        fabInputRef.current.value = '';
    };

    return (
        <div className="flex-col gap-6" style={{ paddingBottom: 'var(--space-8)' }}>
            <header className="flex-col gap-1 text-center" style={{ marginTop: 'var(--space-2)' }}>
                <h1 className="text-2xl">Evidence Vault</h1>
                <p className="text-muted text-sm">Your secure document library. Files are kept forever.</p>
            </header>

            {/* Search Bar */}
            <div style={{ position: 'relative' }}>
                <Search size={18} color="var(--color-text-muted)" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                    type="text"
                    placeholder="Search documents..."
                    value={searchQuery}
                    onChange={(e) => {
                        setSearchQuery(e.target.value);
                        if (e.target.value) setActiveTab('files');
                    }}
                    style={{
                        width: '100%', padding: '12px 12px 12px 40px', backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)', borderRadius: 'var(--border-radius-full)',
                        color: 'var(--color-text)', outline: 'none'
                    }}
                />
                {searchQuery && (
                    <button
                        onClick={() => setSearchQuery('')}
                        style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}
                    >
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Breadcrumb when folder is active */}
            {activeFolder && (
                <div className="flex items-center gap-2" style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-muted)' }}>
                    <button onClick={clearFolderFilter} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontWeight: '500', padding: 0 }}>
                        Vault
                    </button>
                    <ChevronRight size={14} />
                    <span style={{ color: 'var(--color-text)', fontWeight: '500' }}>{activeFolder}</span>
                    <button onClick={clearFolderFilter} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', display: 'flex' }}>
                        <X size={16} />
                    </button>
                </div>
            )}

            {/* Tabs */}
            <div className="flex" style={{ borderBottom: '1px solid var(--color-border)' }}>
                <button
                    onClick={() => { setActiveTab('folders'); setActiveFolder(null); }}
                    style={{
                        flex: 1, padding: 'var(--space-3)', fontWeight: '500',
                        color: activeTab === 'folders' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        borderBottom: activeTab === 'folders' ? '2px solid var(--color-primary)' : '2px solid transparent'
                    }}
                >
                    Folders
                </button>
                <button
                    onClick={() => setActiveTab('files')}
                    style={{
                        flex: 1, padding: 'var(--space-3)', fontWeight: '500',
                        color: activeTab === 'files' ? 'var(--color-primary)' : 'var(--color-text-muted)',
                        borderBottom: activeTab === 'files' ? '2px solid var(--color-primary)' : '2px solid transparent'
                    }}
                >
                    All Files {files.length > 0 && `(${files.length})`}
                </button>
            </div>

            {/* Content Area */}
            {activeTab === 'folders' ? (
                <div className="flex-col gap-3">
                    {folders.map(folder => {
                        // Count files in this folder
                        const isYearFolder = /^\d{4}$/.test(folder);
                        const count = files.filter(f =>
                            isYearFolder
                                ? f.date.includes(folder)
                                : f.folder === folder || (f.path && f.path.toLowerCase().includes(folder.toLowerCase()))
                        ).length;

                        return (
                            <div
                                key={folder}
                                className="card flex justify-between items-center"
                                style={{ padding: 'var(--space-3)', cursor: 'pointer' }}
                                onClick={() => handleFolderClick(folder)}
                            >
                                <div className="flex gap-3 items-center">
                                    <Folder size={24} color="#3b82f6" />
                                    <div className="flex-col gap-0">
                                        <span className="font-medium text-base">{folder}</span>
                                        <span className="text-xs text-muted">{count} {count === 1 ? 'file' : 'files'}</span>
                                    </div>
                                </div>
                                <ArrowRight size={18} color="var(--color-text-muted)" />
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="flex-col gap-3">
                    {filteredFiles.length === 0 ? (
                        <div className="text-center text-muted" style={{ padding: 'var(--space-8)' }}>
                            {activeFolder
                                ? `No files in "${activeFolder}" yet. Upload one!`
                                : searchQuery
                                    ? 'No documents matched your search.'
                                    : 'No files uploaded yet. Tap the button below to upload.'}
                        </div>
                    ) : (
                        filteredFiles.map(file => (
                            <div
                                key={file.id}
                                className="card flex justify-between items-center"
                                style={{ padding: 'var(--space-3)', cursor: 'pointer' }}
                                onClick={() => handleFileClick(file)}
                            >
                                <div className="flex gap-3 items-center" style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ padding: '8px', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--border-radius-md)', flexShrink: 0 }}>
                                        {file.type === 'pdf'
                                            ? <FileText size={20} color="var(--color-text-muted)" />
                                            : <ImageIcon size={20} color="var(--color-text-muted)" />}
                                    </div>
                                    <div className="flex-col gap-1" style={{ minWidth: 0 }}>
                                        <span className="font-medium text-sm" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '180px', display: 'block' }}>
                                            {file.name}
                                        </span>
                                        <div className="flex gap-2">
                                            <span className="text-xs text-muted">{file.date}</span>
                                            <span className="text-xs text-muted">•</span>
                                            <span className="text-xs text-muted">{file.size}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center" style={{ flexShrink: 0 }}>
                                    <ExternalLink size={16} color="var(--color-text-muted)" />
                                    <button
                                        onClick={(e) => handleDeleteFile(e, file)}
                                        title="Delete file"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--color-text-muted)', display: 'flex', padding: '4px',
                                            borderRadius: 'var(--border-radius-md)'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* Quick Upload FAB */}
            <input
                type="file"
                ref={fabInputRef}
                onChange={handleFabUpload}
                style={{ display: 'none' }}
                accept=".pdf,image/png,image/jpeg,image/jpg,.doc,.docx"
            />
            <button
                onClick={() => fabInputRef.current?.click()}
                disabled={uploading}
                style={{
                    position: 'fixed', bottom: '80px', right: 'calc(50% - 240px + 20px)',
                    backgroundColor: uploadSuccess ? '#10b981' : 'var(--color-primary)', color: 'var(--color-base)',
                    width: '56px', height: '56px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: 'var(--shadow-lg)', zIndex: 100, transition: 'background-color 0.3s',
                    opacity: uploading ? 0.7 : 1
                }}
                className="fab"
                title={activeFolder ? `Upload to ${activeFolder}` : 'Upload to Vault'}
            >
                {uploadSuccess ? <CheckCircle size={24} /> : <UploadCloud size={24} />}
            </button>

            {uploadSuccess && (
                <div style={{
                    position: 'fixed', bottom: '148px', right: 'calc(50% - 240px + 20px)',
                    backgroundColor: '#10b981', color: 'white', padding: '6px 12px',
                    borderRadius: 'var(--border-radius-md)', fontSize: '13px', fontWeight: '500',
                    boxShadow: 'var(--shadow-lg)', zIndex: 100, whiteSpace: 'nowrap'
                }}>
                    Uploaded!
                </div>
            )}

            <style>{`
        @media (max-width: 480px) {
          .fab { right: 20px !important; }
        }
      `}</style>
        </div>
    );
};

export default Vault;
