import React, { useCallback, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";

import { usePocket } from "../contexts/PocketContext";

export const SignIn = () => {
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const { user, login } = usePocket()!;
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/projects");
  }, [user]);

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
    [login]
  );

  return (
    <section className="flex flex-col justify-center items-center h-screen min-w-[400px]">
      <h1 className="mb-5">Sign In</h1>
      <form onSubmit={handleOnSubmit} className="w-full max-w-sm">
        <div className="items-center mb-5 w-full form-group">
          <label className="block mb-1 text-left" htmlFor="email">
            Email:
          </label>
          <input
            className="block p-2 w-full rounded border border-gray-300"
            placeholder="Enter your email"
            type="email"
            ref={emailRef}
            required
          />
        </div>
        <div className="relative items-center w-full">
          <label className="block mb-1 text-left">Password:</label>
          <input
            className="block p-2 w-full rounded border border-gray-300"
            placeholder="Enter your password"
            type="password"
            ref={passwordRef}
            required
          />
          <button
            className="absolute bottom-2 right-3"
            type="button"
            onClick={() => {
              if (passwordRef.current) {
                passwordRef.current.type =
                  passwordRef.current.type === "password" ? "text" : "password";
              }
            }}
          >
            Toggle
          </button>
        </div>
        <button
          type="submit"
          className="block p-2 mx-auto my-7 rounded border border-gray-300"
        >
          Log in
        </button>
        <p className="mt-2">
          New User? <Link to="/"> Register</Link>
        </p>
      </form>
    </section>
  );
};
