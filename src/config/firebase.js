// Config file
import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyA8y_dHua_ALZuR4JsWvoOVzE4IgL8ahBg",
  authDomain: "app-chat-40cff.firebaseapp.com",
  databaseURL: "https://app-chat-40cff.firebaseio.com",
  projectId: "app-chat-40cff",
  storageBucket: "",
  messagingSenderId: "1033354924362"
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
