import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterMemberMutation } from "./authSlice";

import styles from "./authforms.module.css";

export default function MemberRegister() {
  const navigate = useNavigate();
  const [register, { isLoading, error }] = useRegisterMemberMutation();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [memberName, setMemberName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const handleRegister = async (evt) => {
    evt.preventDefault();
    try {
      await register({ username, password, memberName, email, phone }).unwrap();
      navigate("/memberonboard");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <article className="pageSetup">
      <h1>Team Member Portal</h1>
      <form className={styles.loginForm} onSubmit={handleRegister}>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Name</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
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
          <label className={styles.labelName}>Phone</label>
          <input
            className={styles.loginFormInput}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Email</label>
          <input
            className={styles.loginFormInput}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          {isLoading ? "Registering..." : "Register"}
        </button>
        {error && (
          <p className={styles.error}>
            Registration failed: {error.data?.message || "Please try again."}
          </p>
        )}
      </form>
    </article>
  );
}
