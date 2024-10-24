export default function OnboardOwner() {
  return (
    <article className="pageSetup">
      <h1>Enter your business information</h1>
      <form className="loginForm">
        <label className="labelName">Business Name:</label>
        <input className="loginFormInput" type="text" required />
        <label className="labelName">Business Code:</label>
        <input className="loginFormInput" type="text" required />
        <button className="authAction">Create Business</button>
      </form>
    </article>
  );
}
