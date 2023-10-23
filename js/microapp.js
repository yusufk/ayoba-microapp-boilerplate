/**
* A boilerplate microapp for ayoba that implements a stub interface and debug logging on the page
*/
var debug = false;
var ready = false;
var context;
var appcontext
// This is the magic line that pushes error event to the magic console
window.onerror = function (msg, url, line, col, error) { console.log(msg, url, line, col, error); };
// Let's wait for the page to load before doing anything
window.onload = function afterpagedLoad() {
    context = getURLParameter("context");
    debug = ("true" === getURLParameter("debug"));
    if (debug) {
        console.log("Debug mode: " + debug);
        document.getElementById("log-container").hidden = false;
        console.log("Hosted at: " + window.location.href);
    }
    console.log("Starting...");
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    console.log("User agent: " + userAgent)
    //check if an Ayoba object exists and if not create a stub
    if (typeof Ayoba === 'undefined') {
        console.log("Looks like we're not inside ayoba, stubbinng the situation...");
        Ayoba = new AyobaStub();
    }
    else {
        console.log("Looks like we're in ayoba...");
    };
    console.log("List of methods available:");
    console.log(Object.getOwnPropertyNames(Ayoba));
    Object.getOwnPropertyNames(Ayoba).forEach((value) => {
        console.log(value);
        // Populate a table with the available methods, an input field and a button to call them
        var table = document.getElementById("methodsTable");
        var row = table.insertRow(-1);
        var cell1 = row.insertCell(0);
        // if value starts with get or finish, assume no input field is required
        if (value.startsWith("get") || value.startsWith("finish") || value.startsWith("trigger") || value.startsWith("is")) {
            cell1.innerHTML = "<button onclick=\"" + value + "()\">" + value + "</button>";
            var cell2 = row.insertCell(1);
            cell2.innerHTML = "-----";
        } else {
            cell1.innerHTML = "<button onclick=\"" + value + "(" + document.getElementById("inputText_" + value + ")".value) + ")\">" + value + "</button>";
            var cell2 = row.insertCell(1);
            cell2.innerHTML = "<input type=\"text\" id=\"inputText_" + value + " value=\"\" />";
        }
        var cell3 = row.insertCell(2);
        cell3.innerHTML = "<span type=\"text\" id=" + value + "Text></span>";
    })
    const copyButton = document.getElementById("btn_copy");
    copyButton.addEventListener('click', () => {
        copyMessage("logger");
    });
    console.log("Now let's wait till the presence is updated...");
};

/**
* This function ensures that the console output is visible to the user on the page for debugging purposes
*/
(function (logger) {
    console.old = console.log;
    console.log = function () {
        var output = "", arg, i;

        for (i = 0; i < arguments.length; i++) {
            arg = arguments[i];
            output += "<span class=\"log-" + (typeof arg) + "\">";

            if (
                typeof arg === "object" &&
                typeof JSON === "object" &&
                typeof JSON.stringify === "function"
            ) {
                output += JSON.stringify(arg);
            } else {
                output += arg;
            }

            output += "</span>&nbsp;";
        }

        logger.innerHTML += output + "<br>";
        console.old.apply(undefined, arguments);
    };
})(document.getElementById("logger"));


/**
* This function is called when the microapp is loaded and ready to be used
*/
function start() {
    //Now that presence is updated and Ayoba is initialised, let's try calling a few functions
    ready = true;
    console.log("Let's try calling available methods..")
    if (Object.getOwnPropertyNames(Ayoba).includes("getSelfJid")) {
        console.log("Calling getSelfJid()...");
        console.log("JID: " + getSelfJid());
    };
    if (Object.getOwnPropertyNames(Ayoba).includes("getMsisdn")) {
        console.log("Calling getMsisdn()...");
        console.log("MSISDN: " + getMsisdn());
    };
    if (Object.getOwnPropertyNames(Ayoba).includes("getCountry")) {
        console.log("Country: " + getCountry());
    };
    if (Object.getOwnPropertyNames(Ayoba).includes("getLanguage")) {
        console.log("Language: " + getLanguage());
    };
}

/**
* This function is called to close the microapp
*/
function finish() {
    console.log(Ayoba.finish());
}

function sendMessage() {
    Ayoba.sendMessage(document.getElementById("inputText").value);
}

function composeMessage() {
    Ayoba.composeMessage(document.getElementById("inputText").value);
}

function copyMessage(theIndex) {
    var strInputCode = document.getElementById(theIndex).innerHTML;
    var cleanText = strInputCode.replace(/<\/?[^>]+(>|$)/g, "\n");
    const el = document.createElement('textarea');
    el.value = cleanText;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}

function sendMedia() {
    Ayoba.sendMedia('https://i.ytimg.com/vi/d5PP4vIX7P8/maxresdefault.jpg', 'image/jpg');
}

function sendLocation() {
    Ayoba.sendLocation(document.getElementById("inputTextLat").value, document.getElementById("inputTextLon").value);
}

function getCountry() {
    var country = Ayoba.getCountry();
    document.getElementById("countryText").textContent = country
    return country
}

function getMsisdn() {
    var msisdn = Ayoba.getMsisdn();
    document.getElementById("getMsisdnText").textContent = msisdn
    return msisdn
}

function getSelfJid() {
    var jid = Ayoba.getSelfJid();
    document.getElementById("selfjidText").textContent = jid
    return jid
}

