import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { authService, dbService } from "../myFirebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Profile({ refreshUser, userObj }) {
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const navigation = useNavigate();

  // Make user log out
  const onLogOut = () => {
    authService.signOut();
    navigation("/");
  };

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid),
      orderBy("createdAt", "desc")
      // where - firestore의 field path(string), Operation String(<, <=, ==,>,>=), value -유저아이디

      // Firebase는 noSQL 기반 DB라서 몇몇 기능은 중복적으로 사용될 수 없다.
    );
    const querySnapshot = await getDocs(q);
    // querySnapshot.forEach((doc) => {
    //   console.log(doc.id, " => ", doc.data());
    // }); 내가 작성한 데이터 출력
  };

  useEffect(() => {
    getMyNweets();
    if (userObj.displayName === null) {
      setNewDisplayName("user");
    }
  }, []);

  const onChange = (e) => setNewDisplayName(e.target.value);
  const onSubmit = async (e) => {
    e.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(userObj, { displayName: newDisplayName });
    }
    refreshUser();
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input
          type="text"
          autoFocus
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
        />
        <input
          type="submit"
          onClick={onSubmit}
          value="Update Profile"
          className="formBtn"
          style={{
            marginTop: 10,
          }}
        />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOut}>
        Log Out
      </span>
    </div>
  );
}
export default Profile;
