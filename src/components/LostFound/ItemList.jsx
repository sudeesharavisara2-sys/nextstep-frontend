import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllItems } from "../../services/lostFoundService";
import "../../styles/lostfound.css";

export default function ItemList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await getAllItems();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter((it) => {
      const name = (it.itemName || "").toLowerCase();
      const desc = (it.description || "").toLowerCase();
      return name.includes(q) || desc.includes(q);
    });
  }, [items, search]);

  return (
    <div className="lf-page-bg">

      {/* Navbar */}
      <nav className="lf-navbar">
        <Link className="lf-navbar-brand" to="/lostfound">🔎 Campus Lost & Found</Link>
        <div className="lf-navbar-links">
          <Link className="lf-nav-link" to="/lostfound">Home</Link>
          <Link className="lf-nav-link" to="/lostfound/items">All Items</Link>
          <Link className="lf-nav-link-report" to="/lostfound/report">Report Item</Link>
        </div>
      </nav>

      <div className="lf-page-container">
        <h1 className="lf-page-title">📦 Lost & Found Items</h1>

        {/* Search Bar */}
        <div className="lf-search-row">
          <input
            type="text"
            className="lf-search-input"
            placeholder="Search by item name or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Link to="/lostfound/report" className="lf-btn lf-btn-success">
            ➕ New Report
          </Link>
        </div>

        {/* Loading */}
        {loading && <div className="lf-loading">Loading items...</div>}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="lf-items-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="lf-item-card">
                <span className={`lf-badge ${item.claimed ? "lf-badge-claimed" : "lf-badge-unclaimed"}`}>
                  {item.claimed ? "✓ Claimed" : "Unclaimed"}
                </span>
                <h5>{item.itemName}</h5>
                <p>{item.description}</p>
                <ul className="lf-item-details">
                  <li><strong>📍</strong> {item.locationFound}</li>
                  <li><strong>📅</strong> {String(item.dateFound || "").slice(0, 10)}</li>
                  <li><strong>📧</strong> {item.contactEmail}</li>
                  <li><strong>🏷️</strong> {item.category}</li>
                </ul>
                <a href={`mailto:${item.contactEmail}`} className="lf-btn-contact">
                  ✉️ Contact Owner
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="lf-empty">
            <h3>No items found</h3>
            {search && <p>No results for "<b>{search}</b>"</p>}
            <Link to="/lostfound/report" className="lf-btn lf-btn-primary" style={{ marginTop: 16 }}>
              Be the first to report an item
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
