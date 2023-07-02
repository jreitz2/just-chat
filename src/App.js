import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Header from './Components/Header';
import Home from './Components/Home';
import SignIn from './Components/SignIn';
import CreateAccount from './Components/CreateAccount';


function App() {

  const firebaseConfig = {
    apiKey: "AIzaSyBSf5_GLw4PvLihhymyqic9ygs3OWuRn24",
    authDomain: "just-chat-496c6.firebaseapp.com",
    projectId: "just-chat-496c6",
    storageBucket: "just-chat-496c6.appspot.com",
    messagingSenderId: "645952286564",
    appId: "1:645952286564:web:7d35976b48b96015eb1471"
  };

  const app = initializeApp(firebaseConfig);
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getFirestore();
 
  const [ isLoggedIn, setIsLoggedIn ] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    onAuthStateChanged(auth, (data) => {
      if(data) {
        setIsLoggedIn(true);
        navigate('/');
      } else {
        setIsLoggedIn(false);
      }
    })
  }, [])


  return (
    <div className="App">
      <Header isLoggedIn={isLoggedIn} auth={auth} user={user} />
        <Routes>
          <Route path='/' element={<Home db={db} user={user} isLoggedIn={isLoggedIn} />}></Route>
          <Route path='/signin' element={<SignIn auth={auth} />}></Route>
          <Route path='/createaccount' element={<CreateAccount auth={auth} />}></Route>
        </Routes>
    </div>
  );
}

export default App;
