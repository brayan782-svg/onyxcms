import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const auth = getAuth(app);

async function run() {
  try {
    try {
      await createUserWithEmailAndPassword(auth, "server@example.com", "server_password_123");
      console.log("User created");
    } catch (e: any) {
      console.log("User might exist:", e.message);
    }
    const user = await signInWithEmailAndPassword(auth, "server@example.com", "server_password_123");
    console.log("Logged in UID:", user.user.uid);
  } catch(e) {
    console.error(e);
  }
  process.exit(0);
}
run();

