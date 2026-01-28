// src/components/LostFound/LostFound.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LostFoundForm from "./LostFoundForm";
import LostFoundList from "./LostFoundList";
import logo from "../../assets/logo1.png";

// CSS
import "../../styles/Lostfound.css";
import "../../styles/App.css";

const LostFound = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  // Add a new item
  const addItem = (newItem) => {
    setItems([newItem, ...items]);
  };

  // Delete an item
  const deleteItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Add comment
  const addComment = (id, comment) => {
    setItems(items.map(item => 
      item.id === id 
        ? { ...item, comments: [...(item.comments || []), comment] } 
        : item
    ));
  };

  // Sidebar simplified: only Home
  const handleHomeClick = () => navigate("/dashboard");

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
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

      {/* Main Lost & Found content */}
      <main className="main-content">
        <h1 className="lf-header">Lost & Found</h1>
        <LostFoundForm addItem={addItem} />
        <LostFoundList 
          items={items} 
          deleteItem={deleteItem} 
          addComment={addComment} 
        />
      </main>
       {/* Floating Footer Text */}
            <div className="powered-by">
                Powered by NSBM
            </div>
    </div>
  );
};

export default LostFound;


 
