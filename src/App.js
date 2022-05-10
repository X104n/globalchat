import './App.css';
import React, { useRef, useState } from 'react';

import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import 'firebase/compat/auth';

import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

firebase.initializeApp({
    apiKey: "AIzaSyAMiTCav-QIyMlQ5O2HVCbumOGmeTMQCQU",
    authDomain: "globalchat-88ed1.firebaseapp.com",
    projectId: "globalchat-88ed1",
    storageBucket: "globalchat-88ed1.appspot.com",
    messagingSenderId: "803929828993",
    appId: "1:803929828993:web:8ce2759e07ac42ce08e780",
    measurementId: "G-T52VS8VBM0"
})

const auth = firebase.auth();
const firestore = firebase.firestore();

function App() {

    const [user] = useAuthState(auth);


    return (
        <div className="App">
            <header>
                <h1>Flammer🔥</h1>
                <SignOut />
            </header>

            <section>
                {user ? <ChatRoom /> : <SignIn />}
            </section>
        </div>
    );
}

function SignIn() {
    const signInWithGoogle = () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider)
    }

    return (
        <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
    )
}

function SignOut() {
    return auth.currentUser && (
        <button onClick={() => auth.signOut()}>Sign out</button>
    )
}

function ChatRoom() {

    const dummy = useRef();
    const messagesRef = firestore.collection('messages');
    const query = messagesRef.orderBy('createdAt').limit(250);

    const [messages] = useCollectionData(query, { idField: 'id' });

    const [formValue, setFormValue] = useState('');

    const sendMessage = async (e) => {
        e.preventDefault();
        const { uid, photoURL } = auth.currentUser;

        await messagesRef.add({
            text: formValue,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            uid,
            photoURL
        })

        setFormValue("");
        dummy.current.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <>
            <div>
                {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
                <span ref={dummy}></span>
            </div>

            <form onSubmit={sendMessage}>
                <input value={formValue} onChange={(e) => setFormValue(e.target.value)} />
                <button type="submit">🍕</button>
            </form>

        </>
    )


}

function ChatMessage(props) {
    const { text, uid, photoURL } = props.message;
  
    const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';
  
    return (<>
      <div className={`message ${messageClass}`}>
        <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} />
        <p>{text}</p>
      </div>
    </>)
  }

export default App;
