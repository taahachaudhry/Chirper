var Chirper = {};
//Firebase base
Chirper.base = "htcchirper";

/*************** CHIRPS ****************/
//Array of chirps and Chirp object
Chirper.chirps = [];
Chirper.Chirp = function (name, message) {
    this.name = name;
    this.message = message;
    this.timestamp = Date.now();
}
Chirper.Chirp.prototype.editing = false;

//CRUD functions with AJAX call to Firebase
Chirper.create = function () {
    var name = Chirper.user[0].name;
    var message = document.getElementById('chirp');

    var chirp = new Chirper.Chirp(name, message.value);
    Chirper.ajax("POST", Chirper.urlHelper(Chirper.base, "chirps"), chirp, function (data) {
        chirp.key = data.name;
        Chirper.chirps.push(chirp);
        message.value = '';
        Chirper.output();
    })
};

Chirper.read = function () {
    Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'chirps'), null, function (data) {
        for (var i in data) {
            var chirp = data[i];
            chirp.__proto__ = Chirper.Chirp.prototype;
            chirp.key = i;
            Chirper.chirps.push(chirp)
        }
        Chirper.output();
    });
};
Chirper.edit = function (index) {
    Chirper.chirps[index].editing = true;
    Chirper.output();
};
Chirper.save = function (index) {
    var name = Chirper.user[0].name;
    var message = document.getElementById('editChirp').value;
    var chirp = new Chirper.Chirp(name, message);
    Chirper.ajax("PATCH", Chirper.urlHelper(Chirper.base, 'chirps', Chirper.chirps[index].key), chirp, function () {
        chirp.key = Chirper.chirps[index].key;
        Chirper.chirps[index] = chirp;
        Chirper.output();
    });
};
Chirper.delete = function (index) {
    Chirper.ajax("DELETE", Chirper.urlHelper(Chirper.base, "chirps", Chirper.chirps[index].key), null, function () { Chirper.chirps.splice(index,1); Chirper.output();})
};

//Table outputting chirps
Chirper.output = function () {
    var h = "";
    for (var i in Chirper.chirps) {
        if (Chirper.chirps[i].editing) {
            h += "<textarea id='editChirp' class='form-control'>"+ Chirper.chirps[i].message +"</textarea>";
            h += "<div class='btn btn-success btn-xs' onclick='Chirper.save(" + i + ")'><i class='fa fa-edit'></i></div>";
        } else {
            h += "<tbody><tr>"
            h += '<td><h4> "' + Chirper.chirps[i].message + '"</h4><h6> –' + Chirper.chirps[i].name + '</h6></td>';
            h += "<td><div class='btn btn-warning btn-sm' style='margin-top:20px' onclick='Chirper.edit(" + i + ")'><i class='fa fa-edit'></i></div></td>";
            h += "<td><div class='btn btn-danger btn-sm' style='margin-top:20px' onclick='Chirper.delete(" + i + ")'><span class='glyphicon glyphicon-eject'></div></td>";
        }
    }
    h += "</tbody></tr>"
    document.getElementById('chirpFeed').innerHTML = h;
};

/*************** END CHIRPS ****************/

/*************** USER PROFILE ****************/
//User array and profile -> there will only be one user in the array 
Chirper.user = [];
Chirper.Profile = function (name, image, bio) {
    this.name = name;
    this.image = image;
    this.bio = bio;
}
Chirper.Profile.prototype.editing = false;

//CRUD functions for user profile
Chirper.createProfile = function () {
    var name = document.getElementById('name');
    var image = document.getElementById('image');
    var bio = document.getElementById('bio');

    var profile = new Chirper.Profile(name.value, image.value, bio.value);
    Chirper.ajax("POST", Chirper.urlHelper(Chirper.base, "profile"), profile, function (data) {
        profile.key = data.name;
        Chirper.user.push(profile);
        Chirper.displayProfile();
    })
};

