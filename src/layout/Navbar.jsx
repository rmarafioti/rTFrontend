import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutOwner, selectOwnerToken } from "../features/auth/authOwnerSlice";
import {
  logoutMember,
  selectMemberToken,
} from "../features/auth/authMemberSlice";
import { useGetOwnerQuery } from "../features/owner/ownerSlice";
import { useGetMemberQuery } from "../features/members/membersSlice";

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

  // Functionality to open and close ham menu
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Collapse menu when user routes to another path via ham menu
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  // Only make the request if an ownerToken is present
  const {
    data: owner,
    error,
    isLoading,
  } = useGetOwnerQuery(undefined, {
    skip: !ownerToken, // Skip the query if ownerToken is not present
  });

  // Only make the request if an memberToken is present
  const { data: member } = useGetMemberQuery(undefined, {
    skip: !memberToken, // Skip the query if memberToken is not present
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const memberId = member?.id;

  // Mobile menu for member
  function MenuMember() {
    return (
      <menu className={`${styles.menuMember} ${menuOpen ? styles.active : ""}`}>
        <ul className={styles.hamMenuSection}>
          <li>
            <p className={styles.hamMenuItem} id={styles.staticInfo}>
              {member?.business?.businessName}
            </p>
          </li>
          <li className={styles.hamMenuItem} id={styles.staticInfo}>
            Total Profits:{" "}
            <b className={styles.bizTakeHome}>${member?.takeHomeTotal}.00</b>
          </li>
          <li className={styles.hamMenuItem}>
            <NavLink to="/memberdashboard">Member Dashboard</NavLink>
          </li>
          <li className={styles.hamMenuItem}>
            <NavLink to="/membercreatedrop">Create A Drop</NavLink>
          </li>
          <li className={styles.hamMenuItem}>
            <NavLink to={`/archive/${memberId}`}>Archive</NavLink>
          </li>
          <li className={styles.hamMenuItem}>
            <NavLink to="/membernotifications">Payments</NavLink>
          </li>
        </ul>
        <li className={styles.hamMenuItem} id={styles.logoutContainer}>
          <a className={styles.logout} onClick={handleLogout}>
            Log Out
          </a>
        </li>
      </menu>
    );
  }

  // Map through all the team members linked to the business
  function TeamMembersCard() {
    return (
      <>
        {owner?.ownerBusiness?.length ? (
          owner.ownerBusiness.map((business) => (
            <ul className={styles.teamMembersList}>
              {business.businessMember?.length ? (
                business.businessMember.map((member) => (
                  <NavLink
                    className={styles.teamMemberLink}
                    to={`ownermemberprofile/${member.id}`}
                  >
                    <li className={styles.teamMember} key={member.id}>
                      <p className={styles.teamMemberName}>
                        {member.memberName}
                      </p>
                    </li>
                  </NavLink>
                ))
              ) : (
                <li>No team members found</li>
              )}
            </ul>
          ))
        ) : (
          <p>No businesses found</p>
        )}
      </>
    );
  }

  // Mobile menu for owner
  function MenuOwner() {
    return (
      <menu className={`${styles.menuOwner} ${menuOpen ? styles.active : ""}`}>
        <ul>
          <li>
            <p className={styles.hamMenuItem} id={styles.staticInfo}>
              {owner?.ownerBusiness?.[0]?.businessName}
            </p>
          </li>
          <li className={styles.hamMenuItem} id={styles.staticInfo}>
            Total Profits:{" "}
            <b className={styles.bizTakeHome}>${owner?.takeHomeTotal}.00</b>
          </li>
          <li className={styles.hamMenuItem} id={styles.teamMembers}>
            Team Members:
          </li>
          <TeamMembersCard />
          <li className={styles.hamMenuItem}>
            <NavLink to="/ownerdashboard">Owner Dashboard</NavLink>
          </li>
          <li className={styles.hamMenuItem}>
            <NavLink to="/ownermembersarchives">Archives</NavLink>
          </li>
        </ul>
        <li className={styles.hamMenuItem} id={styles.logoutContainer}>
          <a className={styles.logout} onClick={handleLogout}>
            Log Out
          </a>
        </li>
      </menu>
    );
  }

  // Hamburger menu
  function HamMenu() {
    return (
      <section className={styles.hamMenuContainer} onClick={toggleMenu}>
        <div
          className={`${styles.menuButtonBurger} ${
            menuOpen ? styles.open : ""
          }`}
        ></div>
        {memberToken && <MenuMember />}
        {ownerToken && <MenuOwner />}
      </section>
    );
  }

  return (
    <>
      {token && (
        <nav className={styles.navbar}>
          <h1 className={styles.title}>Right Track Bookkeeping</h1>
          <ul className={styles.menu}>
            {/* Owner menu desktop */}
            {ownerToken && (
              <div>
                <ul className={styles.menu}>
                  <li className={styles.menuItem}>
                    <NavLink to="/ownerdashboard">Owner Dashboard</NavLink>
                  </li>
                  <li className={styles.menuItem}>
                    <NavLink to="/ownermembersarchives">Archives</NavLink>
                  </li>
                  <li className={styles.menuAccount}>
                    Account
                    <ul className={styles.subCategory}>
                      <li className={styles.subItem}>
                        business: {owner?.ownerBusiness?.[0]?.businessName}
                      </li>
                      <li className={styles.subItem}>team members:</li>
                      <TeamMembersCard />
                      <li
                        className={styles.subItem}
                        id={styles.logout}
                        onClick={handleLogout}
                      >
                        Log Out
                      </li>
                    </ul>
                  </li>
                  <HamMenu />
                </ul>
              </div>
            )}
            {/* Member menu desktop */}
            {memberToken && (
              <ul className={styles.menu}>
                <li className={styles.menuItem}>
                  <NavLink to="/memberdashboard">Member Dashboard</NavLink>
                </li>
                <li className={styles.menuItem}>
                  <NavLink to={`/archive/${memberId}`}>Archives</NavLink>
                </li>
                <li className={styles.menuItem}>
                  <NavLink to="/membernotifications">Payments</NavLink>
                </li>
                <li className={styles.menuAccount}>
                  Account
                  <ul className={styles.subCategory}>
                    <li className={styles.subItem} id={styles.firstListItem}>
                      Business: {member?.business?.businessName}
                    </li>
                    <li className={styles.subItem}>
                      Total Profits: {member?.takeHomeTotal}
                    </li>
                    <li className={styles.subItem} id={styles.createDrop}>
                      <NavLink to="/membercreatedrop">Create A Drop</NavLink>
                    </li>
                    <li
                      className={styles.subItem}
                      id={styles.logout}
                      onClick={handleLogout}
                    >
                      Log Out
                    </li>
                  </ul>
                </li>
                <HamMenu />
              </ul>
            )}
          </ul>
        </nav>
      )}
    </>
  );
}
