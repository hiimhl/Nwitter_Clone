import React, { useRef, useState } from "react";
import { dbService, storageService } from "../myFirebase";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { collection, addDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

// Style
const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;
const InputBox = styled.div`
  display: flex;
  align-items: center;
  /* flex-wrap: wrap; */
  position: relative;
  margin-bottom: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;

  div {
    width: 90%;
    margin: 10px 0;

    input {
      flex-grow: 1;
      height: 40px;
      padding: 0px 20px;
      width: 100%;
      margin-top: 10px;
      color: white;
      border: 1px solid #04aaff;
      border-radius: 20px;
      font-weight: 500;
      font-size: 12px;
    }
  }
`;

const Arrow = styled.input`
  /* position: absolute;
  right: -15px; */
  background-color: #04aaff;
  height: 40px;
  width: 40px;
  padding: 10px 0px;
  text-align: center;
  border-radius: 20px;
  color: white;
`;

const Label = styled.label`
  color: #04aaff;
  cursor: pointer;

  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;
const PhotoAttachment = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  img {
    height: 80px;
    width: 80px;
    border-radius: 40px;
  }
`;

const PhotoClear = styled.div`
  color: #04aaff;
  cursor: pointer;
  text-align: center;

  span {
    margin-right: 10px;
    font-size: 12px;
  }
`;

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
    <Form onSubmit={onSubmit}>
      <InputBox>
        <div>
          <input
            type="text"
            onChange={onChange}
            value={nweet}
            placeholder="What' on your mind?"
            maxLength={120}
            autoFocus
          />
          <input
            type="file"
            accept="image/*"
            ref={fileInput}
            onChange={onFileChange}
          />
        </div>
        <Arrow
          type="submit"
          onClick={onSubmit}
          value="&rarr;"
          className="factoryInput__arrow"
        />
      </InputBox>
      <Label htmlFor="attach-file">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </Label>
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
        <PhotoAttachment>
          <img
            src={getPhoto}
            style={{
              backgroundImage: getPhoto,
            }}
          />
          <PhotoClear onClick={onClearPhoto}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </PhotoClear>
        </PhotoAttachment>
      )}
    </Form>
  );
}

export default NweetFactory;
