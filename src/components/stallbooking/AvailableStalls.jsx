import React from "react";
import { useNavigate } from "react-router-dom";
import NextStepSidebar from "./NextStepSidebar";
import "./StallBooking.css";

export default function AvailableStalls() {
  const navigate = useNavigate();

  const stalls = [
    {
      title: "Food Stall",
      category: "Food & Beverages",
      description: "Snacks, beverages, and fast food for campus events.",
      capacity: 100,
      location: "Main Ground",
      hours: "09:00 - 21:00",
      price: "RS1500.00",
    },
    {
      title: "Book Stall",
      category: "Education",
      description: "Books, stationery, and academic materials.",
      capacity: 60,
      location: "Library Block",
      hours: "10:00 - 18:00",
      price: "RS800.00",
    },
    {
      title: "Tech Gadgets",
      category: "Technology",
      description: "Mobile accessories, headphones, and gadgets.",
      capacity: 50,
      location: "IT Block",
      hours: "09:00 - 19:00",
      price: "RS1800.00",
    },
    {
      title: "Clothing Store",
      category: "Fashion",
      description: "Trendy clothes and accessories.",
      capacity: 80,
      location: "Shopping Complex",
      hours: "09:00 - 20:00",
      price: "RS1200.00",
    },
    {
      title: "Art & Crafts",
      category: "Arts",
      description: "Handmade crafts and art supplies.",
      capacity: 40,
      location: "Arts Block",
      hours: "10:00 - 17:00",
      price: "RS900.00",
    },
    {
      title: "Sports Equipment",
      category: "Sports",
      description: "Fitness and sports gear.",
      capacity: 70,
      location: "Sports Complex",
      hours: "08:00 - 19:00",
      price: "RS1100.00",
    },
    {
      title: "Health & Wellness",
      category: "Health",
      description: "Wellness products and supplements.",
      capacity: 35,
      location: "Health Center",
      hours: "09:00 - 17:00",
      price: "RS1300.00",
    },
    {
      title: "Coffee Corner",
      category: "Food & Beverages",
      description: "Coffee, tea, pastries, and snacks.",
      capacity: 30,
      location: "Central Cafeteria",
      hours: "08:00 - 22:00",
      price: "RS2000.00",
    },
    {
      title: "Stationery Hub",
      category: "Education",
      description: "Complete stationery range.",
      capacity: 45,
      location: "Academic Block",
      hours: "09:00 - 18:00",
      price: "RS700.00",
    },
    {
      title: "Photography",
      category: "Services",
      description: "Camera rentals and photography services.",
      capacity: 25,
      location: "Media Center",
      hours: "10:00 - 19:00",
      price: "RS2500.00",
    },
    {
      title: "Handicraft Stall",
      category: "Arts",
      description: "Traditional handmade products.",
      capacity: 30,
      location: "Exhibition Hall",
      hours: "10:00 - 18:00",
      price: "RS900.00",
    },
    {
      title: "Mobile Repair",
      category: "Services",
      description: "Mobile repair and accessories.",
      capacity: 20,
      location: "Tech Zone",
      hours: "09:00 - 18:00",
      price: "RS1000.00",
    },
  ];

  return (
    <div className="stall-home-layout">
      {/* LEFT SIDEBAR */}
      <NextStepSidebar />

      {/* RIGHT CONTENT */}
      <div className="stall-home-page available-stalls-page">

        {/* TOP NAVBAR */}
        <div className="top-navbar">
          <div className="nav-logo">NEXTSTEP</div>
          <div className="nav-links">
            <span onClick={() => navigate("/dashboard")}>Home</span>
            <span onClick={() => navigate("/stalls/how-to-book")}>
              How to Book
            </span>
            <span onClick={() => navigate("/stalls/my-bookings")}>
              My Bookings
            </span>
          </div>
        </div>

        <h1 className="stall-title">Available Stalls</h1>

        <p className="stall-subtitle" style={{ textAlign: "center" }}>
          Browse and book from our wide range of stalls
        </p>

        <p className="stall-count" style={{ textAlign: "center", marginBottom: "40px" }}>
          Total <b>12</b> stalls available
        </p>

        {/* STALL CARDS */}
        <div className="info-cards">
          {stalls.map((stall, index) => (
            <div className="info-card" key={index}>

              {/* PURPLE HEADER (ONLY ONE) */}
              <div className="card-image">
                <h3>{stall.title}</h3>
              </div>

              {/* WHITE CONTENT */}
              <div className="card-body">

                <span className="tag">{stall.category}</span>

                <p className="desc">{stall.description}</p>

                <div className="meta">
                  <div>Capacity: {stall.capacity}</div>
                  <div>Location: {stall.location}</div>
                  <div>Hours: {stall.hours}</div>
                </div>

                <div className="price">{stall.price} / hour</div>

                <button
                  className="primary-btn"
                  onClick={() => navigate("/stalls/book")}
                >
                  Book This Stall
                </button>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
