import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout, selectToken } from "../features/auth/authSlice";
import { useEffect } from "react";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const token = useSelector(selectToken);

  // Log the token to verify its presence after login
  useEffect(() => {
    console.log("Current token:", token); // This will log whenever `token` changes
  }, [token]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  return (
    <nav id="navbar">
      <NavLink to={`/`}>
        <h1>Right Track Bookkeeping</h1>
      </NavLink>
      <ul>
        {token ? (
          <li>
            <a className="navLink" onClick={handleLogout}>
              Log Out
            </a>
          </li>
        ) : (
          <li>
            <NavLink to="/">Log In</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
