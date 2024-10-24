import { NavLink } from "react-router-dom";

export default function Navbar() {
  return (
    <nav id="navbar">
      <NavLink to={`/`}>
        <h1>Right Track Bookkeeping</h1>
      </NavLink>
    </nav>
  );
}
