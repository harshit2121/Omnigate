import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebase";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async () => {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    
    const docRef = doc(db, "users", uid);
    const snap = await getDoc(docRef);

    if (!snap.exists()) return alert("No role assigned!");

    const role = snap.data().role;

    if(role === "pharmacist") navigate("/pharmacist");
    if(role === "nurse") navigate("/nurse");
    if(role === "patient") navigate(`/patient/${uid}`);
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="Email" onChange={e => setEmail(e.target.value)}/>
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)}/>
      <button onClick={loginUser}>Login</button>
    </div>
  );
}
