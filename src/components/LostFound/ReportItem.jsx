import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createItem } from "../../services/lostFoundService";
import "../../styles/lostfound.css";

export default function ReportItem() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    itemName: "",
    description: "",
    locationFound: "",
    contactEmail: "",
    category: "Electronics",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createItem(form);
      alert("✅ Lost item reported successfully!");
      navigate("/lostfound/items");
    } catch (err) {
      alert("❌ Error while submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lf-report-page">

      {/* Navbar */}
      <nav className="lf-navbar">
        <Link className="lf-navbar-brand" to="/lostfound">🔎 Campus Lost & Found</Link>
        <div className="lf-navbar-links">
          <Link className="lf-nav-link" to="/lostfound">Home</Link>
          <Link className="lf-nav-link" to="/lostfound/items">All Items</Link>
        </div>
      </nav>

      <div className="lf-report-container">
        <div className="lf-form-card">

          <div className="lf-form-card-header">
            <h4>📝 Report Lost Item</h4>
          </div>

          <div className="lf-form-body">
            <form onSubmit={handleSubmit}>

              <div className="lf-form-group">
                <label className="lf-form-label">Item Name *</label>
                <input
                  type="text"
                  className="lf-form-input"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleChange}
                  required
                />
                <span className="lf-form-hint">Enter the name of the lost item</span>
              </div>

              <div className="lf-form-group">
                <label className="lf-form-label">Description</label>
                <textarea
                  className="lf-form-textarea"
                  rows="3"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
                <span className="lf-form-hint">Describe the item in detail</span>
              </div>

              <div className="lf-form-group">
                <label className="lf-form-label">Location Where Lost *</label>
                <input
                  type="text"
                  className="lf-form-input"
                  name="locationFound"
                  value={form.locationFound}
                  onChange={handleChange}
                  required
                />
                <span className="lf-form-hint">Where did you lose this item?</span>
              </div>

              <div className="lf-form-group">
                <label className="lf-form-label">Your Email *</label>
                <input
                  type="email"
                  className="lf-form-input"
                  name="contactEmail"
                  value={form.contactEmail}
                  onChange={handleChange}
                  required
                />
                <span className="lf-form-hint">We'll contact you if someone finds your item</span>
              </div>

              <div className="lf-form-group">
                <label className="lf-form-label">Category</label>
                <select
                  className="lf-form-select"
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="Electronics">Electronics</option>
                  <option value="Personal">Personal Items</option>
                  <option value="Documents">Documents</option>
                  <option value="Clothing">Clothing</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="lf-form-actions">
                <button
                  type="submit"
                  className="lf-btn lf-btn-primary lf-btn-full"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "📤 Submit Report"}
                </button>
                <Link to="/lostfound/items" className="lf-btn lf-btn-outline lf-btn-full">
                  Cancel
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
