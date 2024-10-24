import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation, useRegisterMutation } from "./authSlice";

import "./authform.css";

/** This form allows users to register or log in. */
export default function AuthFormMember() {
  const navigate = useNavigate();

  // Handles swapping between login and register
  const [isLogin, setIsLogin] = useState(true);
  const authAction = isLogin ? "Login" : "Register";
  const altCopy = isLogin
    ? "Need an account? Register here."
    : "Already have an account? Login here.";

  // Controlled form fields
  const [username, setUsername] = useState("");
  const [business, setBusiness] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Form submission
  const [login, { isLoading: loginLoading, error: loginError }] =
    useLoginMutation();
  const [register, { isLoading: registerLoading, error: registerError }] =
    useRegisterMutation();

  /** Send the requested authentication action to the API */
  const attemptAuth = async (evt) => {
    evt.preventDefault();

    const authMethod = isLogin ? login : register;
    const credentials = { name, username, business, password };

    // We don't want to navigate if there's an error.
    // `unwrap` will throw an error if there is one
    // so we can use a try/catch to handle it.
    try {
      await authMethod(credentials).unwrap();
      //set login naviagtion to proper paths
      isLogin ? navigate("/account/") : navigate("/topics/");
    } catch (err) {
      console.error(err);
    }
  };
  //create a login in form that reflects user and owner tables
  return (
    <article className="pageSetup">
      <h1>Team Member Portal</h1>
      <h2>{authAction}</h2>
      <form className="loginForm" onSubmit={attemptAuth}>
        <div className="loginInputSection">
          <label className="labelName">Name</label>
          <input
            className="loginFormInput"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
          />
        </div>
        <div className="loginInputSection">
          <label className="labelName">Username</label>
          <input
            className="loginFormInput"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
          />
        </div>
        <div className="loginInputSection">
          <label className="labelName">Business</label>
          <input
            className="loginFormInput"
            type="text"
            value={business}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="loginInputSection">
          <label className="labelName">Business Code</label>
          <input
            className="loginFormInput"
            type="text"
            value={code}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <div className="loginInputSection">
          <label className="labelName">Password</label>
          <input
            className="loginFormInput"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>
        <button className="authAction">{authAction}</button>
      </form>
      <a onClick={() => setIsLogin(!isLogin)}>{altCopy}</a>
      {(loginLoading || registerLoading) && <p>Please wait...</p>}
      {loginError && <p role="alert">{loginError}</p>}
      {registerError && <p role="alert">{registerError}</p>}
    </article>
  );
}
