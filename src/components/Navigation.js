import React from "react";
import { Link } from "react-router-dom";

// Font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

// Style
const Nav = styled.nav`
  ul {
    display: flex;
    justify-content: center;
    margin-top: 50;
  }
`;

// Link - react-router
const StyledLink = styled(Link)`
  margin-left: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 12;
`;

// Font Awesome Icon
const BlueIcon = styled(FontAwesomeIcon)`
  color: #04aaff;
  font-size: 28px;
`;

function Navigation({ userObj }) {
  return (
    <Nav>
      <ul>
        <li>
          <Link to="/" style={{ marginRight: 10 }}>
            <BlueIcon icon={faTwitter} />
          </Link>
        </li>
        <li>
          <StyledLink to="/profile">
            <BlueIcon icon={faUser} />
            <span style={{ marginTop: 10 }}>
              {userObj.displayName
                ? `${userObj.displayName}의 Profile`
                : "Profile"}
            </span>
          </StyledLink>
        </li>
      </ul>
    </Nav>
  );
}

export default Navigation;
