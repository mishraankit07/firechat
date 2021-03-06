import React, { useState, useEffect } from 'react';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,signOut } from "firebase/auth";
import firebase from 'firebase/compat/app';


// creating a global store
export const AuthContext = React.createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState();
    const [loading, setLoading] = useState(true);
    const auth=getAuth();

    function signup(email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function login(email, password) {
        return signInWithEmailAndPassword(auth,email, password);
    }

    function logout() {
        return signOut(auth);
    }

    // this needs a fix
    function getTimeStamp(){
        return Date();
    }

    // use effect of type component did mount
    // attaching a listener to see if auth token state has changed or not
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((user) => {
            setUser(user);
            setLoading(false);
        })

        // when component will unmount is called
        // this way we'll be able to remove the listner
        return () => {
            unsub();
        }
    }, [])

    const store = {
        auth,
        user,
        signup,
        login,
        logout,
        getTimeStamp
    }

    return (
        <AuthContext.Provider value={store}>
            {!loading && children}
        </AuthContext.Provider>
    )
}