import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { dbService, storageService } from "myFirebase";
import React, { useState } from "react";

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
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="edit..."
              onChange={onChange}
              value={newNweet}
              required
            />
            <input value="Submit" type="submit" onSubmit={onSubmit} />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.photoUrl && (
            <img src={nweetObj.photoUrl} width="50px" height="50px" />
          )}
          {isOwner && (
            <>
              <button onClick={onDelete}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default Nweet;
