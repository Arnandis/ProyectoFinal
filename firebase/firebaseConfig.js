// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; 
import { getAuth } from "firebase/auth"; // Importar autenticación

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-CpzsYxgbI6VSGuNHlWXjdPv8G_glvYs",
  authDomain: "my-proyect-e166c.firebaseapp.com",
  projectId: "my-proyect-e166c",
  storageBucket: "my-proyect-e166c.appspot.com", //Corregido
  messagingSenderId: "888506260696",
  appId: "1:888506260696:web:6527f9b1c24d050847cbad",
  measurementId: "G-M33G18LK59"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Firestore
const auth = getAuth(app); // Autenticación

// Exportar para usar en otros archivos
export { db, auth };


/*// firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
// Importar Firestore desde Firebase SDK
import { getFirestore } from "firebase/firestore"; 

// Tu configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-CpzsYxgbI6VSGuNHlWXjdPv8G_glvYs",
  authDomain: "my-proyect-e166c.firebaseapp.com",
  projectId: "my-proyect-e166c",
  storageBucket: "my-proyect-e166c.firebasestorage.app",
  messagingSenderId: "888506260696",
  appId: "1:888506260696:web:6527f9b1c24d050847cbad",
  measurementId: "G-M33G18LK59"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Firestore
const db = getFirestore(app); // Esta es la referencia a Firestore


// Exportar `db` para usarlo en otros archivos
export { db};
*/ 