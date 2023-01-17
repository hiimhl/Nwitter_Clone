import React, { useEffect, useState } from "react";
import Router from "components/Router";
import { authService } from "myFirebase";
import { updateCurrentUser } from "firebase/auth";

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
    <>
      {init ? (
        <Router
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        "Initializing..."
      )}
      <footer> &copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
