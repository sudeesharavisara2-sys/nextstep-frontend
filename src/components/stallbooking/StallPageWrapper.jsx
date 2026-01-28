import React from "react";
import "./StallBooking.css";

export default function StallPageWrapper({ title, subtitle, children }) {
  return (
    <div className="nextstep-stall-bg">
      <div className="nextstep-stall-container">
        {title && <h1 className="nextstep-title">{title}</h1>}
        {subtitle && <p className="nextstep-subtitle">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
