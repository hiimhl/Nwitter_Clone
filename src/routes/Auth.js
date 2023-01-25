import React from "react";
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { authService } from "myFirebase";
import AuthForm from "../components/AuthForm";

// Font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTwitter,
  faGoogle,
  faGithub,
} from "@fortawesome/free-brands-svg-icons";
import styled from "styled-components";

// Style
const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 10vh;
`;

const Btns = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 320px;

  button {
    cursor: pointer;
    border-radius: 20px;
    border: none;
    padding: 10px 0px;
    font-size: 12px;
    text-align: center;
    width: 150px;
    background: white;
    cursor: pointer;
  }
`;

function Auth() {
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
    <Container>
      <FontAwesomeIcon
        icon={faTwitter}
        color={"#04AAFF"}
        size="3x"
        style={{ marginBottom: 30 }}
      />
      <AuthForm />
      <Btns>
        <button onClick={onSocialClick} name="google">
          Google <FontAwesomeIcon icon={faGoogle} size="2x" />
        </button>
        <button onClick={onSocialClick} name="github">
          Github <FontAwesomeIcon icon={faGithub} size="2x" />
        </button>
      </Btns>
    </Container>
  );
}
export default Auth;
