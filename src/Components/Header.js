import { Link } from "react-router-dom";
import { signOut } from "firebase/auth";


const Header = ( {isLoggedIn, auth, user } ) => {

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                console.log('logged out');
            })
            .catch((err) => {
                console.log(err.message)
            })
    }

    return ( 
        <div className="header">
            <Link to='/' className="logo">Just Chat!</Link>
            <div className="account-buttons">
                {!isLoggedIn && <Link to='/signin'><button>Sign-in</button></Link>}
                {!isLoggedIn && <Link to='/createaccount'><button>Create account</button></Link>}
                {isLoggedIn && 
                    <div>
                        {user.email} <button onClick={handleLogout}>Logout</button>
                    </div>}
            </div>
            
        </div>
     );
}
 
export default Header;