import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "../myFirebase";
import React, { useState } from "react";

// Font
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";
import { FormBtn } from "routes/Profile";

// Style
const NweetBox = styled.div`
  box-sizing: border-box;
  margin-bottom: 20px;
  background-color: white;
  width: 100%;
  padding: 20px;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  color: rgba(0, 0, 0, 0.8);

  h4 {
    font-size: 14px;
  }

  img {
    right: -10px;
    top: 20px;
    position: absolute;
    border-radius: 50%;
    width: 50px;
    height: 50px;
    margin-top: 10px;
  }
`;

const Form = styled.form`
  cursor: pointer;
  margin-top: 15px;
  margin-bottom: 5px;
  width: 100%;
  max-width: 320px;
  display: flex;
  flex-direction: column;
`;

const EditInput = styled.input`
  border: 1px solid #dce2e7;
  /* background-color: #e6ebee; */
  border-radius: 5px;
  padding: 5px 10px;
  margin-bottom: 10px;
`;

const Actions = styled.div`
  position: absolute;
  right: 10px;
  top: 10px;

  span {
    cursor: pointer;
  }

  span:first-child {
    margin-right: 10px;
  }
`;

const TrashIcon = styled(FontAwesomeIcon)`
  transition: color 0.3s ease;
  &:hover {
    color: tomato;
  }
`;

function Nweet({ nweetObj, isOwner }) {
  const [editing, setEditing] = useState(false);
  const [newNweet, setNewNweet] = useState(nweetObj.text);
  const NweetTextRef = doc(dbService, "nweets", nweetObj.id); // 컬렉션 이름, 삭제할 데이터(의 id)

  // Delete the nweet
  const onDelete = async () => {
    const ok = window.confirm("Are you sure you want to delete this nweet?");
    if (ok) {
      //delete nweet
      await deleteDoc(NweetTextRef);
      if (nweetObj.photoUrl !== "") {
        await deleteObject(ref(storageService, nweetObj.photoUrl));
      }
    }
  };

  // Edit Form
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (e) => {
    e.preventDefault();
    await updateDoc(NweetTextRef, { text: newNweet });
    setEditing(false);
  };
  const onChange = (e) => setNewNweet(e.target.value);

  return (
    <NweetBox>
      {editing ? (
        <>
          <Form onSubmit={onSubmit}>
            <EditInput
              type="text"
              placeholder="edit..."
              onChange={onChange}
              value={newNweet}
              required
              autoFocus
            />
            <FormBtn value="Submit" type="submit" onSubmit={onSubmit} />
          </Form>
          <FormBtn as="span" onClick={toggleEditing} bgColor="tomato">
            Cancel
          </FormBtn>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} />}
          {isOwner && (
            <Actions>
              <span onClick={onDelete}>
                <TrashIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </Actions>
          )}
        </>
      )}
    </NweetBox>
  );
}

export default Nweet;
