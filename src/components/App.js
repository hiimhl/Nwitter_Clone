import React, { useEffect, useState } from "react";
import Router from "components/Router";
import { authService } from "myFirebase";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userObj, setUserObj] = useState(null);

  // Check if user is logged in
  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // set user infomation
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);
  // onAuthStateChanged - like an EventListener. 상태가 변화하는 것을 지켜보고 알려줌.

  return (
    <>
      {init ? (
        <Router isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing..."
      )}
      <footer> &copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
