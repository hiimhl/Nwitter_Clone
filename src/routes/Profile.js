import { updateProfile } from "firebase/auth";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { authService, dbService } from "../myFirebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { HomeContainer } from "./Home";
import styled from "styled-components";

// Style
const Form = styled.form`
  border-bottom: 1px solid rgba(255, 255, 255, 0.9);
  padding: 30px 0;
  width: 100%;
  display: flex;
  flex-direction: column;

  input {
    border: 1px solid #04aaff;
    padding: 7px 20px;
    text-align: center;
    color: white;
    border-radius: 20px;
    margin-top: 10px;
  }
`;

// Form button
export const FormBtn = styled.input`
  cursor: pointer;
  width: 100%;
  padding: ${(pros) => (pros.btn ? "10px 0" : "10px 20px")};
  text-align: center;
  color: white;
  border-radius: 20px;
  background-color: ${(props) => props.bgColor || "#04aaff"};
  margin-top: ${(props) => props.marginTop || 0};
`;

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
    <HomeContainer>
      <Form onSubmit={onSubmit}>
        <input
          type="text"
          autoFocus
          placeholder="Display name"
          onChange={onChange}
          value={newDisplayName}
        />
        <FormBtn
          type="submit"
          onClick={onSubmit}
          marginTop="10px"
          value="Update Profile"
        />
      </Form>
      <FormBtn
        as="span"
        bgColor="tomato"
        marginTop="50px"
        btn={true}
        onClick={onLogOut}
      >
        Log Out
      </FormBtn>
    </HomeContainer>
  );
}
export default Profile;
