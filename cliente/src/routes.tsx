import { Routes, Route } from "react-router-dom";
import App from "./App";
import { Home } from "./components/home";




export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  );
}