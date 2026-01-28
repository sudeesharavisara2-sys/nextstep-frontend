import React from "react";
import { useNavigate } from "react-router-dom";

export default function NextStepSidebar() {
  const navigate = useNavigate();

  return (
    <div className="nextstep-sidebar">
      <div className="nextstep-logo">NEXTSTEP</div>

      <div className="nextstep-menu">
        <button onClick={() => navigate("/dashboard")}>Home</button>
        <button>Club Events</button>
        <button onClick={() => navigate("/stalls")}>Stalls</button>
        <button>Lost & Found</button>
        <button>Model Papers</button>
        <button>Study Room Booking</button>
        <button>Shuttle Service</button>
      </div>

      <button className="nextstep-logout">Logout</button>
    </div>
  );
}
