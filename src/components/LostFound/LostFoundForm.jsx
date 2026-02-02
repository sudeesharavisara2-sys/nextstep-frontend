// src/components/LostFound/LostFoundForm.jsx
import React, { useState } from "react";
import API from "../../api";
import "../../styles/Lostfound.css";
import "../../styles/App.css";

const LostFoundForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("date", date);
    if (image) formData.append("image", image);

    try {
      setLoading(true);
      await API.post("/lostfound", formData); // Use API.post directly
      alert("Item submitted successfully");

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("");
      setLocation("");
      setDate("");
      setImage(null);
    } catch (err) {
      console.error(err);
      alert("Failed to submit item");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lostfound-form-container">
      <h2>Submit Lost & Found Item</h2>
      <form onSubmit={handleSubmit} className="lostfound-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Image (optional)</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default LostFoundForm;
