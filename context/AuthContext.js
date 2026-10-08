"use client";
import Cookies from "js-cookie";
import React, { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/firebase";
import { establishSession, shouldSyncSignedInUser } from "@/lib/accounts";
import { readSessionUser } from "@/lib/roles";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [state, setState] = useState({ user: null });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const existing = readSessionUser(Cookies.get("qasim_lms_auth"));
    if (existing) setState({ user: existing });
    setReady(true);

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const userSnap = await getDoc(doc(db, "Users", firebaseUser.uid));
        let hasStudentDoc = false;
        if (!userSnap.exists()) {
          const studentSnap = await getDoc(doc(db, "Students", firebaseUser.uid));
          hasStudentDoc = studentSnap.exists();
        }
        if (!shouldSyncSignedInUser(firebaseUser, userSnap.exists(), hasStudentDoc)) {
          return;
        }
        await establishSession(firebaseUser, { setState });
      } catch (error) {
        console.error(error);
      }
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ state, setState, ready }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export { AuthProvider, useAuth };
