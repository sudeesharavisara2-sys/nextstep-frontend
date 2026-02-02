import React, { useState, useEffect } from 'react';
import API from '../../api'; 
import '../../styles/ModelPaper.css';

const AdminModelPaper = () => {
    const [folders, setFolders] = useState([]);
    const [folderContent, setFolderContent] = useState({ subFolders: [], files: [] });
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [showFolderModal, setShowFolderModal] = useState(false);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [folderHistory, setFolderHistory] = useState([]); // Navigation සඳහා

    const [formData, setFormData] = useState({ 
        campus: '', faculty: '', year: '', semester: '', file: null, folderName: '' 
    });

    // Filters වෙනස් වූ විට මුල සිට ආරම්භ කිරීම
    useEffect(() => {
        if (formData.campus && formData.faculty && formData.year && formData.semester) {
            fetchFolders();
            setSelectedFolderId(null);
            setFolderHistory([]);
            setFolderContent({ subFolders: [], files: [] });
        }
    }, [formData.campus, formData.faculty, formData.year, formData.semester]);

    // Folder එකක් select කළ විට එහි content ලබා ගැනීම
    useEffect(() => {
        if (selectedFolderId) {
            fetchFolderContent(selectedFolderId);
        }
    }, [selectedFolderId]);

    const fetchFolders = async () => {
        try {
            const res = await API.get('/files/filter', {
                params: {
                    faculty: formData.faculty,
                    campus: formData.campus,
                    year: formData.year,
                    semester: formData.semester
                }
            });
            setFolders(res.data);
        } catch (err) {
            console.error("Error fetching folders", err);
            setFolders([]);
        }
    };

    const fetchFolderContent = async (folderId) => {
        try {
            const res = await API.get(`/files/folder/${folderId}/content`);
            setFolderContent(res.data);
        } catch (err) {
            console.error("Error fetching folder content", err);
        }
    };

    // Folder එකක් ඇතුළට යාම
    const handleFolderClick = (folder) => {
        setSelectedFolderId(folder.id);
        setFolderHistory(prev => [...prev, folder]);
    };

    // ආපසු පස්සට යාම (Back Navigation)
    const handleGoBack = () => {
        const newHistory = [...folderHistory];
        newHistory.pop(); // දැනට ඉන්න එක අයින් කරනවා
        setFolderHistory(newHistory);

        if (newHistory.length > 0) {
            setSelectedFolderId(newHistory[newHistory.length - 1].id);
        } else {
            setSelectedFolderId(null);
            fetchFolders(); // ආයෙත් Main folders වලට යනවා
        }
    };

    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const requestBody = {
                folderName: formData.folderName,
                parentFolderId: selectedFolderId, // දැනට ඉන්න folder එක parent වෙනවා
                faculty: formData.faculty,
                campus: formData.campus,
                year: formData.year,
                semester: formData.semester
            };
            await API.post('/files/folder', requestBody);
            alert("Folder Created Successfully!");
            setShowFolderModal(false);
            
            // Refresh content
            if (selectedFolderId) fetchFolderContent(selectedFolderId);
            else fetchFolders();
        } catch (err) {
            alert("Error creating folder.");
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!selectedFolderId) {
            alert("Please select a folder first!");
            return;
        }
        const data = new FormData();
        data.append('file', formData.file);
        data.append('folderId', selectedFolderId);

        try {
            await API.post('/files/upload', data);
            setShowUploadModal(false);
            alert("File uploaded successfully!");
            fetchFolderContent(selectedFolderId);
        } catch (err) {
            alert("Upload failed.");
        }
    };

    const handleRename = async (id, currentName, type) => {
        const newName = prompt(`Enter new name for ${type}:`, currentName);
        if (!newName || newName === currentName) return;

        try {
            await API.put(`/files/rename?id=${id}&newName=${newName}&type=${type}`);
            alert(`${type} renamed successfully!`);
            if (selectedFolderId) fetchFolderContent(selectedFolderId);
            else fetchFolders();
        } catch (err) {
            alert("Rename failed.");
        }
    };

    const handleDelete = async (id, type) => {
        if (!window.confirm(`Are you sure you want to delete this ${type}?`)) return;
        try {
            await API.delete(`/files/${type}/${id}`);
            alert(`${type} deleted successfully!`);
            if (selectedFolderId) fetchFolderContent(selectedFolderId);
            else fetchFolders();
        } catch (err) {
            alert("Delete failed.");
        }
    };

    return (
        <div className="mp-container">
            <div className="mp-header">
                <h2 style={{ color: '#006837' }}>Manage Model Papers</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="btn-yellow" onClick={() => setShowFolderModal(true)}>+ New Folder</button>
                    <button className="btn-green" disabled={!selectedFolderId} onClick={() => setShowUploadModal(true)}>+ Upload PDF</button>
                </div>
            </div>

            {/* Filter Section (පරණ විදිහටම) */}
            <div className="filter-section" style={{ background: '#f0f2f5', padding: '15px', borderRadius: '10px', marginBottom: '20px' }}>
                <div className="form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                    <select className="form-input" required onChange={e => setFormData({...formData, campus: e.target.value})}>
                        <option value="">Select Campus</option>
                        <option value="NSBM">NSBM</option>
                        <option value="University of Plymouth">University of Plymouth</option>
                        <option value="Victoria University">Victoria University</option>
                    </select>
                    <select className="form-input" required onChange={e => setFormData({...formData, faculty: e.target.value})}>
                        <option value="">Select Faculty</option>
                        <option value="FOB">FOB</option>
                        <option value="FOC">FOC</option>
                        <option value="FOE">FOE</option>
                        <option value="FOS">FOS</option>
                    </select>
                    <select className="form-input" required onChange={e => setFormData({...formData, year: e.target.value})}>
                        <option value="">Select Year</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                    </select>
                    <select className="form-input" required onChange={e => setFormData({...formData, semester: e.target.value})}>
                        <option value="">Select Semester</option>
                        <option value="1st Semester">1st Semester</option>
                        <option value="2nd Semester">2nd Semester</option>
                    </select>
                </div>
            </div>

            {/* Breadcrumbs Navigation */}
            <div className="breadcrumbs" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ cursor: 'pointer', color: '#006837', fontWeight: 'bold' }} onClick={() => { setSelectedFolderId(null); setFolderHistory([]); fetchFolders(); }}>Root</span>
                {folderHistory.map((folder, index) => (
                    <span key={folder.id}> &gt; {folder.folderName}</span>
                ))}
                {selectedFolderId && (
                    <button onClick={handleGoBack} style={{ marginLeft: '10px', padding: '2px 8px', borderRadius: '5px', cursor: 'pointer' }}>⬅ Back</button>
                )}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1.5 }}>
                    <h4>Folders & Files</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                        {/* 1. Folders Display */}
                        {(selectedFolderId ? folderContent.subFolders : folders).map(folder => (
                            <div key={folder.id} className="folder-card" onClick={() => handleFolderClick(folder)}
                                style={{ padding: '12px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer', background: '#fff', display: 'flex', justifyContent: 'space-between' }}>
                                <span>📁 {folder.folderName}</span>
                                <div style={{ display: 'flex', gap: '5px' }}>
                                    <button onClick={(e) => { e.stopPropagation(); handleRename(folder.id, folder.folderName, 'folder'); }}>✏️</button>
                                    <button onClick={(e) => { e.stopPropagation(); handleDelete(folder.id, 'folder'); }}>🗑️</button>
                                </div>
                            </div>
                        ))}

                        {/* 2. Files Display */}
                        {selectedFolderId && folderContent.files?.map(file => (
                            <div key={file.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #eee', background: '#f9f9f9', borderRadius: '5px' }}>
                                <span>📄 {file.fileName}</span>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button onClick={() => window.open(`http://localhost:8099/api/v1/files/download/${file.id}`)}>⬇️</button>
                                    <button onClick={() => handleRename(file.id, file.fileName, 'file')}>✏️</button>
                                    <button onClick={() => handleDelete(file.id, 'file')}>🗑️</button>
                                </div>
                            </div>
                        ))}

                        {(!selectedFolderId && folders.length === 0) || (selectedFolderId && folderContent.subFolders?.length === 0 && folderContent.files?.length === 0) ? (
                            <p style={{ color: '#999' }}>Empty folder or no results found.</p>
                        ) : null}
                    </div>
                </div>
            </div>

            {/* Modals remain the same as your code */}
            {/* Create Folder Modal */}
            {showFolderModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>Create New {selectedFolderId ? 'Sub-Folder' : 'Subject Folder'}</h3>
                        <form onSubmit={handleCreateFolder}>
                            <input type="text" placeholder="Folder Name" className="form-input" required
                                onChange={e => setFormData({...formData, folderName: e.target.value})} />
                            <button type="submit" className="btn-primary" style={{width:'100%', marginTop:'10px'}}>Create</button>
                            <button type="button" className="btn-red" onClick={() => setShowFolderModal(false)} style={{width:'100%', marginTop:'5px'}}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <h3>Upload PDF to: {folderHistory[folderHistory.length-1]?.folderName}</h3>
                        <form onSubmit={handleUpload}>
                            <input type="file" accept=".pdf" className="form-input" required 
                                onChange={e => setFormData({...formData, file: e.target.files[0]})} />
                            <button type="submit" className="btn-primary" style={{width:'100%', marginTop:'10px'}}>Upload</button>
                            <button type="button" className="btn-red" onClick={() => setShowUploadModal(false)} style={{width:'100%', marginTop:'5px'}}>Cancel</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminModelPaper;