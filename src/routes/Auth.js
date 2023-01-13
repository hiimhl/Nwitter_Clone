import React, { useState } from "react";
import { async } from "@firebase/util";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "myFirebase";

function Auth() {
  const [user, setUser] = useState({
    //
    email: "",
    password: "",
  });
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  //Input onChange
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    // 비구조화 할당
    // const { name, value } = event.target; // 위의 코드와 같음

    setUser({ [name]: value, ...user });
  };

  // Form OnSubmit
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;

      // Error Tenant Id....
      const auth = getAuth();

      if (newAccount) {
        // create account && Log in
        data = await createUserWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );
      } else {
        // log in
        data = await signInWithEmailAndPassword(
          auth,
          user.email,
          user.password
        );
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // toggle Account/ Sign in
  const toggleAccount = () => setNewAccount((prev) => !prev);

  // Handle google and github login buttons
  const onSocialClick = async (e) => {
    const {
      target: { name },
    } = e;
    let provider;

    if (name === "google") {
      provider = new GoogleAuthProvider();
      const result = await signInWithPopup(authService, provider);
    } else if (name === "github") {
      provider = new GithubAuthProvider();
      const result = await signInWithPopup(authService, provider);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          value={user.email}
          onChange={onChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={user.password}
          onChange={onChange}
          required
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </span>
      <div>
        <button onClick={onSocialClick} name="google">
          Continue with Google
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github
        </button>
      </div>
    </div>
  );
}
export default Auth;
