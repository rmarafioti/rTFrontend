import Navbar from "./layout/Navbar";
import Footer from "./layout/Footer";
import Dashboard from "./features/Dashboard";
import Drop from "./components/Drop";

import "./index.css";

export default function main() {
  return (
    <>
      <Navbar />
      <Dashboard />
      <Drop />
      <Footer />
    </>
  );
}
