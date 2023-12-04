import { error } from "console";
import learnerInterface from "../Interfaces/learnerInterface";
import { Router, Request, Response } from "express";

import { initializeApp } from "firebase/app";

import {
  getAuth,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";

const learnerRouter: Router = Router();

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABi-ROP9jjrQzZ0zx6SNdcpdlZ1iTDBhA",
  authDomain: "matutor-db-9424d.firebaseapp.com",
  projectId: "matutor-db-9424d",
  storageBucket: "matutor-db-9424d.appspot.com",
  messagingSenderId: "65458218474",
  appId: "1:65458218474:web:8331f19e42afa21689fe93"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const collectionName: string = "userLearner";
const db: any = getFirestore(app);

learnerRouter.route("/").get(async (req: Request, res: Response) => {
  res.status(200).send("matutor back end connection success");
});

///login-----------------------------------------------------------------------------
learnerRouter.route("/login").post(async (req: Request, res: Response) => {
  console.log(req);
  const docRef: any = doc(db, collectionName, req.body.learnerEmail);
  const docSnap = await getDoc(docRef);

  try {
    res.setHeader("Content-Type", "application/JSON");
    if (req.body.learnerEmail === null || req.body.learnerPassword === "") {
      res.status(401).send({ message: "Bad Request" });
    } else {
      if (docSnap.exists()) {
        const auth = getAuth();
        signInWithEmailAndPassword(
          auth,
          req.body.learnerEmail,
          req.body.learnerPassword
        )
          .then(() => {
            const learnerData = docSnap.data() as learnerInterface;

            const learnerObject: learnerInterface = {
              learnerID: learnerData.learnerID,
              learnerAddress: learnerData.learnerAddress,
              learnerAge: learnerData.learnerAge,
              learnerBdate: learnerData.learnerBdate,
              learnerEmail: learnerData.learnerEmail,
              learnerFirstname: learnerData.learnerFirstname,
              learnerGuardianEmail: learnerData.learnerGuardianEmail,
              learnerGuardianName: learnerData.learnerGuardianName,
              learnerLastname: learnerData.learnerLastname,
            };

            res.status(200).send(learnerObject);
          })
          .catch(() => {
            res.setHeader("Content-Type", "application/JSON");
            res.status(400).json({ message: "Learner failed to loginr." });
          });
      }
    }
  } catch (exception) {
    res.status(200).send("matutor back end connection success");
  }
});

///Register-----------------------------------------------------------------------------
learnerRouter.route("/register").post(async (req: Request, res: Response) => {
  const docRef: any = doc(db, collectionName, req.body.learnerEmail);
  const docSnap = await getDoc(docRef);

  try {
    res.setHeader("Content-Type", "application/JSON");
    if (docSnap.exists()) {
      res.status(403).send({ message: "Account already exists" });
    } else {
      const auth = getAuth();
      createUserWithEmailAndPassword(
        auth,
        req.body.learnerEmail,
        req.body.learnerPassword
      )
        .then((userCredential) => {
          const learner = userCredential.user;
          const learnerObject: learnerInterface = {
            learnerID: learner.uid,
            learnerAddress: req.body.learnerAddress,
            learnerAge: req.body.learnerAge,
            learnerBdate: req.body.learnerBdate,
            learnerEmail: req.body.learnerEmail,
            learnerFirstname: req.body.learnerFirstname,
            learnerGuardianEmail: req.body.learnerGuardianEmail,
            learnerGuardianName: req.body.learnerGuardianName,
            learnerLastname: req.body.learnerLastname,
          };

          res.setHeader("Content-Type", "application/JSON");
          setDoc(docRef, learnerObject);
          res.status(200).json({ message: "Learner Registered." });
        })
        .catch((error) => {
          res.setHeader("Content-Type", "application/JSON");
          res.status(400).json({ message: "Learner failed to register." });
        });
    }
  } catch (exception) {
    res.setHeader("Content-Type", "application/JSON");
    res.status(400).json({ message: "Error occured in registration." });
  }

  //console.log(req.body);
  //res.status(200).send("Data is sent.");
});

export default learnerRouter;
