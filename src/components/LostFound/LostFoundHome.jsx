import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllItems } from "../../services/lostFoundService";
import "../../styles/lostfound.css";

export default function LostFoundHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const totalItems = items.length;
  const unclaimedItems = useMemo(() => items.filter((i) => !i.claimed).length, [items]);
  const claimedItems = totalItems - unclaimedItems;

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getAllItems();
        setItems(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error(e);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return (
    <div className="lf-home-bg">

      {/* Navbar */}
      <nav className="lf-navbar">
        <span className="lf-navbar-brand">🔎 Campus Lost & Found</span>
        <div className="lf-navbar-links">
          <Link className="lf-nav-link" to="/lostfound">Home</Link>
          <Link className="lf-nav-link" to="/lostfound/items">All Items</Link>
          <Link className="lf-nav-link-report" to="/lostfound/report">Report Item</Link>
        </div>
      </nav>

      <div className="lf-container">

        {/* Hero */}
        <div className="lf-hero">
          <h1>Find What You Lost</h1>
          <p>Report lost items or check if your lost belongings have been found</p>
          {loading && <span className="lf-loading-badge">Loading stats...</span>}
        </div>

        {/* Stats */}
        <div className="lf-stats-row">
          <div className="lf-stat-card lf-stat-blue">
            <div className="stat-icon">📦</div>
            <h2>{totalItems}</h2>
            <h5>Total Items Reported</h5>
          </div>
          <div className="lf-stat-card lf-stat-yellow">
            <div className="stat-icon">❓</div>
            <h2>{unclaimedItems}</h2>
            <h5>Waiting to be Claimed</h5>
          </div>
          <div className="lf-stat-card lf-stat-green">
            <div className="stat-icon">✅</div>
            <h2>{claimedItems}</h2>
            <h5>Successfully Claimed</h5>
          </div>
        </div>

        {/* Action Cards */}
        <div className="lf-action-row">
          <div className="lf-action-card">
            <div className="action-icon">⚠️</div>
            <h3>Lost Something?</h3>
            <p>Report your lost item so others can help find it</p>
            <Link to="/lostfound/report" className="lf-btn lf-btn-danger lf-btn-lg">
              ➕ Report Lost Item
            </Link>
          </div>
          <div className="lf-action-card">
            <div className="action-icon">🔍</div>
            <h3>Found Something?</h3>
            <p>Check if someone has reported it as lost</p>
            <Link to="/lostfound/items" className="lf-btn lf-btn-primary lf-btn-lg">
              Browse Items
            </Link>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="lf-footer">
        <p>© 2026 Campus Lost & Found System</p>
        <p>Helping students reunite with their belongings</p>
      </footer>

    </div>
  );
}
