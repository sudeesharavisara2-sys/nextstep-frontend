import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllItems, claimItem, deleteItem, searchItems, getUnclaimed } from "../../services/lostFoundService";


export default function ItemList() {
  const [items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const data = await lostFoundService.getAllItems(); // GET /api/lost-found
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
    <>
      <style>{`
        .item-card { transition: all 0.3s; }
        .item-card:hover { box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
        .claimed-badge { position: absolute; top: 10px; right: 10px; }
      `}</style>

      {/* Navbar (same style as Home) */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <Link className="navbar-brand" to="/lostfound">
            🔎 Campus Lost & Found
          </Link>

          <div className="navbar-nav ms-auto">
            <Link className="nav-link" to="/lostfound">Home</Link>
            <Link className="nav-link" to="/lostfound/items">All Items</Link>
            <Link className="nav-link" to="/lostfound/report">Report Item</Link>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <h1 className="mb-4">📦 Lost & Found Items</h1>

        {/* Search Form */}
        <div className="row g-3 mb-4">
          <div className="col-md-8">
            <input
              type="text"
              className="form-control"
              placeholder="Search by item name or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="col-md-2">
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={() => {}}
            >
              🔍 Search
            </button>
          </div>

          <div className="col-md-2">
            <Link to="/lostfound/report" className="btn btn-success w-100">
              ➕ New Report
            </Link>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-5">
            <span className="badge bg-secondary">Loading items...</span>
          </div>
        )}

        {/* Items Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="row">
            {filteredItems.map((item) => (
              <div key={item.id} className="col-md-4 mb-4">
                <div className="card item-card h-100 position-relative">
                  <div className="card-body">
                    {item.claimed ? (
                      <span className="badge bg-success claimed-badge">
                        ✓ Claimed
                      </span>
                    ) : (
                      <span className="badge bg-warning text-dark claimed-badge">
                        Unclaimed
                      </span>
                    )}

                    <h5 className="card-title">{item.itemName}</h5>
                    <p className="card-text text-muted">{item.description}</p>

                    <ul className="list-unstyled">
                      <li>
                        <strong>📍</strong> {item.locationFound}
                      </li>
                      <li>
                        <strong>📅</strong>{" "}
                        {String(item.dateFound || "").slice(0, 10)}
                      </li>
                      <li>
                        <strong>📧</strong> {item.contactEmail}
                      </li>
                      <li>
                        <strong>🏷️</strong> {item.category}
                      </li>
                    </ul>

                    <a
                      href={`mailto:${item.contactEmail}`}
                      className="btn btn-outline-primary btn-sm"
                    >
                      ✉️ Contact Owner
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Items Message */}
        {!loading && filteredItems.length === 0 && (
          <div className="text-center py-5">
            <h3>No items found</h3>
            {search && (
              <p className="text-muted">
                No results for "<b>{search}</b>"
              </p>
            )}
            <Link to="/lostfound/report" className="btn btn-primary mt-3">
              Be the first to report an item
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
