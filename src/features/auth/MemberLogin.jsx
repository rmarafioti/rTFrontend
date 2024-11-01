import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMemberMutation } from "./authMemberSlice";

import styles from "./authforms.module.css";

export default function MemberLogin() {
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMemberMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (evt) => {
    evt.preventDefault();
    try {
      await login({ username, password }).unwrap();
      navigate("/memberdashboard");
    } catch (err) {
      console.error(err);
    }
  };
  //create a login in form that reflects member and owner tables
  return (
    <article className="pageSetup">
      <h1>Team Member Portal</h1>
      <form className={styles.loginForm} onSubmit={handleLogin}>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Username</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Password</label>
          <input
            className={styles.loginFormInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
        {error && (
          <p className={styles.error}>Login failed: {error.data?.message}</p>
        )}
      </form>
    </article>
  );
}
