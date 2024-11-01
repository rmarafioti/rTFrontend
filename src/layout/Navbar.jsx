import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { logoutOwner, selectOwnerToken } from "../features/auth/authOwnerSlice";
import {
  logoutMember,
  selectMemberToken,
} from "../features/auth/authMemberSlice";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  const token = ownerToken || memberToken; // Token is present if either owner or member is logged in

  // Log the token to verify its presence after login
  useEffect(() => {
    console.log("Current token:", token); // This will log whenever `token` changes
  }, [token]);

  const handleLogout = async () => {
    if (ownerToken) {
      await dispatch(logoutOwner());
    } else if (memberToken) {
      await dispatch(logoutMember());
    }
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
