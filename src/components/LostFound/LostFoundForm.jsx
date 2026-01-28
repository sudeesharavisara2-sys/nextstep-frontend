import React, { useState } from "react";

const LostFoundForm = ({ addItem }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [status, setStatus] = useState("Lost");
  const [image, setImage] = useState(null); // New state for image

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description) return;

    const newItem = {
      id: Date.now(),
      title,
      description,
      location,
      status,
      comments: [],
      image, // include the image
    };

    addItem(newItem);

    // Reset form
    setTitle("");
    setDescription("");
    setLocation("");
    setStatus("Lost");
    setImage(null);
  };

  return (
    <form className="lostfound-form" onSubmit={handleSubmit}>
      <h3>Post a Lost or Found Item</h3>
      <input 
        type="text" 
        placeholder="Title" 
        value={title} 
        onChange={e => setTitle(e.target.value)} 
        required
      />
      <textarea 
        placeholder="Description" 
        value={description} 
        onChange={e => setDescription(e.target.value)} 
        required
      />
      <input 
        type="text" 
        placeholder="Location" 
        value={location} 
        onChange={e => setLocation(e.target.value)}
      />
      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="Lost">Lost</option>
        <option value="Found">Found</option>
      </select>

      {/* NEW: Image Upload */}
      <input 
        type="file" 
        accept="image/*" 
        onChange={e => setImage(e.target.files[0])} 
      />

      <button type="submit">Post</button>
    </form>
  );
};

export default LostFoundForm;