Chirper.readProfile = function () {
    Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'profile'), null, function (data) {
        for (var i in data) {
            var profile = data[i];
            profile.__proto__ = Chirper.Profile.prototype;
            profile.key = i;
            Chirper.user.push(profile);
        }
        Chirper.displayProfile();
    });
};
Chirper.editProfile = function (index) {
    Chirper.user[index].editing = true;
    Chirper.displayProfile();
};
Chirper.saveProfile = function (index) {
    delete Chirper.user[index].editing;
    var name = document.getElementById('editName').value;
    var image = document.getElementById('editImg').value;
    var bio = document.getElementById('editBio').value;
    var profile = new Chirper.Profile(name, image, bio);
    Chirper.ajax("PUT", Chirper.urlHelper(Chirper.base, "profile", Chirper.user[index].key), profile, function () {
        profile.key = Chirper.user[index].key;
        Chirper.user[index] = profile;
        Chirper.displayProfile();
    })
};
Chirper.deleteProfile = function (index) {
    Chirper.ajax("DELETE", Chirper.urlHelper(Chirper.base, "profile", Chirper.user[index].key), null, function () {
        Chirper.user.splice(index, 1); Chirper.displayProfile(); 
    })
};

//Table displaying profile
Chirper.displayProfile = function () {
    var h = '<table class="table table-striped table-bordered"></table>'    
    if (Chirper.user.length === 0) {
        document.getElementById('clearLogin');
    } else {
        document.getElementById('clearLogin').innerHTML = '';
        h += '<tbody><tr>';
        for (var i in Chirper.user) {
            if (Chirper.user[i].editing) {
                h += "<td><input type='text' id='editName' class='form-control' value='" + Chirper.user[i].name + "'/></td><br>";
                h += "<td><input type='text' id='editImg' class='form-control' value='" + Chirper.user[i].image + "'/></td><br>";
                h += "<td><textarea id='editBio' class='form-control'>"+ Chirper.user[i].bio + "</textarea></td><br>";
                h += "<td><div style='margin-bottom:5px' class='btn btn-success btn-sm center-block' onclick='Chirper.saveProfile(" + i + ")'><i class='fa fa-save'></i></div></td>";
            } else {
                h += "<td><img src='" + Chirper.user[i].image + "' class='img-thumbnail img-responsive center-block' style='height:200px; width:200px;'/><td>"
                h += '<td><h3 style="text-align:center">' + Chirper.user[i].name + '</h3></td><td><h5 style="text-align:center"> ' + Chirper.user[i].bio + '</h5></td>';
                h += "<td><div style='margin-bottom:5px' class='btn btn-warning btn-sm center-block' onclick='Chirper.editProfile(" + i + ")'><i class='fa fa-edit'></i></div></td>";
                h += "<td><div class='btn btn-danger btn-sm center-block' onclick='Chirper.deleteProfile(" + i + ")'><span class='glyphicon glyphicon-eject'></div></td>";
            }
        }
        h += "</tbody></tr>"
        document.getElementById('clearLogin').innerHTML = h;
    }
};
/*************** END USER PROFILE ****************/

/*************** USER FRIENDS ****************/
//Friends array and Friend Object
Chirper.friends = [];
Chirper.Friend = function (name, base) {
    this.name = name;
    this.base = base;
}

//Add friend
Chirper.addFriend = function () {
    var friendBase = document.getElementById('base').value;
    console.log(friendBase)
    Chirper.ajax("GET", Chirper.urlHelper(friendBase,"profile"), null, function (data) {
        for (var i in data) {
            console.log(data[i].name);
            var friend = new Chirper.Friend(data[i].name, friendBase);
            friend.key = i;
            friend.__proto__ = Chirper.Friend.prototype;
            Chirper.friends.push(friend);
        }
        //Chirper.displayFriends();
    }, function(){ console.log("error");});
}

/*************** END USER FRIENDS ****************/

//URL Helper for Firebase
Chirper.urlHelper = function (base) {
    var url = "https://" + base + ".firebaseio.com/";
    for (var i = 1; i < arguments.length; i++) {
        url += arguments[i] + '/'
    }
    if (base === 'htcchirper') {
        return url + ".json?auth="+ChirperKey.fb_key;
    } else {
        return url + ".json";
    }
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
//Read onload
Chirper.read();
Chirper.readProfile();