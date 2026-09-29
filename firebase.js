import {
  initializeApp, getAnalytics, isSupported,
  getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signInAnonymously, EmailAuthProvider, linkWithCredential, sendPasswordResetEmail, updateProfile, signOut,
  initializeFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp
} from './vendor/firebase.js';

const firebaseConfig = {
  apiKey: 'AIzaSyC7v3tspF41UINBAswDM3r0c364yrJz88U',
  authDomain: 'innovationlab-2a7bf.firebaseapp.com',
  projectId: 'innovationlab-2a7bf',
  storageBucket: 'innovationlab-2a7bf.firebasestorage.app',
  messagingSenderId: '344321204065',
  appId: '1:344321204065:web:ebc46c2d999ac091546f20',
  measurementId: 'G-VJQ0FYLT55'
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = initializeFirestore(app, { ignoreUndefinedProperties: true });
isSupported().then(ok => { if (ok) getAnalytics(app); }).catch(() => {});

export const STUDENTS = 'students';
export const ROLES = ['Student', 'Founder', 'Educator', 'Developer', 'Designer', 'Other'];

const studentRef = uid => doc(db, STUDENTS, uid);

export const watchAuth = callback => onAuthStateChanged(auth, callback);

export async function signUp({ name, email, password }) {
  const credential = EmailAuthProvider.credential(email, password);
  const { user } = auth.currentUser?.isAnonymous
    ? await linkWithCredential(auth.currentUser, credential)
    : await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(user, { displayName: name });
  return user;
}

export const startGuestSession = () => auth.currentUser?.isAnonymous ? Promise.resolve(auth.currentUser) : signInAnonymously(auth).then(c => c.user);

export const signIn = (email, password) => signInWithEmailAndPassword(auth, email, password).then(c => c.user);
export const signOutStudent = () => signOut(auth);
export const resetPassword = email => sendPasswordResetEmail(auth, email);

export async function loadStudent(uid) {
  const snap = await getDoc(studentRef(uid));
  return snap.exists() ? snap.data() : null;
}

export async function createStudent(user, { name, role }, data) {
  const ref = studentRef(user.uid);
  const existing = await getDoc(ref);
  return setDoc(ref, {
    ...data,
    uid: user.uid,
    email: user.email,
    name,
    role,
    isAnonymous: false,
    app: 'codeclass',
    createdAt: existing.exists() ? existing.data().createdAt : serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastActiveAt: serverTimestamp()
  }, { merge: true });
}

export function createGuest(user, data) {
  return setDoc(studentRef(user.uid), { ...data, uid: user.uid, name: '', isAnonymous: true, app: 'codeclass', createdAt: serverTimestamp(), updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() }, { merge: true });
}

export function saveGuest(uid, data) {
  return setDoc(studentRef(uid), { ...data, uid, isAnonymous: true, app: 'codeclass', updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() }, { merge: true });
}

export function saveStudent(uid, data) {
  return updateDoc(studentRef(uid), { ...data, updatedAt: serverTimestamp(), lastActiveAt: serverTimestamp() });
}
