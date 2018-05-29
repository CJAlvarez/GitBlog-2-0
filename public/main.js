


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

var userTorrent = {};

// AUTENTICACIÓN CON GOOGLE
function signInGoogle() {
    try {
        signOut();
    } catch (error) {}
    
    if (!firebase.auth().currentUser) {
        var provider = new firebase.auth.GoogleAuthProvider();

        provider.addScope('https://www.googleapis.com/auth/contacts.readonly');

        firebase.auth().signInWithPopup(provider).then(function (result) {

            var token = result.credential.accesstoken;

            var user = result.user;
            var name = user.displayName;
            var email = user.email;
            var photoUrl = user.photoURL;
            var uid = user.uid;

            //console.log(user);

            firebase.database().ref('users/' + uid).set({
                uid: uid,
                name: name,
                email: email,
                photoUrl: photoUrl
            });

            userTorrent = user;

            if (user != null) {
                // user.providerData.forEach(function (profile) {
                //     console.log("Sign-in provider: " + profile.providerId);
                //     console.log("  Provider-specific UID: " + profile.uid);
                //     console.log("  Name: " + profile.displayName);
                //     console.log("  Email: " + profile.email);
                //     console.log("  Photo URL: " + profile.photoURL);
                // });
            }

            // BOTÓN
            document.getElementById("login_button").style.display = 'none';
            document.getElementById("logout_button").style.display = "block";
            refrehBoard();
            showReal(true);
        }).catch(function (error) {

            console.log("HEY ERROR");

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
        signOut();
        //currentUser = {};
    }
}

function signOut() {
    firebase.auth().signOut()
        .then(function () {
            console.log("OUT");
            document.getElementById("logout_button").style.display = 'none';
            document.getElementById("login_button").style.display = "block";
            blank_div();
            showReal(false);
        })
        .catch(function (error) {
            console.log("STILL IN");
        });
}

function blank_div() {
    var div = document.getElementById('messages-container')
    while (div.hasChildNodes()) {
        console.log("CLEANING");
        div.removeChild(div.lastChild);
    }
    div = document.getElementById('people-container')
    while (div.hasChildNodes()) {
        console.log("CLEANING");
        div.removeChild(div.lastChild);
    }
}

function showReal(flag) {
    if (flag == true || firebase.auth().currentUser) {
        document.getElementById("logout_button").style.display = "block";
        document.getElementById("notification_button").style.display = "block";
        document.getElementById("refresh_button").style.display = "block";
        document.getElementById("wellcome_Board").style.display = "none";
        document.getElementById("Real-content").style.display = "block";
    } else {
        document.getElementById("logout_button").style.display = "none";
        document.getElementById("notification_button").style.display = "none";
        document.getElementById("refresh_button").style.display = "none";
        document.getElementById("wellcome_Board").style.display = "block";
        document.getElementById("Real-content").style.display = "none";
    }
}


// REFRESH BOARD
function refrehBoard() {
    if (firebase.auth().currentUser) {
        blank_div();
        renderHTML_All();
        refreshPeople();
    }
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
    //window.open("index.html", "_self");
}

function cleanField() {
    document.getElementById('field').textContent = "";
}

function visibility() {
    text = document.getElementById('Show-all').textContent;
    console.log(text);
    if(text == '  Público') {
        document.getElementById('Show-all').textContent = '  Privado';
    } else {
        document.getElementById('Show-all').textContent = '  Público';
    }
}

// LISTENERS
document.getElementById('GB-Hecho').addEventListener('click', addMessage, false);
document.getElementById('login_image').addEventListener('click', signInGoogle, false);
document.getElementById('login_button').addEventListener('click', signInGoogle, false);
document.getElementById('logout_button').addEventListener('click', signOut, false);
document.getElementById('BigTitle').addEventListener('click', goHome, false);
document.getElementById('refresh_button').addEventListener('click', refrehBoard, false);
document.getElementById('GB-Visibilidad').addEventListener('click', visibility, false);

var database = firebase.database();

var messagesContainer = document.getElementById("messages-container");
var text;


function addMessage() {
    if (firebase.auth().currentUser) {
        text = document.getElementById('field').textContent;
        var user = firebase.auth().currentUser;

        // GENERATE A UNIQUE ID BY DATE
        var fecha = new Date();

        var UID = "Y" + fecha.getFullYear() + "M" + (fecha.getMonth() + 1) + "D" + fecha.getDate() + "H" + fecha.getHours() + "Mi" + fecha.getMinutes() + "S" + fecha.getSeconds() + "m" + fecha.getMilliseconds() + "";
        //var UID = 0;
        firebase.database().ref('messages/' + UID).set({
            uid: user.uid,
            text: text
        });

        renderHTML(text);
        cleanField();
    }
}

function renderHTML(message) {
    // USER REFERENCE
    var user = firebase.auth().currentUser;

    var name = user.displayName;
    var photoUrl = user.photoURL;
    var uid = user.uid;

    messagesContainer.insertAdjacentHTML('beforeEnd', '<div class="w3-container w3-card w3-white w3-margin-bottom"><h2 class="w3-text-grey w3-padding-16"><img class="w3-card w3-black" src="'
        + photoUrl + '" border="0" width="55" height="55">   '
        + name + '</h2><p class="w3-opacity w3-container w3-card w3-padding">' + message +
        '</p><div class="w3-container"></div></div>');
}

function refreshPeople() {
    return firebase.database().ref('/users').once('value').then(function (snapshot) {
        // FOR_EACH
        snapshot.forEach(function (data) {
            // REAL_CAPTURE
            document.getElementById("people-container").insertAdjacentHTML('beforeEnd', '<h5 class="w3-button w3-card w3-light-grey w3-padding-16" onclick="selectPerson(\'' + data.val().uid + '\')" id=\'' + data.val().uid + '\'><img class="w3-card w3-black" src="'
                + data.val().photoUrl + '" border="0" width="55" height="55"><b>    ' + data.val().name + '</b></h5>');
            // END REAL_CAPTURE
        });
        // END FOR_EACH
    });
}



function selectPerson(person) {
    firebase.database().ref('/users/'+person).once('value').then(function (snapshot) {
        var temp = document.getElementById('field').textContent;
        document.getElementById('field').textContent = "@" + snapshot.val().name + " " + temp;
    });
}

function renderHTML_All() {
    // DATABASE_REFERENCE
    return firebase.database().ref('/messages').once('value').then(function (snapshot) {

        // FOR_EACH
        snapshot.forEach(function (data) {

            // REAL_CAPTURE
            firebase.database().ref('/messages/' + data.key).once('value').then(function (intern) {

                // USER
                return firebase.database().ref('/users/' + intern.val().uid).once('value').then(function (atom) {
                    messagesContainer.insertAdjacentHTML('beforeEnd', '<div class="w3-container w3-card w3-white w3-margin-bottom"><h2 class="w3-text-grey w3-padding-16"><img class="w3-card w3-black" src="'
                        + atom.val().photoUrl + '" border="0" width="55" height="55">   '
                        + atom.val().name + '</h2><p class="w3-opacity w3-container w3-card w3-padding">' + intern.val().text +
                        '</p><div class="w3-container"></div></div>');
                    // END USER
                });
                // END REAL_CAPTURE
            });
            // END FOR_EACH
        });
        // END DATABASE_REFERENCE
    });
}



/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>       JSON DE USUARIO-DEFAULT
{
  "users": [
    {
      "localId": uid,
      "email": email-address
      "emailVerified": email-verified,
      "passwordHash": base64-encoded-password-hash,
      "salt": base64-encoded-password-salt,
      "displayName": name,
      "photoUrl": photo-url,
      "createdAt": created-at-in-millis,
      "lastSignedInAt": last-signedin-at-in-millis,
      "phoneNumber": phone-number
      "providerUserInfo": [
        {
          "providerId": provider-id,
          "rawId": provider-uid,
          "email":  provider-email,
          "displayName": provider-name,
          "photoUrl": provider-photo-url
        },
        ...
      ]
    },
    ...
  ]
}

>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   JSON USER

{
    "users": [
        "id": {
            
        }
    ]
}


>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   JSON MESSAGE
{
    "messages": [
        "id": {
            "uid": uid,
             "text": text
        },
        ...
    ]
}

 */