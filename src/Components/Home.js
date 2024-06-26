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
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import emojiBtn from "../assets/emoji-btn.png";

const Home = ({
  db,
  isLoggedIn,
  user,
  auth,
  selectedUser,
  currentDirectMessage,
  isLoading,
}) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState(false);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

  const scrollRef = useRef();
  const colRef = useRef(null);
  const colQuery = useRef(null);

  useEffect(() => {
    if (user && currentDirectMessage) {
      const conversationId1 = `${user.uid}_${selectedUser}`;
      const conversationId2 = `${selectedUser}_${user.uid}`;

      const checkCollectionExists = async () => {
        const querySnapshot1 = await getDocs(collection(db, conversationId1));
        if (!querySnapshot1.empty) {
          colRef.current = collection(db, conversationId1);
          colQuery.current = query(
            colRef.current,
            orderBy("createdAt", "desc"),
            limit(30)
          );
          subscribeToMessages();
        } else {
          const querySnapshot2 = await getDocs(collection(db, conversationId2));
          if (!querySnapshot2.empty) {
            colRef.current = collection(db, conversationId2);
            colQuery.current = query(
              colRef.current,
              orderBy("createdAt", "desc"),
              limit(30)
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
        limit(30)
      );
      subscribeToMessages();
    }
  }, [user, selectedUser, currentDirectMessage, db, auth]);

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

  const handleClickOutside = () => {
    if (emojiPickerVisible) {
      setEmojiPickerVisible(!emojiPickerVisible);
    }
  };

  const handleSend = async () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > 0) {
      try {
        await addDoc(colRef.current, {
          message: trimmedMessage,
          author: user.displayName,
          photoURL: user.photoURL,
          createdAt: serverTimestamp(),
        }).then(() => {
          setMessage("");
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  const parseDiceRoll = (message) => {
    const regex = /^\/r\s+(\d+)d(\d+)$/;
    const match = message.match(regex);
    if (match) {
      const N = parseInt(match[1]);
      const M = parseInt(match[2]);
      return { N, M };
    }
    return null;
  };

  const rollDice = (N, M) => {
    let total = 0;
    for (let i = 0; i < N; i++) {
      total += Math.floor(Math.random() * M) + 1;
    }
    return total;
  };

  const handleDiceRoll = () => {
    const isDiceRoll = parseDiceRoll(message);
    if (isDiceRoll) {
      const { N, M } = isDiceRoll;
      const result = rollDice(N, M);
      setMessage(`Rolled ${N}d${M}: ${result}`);
    }
  };

  const handleDiceAndSend = (e) => {
    e.preventDefault();
    handleDiceRoll();
    setSendMessage(true);
  };

  useEffect(() => {
    if (sendMessage) {
      handleSend();
      setSendMessage(false);
    }
  }, [sendMessage]);

  return (
    <div className="chat-container">
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {!isLoggedIn && (
            <span className="sign-in-prompt">
              Sign in to use group chat or direct message other users!
            </span>
          )}
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
                <button
                  type="button"
                  onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                >
                  <img src={emojiBtn} alt="emoji" />
                </button>
                <div className={emojiPickerVisible ? "showEmoji" : "hideEmoji"}>
                  <Picker
                    data={data}
                    onClickOutside={handleClickOutside}
                    onEmojiSelect={(e) => {
                      setMessage(message + e.native);
                      setEmojiPickerVisible(!emojiPickerVisible);
                    }}
                  ></Picker>
                </div>
                <button className="send-btn" onClick={handleDiceAndSend}>
                  Send
                </button>
              </form>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
