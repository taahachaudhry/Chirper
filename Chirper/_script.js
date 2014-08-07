﻿var Chirper = {};
//Firebase base
Chirper.base = "htcchirper";

//Array of chirps and Chirp object
Chirper.chirps = [];
Chirper.Chirp = function (name, message) {
    this.name = name;
    this.message = message;
    this.timestamp = Date.now();
}
//CRUD functions with AJAX call to Firebase
Chirper.create = function () {
    var name = "Taaha Chaudhry";
    var message = document.getElementById('chirp');

    var chirp = new Chirper.Chirp(name, message.value);
    Chirper.ajax("POST", Chirper.urlHelper(Chirper.base, "chirps"), chirp, function () { console.log("success");})
};
Chirper.read = function () { };
Chirper.edit = function () { };
Chirper.save = function () { };
Chirper.delete = function () { };

//Table outputting chirps
Chirper.output = function () { };

//URL Helper for Firebase
Chirper.urlHelper = function (base) {
    var url = "https://" + base + ".firebaseio.com/";
    for (var i = 1; i < arguments.length; i++) {
        url += arguments[i] + '/'
    }
    return url + ".json";
};
//AJAX Call Function
Chirper.ajax = function (method, url, data, success, error) {
    var request = new XMLHttpRequest();
    request.open(method, url);
    request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
            success(JSON.parse(this.response));
        } else {
            console.log("Error on " + method);
            error();
        }
    };
    request.onerror = function () {
        console.log("Communication error");
        error();
    }
    if (data) {
        request.send(JSON.stringify(data));
    } else {
        request.send();
    }
}