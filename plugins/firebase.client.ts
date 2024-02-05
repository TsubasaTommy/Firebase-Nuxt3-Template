import { initializeApp,getApp } from 'firebase/app';

import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore,initializeFirestore,FirestoreSettings, connectFirestoreEmulator, persistentLocalCache, type FirestoreLocalCache } from "firebase/firestore";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";

import { defineNuxtPlugin } from '#app';

export default defineNuxtPlugin(() => {

    const firebaseConfig = {
        apiKey: "AIzaSyBdMDux7lnMhM2PUGgh8ut9WbxNJc3RPKs",
        authDomain: "easybuilding-57efe.firebaseapp.com",
        projectId: "easybuilding-57efe",
        storageBucket: "easybuilding-57efe.appspot.com",
        messagingSenderId: "944156422914",
        appId: "1:944156422914:web:6d74a773069c523f0d881b",
        measurementId: "G-FRPM9N0CRS"
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
