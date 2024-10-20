import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Dashboard from "./features/Dashboard";

import "./index.css";

export default function main() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <Footer />
    </>
  );
}
