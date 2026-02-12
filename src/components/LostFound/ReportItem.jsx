import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createItem } from "../../services/lostFoundService";


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
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await lostFoundService.createItem(form); // POST /api/lost-found
      alert("✅ Lost item reported successfully!");
      navigate("/lostfound/items");
    } catch (err) {
      alert("❌ Error while submitting report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        body { 
          padding-top: 20px; 
          background-color: #f8f9fa; 
        }
        .rf-card {
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.1);
          border: 0;
        }
      `}</style>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/lostfound">
            🔎 Campus Lost & Found
          </Link>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card rf-card">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">📝 Report Lost Item</h4>
              </div>

              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label">Item Name *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="itemName"
                      value={form.itemName}
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">
                      Enter the name of the lost item
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      name="description"
                      value={form.description}
                      onChange={handleChange}
                    />
                    <div className="form-text">
                      Describe the item in detail
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">
                      Location Where Lost *
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="locationFound"
                      value={form.locationFound}
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">
                      Where did you lose this item?
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Your Email *</label>
                    <input
                      type="email"
                      className="form-control"
                      name="contactEmail"
                      value={form.contactEmail}
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">
                      We'll contact you if someone finds your item
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
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

                  <div className="d-grid gap-2">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg"
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "📤 Submit Report"}
                    </button>

                    <Link
                      to="/lostfound/items"
                      className="btn btn-outline-secondary"
                    >
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
