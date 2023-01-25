import React, { useEffect, useState } from "react";
import Router from "./Router";
import { authService } from "../myFirebase";
import { updateCurrentUser } from "firebase/auth";
import { GlobalStyle } from "global-style";
import styled from "styled-components";

// Style
const Wrapper = styled.div`
  width: 100%;
  max-width: 890px;
  margin: 0 auto;
  margin-top: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  footer {
    width: 100%;
    display: flex;

    span {
      padding-top: 20px;
      margin: auto;
    }
  }
`;

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user); // set user information
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);
  // onAuthStateChanged - like an EventListener. 상태가 변화하는 것을 지켜보고 알려줌.

  // Send to Profile component
  const refreshUser = async () => {
    await updateCurrentUser(authService, authService.currentUser);
    setUserObj(authService.currentUser);
  };

  return (
    <Wrapper>
      <GlobalStyle />
      {init ? (
        <Router
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer>
        <span> &copy; {new Date().getFullYear()} Nwitter</span>
      </footer>
    </Wrapper>
  );
}

export default App;
