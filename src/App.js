import './App.css';
import React, { useRef, useState } from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
//hooks
import { useAuthState } from 'react-firebase-hooks/auth';
import { useCollectionData } from 'react-firebase-hooks/firestore';

//toast lib
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const toastify = (txt) => {
  toast.success(`${txt}`, {
    position: toast.POSITION.BOTTOM_CENTER,
    autoClose: 800,
    theme: 'dark'
  });
};


firebase.initializeApp({
  apiKey: "AIzaSyACYcPxFdTNYwHQXBkKtCDV8ZO1wrIjRBQ",
  authDomain: "superchat-ee15a.firebaseapp.com",
  projectId: "superchat-ee15a",
  storageBucket: "superchat-ee15a.appspot.com",
  messagingSenderId: "862817840506",
  appId: "1:862817840506:web:11f501011b7d9ccb127ac3"
})

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {
const [user] = useAuthState(auth)
  return (
<div className="App">
      <header>
        <h1>superchat with ⚛️🔥</h1>
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
    auth.signInWithPopup(provider);
    // if (auth.signInWithPopup(provider)) {
      toastify('in')
  
// }
  }

  return (
    <>
      <button className="sign-in" onClick={signInWithGoogle}>Sign in with Google</button>
      {/* <p>Do not violate the community guidelines or you will be banned for life!</p> */}
    </>
  )

}
function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>go home</button>
  )
}


function ChatRoom() {
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const query = messagesRef.orderBy('createdAt').limit(25);

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

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return (<>
    <main>

      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}

      <span ref={dummy}></span>

    </main>

    <form onSubmit={sendMessage}>

      <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="..." autoFocus />

      <button type="submit" disabled={!formValue}> &gt;</button>

    </form>
  </>)
}


function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL || 'https://api.adorable.io/avatars/23/abott@adorable.png'} alt='notyet'/>
      <p>{text}</p>
    </div>
  </>)
}


export default App;
