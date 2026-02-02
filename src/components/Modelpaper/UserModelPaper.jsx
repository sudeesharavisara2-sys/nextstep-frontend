import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/ModelPaper.css';

const UserModelPaper = () => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [folderContent, setFolderContent] = useState({ subFolders: [], files: [] });
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [folderHistory, setFolderHistory] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);

    const [filters, setFilters] = useState({
        campus: '', faculty: '', year: '', semester: ''
    });

    const [formData, setFormData] = useState({ 
        folderName: '', file: null 
    });

    const token = localStorage.getItem('token');

    // Token check
    useEffect(() => {
        if (!token) navigate('/');
    }, [token, navigate]);

    // 1. Current User ID ගන්නවා
    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        console.log('🔍 User from localStorage:', user);
        if (user) {
            setCurrentUserId(user.id);
            console.log('✅ Current User ID set to:', user.id);
        }
    }, []);

    // 2. Filters වෙනස් වෙද්දී main folders ගන්නවා
    useEffect(() => {
        if (filters.campus && filters.faculty && filters.year && filters.semester) {
            fetchMainFolders();
            setSelectedFolderId(null);
            setFolderHistory([]);
        }
    }, [filters]);

    // 3. Folder select කරද්දී content ගන්නවා
    useEffect(() => {
        if (selectedFolderId) fetchFolderContent(selectedFolderId);
    }, [selectedFolderId]);

    const fetchMainFolders = async () => {
        try {
            console.log('📡 Fetching folders with filters:', filters);
            const res = await API.get('/files/filter', { params: filters });
            console.log('📦 Fetched Folders:', res.data);
            
            res.data.forEach((folder, index) => {
                console.log(`Folder ${index + 1}:`, {
                    name: folder.folderName,
                    ownerId: folder.owner?.id,
                    ownerName: folder.owner?.fullName,
                    currentUserId: currentUserId,
                    isOwner: folder.owner?.id === currentUserId
                });
            });
            
            setFolders(res.data);
        } catch (err) { 
            console.error("❌ Error fetching folders", err); 
            setFolders([]);
        }
    };

    const fetchFolderContent = async (folderId) => {
        try {
            console.log('📡 Fetching content for folder:', folderId);
            const res = await API.get(`/files/folder/${folderId}/content`);
            console.log('📦 Folder Content:', res.data);
            
            res.data.subFolders?.forEach((folder, index) => {
                console.log(`SubFolder ${index + 1}:`, {
                    name: folder.folderName,
                    ownerId: folder.owner?.id,
                    currentUserId: currentUserId,
                    isOwner: folder.owner?.id === currentUserId
                });
            });
            
            res.data.files?.forEach((file, index) => {
                console.log(`File ${index + 1}:`, {
                    name: file.fileName,
                    ownerId: file.owner?.id,
                    currentUserId: currentUserId,
                    isOwner: file.owner?.id === currentUserId
                });
            });
            
            setFolderContent(res.data);
        } catch (err) { 
            console.error("❌ Error loading content", err); 
            setFolderContent({ subFolders: [], files: [] });
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const requestBody = {
                folderName: formData.folderName,
                parentFolderId: selectedFolderId,
                ...filters 
            };
            await API.post('/files/folder', requestBody);
            alert("Folder Created!");
            setShowFolderModal(false);
            setFormData({ ...formData, folderName: '' });
            selectedFolderId ? fetchFolderContent(selectedFolderId) : fetchMainFolders();
        } catch (err) { 
            alert("Error creating folder."); 
            console.error(err);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFolderId) return alert("Select a folder first!");

        const data = new FormData();
        data.append('file', formData.file);
        data.append('folderId', selectedFolderId);

        try {
            await API.post('/files/upload', data);
            alert("File Uploaded!");
            setShowUploadModal(false);
            setFormData({ ...formData, file: null });
            fetchFolderContent(selectedFolderId);
        } catch (err) { 
            alert("Upload failed."); 
            console.error(err);
        }
    };

    const handleRename = async (id, currentName, type, ownerId) => {
        console.log('🔍 Rename check:', { ownerId, currentUserId, match: ownerId === currentUserId });
        
        if (ownerId !== currentUserId) {
            alert("You can only rename your own items!");
            return;
        }
        
        const newName = prompt(`Rename ${type}:`, currentName);
        if (!newName || newName === currentName) return;
        
        try {
            await API.put(`/files/rename?id=${id}&newName=${newName}&type=${type}`);
            alert(`${type} renamed successfully!`);
            selectedFolderId ? fetchFolderContent(selectedFolderId) : fetchMainFolders();
        } catch (err) { 
            alert("Rename failed."); 
            console.error(err);
        }
    };

    const handleDelete = async (id, type, ownerId) => {
        console.log('🔍 Delete check:', { ownerId, currentUserId, match: ownerId === currentUserId });
        
        if (ownerId !== currentUserId) {
            alert("You can only delete your own items!");
            return;
        }
        
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        
        try {
            await API.delete(`/files/${type}/${id}`);
            alert(`${type} deleted successfully!`);
            selectedFolderId ? fetchFolderContent(selectedFolderId) : fetchMainFolders();
        } catch (err) { 
            alert("Delete failed."); 
            console.error(err);
        }
    };

    const handleFolderClick = (folder) => {
        setSelectedFolderId(folder.id);
        setFolderHistory(prev => [...prev, folder]);
    };

    const handleGoBack = () => {
        const newHistory = [...folderHistory];
        newHistory.pop();
        setFolderHistory(newHistory);
        if (newHistory.length > 0) setSelectedFolderId(newHistory[newHistory.length - 1].id);
        else { setSelectedFolderId(null); fetchMainFolders(); }
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="logo"><h2>NEXTSTEP</h2></div>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => navigate('/dashboard')}>Home</li>
                    <li className="menu-item active">Model Papers</li>
                </ul>
            </aside>

            <main className="main-content">
                <div className="mp-container">
                    <div className="mp-header">
                        <h2>Model Papers</h2>
                        <div className="mp-header-actions">
                            <button className="btn-yellow" onClick={() => setShowFolderModal(true)}>+ New Folder</button>
                            <button className="btn-green" disabled={!selectedFolderId} onClick={() => setShowUploadModal(true)}>+ Upload PDF</button>
                        </div>
                    </div>

                    {/* Filter Section */}
                    <div className="filter-section">
                        <div className="form-grid">
                            {['campus', 'faculty', 'year', 'semester'].map(field => (
                                <select key={field} className="form-input" value={filters[field]} onChange={e => setFilters({...filters, [field]: e.target.value})}>
                                    <option value="">Select {field.charAt(0).toUpperCase() + field.slice(1)}</option>
                                    {field === 'campus' && (
                                        <>
                                            <option value="NSBM">NSBM</option>
                                            <option value="University of Plymouth">University of Plymouth</option>
                                            <option value="Victoria University">Victoria University</option>
                                        </>
                                    )}
                                    {field === 'faculty' && (
                                        <>
                                            <option value="FOB">FOB</option>
                                            <option value="FOC">FOC</option>
                                            <option value="FOE">FOE</option>
                                            <option value="FOS">FOS</option>
                                        </>
                                    )}
                                    {field === 'year' && (
                                        <>
                                            <option value="1st Year">1st Year</option>
                                            <option value="2nd Year">2nd Year</option>
                                            <option value="3rd Year">3rd Year</option>
                                            <option value="4th Year">4th Year</option>
                                        </>
                                    )}
                                    {field === 'semester' && (
                                        <>
                                            <option value="1st Semester">1st Semester</option>
                                            <option value="2nd Semester">2nd Semester</option>
                                        </>
                                    )}
                                </select>
                            ))}
                        </div>
                    </div>

                    {/* Breadcrumbs */}
                    <div className="breadcrumbs">
                        <span className="breadcrumb-item" onClick={() => { setSelectedFolderId(null); setFolderHistory([]); fetchMainFolders(); }}>
                            📚 All Subjects
                        </span>
                        {folderHistory.map(f => <span key={f.id} className="breadcrumb-separator"> / {f.folderName}</span>)}
                        {selectedFolderId && (
                            <button className="breadcrumb-back-btn" onClick={handleGoBack}>
                                ⬅ Back
                            </button>
                        )}
                    </div>

                   

                    {/* Content Display Grid */}
                    <div className="resource-grid">
                        
                        {/* Folders Display */}
                        {(selectedFolderId ? folderContent.subFolders : folders).map(folder => {
                            const isOwner = folder.owner?.id === currentUserId;
                            console.log(`Rendering folder "${folder.folderName}":`, { ownerId: folder.owner?.id, currentUserId, isOwner });
                            
                            return (
                                <div key={folder.id} className={`resource-card folder ${isOwner ? 'owner-card' : ''}`}>
                                    <div className="folder-clickable-area" onClick={() => handleFolderClick(folder)}>
                                        <div className="folder-icon">📁</div>
                                        <div className="folder-name">{folder.folderName}</div>
                                        <div className="folder-owner">by {folder.owner?.fullName || 'Unknown'}</div>
                                        {isOwner && <div className="owner-badge">(Your folder)</div>}
                                    </div>

                                    {/* Owner buttons */}
                                    {isOwner && (
                                        <div className="owner-actions">
                                            <button 
                                                className="btn-rename"
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleRename(folder.id, folder.folderName, 'folder', folder.owner.id); 
                                                }}>
                                                ✏️ Rename
                                            </button>
                                            <button 
                                                className="btn-delete"
                                                onClick={(e) => { 
                                                    e.stopPropagation(); 
                                                    handleDelete(folder.id, 'folder', folder.owner.id); 
                                                }}>
                                                🗑️ Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Files Display */}
                        {selectedFolderId && folderContent.files?.map(file => {
                            const isOwner = file.owner?.id === currentUserId;
                            console.log(`Rendering file "${file.fileName}":`, { ownerId: file.owner?.id, currentUserId, isOwner });
                            
                            return (
                                <div key={file.id} className={`resource-card file ${isOwner ? 'owner-card' : ''}`}>
                                    <div className="file-icon">📄</div>
                                    <div className="file-name-label">{file.fileName}</div>
                                    <div className="file-owner">by {file.owner?.fullName || 'Unknown'}</div>
                                    {isOwner && <div className="owner-badge">(Your file)</div>}
                                    
                                    <div className="file-actions">
                                        <button 
                                            className="btn-download"
                                            onClick={() => window.open(`http://localhost:8099/api/v1/files/download/${file.id}`)}>
                                            ⬇️ Download
                                        </button>
                                        
                                        {/* Owner buttons */}
                                        {isOwner && (
                                            <div className="owner-actions-inline">
                                                <button 
                                                    className="btn-rename-icon"
                                                    onClick={() => handleRename(file.id, file.fileName, 'file', file.owner.id)}>
                                                    ✏️
                                                </button>
                                                <button 
                                                    className="btn-delete-icon"
                                                    onClick={() => handleDelete(file.id, 'file', file.owner.id)}>
                                                    🗑️
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Empty States */}
                    {!selectedFolderId && folders.length === 0 && filters.campus && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📂</div>
                            <p>No folders found for the selected filters. Create one to get started!</p>
                        </div>
                    )}

                    {selectedFolderId && folderContent.subFolders?.length === 0 && folderContent.files?.length === 0 && (
                        <div className="empty-state">
                            <div className="empty-state-icon">📭</div>
                            <p>This folder is empty. Upload files or create subfolders!</p>
                        </div>
                    )}

                    {/* Modals */}
                    {showFolderModal && (
                        <div className="modal-overlay" onClick={() => setShowFolderModal(false)}>
                            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                                <h3>Create New Folder</h3>
                                <form onSubmit={handleCreateFolder}>
                                    <input 
                                        type="text" 
                                        placeholder="Enter folder name" 
                                        className="form-input" 
                                        required
                                        value={formData.folderName}
                                        onChange={e => setFormData({...formData, folderName: e.target.value})}
                                    />
                                    <button type="submit" className="modal-btn-submit">Create Folder</button>
                                    <button type="button" className="modal-btn-cancel" onClick={() => { setShowFolderModal(false); setFormData({...formData, folderName: ''}); }}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}

                    {showUploadModal && (
                        <div className="modal-overlay" onClick={() => setShowUploadModal(false)}>
                            <div className="modal-container" onClick={(e) => e.stopPropagation()}>
                                <h3>Upload PDF Document</h3>
                                <form onSubmit={handleUpload}>
                                    <input 
                                        type="file" 
                                        accept=".pdf" 
                                        className="form-input" 
                                        required 
                                        onChange={e => setFormData({...formData, file: e.target.files[0]})}
                                    />
                                    <button type="submit" className="modal-btn-submit">Upload File</button>
                                    <button type="button" className="modal-btn-cancel" onClick={() => { setShowUploadModal(false); setFormData({...formData, file: null}); }}>Cancel</button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
};

export default UserModelPaper;