import {
  collection,
  getDocs,
  setDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";

const UserList = ({
  user,
  db,
  selectedUser,
  setSelectedUser,
  setCurrentDirectMessage,
}) => {
  const [userList, setUserList] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleIsExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  useEffect(() => {
    const colRef = collection(db, "users");

    const getUserList = async () => {
      try {
        const response = await getDocs(colRef);
        const users = [];
        response.forEach((doc) => {
          users.push(doc.data());
        });
        setUserList(users);
      } catch (error) {
        console.log(error);
      }
    };
    getUserList();
  }, [db]);

  const startDirectMessage = async (userData) => {
    if (user.uid !== userData.uid) {
      const participants = [user.uid, userData.uid];
      const conversationId = participants.sort().join("_");
      setSelectedUser(userData.uid);
      setCurrentDirectMessage(conversationId);
      const convoRef = doc(db, conversationId, user.uid);

      try {
        const convoSnapshot = await getDoc(convoRef);
        if (!convoSnapshot.exists()) {
          await setDoc(doc(db, conversationId, user.uid), {
            message: `Started a conversation with ${userData.name}`,
            author: user.displayName,
            photoURL: user.photoURL,
            createdAt: serverTimestamp(),
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const startGroupMessage = () => {
    setCurrentDirectMessage(null);
    setSelectedUser(null);
  };

  return (
    user && (
      <>
        <button className="show-users-button" onClick={toggleIsExpanded}>
          {!isExpanded && <span>&gt;</span>}
          {isExpanded && <span>&lt;</span>}
        </button>
        <div className={`user-list-container ${isExpanded ? "expanded" : ""}`}>
          <ul>
            <li
              onClick={startGroupMessage}
              className={selectedUser === null ? "active-user" : ""}
            >
              <p>Group Chat</p>
            </li>
            {userList.map((userData) => (
              <li
                key={userData.uid}
                onClick={() => startDirectMessage(userData)}
                className={`${userData.uid === user.uid ? "active-user" : ""} 
              ${userData.uid === selectedUser ? "selected-user" : ""}`}
              >
                <img src={userData.photoURL} alt="user" />
                <p>{userData.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  );
};

export default UserList;
