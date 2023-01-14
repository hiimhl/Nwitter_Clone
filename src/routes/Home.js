import Nweet from "components/Nweet";
import {
  addDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import { dbService } from "myFirebase";
import React, { useEffect, useRef, useState } from "react";

function Home({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [getPhoto, setGetPhoto] = useState(null);
  const fileInput = useRef();

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

  // Get image & Make a thumbnail
  const onFileChange = (e) => {
    const { files } = e.target;
    const theFile = files[0]; // cause input get only one file
    const reader = new FileReader();

    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget; // Make image to string
      setGetPhoto(result);
    };
    reader.readAsDataURL(theFile); // read image
  };
  const onClearPhoto = (e) => {
    setGetPhoto(null);
    fileInput.current.value = "";
  };

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
        <input
          type="file"
          accept="image/*"
          ref={fileInput}
          onChange={onFileChange}
        />
        <input type="submit" onClick={onSubmit} value="Nweet" />
        {getPhoto && (
          <div>
            <img src={getPhoto} alt="thumbnail" width="50px" height="50px" />
            <button onClick={onClearPhoto}>Clear image</button>
          </div>
        )}
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
