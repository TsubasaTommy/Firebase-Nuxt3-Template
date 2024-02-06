import { initializeApp,getApp } from 'firebase/app';

import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore,initializeFirestore,FirestoreSettings, connectFirestoreEmulator, persistentLocalCache, type FirestoreLocalCache } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {
    const firebaseConfig = {
        apiKey: ,
        authDomain: ,
        projectId: ,
        storageBucket: ,
        messagingSenderId: ,
        appId: ,
        measurementId: 
      };
   
    initializeApp(firebaseConfig);
    

    
    
    const setting:FirestoreSettings ={
        localCache:persistentLocalCache()
    }
    initializeFirestore(getApp(),setting)

    const isEmulating = window.location.hostname === "localhost";
    if (isEmulating) {
        const auth = getAuth();
        connectAuthEmulator(auth, "http://localhost:9099");

        const storage = getStorage();
        connectStorageEmulator(storage, "localhost", 9199);

        const db = getFirestore();
        connectFirestoreEmulator(db, 'localhost', 8080); 

        const functions = getFunctions();
        connectFunctionsEmulator(functions, "localhost", 5001);
    }
});
