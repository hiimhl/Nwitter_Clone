import Nweet from "components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { dbService } from "myFirebase";
import React, { useEffect, useState } from "react";
import styled from "styled-components";

// Style

export const HomeContainer = styled.div`
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

const NweetBox = styled.div`
  margin-top: 30px;
  height: auto;
  max-height: 57vh;

  /* Make scroll and hide scrollbar */
  overflow-y: scroll;
  -ms-overflow-style: none; /* 인터넷 익스플로러 */
  scrollbar-width: none; /* 파이어폭스 */
  &::-webkit-scrollbar {
    display: none; /* 크롬, 사파리, 오페라, 엣지 */
  }
`;

function Home({ userObj }) {
  const [nweets, setNweets] = useState([]);

  //Get data from firebase in realtime
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  return (
    <HomeContainer>
      <NweetFactory userObj={userObj} />
      <NweetBox>
        {nweets.map((data) => (
          <Nweet
            key={data.id}
            nweetObj={data}
            isOwner={data.creatorId === userObj.uid}
          />
        ))}
      </NweetBox>
    </HomeContainer>
  );
}
export default Home;
