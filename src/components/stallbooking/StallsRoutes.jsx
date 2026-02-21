import { Routes, Route } from "react-router-dom";
import AvailableStalls from "./AvailableStalls";
import BookStall from "./BookStall";
import MyBookings from "./MyBookings";
import HowToBook from "./HowToBook";

export default function StallsRoutes() {
  return (
    <Routes>
      <Route index element={<AvailableStalls />} />
      <Route path="available" element={<AvailableStalls />} />
      <Route path="book" element={<BookStall />} />
      <Route path="my-bookings" element={<MyBookings />} />
      <Route path="how-to-book" element={<HowToBook />} />
    </Routes>
  );
}
