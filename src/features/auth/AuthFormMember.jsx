import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useLoginMemberMutation,
  useRegisterMemberMutation,
} from "./authMemberSlice";
import { useGetBusinessQuery } from "../buisness/businessSlice";
import { useLinkMemberToBusinessMutation } from "../members/membersSlice";

import styles from "./authforms.module.css";

// This form allows users to register or log in.
export default function AuthFormMember() {
  const {
    data: businesses,
    isLoading: isBusinessesLoading,
    isError: isBusinessesError,
  } = useGetBusinessQuery();
  const navigate = useNavigate();

  // Handles swapping between login and register
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "Member Login" : "Member Register";
  const altCopy = isLogin
    ? "Need an account? Register here."
    : "Already have an account? Login here.";

  // Controlled form fields
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [memberName, setMemberName] = useState("");

  // Form fields for registration
  const [businessName, setBusinessName] = useState("");
  const [code, setCode] = useState("");

  // Form submission
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMemberMutation();
  const [register, { isLoading: registerLoading, error: registerError }] =
    useRegisterMemberMutation();
  // Additional form submission for registration
  const [
    linkBusiness,
    { isLoading: linkToBusinessLoading, error: linkToBusinessError },
  ] = useLinkMemberToBusinessMutation();

  /** Send the requested authentication action to the API */
  const attemptAuth = async (evt) => {
    evt.preventDefault();

    const authMethod = isLogin ? login : register;
    const credentials = { username, password, memberName };

    // We don't want to navigate if there's an error.
    // `unwrap` will throw an error if there is one
    // so we can use a try/catch to handle it.
    try {
      const authResponse = await authMethod(credentials).unwrap();
      //set login naviagtion to proper paths

      if (!isLogin) {
        // If registering, link member to business after successful registration
        const memberId = authResponse.id;
        await linkBusiness({
          businessName,
          code,
          memberId,
        }).unwrap();
      }

      navigate("/memberdashboard/");
    } catch (err) {
      console.error("Authentication or linking to business failed:", err);
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
          <label className={styles.labelName}>Full Name:</label>
          <input
            className={styles.loginFormInput}
            type="text"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
            autoComplete="name"
          />
        </div>
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
              <label className={styles.labelName}>Business:</label>
              {isBusinessesLoading ? (
                <p>Loading business...</p>
              ) : isBusinessesError ? (
                <p>Error loading businesses</p>
              ) : (
                <select
                  className={styles.loginFormInput}
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  required
                >
                  <option value="" disabled>
                    -- Select a business --
                  </option>
                  {businesses.map((business) => (
                    <option key={business.id} value={business.name}>
                      {business?.businessName}
                    </option>
                  ))}
                </select>
              )}
            </div>
            <div className={styles.loginInputSection}>
              <label className={styles.labelName}>Code:</label>
              <input
                className={styles.loginFormInput}
                type="password"
                value={code}
                placeholder="Enter your owner provided business code"
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
          {loginLoading || registerLoading ? "Please wait..." : authAction}
        </button>
      </form>
      {(loginLoading || registerLoading || linkToBusinessLoading) && (
        <p>Please wait...</p>
      )}
      {loginError && (
        <p role="alert">{loginError.data?.message || "Login failed"}</p>
      )}
      {registerError && (
        <p role="alert">
          {registerError.data?.message || "Registration failed"}
        </p>
      )}
      {linkToBusinessError && (
        <p role="alert">
          {linkToBusinessError.data?.message ||
            "Failure to connect to business"}
        </p>
      )}
    </article>
  );
}
