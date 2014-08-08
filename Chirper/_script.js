var Chirper = {};
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
    Chirper.ajax("POST", Chirper.urlHelper(Chirper.base, "chirps"), chirp, function () { Chirper.read(); message.value = '';})
};
Chirper.read = function () {
    Chirper.chirps = [];
    Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'chirps'), null, function (data) {
        for (var i in data) {
            var chirp = new Chirper.Chirp(data[i].name, data[i].message);
            chirp.key = i;
            Chirper.chirps.push(chirp);
        }
        Chirper.output();
    });
};
Chirper.edit = function () { };
Chirper.save = function () { };
Chirper.delete = function (index) {
    Chirper.ajax("DELETE", Chirper.urlHelper(Chirper.base, "chirps", Chirper.chirps[index].key), null, function () { Chirper.read();})
};

//Table outputting chirps
Chirper.output = function () {
    var h = "";
    for (var i in Chirper.chirps) {
        h += "<tbody><tr>"
        h += '<td><h4> "' + Chirper.chirps[i].message + '"</h4><h6> –' + Chirper.chirps[i].name + '</h6></td>';
        h += "<td><div class='btn btn-warning btn-xs' style='margin-top:20px' onclick='Chirper.edit(" + i + ")'><i class='fa fa-edit'></i></div></td>";
        h += "<td><div class='btn btn-danger btn-xs' style='margin-top:20px' onclick='Chirper.delete(" + i + ")'><span class='glyphicon glyphicon-eject'></div></td>";
    }
    h += "</tbody></tr>"
    document.getElementById('chirpFeed').innerHTML = h;
};

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
Chirper.read();