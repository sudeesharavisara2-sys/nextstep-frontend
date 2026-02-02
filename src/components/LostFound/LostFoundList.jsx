import React from "react";
import LostFoundItem from "./LostFoundItem";
import "../../styles/Lostfound.css";
import "../../styles/App.css";

const LostFoundList = ({ items, loading, deleteItem, addComment }) => {
  if (loading) return <p>Loading...</p>;
  if (!items || items.length === 0) return <p>No items found.</p>;

  return (
    <div className="lostfound-list-container">
      <h2>Lost & Found Items</h2>
      <div className="lostfound-items-grid">
        {items.map((item) => (
          <LostFoundItem
            key={item.id || item._id} // Ensure unique key
            item={item}
            onDelete={deleteItem}
            onAddComment={addComment}
          />
        ))}
      </div>
    </div>
  );
};

export default LostFoundList;
