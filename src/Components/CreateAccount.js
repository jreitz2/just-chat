import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useState } from 'react';

const CreateAccount = ( { auth } ) => {
    
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ error, setError ] = useState("");

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };
    
    const createAccount = (e) => {
        e.preventDefault();
        createUserWithEmailAndPassword(auth, email, password)
            .then((cred) => {
                console.log('user created:', cred.user);
                setError("");
            })
            .catch((err) => {
                console.log(err.message)
                setError(err.message);
            })
        setEmail("");
        setPassword("");
    } 

    return ( 
        <div className="account-form-container">
            <form className="account-form" onSubmit={createAccount}>
                <label htmlFor="email">Email:</label>
                <input type="email" id="email" name="email" value={email} onChange={handleEmailChange} />
                <label htmlFor="password">Password:</label>
                <input type="password" id="password" name="password" value={password} onChange={handlePasswordChange} />
                <button type="submit">Create account</button>
                {error}
            </form>
            
        </div>
     );
}
 
export default CreateAccount;