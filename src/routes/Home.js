import Nweet from "components/Nweet";
import {
  addDoc,
  collection,
  getDocs,
  query,
  onSnapshot,
  orderBy,
  doc,
} from "firebase/firestore";
import { dbService } from "myFirebase";
import React, { useEffect, useState } from "react";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
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

  // Add data to firebase
  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet("");
  };

  const onChange = (e) => setNweet(e.target.value);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          onChange={onChange}
          value={nweet}
          placeholder="What' on your mind?"
          maxLength={120}
        />
        <input type="submit" onClick={onSubmit} value="Nweet" />
      </form>
      <div>
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
