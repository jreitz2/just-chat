import { signOut, signInWithRedirect } from "firebase/auth";

const Header = ({ isLoggedIn, auth, user, provider }) => {
  const handleSignIn = () => {
    signInWithRedirect(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        console.log("logged out");
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <div className="header">
      <h1>Just Chat!</h1>
      <div className="account-buttons">
        {!isLoggedIn && <button onClick={handleSignIn}>Sign-in</button>}
        {isLoggedIn && (
          <div className="account-signed-in">
            <img src={user.photoURL} alt="user" />
            {user.displayName}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
