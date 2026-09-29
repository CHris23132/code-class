export { initializeApp } from 'firebase/app';
export { getAnalytics, isSupported } from 'firebase/analytics';
export {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  EmailAuthProvider, linkWithCredential, signInAnonymously,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
  signOut
} from 'firebase/auth';
export { initializeFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
