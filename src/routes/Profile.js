import { authService } from "myFirebase";
import React from "react";
import { useNavigate } from "react-router-dom";

function Profile() {
  const navigation = useNavigate();

  // Make user log out
  const onLogOut = () => {
    authService.signOut();
    navigation("/");
  };

  return (
    <>
      <button onClick={onLogOut}>Log Out</button>
    </>
  );
}
export default Profile;
