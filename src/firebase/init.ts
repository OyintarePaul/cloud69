import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
const firebaseConfig = {
  apiKey: "AIzaSyDt1Qv-4qwqgXBqgMBFf-Uc2xemHuXLX7Q",
  authDomain: "cloud69-d1d1f.firebaseapp.com",
  projectId: "cloud69-d1d1f",
  storageBucket: "cloud69-d1d1f.appspot.com",
  messagingSenderId: "499886396897",
  appId: "1:499886396897:web:9eacbf93ff32294b266ea0",
  measurementId: "G-0THPWB1VVD",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const analytics = getAnalytics(app);
