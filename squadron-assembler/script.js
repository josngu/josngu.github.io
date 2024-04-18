"use strict";
var stopwatch = {
    minute: '00',
    sec: '00',
    msec: '00'
};
//The following variable only ensures that there will be no identical element IDs
var people = 0;
var numberOfPeople = 0;
var squadron = [];
var selection = 0;
var longAlert = 5000;
var shortAlert = 2500;
// Do all of this once the page actually loads
$(function () {
    checkFormChanges();
    var timerDOM = $("#timer");
    function timer() {
        // Need this to avoid type mismatches
        let msecNum = parseInt(stopwatch.msec, 10);
        let secNum = parseInt(stopwatch.sec, 10);
        let minuteNum = parseInt(stopwatch.minute, 10);
        msecNum++;
        if (msecNum == 100) {
            secNum++;
            msecNum = 0;
        }
        if (secNum == 60) {
            minuteNum++;
            secNum = 0;
        }
        stopwatch.msec = msecNum < 10 ? "0" + msecNum : msecNum.toString();
        stopwatch.sec = secNum < 10 ? "0" + secNum : secNum.toString();
        stopwatch.minute = minuteNum < 10 ? "0" + minuteNum : minuteNum.toString();
        let formattedTime = `TIME ${stopwatch.minute}:${stopwatch.sec}:${stopwatch.msec}`;
        timerDOM.text(formattedTime);
    }
    setInterval(timer, 10);
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
        //Prevent the person from being moved past the "Add Person" button
        if ($("#person-" + selection).next().text() != $(".add-person").text()) {
            $("#person-" + selection).next().insertBefore($("#person-" + selection));
        }
    }, 1);
}
function uploadPicture() {
    const reader = new FileReader();
    var file = $("input[type=file]").get(0);
    reader.onload = function () {
        $("#profile-picture-" + selection).attr("src", reader.result);
    };
    reader.readAsDataURL(file.files[0]);
}
function save() {
    try {
        if (numberOfPeople == 0) {
            $(".alert").remove();
            $("main").append('<div class="alert" role="alert">You cannot save a squadron with no people in it.</div>');
            $(".alert").delay(longAlert).queue(function () {
                $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                    $(this).remove();
                }).dequeue();
            });
            return;
        }
        localStorage.setItem("squadron-list", JSON.stringify($("#squadron-container").html()));
        localStorage.setItem("profile", JSON.stringify($("#editor-container").html()));
        localStorage.setItem("people", JSON.stringify(people));
        localStorage.setItem("numberOfPeople", JSON.stringify(numberOfPeople));
        localStorage.setItem("squadron", JSON.stringify(squadron));
        localStorage.setItem("selection", JSON.stringify(selection));
        $(".alert").remove();
        $("main").append('<div class="alert" role="alert">Save successful.</div>');
        $(".alert").delay(shortAlert).queue(function () {
            $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                $(this).remove();
            }).dequeue();
        });
    }
    catch (e) {
        $(".alert").remove();
        $("main").append('<div class="alert" role="alert">Cannot save squadron. Photos must be cumulatively less than 5MB in size.</div>');
        $(".alert").delay(longAlert).queue(function () {
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
