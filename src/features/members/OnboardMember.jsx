export default function OnboardMember() {
  return (
    <article className="pageSetup">
      <h1>Enter you contact info to connect with other team members</h1>
      <form className="loginForm">
        <label className="labelName">Phone:</label>
        <input className="loginFormInput" type="text" required />
        <label className="labelName">Email:</label>
        <input className="loginFormInput" type="email" required />
        <button className="authAction">Submit Contact Info</button>
      </form>
    </article>
  );
}
