import React, { useState } from "react";
import { async } from "@firebase/util";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

function Auth() {
  const [user, setUser] = useState({
    //
    email: "",
    password: "",
  });
  const [newAccount, setNewAccount] = useState(true);

  //Input onChange
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    // 비구조화 할당
    // const { name, value } = event.target; // 위의 코드와 같음

    setUser({ ...user, [name]: value });
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
      console.log(data);
    } catch (error) {
      console.log(error);
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
      </form>
      <div>
        <button>Continue with Google</button>
      </div>
    </div>
  );
}
export default Auth;
