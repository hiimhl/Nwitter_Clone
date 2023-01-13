import React, { useEffect, useState } from "react";
import Router from "components/Router";
import { authService } from "myFirebase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // setInterval(() => {
  //   console.log(authService.currentUser);
  // }, 2000);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      user ? setIsLoggedIn(true) : setIsLoggedIn(false);
      setInit(true);
    });
  }, []);
  // onAuthStateChanged - like an EventListener. 상태가 변화하는 것을 지켜보고 알려줌.

  return (
    <>
      {init ? <Router isLoggedIn={isLoggedIn}></Router> : "Initializing..."}
      <footer> &copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
