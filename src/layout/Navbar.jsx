import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutOwner, selectOwnerToken } from "../features/auth/authOwnerSlice";
import {
  logoutMember,
  selectMemberToken,
} from "../features/auth/authMemberSlice";

import styles from "../styling/layout.module.css";

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const ownerToken = useSelector(selectOwnerToken);
  const memberToken = useSelector(selectMemberToken);

  // Token is present if either owner or member is logged in
  const token = ownerToken || memberToken;

  const handleLogout = async () => {
    if (ownerToken) {
      await dispatch(logoutOwner());
    } else if (memberToken) {
      await dispatch(logoutMember());
    }
    navigate("/");
  };

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Right Track Bookkeeping</h1>
      <ul className={styles.menu}>
        {token ? (
          <>
            {ownerToken && (
              <ul className={styles.menu}>
                <li className={styles.menuItem}>
                  <NavLink to="/ownerdashboard">Owner Dashboard</NavLink>
                </li>
                <li className={styles.menuItem}>
                  <NavLink to="/ownermembersarchives">Archives</NavLink>
                </li>
              </ul>
            )}
            {memberToken && (
              <ul className={styles.menu}>
                <li className={styles.menuItem}>
                  <NavLink to="/memberdashboard">Member Dashboard</NavLink>
                </li>
                <li className={styles.menuItem}>
                  <NavLink to="/memberarchive">Archives</NavLink>
                </li>
                <li className={styles.menuItem}>
                  <NavLink to="/membernotifications">Payments</NavLink>
                </li>
                <li className={styles.menuAccount}>Account</li>
              </ul>
            )}
            <li className={styles.menuItem}>
              <a className={styles.menuItem} onClick={handleLogout}>
                Log Out
              </a>
            </li>
          </>
        ) : (
          <li className={styles.menuItem}>
            <NavLink to="/">Log In</NavLink>
          </li>
        )}
      </ul>
    </nav>
  );
}
