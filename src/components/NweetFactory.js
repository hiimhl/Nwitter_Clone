import React, { useRef, useState } from "react";
import { dbService, storageService } from "../myFirebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

function NweetFactory({ userObj }) {
  const [nweet, setNweet] = useState("");
  const [getPhoto, setGetPhoto] = useState("");
  const fileInput = useRef();

  const onChange = (e) => setNweet(e.target.value);

  // Add data to firebase
  const onSubmit = async (e) => {
    if (nweet === "") {
      return;
    }
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
  const onClearPhoto = () => {
    setGetPhoto("");
    fileInput.current.value = "";
  };

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
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
        <input
          type="submit"
          onClick={onSubmit}
          value="&rarr;"
          className="factoryInput__arrow"
        />
      </div>
      <label htmlFor="attach-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input
        id="attach-file"
        type="file"
        accept="image/*"
        onChange={onFileChange}
        style={{
          opacity: 0,
        }}
      />

      {getPhoto && (
        <div className="factoryForm__attachment">
          <img
            src={getPhoto}
            style={{
              backgroundImage: getPhoto,
            }}
          />
          <div className="factoryForm__clear" onClick={onClearPhoto}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
    </form>
  );
}

export default NweetFactory;
