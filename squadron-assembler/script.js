"use strict";
var minute = 0;
var sec = 0;
var msec = 0;
//The following variable only ensures that there will be no identical element IDs
var people = 0;
var numberOfPeople = 0;
var squadron = [];
var selection = 0;
$(function () {
    checkFormChanges();
});
function checkFormChanges() {
    $("#name").on("focusout", function () {
        squadron[selection].name = $("#name").text();
    });
    $("#unit-callsign").on("focusout", function () {
        squadron[selection].unitCallsign = $("#unit-callsign").text();
        $("#unit-callsign-" + selection).text($("#unit-callsign").text());
    });
    $("#squadron-callsign").on("focusout", function () {
        squadron[selection].squadronCallsign = $("#squadron-callsign").text();
    });
    $("#affiliation").on("focusout", function () {
        squadron[selection].affiliation = $("#affiliation").text();
        $("#affiliation-" + selection).text($("#affiliation").text());
    });
    $("#aircraft").on("focusout", function () {
        squadron[selection].aircraft = $("#aircraft").text();
    });
    $("#nationality").on("focusout", function () {
        squadron[selection].nationality = $("#nationality").text();
    });
    $("#age").on("focusout", function () {
        squadron[selection].age = $("#age").text();
    });
    $("#blood-type").on("focusout", function () {
        squadron[selection].bloodType = $("#blood-type").text();
    });
}
function addPerson() {
    $("#squadron-container > .add-person").before('<div id="person-' + people + '" class="person-container" onclick="selectPerson(' + people + ');" onkeypress="selectPerson(' + people + ');" tabindex="0"><img id="profile-picture-' + people + '" src="images/person.webp" alt="" class="person-image"><h3 id="unit-callsign-' + people + '" data-placeholder="UNIT CALLSIGN"></h3><p id="affiliation-' + people + '" data-placeholder="AFFILIATION"></p></div>');
    $("#instructions > p").text("Add or select a person.");
    squadron[people] = {
        name: "",
        unitCallsign: "",
        squadronCallsign: "",
        affiliation: "",
        aircraft: "",
        nationality: "",
        age: "",
        bloodType: ""
    };
    //Have the first person be automatically selected
    if (numberOfPeople == 0) {
        selectPerson(people);
        $("#instructions").css("display", "none");
    }
    people++;
    numberOfPeople++;
}
function selectPerson(personNum) {
    //Allows the person to show that they are being currently selected
    $(".person-container").removeClass("person-container-selected");
    setTimeout(function () {
        $("#person-" + personNum).addClass("person-container-selected");
    }, 1);
    //Animation purposes; this technique is better tham the code above but I can't be bothered to redo it
    $("#editor-container").after($("#editor-container").clone(true));
    $("#editor-container:last").remove();
    $("#profile-editor").css("display", "block");
    //
    selection = personNum;
    $("#name").text(squadron[personNum].name);
    $("#unit-callsign").text(squadron[personNum].unitCallsign);
    $("#squadron-callsign").text(squadron[personNum].squadronCallsign);
    $("#affiliation").text(squadron[personNum].affiliation);
    $("#aircraft").text(squadron[personNum].aircraft);
    $("#nationality").text(squadron[personNum].nationality);
    $("#age").text(squadron[personNum].age);
    $("#blood-type").text(squadron[personNum].bloodType);
    $("#instructions").css("display", "none");
}
function deleteProfile() {
    $("#person-" + selection).remove();
    $(".row p").text("");
    $("#profile-editor").css("display", "none");
    $("#instructions > p").text("Add or select a person.");
    $("#instructions").css("display", "block");
    numberOfPeople--;
}
function deleteSquadron() {
    if ($("#delete-squadron").text() == "ARE YOU SURE?") {
        $("#delete-squadron").text("DELETE SQUADRON");
        $(".person-container").remove();
        $(".row p").text("");
        $("#profile-editor").css("display", "none");
        $("#instructions > p").text("Add or select a person.");
        $("#instructions").css("display", "block");
        people = 0;
        numberOfPeople = 0;
    }
    else {
        $("#delete-squadron").text("ARE YOU SURE?");
        $("#delete-squadron").on("focusout", function () {
            $("#delete-squadron").text("DELETE SQUADRON");
        });
    }
}
function movePersonLeft() {
    //Prevents the .person-container animation from playing again
    $(".person-container h3, p, img").css("animation", "none");
    setTimeout(function () {
        $("#person-" + selection).prev().insertAfter($("#person-" + selection));
    }, 1);
}
function movePersonRight() {
    $(".person-container h3, p, img").css("animation", "none");
    setTimeout(function () {
        if ($("#person-" + selection).next().text() != $(".add-person").text()) {
            $("#person-" + selection).next().insertBefore($("#person-" + selection));
        }
    }, 1);
}
function uploadPicture() {
    const reader = new FileReader();
    var file = $("input[type=file]").get(0).files[0];
    reader.onload = function () {
        $("#profile-picture-" + selection).attr("src", reader.result);
    };
    reader.readAsDataURL(file);
}
function save() {
    try {
        localStorage.setItem("squadron-list", JSON.stringify($("#squadron-container").html()));
        localStorage.setItem("profile", JSON.stringify($("#editor-container").html()));
        localStorage.setItem("people", JSON.stringify(people));
        localStorage.setItem("numberOfPeople", JSON.stringify(numberOfPeople));
        localStorage.setItem("squadron", JSON.stringify(squadron));
        localStorage.setItem("selection", JSON.stringify(selection));
        $(".alert").remove();
        $("main").append('<div class="alert" role="alert">Save successful.</div>');
        $(".alert").delay(2500).queue(function () {
            $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                $(this).remove();
            }).dequeue();
        });
    }
    catch (e) {
        $(".alert").remove();
        $("main").append('<div class="alert" role="alert">Cannot save squadron. Photos must be cumulatively less than 5MB in size.</div>');
        $(".alert").delay(5000).queue(function () {
            $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                $(this).remove();
            }).dequeue();
        });
    }
}
function load() {
    if (localStorage.getItem("people") !== null) {
        $("#squadron-container").html(JSON.parse(localStorage.getItem("squadron-list")));
        $("#editor-container").html(JSON.parse(localStorage.getItem("profile")));
        people = JSON.parse(localStorage.getItem("people"));
        numberOfPeople = JSON.parse(localStorage.getItem("numberOfPeople"));
        squadron = JSON.parse(localStorage.getItem("squadron"));
        selection = JSON.parse(localStorage.getItem("selection"));
        $("#profile-editor").css("display", "block");
        $("#instructions").css("display", "none");
        checkFormChanges();
    }
}
function timer() {
    msec = parseInt(msec);
    sec = parseInt(sec);
    minute = parseInt(minute);
    msec++;
    if (msec == 100) {
        sec++;
        msec = 0;
    }
    if (sec == 60) {
        minute++;
        sec = 0;
    }
    if (msec < 10 || msec == 0) {
        msec = "0" + msec;
    }
    if (sec < 10 || sec == 0) {
        sec = "0" + sec;
    }
    if (minute < 10 || minute == 0) {
        minute = "0" + minute;
    }
    $("#timer").text("TIME " + minute + ":" + sec + ":" + msec);
    setTimeout("timer()", 10);
}
timer();
