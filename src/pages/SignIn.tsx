import React, { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";

export const SignIn = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { login } = usePocket()!;
  const navigate = useNavigate();
  console.log("sign");
  const handleOnSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt?.preventDefault();
      if (!emailRef.current?.value || !passwordRef.current?.value) {
        // Handle validation error (e.g., show an error message)
        console.error("Email and password are mandatory");
        return;
      }

      await login(emailRef.current.value, passwordRef.current.value);
      navigate("/projects");
    },
    [login],
  );

  return (
    <section>
      <h2>Sign In</h2>
      <form onSubmit={handleOnSubmit}>
        <input placeholder="Email" type="email" ref={emailRef} />
        <input placeholder="Password" type="password" ref={passwordRef} />
        <button type="submit">Login</button>
        <Link to="/">New User? Register</Link>
      </form>
    </section>
  );
};
