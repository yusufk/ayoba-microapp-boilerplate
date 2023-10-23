class AyobaStub {
    constructor() {
        this.isStubbed = this.isStubbed;
        this.finish = this.finish;
        this.getMsisdn = this.getMsisdn;
        this.getCanSendMessage = this.getCanSendMessage;
        this.getLanguage = this.getLanguage;
        this.getSelfJid = this.getSelfJid;
        this.getContacts = this.getContacts;
        this.getCountry = this.getCountry;
        this.sendMessage = this.sendMessage;
        this.composeMessage = this.composeMessage;
        this.sendMedia = this.sendMedia;
        this.sendLocation = this.sendLocation;
        this.startConversation = this.startConversation;
        this.triggerLocationChanged = this.triggerLocationChanged;
        this.triggerProfileChanged = this.triggerProfileChanged;
        this.triggerPresenceChanged = this.triggerPresenceChanged;
        this.triggerMediaSentResponse = this.triggerMediaSentResponse;
        this.triggerLocationSentResponse = this.triggerLocationSentResponse;
        this.triggerNicknameChanged = this.triggerNicknameChanged;
        // wait 5 seconds before triggering running all the triggers
        setTimeout(() => {
            this.triggerLocationChanged();
            this.triggerProfileChanged();
            this.triggerPresenceChanged();
            this.triggerMediaSentResponse();
            this.triggerNicknameChanged();
            this.triggerLocationSentResponse();
        }, 5000);
    }

    finish() {
        return "This api call will close the ayoba microApp";
    }

    isStubbed() {
        return true;
    }

    sendMessage() {
        return "message has been send..!"
    }

    composeMessage() {
        return "This Api will open the chat"
    }

    sendMedia() {
        return ("https://i.ytimg.com/vi/d5PP4vIX7P8/maxresdefault.jpg , image/jpg");
    }

    sendLocation() {
        return "Latitude: -26.185357775567436" + " " + "Longitude: 28.019023561909993";
    }

    getCountry() {
        var country = "ZA";
        return country;
    }

    getContacts() {
        var jsonContacts = "{msisdn:\"27833241313\"}";
        return jsonContacts
    }

    getMsisdn() {
        var msisdn = "27833241313";
        return msisdn;
    }

    getCanSendMessage() {
        var canSendMessage = true;
        return canSendMessage;
    }

    getLanguage() {
        var language = "en";
        return language
    }

    getSelfJid() {
        var selfJid = "65c3kdflfc5c7c3hb30lc7615beda57031p2d2df@dev.ayoba.me";
        return selfJid;
    }

    startConversation(msisdn) {
        return "This api will open the chat with the number " + msisdn + "!";
    }

    triggerLocationChanged() {
        onLocationChanged(-26.185357775567436, 28.019023561909993);
    }

    triggerProfileChanged() {
        onProfileChanged("test status", "https://i.ytimg.com/vi/d5PP4vIX7P8/maxresdefault.jpg");
    }

    triggerPresenceChanged() {
        onPresenceChanged("test presence");
    }

    triggerMediaSentResponse() {
        onMediaSentResponse("true","https://i.ytimg.com/vi/d5PP4vIX7P8/maxresdefault.jpg");
    }

    triggerLocationSentResponse() {
        onLocationSentResponse("true");
    }

    triggerNicknameChanged() {
        onNicknameChanged("test nickname");
    }

}