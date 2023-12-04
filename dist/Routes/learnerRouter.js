"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const app_1 = require("firebase/app");
const auth_1 = require("firebase/auth");
const firestore_1 = require("firebase/firestore");
const learnerRouter = (0, express_1.Router)();
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyAdpzZ3hDnsNvEwc3SPS02VhCpF2oaciXU",
    authDomain: "matutor-db-new.firebaseapp.com",
    projectId: "matutor-db-new",
    storageBucket: "matutor-db-new.appspot.com",
    messagingSenderId: "768973720183",
    appId: "1:768973720183:web:b3e08b1cf6913c786d5472",
};
// Initialize Firebase
const app = (0, app_1.initializeApp)(firebaseConfig);
const collectionName = "userLearner";
const db = (0, firestore_1.getFirestore)(app);
learnerRouter.route("/").get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).send("matutor back end connection success");
}));
///login-----------------------------------------------------------------------------
learnerRouter.route("/login").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = (0, firestore_1.doc)(db, collectionName, req.body.learnerEmail);
    const docSnap = yield (0, firestore_1.getDoc)(docRef);
    try {
        res.setHeader("Content-Type", "application/JSON");
        if (req.body.learnerEmail === null || req.body.learnerPassword === "") {
            res.status(401).send({ message: "Bad Request" });
        }
        else {
            if (docSnap.exists()) {
                const auth = (0, auth_1.getAuth)();
                (0, auth_1.signInWithEmailAndPassword)(auth, req.body.learnerEmail, req.body.learnerPassword)
                    .then(() => {
                    const learnerData = docSnap.data();
                    const learnerObject = {
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
                    res.status(400).json({ message: "Learner failed to register." });
                });
            }
        }
    }
    catch (exception) { }
    res.status(200).send("matutor back end connection success");
}));
///Register-----------------------------------------------------------------------------
learnerRouter.route("/register").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const docRef = (0, firestore_1.doc)(db, collectionName, req.body.learnerEmail);
    const docSnap = yield (0, firestore_1.getDoc)(docRef);
    try {
        res.setHeader("Content-Type", "application/JSON");
        if (docSnap.exists()) {
            res.status(403).send({ message: "Account already exists" });
        }
        else {
            const auth = (0, auth_1.getAuth)();
            (0, auth_1.createUserWithEmailAndPassword)(auth, req.body.learnerEmail, req.body.learnerPassword)
                .then((userCredential) => {
                const learner = userCredential.user;
                const learnerObject = {
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
                (0, firestore_1.setDoc)(docRef, learnerObject);
                res.status(200).json({ message: "Learner Registered." });
            })
                .catch((error) => {
                res.setHeader("Content-Type", "application/JSON");
                res.status(400).json({ message: "Learner failed to register." });
            });
        }
    }
    catch (exception) {
        res.setHeader("Content-Type", "application/JSON");
        res.status(400).json({ message: "Error occured in registration." });
    }
    //console.log(req.body);
    //res.status(200).send("Data is sent.");
}));
exports.default = learnerRouter;
