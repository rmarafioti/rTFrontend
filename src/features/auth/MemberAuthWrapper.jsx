import { useState } from "react";
import MemberLogin from "./MemberLogin";
import MemberRegister from "./MemberRegister";

export default function AuthWrapper() {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <article className="pageSetup">
      {isLogin ? <MemberLogin /> : <MemberRegister />}
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin
          ? "Need an account? Register here."
          : "Already have an account? Login here."}
      </button>
    </article>
  );
}
