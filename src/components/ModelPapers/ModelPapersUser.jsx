import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../api';
import '../../styles/Dashboard.css';
import '../../styles/ModelPapersUser.css';
// ✅ Import the logo
import logo from "../../assets/logo1.png";

const ModelPapersUser = () => {
    const navigate = useNavigate();
    const [folders, setFolders] = useState([]);
    const [files, setFiles] = useState([]);
    const [currentFolder, setCurrentFolder] = useState(null);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [uploadFile, setUploadFile] = useState(null);
    const [uploadDescription, setUploadDescription] = useState('');

    const token = localStorage.getItem('token');

    useEffect(() => {
        if (!token) navigate('/');
        else loadRootFolders();
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
        }
    };

    // Open a folder
    const openFolder = async (folder) => {
        try {
            const foldersRes = await API.get(`/files/folders/${folder.id}/subfolders`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const filesRes = await API.get(`/files/folders/${folder.id}/files`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            setFolders(foldersRes.data);
            setFiles(filesRes.data);
            setCurrentFolder(folder);
            
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
            const newBreadcrumb = breadcrumb.slice(0, index);
            setBreadcrumb(newBreadcrumb);
            await openFolder(folder);
        }
    };

    // Download file
    const downloadFile = async (fileId, fileName) => {
        try {
            const res = await API.get(`/files/download/${fileId}`, {
                headers: { 'Authorization': `Bearer ${token}` },
                responseType: 'blob'
            });

            const url = window.URL.createObjectURL(new Blob([res.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            link.remove();
            
            alert('File downloaded successfully!');
        } catch (err) {
            console.error("Download error:", err);
            alert("Failed to download file");
        }
    };

    // Upload file
    const handleFileUpload = async (e) => {
        e.preventDefault();
        if (!currentFolder || !uploadFile) {
            alert('Please select a folder and a file!');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', uploadFile);
            formData.append('folderId', currentFolder.id);
            formData.append('description', uploadDescription);

            const res = await API.post('/files/upload', formData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (res.status === 201) {
                alert('File uploaded successfully!');
                setIsUploadModalOpen(false);
                setUploadFile(null);
                setUploadDescription('');
                openFolder(currentFolder);
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.response?.data?.message || "Failed to upload file");
        }
    };

    const getFileIcon = (fileType) => {
        const type = fileType?.toLowerCase();
        if (type === 'pdf') return '📕';
        if (['doc', 'docx'].includes(type)) return '📘';
        if (['xls', 'xlsx'].includes(type)) return '📗';
        if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) return '🖼️';
        if (['zip', 'rar'].includes(type)) return '📦';
        return '📄';
    };

    const filteredFolders = folders.filter(f => 
        f.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredFiles = files.filter(f => 
        f.fileName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.fileType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-layout">
            {/* ✅ UPDATED SIDEBAR SECTION */}
            <aside className="sidebar">
                <div className="logo">
                    <img src={logo} alt="NextStep Logo" className="logo-img" />
                </div>
                <ul className="menu-list">
                    <li className="menu-item" onClick={() => navigate('/dashboard')}>
                        Home
                    </li>
                    <li className="menu-item active">
                        Model Papers
                    </li>
                </ul>
                
            </aside>

            <main className="main-content">
                <header className="shuttle-header">
                    <h1>📚 Model Papers</h1>
                    <p>Browse and download study materials</p>
                </header>

                {/* Breadcrumb Navigation */}
                <div className="file-breadcrumb">
                    <span onClick={() => navigateToBreadcrumb(-1)} className="breadcrumb-link">
                        🏠 Home
                    </span>
                    {breadcrumb.map((folder, index) => (
                        <React.Fragment key={folder.id}>
                            <span className="breadcrumb-separator">›</span>
                            <span 
                                onClick={() => navigateToBreadcrumb(index)} 
                                className="breadcrumb-link">
                                {folder.name}
                            </span>
                        </React.Fragment>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="search-container">
                    <input 
                        type="text" 
                        className="shuttle-search-input" 
                        placeholder="Search folders or files..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {currentFolder && (
                        <button 
                            className="upload-btn-top"
                            onClick={() => setIsUploadModalOpen(true)}>
                            📤 Upload File
                        </button>
                    )}
                </div>

                {/* Folders Grid */}
                {filteredFolders.length > 0 && (
                    <div>
                        <h3 style={{color: 'white', marginBottom: '15px'}}>📁 Folders</h3>
                        <div className="dashboard-cards">
                            {filteredFolders.map((folder) => (
                                <div 
                                    key={folder.id} 
                                    className="info-card file-folder-card" 
                                    onClick={() => openFolder(folder)}>
                                    <div className="folder-icon">📁</div>
                                    <h3>{folder.name}</h3>
                                    <p>{folder.description || 'No description'}</p>
                                    <div className="folder-stats">
                                        <span>📂 {folder.subFolderCount} folders</span>
                                        <span>📄 {folder.fileCount} files</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Files Grid */}
                {filteredFiles.length > 0 && (
                    <div style={{marginTop: '30px'}}>
                        <h3 style={{color: 'white', marginBottom: '15px'}}>📄 Files</h3>
                        <div className="dashboard-cards">
                            {filteredFiles.map((file) => (
                                <div key={file.id} className="info-card file-card">
                                    <div className="file-icon-large">
                                        {getFileIcon(file.fileType)}
                                    </div>
                                    <h3 className="file-name">{file.fileName}</h3>
                                    <div className="file-details">
                                        <span className="file-type-badge">{file.fileType}</span>
                                        <span className="file-size">{file.fileSizeFormatted}</span>
                                    </div>
                                    <p className="file-upload-info">
                                        Uploaded by {file.uploadedByName}
                                    </p>
                                    <div className="file-actions">
                                        <button 
                                            className="file-download-btn"
                                            onClick={() => downloadFile(file.id, file.fileName)}>
                                            ⬇️ Download
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {filteredFolders.length === 0 && filteredFiles.length === 0 && (
                    <div className="empty-state">
                        <div className="empty-icon">📂</div>
                        <h3>No folders or files found</h3>
                        <p>{searchTerm ? 'Try a different search term' : 'This folder is empty'}</p>
                    </div>
                )}
            </main>

            {/* Upload File Modal */}
            {isUploadModalOpen && (
                <div className="shuttle-modal-overlay" onClick={() => setIsUploadModalOpen(false)}>
                    <div className="shuttle-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal-btn" onClick={() => setIsUploadModalOpen(false)}>&times;</button>
                        <div className="modal-scrollable-area">
                            <h2 className="modal-bus-title">Upload File</h2>
                            <p className="modal-bus-sub">Upload to: {currentFolder?.folderPath}</p>
                            <form onSubmit={handleFileUpload}>
                                <div className="upload-form-group">
                                    <label>Select File *</label>
                                    <input 
                                        type="file" 
                                        onChange={(e) => setUploadFile(e.target.files[0])}
                                        required 
                                        className="file-input"
                                    />
                                </div>
                                <div className="upload-form-group">
                                    <label>Description (Optional)</label>
                                    <textarea 
                                        value={uploadDescription}
                                        onChange={(e) => setUploadDescription(e.target.value)}
                                        rows="3"
                                        placeholder="Add a description..."
                                        className="file-textarea"
                                    ></textarea>
                                </div>
                                <button type="submit" className="modal-call-btn">📤 Upload File</button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelPapersUser;