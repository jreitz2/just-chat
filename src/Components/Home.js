import {
  collection,
  onSnapshot,
  orderBy,
  query,
  limit,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useEffect, useState, useRef } from "react";

const Home = ({ db, isLoggedIn, user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const scrollRef = useRef();
  const colRef = collection(db, "messages");
  const colQuery = query(colRef, orderBy("createdAt", "desc"), limit(20));

  useEffect(() => {
    const unsub = onSnapshot(colQuery, (querySnapshot) => {
      const tempMessages = [];
      querySnapshot.forEach((doc) => {
        tempMessages.unshift({ ...doc.data(), id: doc.id });
      });
      setMessages(tempMessages);
      console.log(tempMessages);
    });
    return () => {
      unsub();
    };
  }, []);

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
          <img src={msg.photoURL} />
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
    addDoc(colRef, {
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
