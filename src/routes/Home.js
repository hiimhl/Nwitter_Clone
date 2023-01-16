import Nweet from "components/Nweet";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { dbService, storageService } from "myFirebase";
import React, { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

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

    // Upload Photograph
    let photoUrl = "";
    if (getPhoto !== "") {
      const photoRef = ref(storageService, `${userObj.uid}/${uuidv4()}`); // 유저아이디/랜덤아이디
      // getStorage, 데이터가 저장될 주소
      const response = await uploadString(photoRef, getPhoto, "data_url"); // 주소, 데이터, format

      // download file what user uploaded
      photoUrl = await getDownloadURL(response.ref);
    }

    await addDoc(collection(dbService, "nweets"), {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      photoUrl,
    });
    setNweet("");
    setGetPhoto("");

    // Clean the input text
    fileInput.current.value = "";
  };

  const onChange = (e) => setNweet(e.target.value);

  // Get image & Make a thumbnail
  const onFileChange = (e) => {
    const { files } = e.target;
    const theFile = files[0]; // cause input get only one file
    const reader = new FileReader();

    // to read Image
    reader.onloadend = (finishedEvent) => {
      const { result } = finishedEvent.currentTarget;
      setGetPhoto(result);
    };
    // Make Image to dataUrl / string
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
