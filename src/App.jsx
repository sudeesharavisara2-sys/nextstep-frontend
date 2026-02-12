import { BrowserRouter, Routes, Route } from "react-router-dom";

// Auth
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

// Dashboard
import Dashboard from "./components/Dashboard/Dashboard";

// Lost & Found
import LostFoundHome from "./components/LostFound/LostFoundHome";
import ItemList from "./components/LostFound/ItemList";
import ReportItem from "./components/LostFound/ReportItem";
import Navbar from "./components/Navbar";



//import "./styles/lostFound.css";

function App() {
  return (
    <BrowserRouter>
     {/* ✅ ADD THIS LINE */}
      
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Lost & Found */}
        <Route path="/lostfound" element={<LostFoundHome />} />
        <Route path="/lostfound/items" element={<ItemList />} />
        <Route path="/lostfound/report" element={<ReportItem />} />
     

      </Routes>
    </BrowserRouter>
  );
}

export default App;