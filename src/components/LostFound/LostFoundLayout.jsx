import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

export default function LostFoundLayout() {
  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
}
