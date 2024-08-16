import { db } from './firebase';
import { collection, addDoc } from "firebase/firestore";

async function testFirestore() {
  try {
    const docRef = await addDoc(collection(db, "testCollection"), {
      name: "Test User",
      timestamp: new Date()
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

testFirestore();

