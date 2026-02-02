// src/components/LostFound/LostFoundAdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api";
import logo from "../../assets/logo1.png";
import "../../styles/Lostfound.css";
import "../../styles/App.css";

const LostFoundAdminDashboard = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // --- State ---
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    date: "",
    image: null,
  });

  // --- Load Items ---
  useEffect(() => {
    if (!token) navigate("/login");
    else loadItems();
  }, [token, navigate]);

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await API.get("/lost-found", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load items", err);
      alert("Failed to load items");
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Item ---
  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      await API.delete(`/lost-found/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item deleted successfully");
      loadItems();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item");
    }
  };

  // --- Open Add/Edit Modal ---
  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      date: "",
      image: null,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setIsEditMode(true);
    setSelectedItemId(item._id);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      location: item.location,
      date: item.date,
      image: null,
    });
    setIsModalOpen(true);
  };

  // --- Handle Form Change ---
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setFormData({ ...formData, image: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  // --- Submit Form ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("location", formData.location);
    data.append("date", formData.date);
    if (formData.image) data.append("image", formData.image);

    try {
      const config = {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      };

      if (isEditMode) {
        await API.put(`/lost-found/${selectedItemId}`, data, config);
        alert("Item updated successfully!");
      } else {
        await API.post("/lost-found", data, config);
        alert("Item added successfully!");
      }

      setIsModalOpen(false);
      loadItems();
    } catch (err) {
      console.error("Failed to submit item", err);
      alert("Failed to submit item");
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="Logo" className="logo-img" />
        </div>
        <ul className="menu-list">
          <li className="menu-item" onClick={() => navigate("/admin-dashboard")}>
            Home
          </li>
          <li className="menu-item active">Lost & Found</li>
        </ul>
        <button
          className="btn-red"
          style={{ marginTop: "auto", padding: "10px" }}
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="lf-header-row">
          <h1>Lost & Found – Admin Dashboard</h1>
          <button className="btn-green" onClick={openAddModal}>
            + Add New Item
          </button>
        </header>

        {loading ? (
          <p>Loading...</p>
        ) : items.length === 0 ? (
          <p>No records found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Location</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item._id}>
                  <td>{item.title}</td>
                  <td>{item.category}</td>
                  <td>{item.location}</td>
                  <td>{new Date(item.date).toLocaleDateString()}</td>
                  <td>
                    <button className="btn-yellow" onClick={() => openEditModal(item)}>
                      Edit
                    </button>
                    <button className="btn-red" onClick={() => deleteItem(item._id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h3>{isEditMode ? "Edit Item" : "Add New Item"}</h3>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Image (optional)</label>
                  <input type="file" name="image" onChange={handleInputChange} accept="image/*" />
                </div>
              </div>

              <div className="modal-footer">
                <button type="submit" className="btn-save-shuttle">
                  {isEditMode ? "Save Changes" : "Add Item"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="powered-by">Powered by NSBM</div>
    </div>
  );
};

export default LostFoundAdminDashboard;