function getCanSendMessage() {
    var canSendMessage = Ayoba.getCanSendMessage();
    document.getElementById("cansendText").textContent = canSendMessage
    return canSendMessage
}

function getLanguage() {
    var language = Ayoba.getLanguage();
    document.getElementById("languageText").textContent = language
    return language
}

function getURLParameter(sParam) {
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam) {
            return sParameterName[1];
        }
    }
}

function getSelfJidFromUrl() {
    var selfJid = getURLParameter("jid")
    document.getElementById("selfjidText").textContent = selfJid
    return selfJid
}

/*
 * The Ayoba native interface calls this method every time
 * the app receives a new location event.
 * 
 * Remember this listener will only be called when the native
 * permission is accepted by the user. 
 * 
 * In some border cases, also can receive lat=0.0, lon=0.0. Most of
 * cases, will mean Ayoba cannot retrieve the GPS coordinates.
 */
function onLocationChanged(lat, lon) {
    document.getElementById("triggerLocationChangedText").textContent = lat + ", " + lon;
    console.log("Event: location changed, lat: " + lat + ", lon: " + lon);
}

/*
 * The Ayoba native interface calls this method every time
 * the user profile changes (nickname or avatar)
 */
function onProfileChanged(profileText, avatarPath) {
    document.getElementById("triggerProfileChangedText").textContent = profileText
    document.getElementById("avatarImage").src = avatarPath
    console.log("Event: profile changed, nickname: " + profileText + ", avatar path: " + avatarPath);
}

/*
 * The Ayoba native interface calls this method every time
 * the user nickname changes (infact, always online)
 */
function onNicknameChanged(nickname) {
    document.getElementById("triggerNicknameChangedText").textContent = nickname
    console.log("Event: nickname changed: " + nickname);
}

/*
 * The Ayoba native interface calls this method every time
 * the user presence changes (infact, always online)
 */
function onPresenceChanged(presence) {
    document.getElementById("triggerPresenceChangedText").textContent = presence
    console.log("Event: presence changed: " + presence);
}

/*
 * The Ayoba native interface calls this method every time
 * the user avatar changes (infact, always online)
 */
function onAvatarChanged(avatar) {
    document.getElementById("avatarImage").src = avatar
    console.log("Event: avatar changed: " + avatar);
}

/*
 * This method should be implemented to retrieve the "sendMedia(...)" result
 * 
 * @param {int} responseCode: result code
 *  0: the location could not be sent
 *  1: the location has been sent successfully
 * @param encodedUrl: Base64 encoded media file’s url
 */
function onMediaSentResponse(responseCode, encodedUrl) {
    document.getElementById("triggerMediaSentResponseText").value = responseCode + " - " + encodedUrl;
    console.log("Event: media sent, response code: " + responseCode + " URL: " + encodedUrl);
}

/*
 * This method should be implemented to retrieve the "sendLocation(...)" result
 *
 * @param {int} responseCode: result code
 *  0: the location could not be sent
 *  1: the location has been sent successfully
 */
function onLocationSentResponse(responseCode) {
    document.getElementById("triggerLocationSentResponseText").value = responseCode
}

function getContactJid() {
    var contactJid = getURLParameter("contactjid")
    document.getElementById("inputText").value = contactJid
    return contactJid
}

function getContactName() {
    var contactName = getURLParameter("contactname")
    document.getElementById("inputText").value = contactName
    return contactName
}

function getContacts() {
    var contactsJson = Ayoba.getContacts();
    document.getElementById("inputText").value = contactsJson
    return contactsJson;
}

function takePicture() {
    var responseCode = Ayoba.takePicture();
    return responseCode;
}

/*
 * This method should be implemented to retrieve the "sendPicture(...)" result
 *
 * @param {int} responseCode: result code
 *  0: the picture could not be taken
 *  1: the picture has been taken successfully
 */
function onPictureRetrievedResponse(responseCode, picturePath) {
    document.getElementById("inputText").value = responseCode
    document.getElementById("pictureRetrieved").src = picturePath
}

/* Select a contact from the contact list */
function selectContact() {
    // Open the device's contact list and allow the user to select a contact
    // Once a contact is selected, update the selectedContact span with the contact's phone number
    // You can use a plugin like cordova-plugin-contacts to access the device's contacts
    navigator.contacts.pickContact(function (contact) {
        document.getElementById("inputText_startConversation").innerHTML = contact.phoneNumbers[0].value;
    }, function (err) {
        console.log('Error: ' + err);
    });
}


/*
 * Starts a conversation with a user using his JID
 */
function startConversation() {
    var msisdn = document.getElementById("selectedContact").innerHTML;
    jid = sha1(msisdn) + "@dev.ayoba.me";
    Ayoba.startConversation(jid);
}

function getFile() {
    var responseCode = Ayoba.getFile();
    return responseCode;
}

/*
 * This method should be implemented to retrieve the "sendFileRetrievedResponse(...)" result
 *
 * @param {int} responseCode: result code
 *  -1: the file could not be retrieved
 *  1: the file has retrieved successfully
 * @param {String} filePath: user selected files paths array
 */
function onFileRetrievedResponse(responseCode, filePath) {
    document.getElementById("inputText").value = responseCode.concat(" - ").concat(filePath)
    document.getElementById("pictureRetrieved").src = filePath
}