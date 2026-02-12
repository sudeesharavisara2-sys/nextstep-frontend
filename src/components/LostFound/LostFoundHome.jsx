import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getAllItems } from "../../services/lostFoundService";

export default function LostFoundHome() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // counts
  const totalItems = items.length;

  const unclaimedItems = useMemo(
    () => items.filter((i) => !i.claimed).length,
    [items]
  );

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
    <>
      {/* PAGE-ONLY STYLES */}
      <style>{`
        .lf-home-bg {
          background: linear-gradient(135deg, #0f2027, #2c5364, #2ecc71);
          min-height: 100vh;
        }

        .lf-card {
          border-radius: 15px;
          box-shadow: 0 10px 20px rgba(0,0,0,0.15);
          border: none;
        }

        .stats-card {
          transition: 0.3s;
        }

        .stats-card:hover {
          transform: translateY(-8px);
        }

        .lf-footer {
          background: #111827;
        }
      `}</style>

      <div className="lf-home-bg">

        {/* Navbar */}
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container">
            <span className="navbar-brand">
              🔎 Campus Lost & Found
            </span>

            <div className="navbar-nav ms-auto">
              <Link className="nav-link" to="/lostfound">
                Home
              </Link>

              <Link className="nav-link" to="/lostfound/items">
                All Items
              </Link>

              <Link className="nav-link" to="/lostfound/report">
                Report Item
              </Link>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="container py-5">

          <div className="text-center text-white mb-5">

            <h1 className="display-4 fw-bold">
              Find What You Lost
            </h1>

            <p className="lead">
              Report lost items or check if your lost belongings have been found
            </p>

            {loading && (
              <span className="badge bg-light text-dark">
                Loading stats...
              </span>
            )}

          </div>

          {/* Stats Cards */}
          <div className="row g-4 mb-5">

            {/* Total */}
            <div className="col-md-4">

              <div className="card lf-card stats-card bg-primary text-white">

                <div className="card-body text-center py-5">

                  <div style={{ fontSize: 40 }}>
                    📦
                  </div>

                  <h2>{totalItems}</h2>

                  <h5>Total Items Reported</h5>

                </div>

              </div>

            </div>


            {/* Unclaimed */}
            <div className="col-md-4">

              <div className="card lf-card stats-card bg-warning text-white">

                <div className="card-body text-center py-5">

                  <div style={{ fontSize: 40 }}>
                    ❓
                  </div>

                  <h2>{unclaimedItems}</h2>

                  <h5>Waiting to be Claimed</h5>

                </div>

              </div>

            </div>


            {/* Claimed */}
            <div className="col-md-4">

              <div className="card lf-card stats-card bg-success text-white">

                <div className="card-body text-center py-5">

                  <div style={{ fontSize: 40 }}>
                    ✅
                  </div>

                  <h2>{claimedItems}</h2>

                  <h5>Successfully Claimed</h5>

                </div>

              </div>

            </div>

          </div>


          {/* Action Cards */}
          <div className="row g-4">

            {/* Lost */}
            <div className="col-md-6">

              <div className="card lf-card">

                <div className="card-body text-center p-5">

                  <div style={{ fontSize: 56 }}>
                    ⚠️
                  </div>

                  <h3>
                    Lost Something?
                  </h3>

                  <p className="text-muted">
                    Report your lost item so others can help find it
                  </p>

                  <Link
                    to="/lostfound/report"
                    className="btn btn-danger btn-lg"
                  >
                    ➕ Report Lost Item
                  </Link>

                </div>

              </div>

            </div>


            {/* Found */}
            <div className="col-md-6">

              <div className="card lf-card">

                <div className="card-body text-center p-5">

                  <div style={{ fontSize: 56 }}>
                    🔍
                  </div>

                  <h3>
                    Found Something?
                  </h3>

                  <p className="text-muted">
                    Check if someone has reported it as lost
                  </p>

                  <Link
                    to="/lostfound/items"
                    className="btn btn-primary btn-lg"
                  >
                    Browse Items
                  </Link>

                </div>

              </div>

            </div>

          </div>

        </div>


        {/* Footer */}
        <footer className="lf-footer text-white py-4">

          <div className="container text-center">

            <p>
              © 2026 Campus Lost & Found System
            </p>

            <p>
              Helping students reunite with their belongings
            </p>

          </div>

        </footer>

      </div>
    </>
  );
}
