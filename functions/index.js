
const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp();

exports.addMessage = functions.https.onRequest((req, res) => {
    // MESSAGE DATA
    const text = req.query.text;

    // USER DATA CONTEXT
    const uid = res.auth.uid;
    const user = res.auth.token.user || null;
    const picture = res.auth.token.picture || null;
    const email = res.auth.token.email || null;
    const mss_public = res.auth.token.mss_public || null;
    const mss_private = res.auth.token.mss_private || null;
    // Push the new message into the Realtime Database using the Firebase Admin SDK.
    return admin.database().ref('/messages').push({
        text: text
    }).then((snapshot) => {
        // Redirect with 303 SEE OTHER to the URL of the pushed object in the Firebase console.
        return res.redirect(303, snapshot.ref.toString());
    });
});

