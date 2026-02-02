import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LostFoundForm from "./LostFoundForm";
import LostFoundList from "./LostFoundList";
import API from "../../api";
import logo from "../../assets/logo1.png";
import "../../styles/Lostfound.css";
import "../../styles/App.css";

const LostFound = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const res = await API.get("/lostfound", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data);
    } catch (err) {
      console.error("Failed to load Lost & Found items", err);
      alert("Failed to load items. Are you logged in?");
    } finally {
      setLoading(false);
    }
  };

  const addItem = (newItem) => {
    setItems([newItem, ...items]);
  };

  const deleteItem = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await API.delete(`/lostfound/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Item deleted successfully");
      loadItems();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete item");
    }
  };

  const addComment = (id, comment) => {
    setItems(
      items.map((item) =>
        item.id === id
          ? { ...item, comments: [...(item.comments || []), comment] }
          : item
      )
    );
  };

  const handleHomeClick = () => navigate("/dashboard");

  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <div className="logo">
          <img src={logo} alt="NextStep Logo" className="logo-img" />
        </div>
        <ul className="menu-list">
          <li className="menu-item" onClick={handleHomeClick}>
            Home
          </li>
        </ul>
      </aside>

      <main className="main-content">
        <h1 className="lf-header">Lost & Found</h1>
        <LostFoundForm addItem={addItem} reloadItems={loadItems} />
        <LostFoundList
          items={items}
          loading={loading}
          deleteItem={deleteItem}
          addComment={addComment}
        />
      </main>

      <div className="powered-by">Powered by NSBM</div>
    </div>
  );
};

export default LostFound;
