import { useCallback, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";

export const SignUp = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { register } = usePocket()!;
  const navigate = useNavigate();

  const handleOnSubmit = useCallback(
    async (evt: React.FormEvent<HTMLFormElement>) => {
      evt?.preventDefault();

      // Basic validation
      if (!emailRef.current?.value || !passwordRef.current?.value) {
        // Handle validation error (e.g., show an error message)
        console.error("Email and password are mandatory");
        return;
      }

      await register(emailRef.current.value, passwordRef.current.value);
      navigate("/sign-in");
    },
    [register, navigate]
  );

  return (
    <section>
      <h2>Sign Up</h2>
      <form onSubmit={handleOnSubmit}>
        <input placeholder="Email" type="email" ref={emailRef} required />
        <input
          placeholder="Password"
          type="password"
          ref={passwordRef}
          required
        />
        <button type="submit">Create</button>
        <Link to="/sign-in">Go to Sign In</Link>
      </form>
    </section>
  );
};
