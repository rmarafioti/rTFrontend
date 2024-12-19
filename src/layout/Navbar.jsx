import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutOwner, selectOwnerToken } from "../features/auth/authOwnerSlice";
import {
  logoutMember,
  selectMemberToken,
} from "../features/auth/authMemberSlice";
import { useGetOwnerQuery } from "../features/owner/ownerSlice";

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

  const { data: owner, error, isLoading } = useGetOwnerQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  function TeamMembersCard() {
    return (
      <>
        {owner?.ownerBusiness?.length ? (
          owner.ownerBusiness.map((business) => (
            <div key={business.id}>
              <ul className={styles.teamMember}>
                {business.businessMember?.length ? (
                  business.businessMember.map((member) => (
                    <li key={member.id}>
                      <p className={styles.teamMemberName}>
                        {member.memberName}
                      </p>
                      <p>Percentage: {member.percentage}</p>
                      <p>Take Home Total: {member.takeHomeTotal}</p>
                      <p> {member.memberName} Archive</p>
                    </li>
                  ))
                ) : (
                  <li>No team members found</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No businesses found</p>
        )}
      </>
    );
  }

  return (
    <nav className={styles.navbar}>
      <h1 className={styles.title}>Right Track Bookkeeping</h1>
      <ul className={styles.menu}>
        {token ? (
          <>
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
                      <li>
                        business: {owner?.ownerBusiness?.[0]?.businessName}
                      </li>
                      <li>team members:</li>
                      <TeamMembersCard />
                      <a className={styles.menuItem} onClick={handleLogout}>
                        Log Out
                      </a>
                    </ul>
                  </li>
                </ul>
              </div>
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
                <li className={styles.menuAccount}>
                  Account
                  <ul className={styles.subCategory}>
                    <li>business:</li>
                    <li>team members:</li>
                    <a className={styles.menuItem} onClick={handleLogout}>
                      Log Out
                    </a>
                  </ul>
                </li>
              </ul>
            )}
            {/*<li className={styles.menuItem}>
              <a className={styles.menuItem} onClick={handleLogout}>
                Log Out
              </a>
            </li>*/}
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
