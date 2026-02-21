import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/ModelPapers.css';

const ModelPapers = () => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [files, setFiles] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    
    // Modal states
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isFileModalOpen, setIsFileModalOpen] = useState(false);
    
    // Form data
    const [folderFormData, setFolderFormData] = useState({
        name: '',
        description: '',
        parentFolderId: null
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileDescription, setFileDescription] = useState('');

    const token = localStorage.getItem('token');

    // ⭐ Ensure userRole is set (silently, no alerts)
    useEffect(() => {
        const currentRole = localStorage.getItem('userRole');
        if (!currentRole || currentRole !== 'ADMIN') {
            localStorage.setItem('userRole', 'ADMIN');
        }
        
        if (!token) {
            navigate('/login');
        } else {
            loadRootFolders();
        }
    }, [token, navigate]);

    // Load root folders
    const loadRootFolders = async () => {
        try {
            const res = await API.get('/files/folders/root', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setFolders(res.data);
            setCurrentFolder(null);
            setBreadcrumb([]);
            setFiles([]);
        } catch (err) {
            console.error("Load folders error:", err);
            if (err.response?.status === 403) {
                alert('Access denied. Please login as Admin.');
                navigate('/login');
            }
        }
    };

    // Open a folder
    const openFolder = async (folder) => {
        try {
            // Get subfolders
            const foldersRes = await API.get(`/files/folders/${folder.id}/subfolders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            // Get files in folder
            const filesRes = await API.get(`/files/folders/${folder.id}/files`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setFolders(foldersRes.data);
            setFiles(filesRes.data);
            setCurrentFolder(folder);
            
            // Update breadcrumb
            const newBreadcrumb = [...breadcrumb, folder];
            setBreadcrumb(newBreadcrumb);
        } catch (err) {
            console.error("Open folder error:", err);
        }
    };

    // Navigate breadcrumb
    const navigateToBreadcrumb = async (index) => {
        if (index === -1) {
            loadRootFolders();
        } else {
            const folder = breadcrumb[index];
            const newBreadcrumb = breadcrumb.slice(0, index + 1);
            setBreadcrumb(newBreadcrumb);
            await openFolder(folder);
        }
    };

    // Create folder
    const handleCreateFolder = async (e) => {
        e.preventDefault();
        try {
            const data = {
                name: folderFormData.name,
                description: folderFormData.description,
                parentFolderId: currentFolder?.id || null
            };

            const res = await API.post('/files/folders/create', data, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (res.status === 201) {
                alert('Folder created successfully!');
                setIsFolderModalOpen(false);
                setFolderFormData({ name: '', description: '', parentFolderId: null });
                
                // Reload current view
                if (currentFolder) {
                    openFolder(currentFolder);
                } else {
                    loadRootFolders();
                }
            }
        } catch (error) {
            console.error("Create folder error:", error);
            const errorMessage = error.response?.data?.message || error.response?.data || "Failed to create folder";
            alert(errorMessage);
        }
    };

    // Upload file
    const handleFileUpload = async (e) => {
        e.preventDefault();
        
        if (!currentFolder) {
            alert('Please select a folder first!');
            return;
        }

        if (!selectedFile) {
            alert('Please select a file!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            formData.append('folderId', currentFolder.id);
            formData.append('description', fileDescription);

            const res = await API.post('/files/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                alert('File uploaded successfully!');
                setIsFileModalOpen(false);
                setSelectedFile(null);
                setFileDescription('');
                openFolder(currentFolder);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.response?.data?.message || "Failed to upload file");
        }
    };

    // Delete folder
    const deleteFolder = async (folderId) => {
        if (window.confirm('Are you sure? This will delete all subfolders and files!')) {
            try {
                const res = await API.delete(`/files/folders/${folderId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.status === 200) {
                    alert('Folder deleted successfully!');
                    if (currentFolder) {
                        openFolder(currentFolder);
                    } else {
                        loadRootFolders();
                    }
                }
            } catch (err) {
                console.error("Delete folder error:", err);
                alert(err.response?.data?.message || "Failed to delete folder");
            }
        }
    };

    // Delete file
    const deleteFile = async (fileId) => {
        if (window.confirm('Are you sure you want to delete this file?')) {
            try {
                const res = await API.delete(`/files/${fileId}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (res.status === 200) {
                    alert('File deleted successfully!');
                    openFolder(currentFolder);
                }
            } catch (err) {
                console.error("Delete file error:", err);
                alert(err.response?.data?.message || "Failed to delete file");
            }
        }
    };

    // Download file
    const downloadFile = async (fileId, fileName) => {
        try {
            const res = await API.get(`/files/download/${fileId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });

            // Create download link
            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download file");
        }
    };

    return (
        <div className="shuttle-admin-page">
            <aside className="shuttle-sidebar">
                <h2>NEXTSTEP ADMIN</h2>
                <ul>
                    <li onClick={() => navigate('/admin-dashboard')}>Admin Home</li>
                    <li className="active">Model Papers</li>
                </ul>
                <button 
                    className="btn-red" 
                    style={{marginTop:'auto', padding:'10px'}} 
                    onClick={() => {localStorage.clear(); navigate('/login');}}>
                    Logout
                </button>
            </aside>

            <main className="shuttle-main">
                <header className="shuttle-banner">
                    <h1>Admin Dashboard - Model Papers Management</h1>
                </header>

                <div className="shuttle-content">
                    {/* Breadcrumb Navigation */}
                    <div className="breadcrumb-nav">
                        <span onClick={() => navigateToBreadcrumb(-1)} className="breadcrumb-item">
                            🏠 Root
                        </span>
                        {breadcrumb.map((folder, index) => (
                            <React.Fragment key={folder.id}>
                                <span className="breadcrumb-separator">/</span>
                                <span 
                                    onClick={() => navigateToBreadcrumb(index)} 
                                    className="breadcrumb-item">
                                    📁 {folder.name}
                                </span>
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="shuttle-header-row">
                        <h2>{currentFolder ? `Folder: ${currentFolder.name}` : 'All Folders'}</h2>
                        <div>
                            <button 
                                className="btn-green" 
                                onClick={() => setIsFolderModalOpen(true)}
                                style={{marginRight: '10px'}}>
                                + New Folder
                            </button>
                            {currentFolder && (
                                <button 
                                    className="btn-green" 
                                    onClick={() => setIsFileModalOpen(true)}>
                                    📤 Upload File
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Folders Table */}
                    {folders.length > 0 && (
                        <div className="shuttle-card" style={{marginBottom: '20px'}}>
                            <h3 style={{padding: '15px', margin: 0, background: '#f8f9fa'}}>📁 Folders</h3>
                            <table className="shuttle-table">
                                <thead>
                                    <tr>
                                        <th>Folder Name</th>
                                        <th>Description</th>
                                        <th>Path</th>
                                        <th>Created By</th>
                                        <th>Subfolders</th>
                                        <th>Files</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {folders.map((folder) => (
                                        <tr key={folder.id}>
                                            <td>
                                                <strong 
                                                    onClick={() => openFolder(folder)}
                                                    style={{cursor: 'pointer', color: '#198754'}}>
                                                    📁 {folder.name}
                                                </strong>
                                            </td>
                                            <td>{folder.description || '-'}</td>
                                            <td><small>{folder.folderPath}</small></td>
                                            <td>{folder.createdByName}</td>
                                            <td>{folder.subFolderCount}</td>
                                            <td>{folder.fileCount}</td>
                                            <td>
                                                <button 
                                                    className="btn-yellow" 
                                                    onClick={() => openFolder(folder)}>
                                                    Open
                                                </button>
                                                <button 
                                                    className="btn-red" 
                                                    onClick={() => deleteFolder(folder.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Files Table */}
                    {files.length > 0 && (
                        <div className="shuttle-card">
                            <h3 style={{padding: '15px', margin: 0, background: '#f8f9fa'}}>📄 Files</h3>
                            <table className="shuttle-table">
                                <thead>
                                    <tr>
                                        <th>File Name</th>
                                        <th>Type</th>
                                        <th>Size</th>
                                        <th>Uploaded By</th>
                                        <th>Upload Date</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {files.map((file) => (
                                        <tr key={file.id}>
                                            <td><strong>{file.fileName}</strong></td>
                                            <td>
                                                <span className="file-type-badge">{file.fileType}</span>
                                            </td>
                                            <td>{file.fileSizeFormatted}</td>
                                            <td>{file.uploadedByName}</td>
                                            <td>{new Date(file.uploadedAt).toLocaleDateString()}</td>
                                            <td>
                                                <button 
                                                    className="btn-yellow" 
                                                    onClick={() => downloadFile(file.id, file.fileName)}>
                                                    Download
                                                </button>
                                                <button 
                                                    className="btn-red" 
                                                    onClick={() => deleteFile(file.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Empty State */}
                    {folders.length === 0 && files.length === 0 && (
                        <div style={{textAlign: 'center', padding: '60px', color: '#999'}}>
                            <h3>📂 No folders or files here</h3>
                            <p>Create a new folder to get started!</p>
                        </div>
                    )}
                </div>
            </main>

            {/* Create Folder Modal */}
            {isFolderModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Create New Folder</h3>
                            <button 
                                className="close-btn" 
                                onClick={() => setIsFolderModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleCreateFolder}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Folder Name *</label>
                                        <input 
                                            type="text" 
                                            value={folderFormData.name}
                                            onChange={(e) => setFolderFormData({...folderFormData, name: e.target.value})}
                                            required 
                                            placeholder="Enter folder name"
                                        />
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea 
                                            value={folderFormData.description}
                                            onChange={(e) => setFolderFormData({...folderFormData, description: e.target.value})}
                                            rows="3"
                                            placeholder="Optional description"
                                        ></textarea>
                                    </div>
                                    {currentFolder && (
                                        <div className="form-group full-width">
                                            <p style={{color: '#666', fontSize: '14px'}}>
                                                📁 Parent: {currentFolder.folderPath}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn-save-shuttle">
                                    Create Folder
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Upload File Modal */}
            {isFileModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-container">
                        <div className="modal-header">
                            <h3>Upload File</h3>
                            <button 
                                className="close-btn" 
                                onClick={() => setIsFileModalOpen(false)}>
                                &times;
                            </button>
                        </div>
                        <form onSubmit={handleFileUpload}>
                            <div className="modal-body">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Select File *</label>
                                        <input 
                                            type="file" 
                                            onChange={(e) => setSelectedFile(e.target.files[0])}
                                            required 
                                        />
                                        {selectedFile && (
                                            <p style={{marginTop: '5px', color: '#666', fontSize: '14px'}}>
                                                Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                                            </p>
                                        )}
                                    </div>
                                    <div className="form-group full-width">
                                        <label>Description</label>
                                        <textarea 
                                            value={fileDescription}
                                            onChange={(e) => setFileDescription(e.target.value)}
                                            rows="2"
                                            placeholder="Optional description"
                                        ></textarea>
                                    </div>
                                    <div className="form-group full-width">
                                        <p style={{color: '#666', fontSize: '14px'}}>
                                            📁 Upload to: {currentFolder.folderPath}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn-save-shuttle">
                                    Upload File
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelPapers;