import Nweet from "components/Nweet";
import NweetFactory from "../components/NweetFactory";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { dbService } from "myFirebase";
import React, { useEffect, useRef, useState } from "react";
import { Link, Route } from "react-router-dom";
import Profile from "./Profile";

function Home({ userObj, refreshUser }) {
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
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((data) => (
          <Nweet
            key={data.id}
            nweetObj={data}
            isOwner={data.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
}
export default Home;
