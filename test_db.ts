import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import fs from "fs";
const configPath = './firebase-applet-config.json';
const firebaseConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function test() {
  const q = collection(db, 'licenses');
  const snap = await getDocs(q);
  console.log("Licenses count:", snap.size);
  snap.forEach(d => console.log(d.id, d.data()));
  process.exit(0);
}
test().catch(e => {
  console.error(e);
  process.exit(1);
});
