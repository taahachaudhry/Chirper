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
    if (Chirper.Profile.isMyProfile) {
        Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'chirps'), null, function (data) {
            for (var i in data) {
                var chirp = data[i];
                chirp.__proto__ = Chirper.Chirp.prototype;
                chirp.key = i;
                Chirper.chirps.push(chirp)
            }
            Chirper.output();
        });
    } else {
        Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'chirps'), null, function (data) {
            for (var i in data) {
                var chirp = data[i];
                chirp.__proto__ = Chirper.Chirp.prototype;
                chirp.key = i;
                Chirper.chirps.push(chirp)
            }
            Chirper.output();
        });
    }

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
    if (Chirper.base === 'htcchirper') {
        for (var i in Chirper.chirps) {
            if (Chirper.chirps[i].editing) {
                h += "<textarea id='editChirp' class='form-control'>" + Chirper.chirps[i].message + "</textarea>";
                h += "<div class='btn btn-success btn-xs' onclick='Chirper.save(" + i + ")'><i class='fa fa-edit'></i></div>";
            } else {
                h += "<tbody><tr>"
                h += '<td><h4> "' + Chirper.chirps[i].message + '"</h4><h6> –' + Chirper.chirps[i].name + '</h6></td>';
                h += "<td><div class='btn btn-warning btn-sm' style='margin-top:20px' onclick='Chirper.edit(" + i + ")'><i class='fa fa-edit'></i></div></td>";
                h += "<td><div class='btn btn-danger btn-sm' style='margin-top:20px' onclick='Chirper.delete(" + i + ")'><span class='glyphicon glyphicon-remove'></div></td>";
            }
        }
    }
    else {
        for (var i in Chirper.chirps) {
            h += "<tbody><tr>"
            h += '<td><h4> "' + Chirper.chirps[i].message + '"</h4><h6> –' + Chirper.chirps[i].name + '</h6></td>';
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
Chirper.Profile.prototype.isMyProfile = true;

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
    if (Chirper.Profile.isMyProfile) {
        Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'profile'), null, function (data) {
            for (var i in data) {
                var profile = data[i];
                profile.__proto__ = Chirper.Profile.prototype;
                profile.key = i;
                Chirper.user.push(profile);
            }
            Chirper.displayProfile();
        });
    } else {
        Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, 'profile'), null, function (data) {
            for (var i in data) {
                var profile = data[i];
                profile.__proto__ = Chirper.Profile.prototype;
                profile.key = i;
                Chirper.user.push(profile);
            }
            Chirper.displayProfile();
        });
    }
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
    } else if (Chirper.base === 'htcchirper') {
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
                h += "<td><div style='margin-bottom:5px' class='btn btn-danger btn-sm center-block' onclick='Chirper.deleteProfile(" + i + ")'><i class='fa fa-minus'></i></div></td>";
                h += "<td><div class='btn btn-primary btn-sm center-block' onclick='Chirper.timeline()'>Timeline</div></td>";
            }
        }
    } else {
        for (var i in Chirper.user) {
            h += "<td><img src='" + Chirper.user[i].image + "' class='img-thumbnail img-responsive center-block' style='height:200px; width:200px;'/><td>"
            h += '<td><h3 style="text-align:center">' + Chirper.user[i].name + '</h3></td><td><h5 style="text-align:center"> ' + Chirper.user[i].bio + '</h5></td>';
        }
    }
    h += "</tbody></tr>"
    document.getElementById('clearLogin').innerHTML = h;
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
    Chirper.ajax("GET", Chirper.urlHelper(friendBase,"profile"), null, function (data) {
        for (var i in data) {
            var friend = new Chirper.Friend(data[i].name, friendBase);    
            friend.__proto__ = Chirper.Friend.prototype;
            friend.key = i;
            Chirper.friends.push(friend);
        }
        Chirper.sendFriend(friend);
    }, function(){ console.log("error");});
}
//Send friend to firebase
Chirper.sendFriend = function (friend) {
    Chirper.ajax("POST", Chirper.urlHelper(Chirper.base, "friends"), friend, function (data) {
        Chirper.friendsTable();
    })
}
//Grab friends from firebase
Chirper.getFriends = function () {
    Chirper.ajax("GET", Chirper.urlHelper(Chirper.base, "friends"), null, function (data) {
        for (var i in data) {
            var friend = data[i];
            friend.__proto__ = Chirper.Friend.prototype;
            friend.key = i;
            Chirper.friends.push(friend);
        }
        Chirper.friendsTable();
    })
}

Chirper.deleteFriend = function (index) {
    Chirper.ajax("DELETE", Chirper.urlHelper(Chirper.base, "friends", Chirper.friends[index].key), null, function () {
        Chirper.friends.splice(index, 1); Chirper.friendsTable();
    });
}
//Table to display friends on profile
Chirper.friendsTable = function () {
    var h = '<thead><tr><th style="text-align:center">Friends</th></tr></thead>';
    h += "<tbody><tr><td><div class='form-inline'><input type='text' id='base' class='form-control' placeholder='Name' />  <button class='btn btn-primary btn-xs' onclick='Chirper.addFriend();'><i class='fa fa-plus'></i></button></div></td></tr></tbody>";
    for (var i in Chirper.friends) {
        h += "<tr><td><a onclick='Chirper.friendsProfile("+i+");'>" + Chirper.friends[i].name + "</a></td>";
        h += "<td><div class='btn btn-danger btn-xs' onclick='Chirper.deleteFriend(" + i + ")'><i class='fa fa-minus'></i></div></td></tr>";
    }
    document.getElementById('userFriends').innerHTML = h;
}

//Displaying friends profile
Chirper.friendsProfile = function (index) {
    Chirper.base = Chirper.friends[index].base;
    Chirper.Profile.prototype.isMyProfile = false;
    Chirper.chirps = [];
    Chirper.read();
    Chirper.output();
    Chirper.user = [];
    Chirper.readProfile();
}
/*************** END USER FRIENDS ****************/

/*************** TIMELINE ****************/
Chirper.timeline = function () {
    //loops through my friends array
    //grab tweets from each friend and put in an array
    //sort array and display
    for (var i in Chirper.friends) {
        //to grab tweets use base to make an ajax call to their messages
        //console.log(Chirper.friends[i].base);
        Chirper.ajax("GET", Chirper.urlHelper(Chirper.friends[i].base, "chirps"), null, function (data) {
            for (var i in data) {
                console.log(data[i].message);
            }
        });
    }
}

/*************** END TIMELINE ****************/

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
Chirper.getFriends();