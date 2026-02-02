import React, { useState } from "react";
import "../../styles/App.css";

const LostFoundItem = ({ item, onDelete, onAddComment }) => {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (!commentText) return;
    onAddComment(item.id, commentText);
    setCommentText("");
  };

  return (
    <div className="lostfound-item-card">
      <h3>
        {item.title} ({item.status || item.category})
      </h3>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Date:</strong> {item.date}</p>

      {item.image && (
        <img
          src={item.image.startsWith("data:") ? item.image : `http://localhost:8099/${item.image}`}
          alt={item.title}
          style={{
            maxWidth: "250px",
            margin: "10px 0",
            borderRadius: "12px",
            objectFit: "cover",
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
          }}
        />
      )}

      <div className="lostfound-actions">
        <button onClick={() => onDelete(item.id)}>Delete</button>
      </div>

      <div className="comments-section">
        <h4>Comments</h4>
        {item.comments && item.comments.length > 0 ? (
          <ul>
            {item.comments.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        ) : <p>No comments yet.</p>}
        <input
          type="text"
          placeholder="Add a comment"
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button onClick={handleAddComment}>Comment</button>
      </div>
    </div>
  );
};

export default LostFoundItem;
