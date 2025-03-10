import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useRegisterOwnerMutation,
  useLoginOwnerMutation,
} from "./authOwnerSlice";
import { useCreateBusinessMutation } from "../owner/ownerSlice";

import styles from "./authforms.module.css";

// This form allows users to register or log in.
export default function AuthFormOwner() {
  const navigate = useNavigate();

  // Handles swapping between login and register
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "Owner Login" : "Owner Register";
  const altCopy = isLogin
    ? "Need an account? Register here."
    : "Already have an account? Login here.";

  // Controlled form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Form fields for registration
  const [ownerName, setOwnerName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  // Form submission
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginOwnerMutation();
  const [register, { isLoading: registerLoading, error: registerError }] =
    useRegisterOwnerMutation();
  // Additional form sunmission for registration
  const [
    createBusiness,
    { isLoading: createBusinessLoading, error: createBusinessError },
  ] = useCreateBusinessMutation();

  /** Send the requested authentication action to the API */
  const attemptAuth = async (evt) => {
    evt.preventDefault();

    const authMethod = isLogin ? login : register;
    const credentials = { username, password, ownerName };

    // We don't want to navigate if there's an error.
    // `unwrap` will throw an error if there is one
    // so we can use a try/catch to handle it.
    try {
      const authResponse = await authMethod(credentials).unwrap();
      //set login naviagtion to proper paths

      if (!isLogin) {
        // If registering, create a business after successful registration
        const ownerId = authResponse.id;
        await createBusiness({
          businessName,
          code,
          ownerId,
        }).unwrap();
      }

      navigate("/ownerdashboard/");
    } catch (err) {
      console.error("Authentication or business creation failed:", err);
    }
  };

  return (
    <article className="pageSetup">
      <h1 className={styles.header}>{authAction}</h1>
      <a onClick={() => setIsLogin(!isLogin)} className={styles.altCopy}>
        {altCopy}
      </a>
      <form className={styles.loginForm} onSubmit={attemptAuth}>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Username:</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </div>
        <div className={styles.loginInputSection}>
          <label className={styles.labelName}>Password:</label>
          <input
            className={styles.loginFormInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        {/* Only show these fields if registering */}
        {!isLogin && (
          <section className={styles.register}>
            <div className={styles.loginInputSection}>
              <label className={styles.labelName}>Full Name:</label>
              <input
                className={styles.loginFormInput}
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className={styles.loginInputSection}>
              <label className={styles.labelName}>Business:</label>
              <input
                className={styles.loginFormInput}
                type="text"
                value={businessName}
                placeholder="Enter your business name"
                onChange={(e) => setBusinessName(e.target.value)}
                required
              />
            </div>
            <div className={styles.loginInputSection}>
              <label className={styles.labelName}>Code:</label>
              <input
                className={styles.loginFormInput}
                type="password"
                value={code}
                placeholder="Enter a unique code for your business"
                onChange={(e) => setCode(e.target.value)}
                required
              />
            </div>
          </section>
        )}
        <button
          className={styles.authAction}
          disabled={loginLoading || registerLoading}
        >
          {loginLoading || registerLoading || createBusinessLoading
            ? "Please wait..."
            : authAction}
        </button>
      </form>

      {(loginLoading || registerLoading) && <p>Please wait...</p>}
      {loginError && (
        <p role="alert">{loginError.data?.message || "Login failed"}</p>
      )}
      {registerError && (
        <p role="alert">
          {registerError.data?.message || "Registration failed"}
        </p>
      )}
      {createBusinessError && (
        <p role="alert">
          {createBusinessError.data?.message ||
            "Failure create business for owner"}
        </p>
      )}
    </article>
  );
}
