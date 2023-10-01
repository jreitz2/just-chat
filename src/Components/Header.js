import {
  signOut,
  signInWithRedirect,
  signInAnonymously,
  updateProfile,
} from "firebase/auth";

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

  const handleGuestSignIn = async () => {
    try {
      signInAnonymously(auth)
        .then((result) => {
          updateProfile(result.user, {
            displayName: "Anonymous",
            photoURL:
              "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg",
          });
          console.log("Signed-in Anonymously", result.user);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
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
        {!isLoggedIn && (
          <button onClick={handleGuestSignIn}>Guest Sign-in</button>
        )}
        {isLoggedIn && (
          <div className="account-signed-in">
            <img
              src={
                user.photoURL !== null
                  ? user.photoURL
                  : "https://lh3.googleusercontent.com/-XdUIqdMkCWA/AAAAAAAAAAI/AAAAAAAAAAA/4252rscbv5M/photo.jpg"
              }
              alt="user"
            />
            {user.displayName !== null ? user.displayName : "Anonymous"}
            <button onClick={handleLogout}>Logout</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
