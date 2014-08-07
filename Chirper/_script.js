var Chirper = {};
//Firebase base
Chirper.base = "htcchirper";

//Array of chirps and Chirp object
Chirper.chirps = [];
Chirper.Chirp = function (name, message) {
    this.name = name;
    this.message = message;
    this.timestamp = timestamp;
}
//CRUD functions with AJAX call to Firebase
Chirper.create = function () { };
Chirper.read = function () { };
Chirper.edit = function () { };
Chirper.save = function () { };
Chirper.delete = function () { };

//Table outputting chirps
Chirper.output = function () { };

//URL Helper for Firebase
//AJAX Call Function