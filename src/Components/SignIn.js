import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

const SignIn = ( { auth } ) => {

    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log('user logged in', cred.user)
            setEmail("");
            setPassword("");
            setError("");
        })
        .catch((err) => {
            console.log(err.message);
            setError(err.message);
        })
    }

    return ( 
        <div className="account-form-container">
            <form className="account-form" onSubmit={handleSignIn}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} />
                <button>Sign-in</button>
                {error}
            </form>
        </div>
     );
}
 
export default SignIn;