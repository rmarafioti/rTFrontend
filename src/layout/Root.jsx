import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

import "../index.css";

export default function Root() {
  return (
    <article className="layout">
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </article>
  );
}
