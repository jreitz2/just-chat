import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  addDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

const Home = ({ db, isLoggedIn, user, selectedUser, currentDirectMessage }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollRef = useRef();
  const colRef = useRef(null);
  const colQuery = useRef(null);

  useEffect(() => {
    if (user && currentDirectMessage) {
      const conversationId1 = `${user.uid}_${selectedUser}`;
      const conversationId2 = `${selectedUser}_${user.uid}`;

      const checkCollectionExists = async () => {
        const querySnapshot1 = await getDocs(collection(db, conversationId1));
        console.log(querySnapshot1);
        if (!querySnapshot1.empty) {
          colRef.current = collection(db, conversationId1);
          colQuery.current = query(
            colRef.current,
            orderBy("createdAt", "desc"),
            limit(20)
          );
          subscribeToMessages();
        } else {
          const querySnapshot2 = await getDocs(collection(db, conversationId2));
          if (!querySnapshot2.empty) {
            colRef.current = collection(db, conversationId2);
            colQuery.current = query(
              colRef,
              orderBy("createdAt", "desc"),
              limit(20)
            );
            subscribeToMessages();
          } else {
            console.log("Both collections do not exist.");
          }
        }
      };

      checkCollectionExists();
    } else {
      colRef.current = collection(db, "messages");
      colQuery.current = query(
        colRef.current,
        orderBy("createdAt", "desc"),
        limit(20)
      );
      subscribeToMessages();
    }
  }, [user, selectedUser, currentDirectMessage, db]);

  const subscribeToMessages = () => {
    const unsub = onSnapshot(colQuery.current, (querySnapshot) => {
      const tempMessages = [];
      querySnapshot.forEach((doc) => {
        tempMessages.unshift({ ...doc.data(), id: doc.id });
      });
      setMessages(tempMessages);
    });

    return () => {
      unsub();
    };
  };

  const chat = messages.map((msg) => {
    return (
      <li
        key={msg.id}
        ref={scrollRef}
        className={`msg-container ${
          user && msg.author === user.displayName ? "active" : ""
        }`}
      >
        <p className="msg-author">
          <img src={msg.photoURL} alt="author" />
          {msg.author}
        </p>
        <p className="msg-msg">{msg.message}</p>
      </li>
    );
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSend = (e) => {
    e.preventDefault();
    console.log(colRef.current);
    addDoc(colRef.current, {
      message: message,
      author: user.displayName,
      photoURL: user.photoURL,
      createdAt: serverTimestamp(),
    }).then(() => {
      setMessage("");
    });
  };

  return (
    <div className="chat-container">
      {!isLoggedIn && "Sign in to use the chat feature!"}
      {isLoggedIn && (
        <div className="chat-log">
          <ul>{chat}</ul>
          <form>
            <input
              type="text"
              className="chat-input"
              id="message"
              name="message"
              value={message}
              onChange={handleMessageChange}
            />
            <button className="send-btn" onClick={handleSend}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Home;
