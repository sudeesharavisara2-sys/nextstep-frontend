// src/components/LostFound/LostFoundList.jsx
import React from "react";
import LostFoundItem from "./LostFoundItem";

const LostFoundList = ({ items, deleteItem, addComment }) => {
  if (items.length === 0) return <p>No posts yet.</p>;

  return (
    <div className="lostfound-list">
      {items.map(item => (
        <LostFoundItem 
          key={item.id} 
          item={item} 
          onDelete={deleteItem} 
          onAddComment={addComment} 
        />
      ))}
    </div>
  );
};

export default LostFoundList;
