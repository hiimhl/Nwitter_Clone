import { addDoc, collection, getDocs } from "firebase/firestore";
import { dbService } from "myFirebase";
import React, { useEffect, useState } from "react";

function Home() {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  //Get data from firebase
  const getNweets = async () => {
    const dbNweets = await getDocs(collection(dbService, "nweets"));
    dbNweets.forEach((doc) => {
      const nweetObject = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets((prev) => [nweetObject, ...prev]);
    });
  };

  useEffect(() => {
    getNweets();
    console.log(nweets);
  }, []);

  // Add data to firebase
  const onSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(dbService, "nweets"), {
      nweet,
      createdAt: Date.now(),
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
          <div key={data.id}>
            <h4>{data.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
export default Home;
