const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");
const parser = require("body-parser");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

admin.initializeApp();
const app = express();

// app.use('/user', getUser);
// app.use('/users/', getAllUsers);
app.use(parser.urlencoded({ extended: false }));
//app.use(bodyParser.json());

exports.user = functions.https.onRequest(app);

function isNumeric(num) {
  return !isNaN(num);
}

app.get("/verify/bvn/:bvn", (req, res) => {
    const bvn = req.params.bvn;
    console.log(bvn);
    if (bvn.length === 11) {
      if (isNumeric(bvn)) {

     admin
          .firestore()
          .collection("bvns")
          .where("bvn", "==", bvn)
          .get()
          .then((snapshot) => {
              if (!snapshot.empty) {

                return res.status(200).send(snapshot.docs[0].data());
              } else {

                return res.status(404).send('Bvn cannot be identified');
              }
          }).catch((error) => {
            res.status(404).send(error);
          });

      } else {
        res.status(406).send("BVN must contain digits only");
      }
    } else {
      res.status(406).send("BVN must be 11 characters long");
    }
});

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});
