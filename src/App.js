import { initializeApp } from "firebase/app";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  getRedirectResult,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import Header from "./Components/Header";
import Home from "./Components/Home";
import UserList from "./Components/UserList";

function App() {
  const firebaseConfig = {
    apiKey: "AIzaSyBSf5_GLw4PvLihhymyqic9ygs3OWuRn24",
    authDomain: "just-chat-496c6.firebaseapp.com",
    projectId: "just-chat-496c6",
    storageBucket: "just-chat-496c6.appspot.com",
    messagingSenderId: "645952286564",
    appId: "1:645952286564:web:7d35976b48b96015eb1471",
  };

  const app = initializeApp(firebaseConfig);
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore(app);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [currentDirectMessage, setCurrentDirectMessage] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if (data) {
        setIsLoggedIn(true);
        console.log("User signed in:", user);
      } else {
        setIsLoggedIn(false);
      }
    });
  }, [auth, user]);

  useEffect(() => {
    if (user !== null) {
      const createUser = async (result) => {
        if (result !== null) {
          const userRef = doc(db, "users", result.user.uid);
          if (!userRef.exists) {
            await setDoc(doc(db, "users", result.user.uid), {
              uid: result.user.uid,
              name: result.user.displayName,
              photoURL: result.user.photoURL,
            });
          }
        }
      };
      getRedirectResult(auth).then((result) => createUser(result));
    }
  }, [user]);

  return (
    <div className="App">
      <Header
        isLoggedIn={isLoggedIn}
        auth={auth}
        user={user}
        provider={provider}
      />
      <main>
        <UserList
          db={db}
          user={user}
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
          setCurrentDirectMessage={setCurrentDirectMessage}
        />
        <Home
          db={db}
          user={user}
          isLoggedIn={isLoggedIn}
          selectedUser={selectedUser}
          currentDirectMessage={currentDirectMessage}
        />
      </main>
    </div>
  );
}

export default App;
