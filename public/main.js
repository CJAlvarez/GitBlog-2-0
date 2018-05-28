// GENERAL DE FIREBASE
var config = {
    apiKey: "AIzaSyDqnRiIiDoTeyl5myWmRXYlI6xWFGP2IfE",
    authDomain: "gitblog-2-0.firebaseapp.com",
    databaseURL: "https://gitblog-2-0.firebaseio.com",
    projectId: "gitblog-2-0",
    storageBucket: "gitblog-2-0.appspot.com",
    messagingSenderId: "877605198730"
};
firebase.initializeApp(config);

// AUTENTICACIÓN CON GOOGLE
function signInGoogle() {
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        firebase.auth().signInWithPopup(provider).then(function (result) {

            var token = result.credential.accesstoken;

            var user = result.user;

            console.log(user);

            // BOTÓN
            document.getElementById("login_button").style.display = 'none';
            document.getElementById("logout_button").style.display = "block";

        }).catch(function (error) {
            var errorCode = error.code;

            var errorMessage = error.message;

            var errorEmail = error.email;

            var credential = error.credential;

            if (errorCode === 'auth/account-exists-with-different-credential') {
                alert('ERROR_SAMEUSER');
            }

            // BOTÓN
            document.getElementById("logout_button").style.display = 'none';
            document.getElementById("login_button").style.display = "block";
        });
    } else {
        firebase.auth().signOut();
    }
}

function signOut() {
    firebase.auth().signOut();
}

// BOTÓN (SIDEBAR)

function w3_open() {
    document.getElementById("main").style.marginLeft = "60px";
    document.getElementById("mySidebar").style.width = "60px";
    document.getElementById("mySidebar").style.display = "block";
    document.getElementById("openNav").style.display = 'none';
}

function w3_close() {
    document.getElementById("main").style.marginLeft = "0%";
    document.getElementById("mySidebar").style.display = "none";
    document.getElementById("openNav").style.display = "inline-block";
}

// NIVEL (PAGINA)
function goHome() {
    window.open("index.html", "_self");
}

function cleanField() {
    document.getElementById('field').textContent = "";
}

function addMessage() {
    window.open("https://us-central1-gitblog-2-0.cloudfunctions.net/addMessage?text=" + document.getElementById('field').textContent)
    cleanField();
}

// LISTENERS
document.getElementById('login_button').addEventListener('click', signInGoogle, false);
document.getElementById('logout_button').addEventListener('click', signOut, false);
document.getElementById('BigTitle').addEventListener('click', goHome, false);
document.getElementById('home_item').addEventListener('click', goHome, false);
document.getElementById('GB-Hecho').addEventListener('click', addMessage, false);