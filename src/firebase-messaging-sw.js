// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyDRsGLBntpNYlIrk75ihZ2byDFTXZQtAhc",
    authDomain: "packagedeliverysystem-39bc0.firebaseapp.com",
    databaseURL: "https://packagedeliverysystem-39bc0.firebaseio.com",
    projectId: "packagedeliverysystem-39bc0",
    storageBucket: "packagedeliverysystem-39bc0.appspot.com",
    messagingSenderId: "704975424235",
    appId: "1:704975424235:web:b6500acca356e7e3538cae",
    measurementId: "G-W8PTVNLMEX"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
