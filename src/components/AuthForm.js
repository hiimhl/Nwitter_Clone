import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import styled from "styled-components";
import { HomeContainer } from "routes/Home";

// Style
const Input = styled.input`
  max-width: 320px;
  width: 100%;
  padding: 10px;
  border-radius: 30px;
  background-color: rgba(255, 255, 255, 1);
  margin-bottom: 10px;
  font-size: 12px;
  color: black;
`;

const SubmitBtn = styled.input`
  text-align: center;
  background: #04aaff;
  color: white;
  margin-top: 10px;
  cursor: pointer;
  padding: 10px;
  border-radius: 30px;
`;

const Error = styled.span`
  color: tomato;
  text-align: center;
  font-weight: 500;
  font-size: 12px;
`;

const SwitchBtn = styled.span`
  color: #04aaff;
  cursor: pointer;
  margin-top: 10px;
  margin-bottom: 50px;
  display: block;
  font-size: 12px;
  text-decoration: underline;
`;

function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  //Input onChange
  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    // 비구조화 할당
    // const { name, value } = event.target; // 위의 코드와 같음

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  // Form OnSubmit
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      let data;
      const auth = getAuth();

      if (newAccount) {
        // create account && Log in
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        // log in
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };

  // toggle Account/ Sign in
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <HomeContainer as="form" onSubmit={onSubmit}>
        <Input
          name="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={onChange}
          required
        />
        <Input
          name="password"
          type="password"
          placeholder="Password"
          value={password}
          onChange={onChange}
          required
        />
        <SubmitBtn
          type="submit"
          value={newAccount ? "Create Account" : "Log In"}
        />
        {error && <Error>{error}</Error>}
      </HomeContainer>
      <SwitchBtn onClick={toggleAccount}>
        {newAccount ? "Sign In" : "Create Account"}
      </SwitchBtn>
    </>
  );
}

export default AuthForm;
