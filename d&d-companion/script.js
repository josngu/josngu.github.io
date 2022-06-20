"use strict";
//The following variable only ensures that there will be no identical element IDs
var people = 0;
var numberOfPeople = 0;
var characterList = [];
var selection = 0;
var longAlert = 5000;
var shortAlert = 2500;
$(function () {
    checkFormChanges();
});
function checkFormChanges() {
    $(".row").on("focusout", function () {
        for (var property in characterList[0]) {
            characterList[selection][property] = $("#" + property).val();
        }
        //Binds the input data to the playercard/character card data
        $("#name-" + selection).text($("#name").val().toString());
        if ($("#race").val() || $("#class").val() != "") {
            $("#race-class" + selection).text($("#race").val() + " " + $("#class").val());
            $("#race-class" + selection).text($("#race").val() + " " + $("#class").val());
        }
        else {
            $("#race-class" + selection).text("");
        }
    });
}
function addPerson() {
    $("#character-container > .add-person").before('<div id="person-' + people + '" class="person-container" onclick="selectPerson(' + people + ');" onkeypress="selectPerson(' + people + ');" tabindex="0"><img id="profile-picture-' + people + '" src="images/person.webp" alt="" class="person-image"><div><h3 id="name-' + people + '" data-placeholder="Name"></h3><p id="race-class' + people + '" data-placeholder="Race and Class"></p></div></div>');
    $("#instructions > p").text("Add or select a person.");
    characterList[people] = {
        name: "",
        race: "",
        class: "",
        alignment: "",
        background: "",
        age: "",
        height: "",
        weight: "",
        eyes: "",
        skin: "",
        hair: ""
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
    //Allows the character to show that they are being currently selected
    $(".person-container").removeClass("person-container-selected");
    setTimeout(function () {
        $("#person-" + personNum).addClass("person-container-selected");
    }, 1);
    //I forgot what this did but it's required; something about an animation or something
    $("#editor-container").after($("#editor-container").clone(true));
    $("#editor-container:last").remove();
    $("#character-editor").css("display", "block");
    //
    selection = personNum;
    //Loads the object values into the character editor
    for (var property in characterList[0]) {
        $("#" + property).val(characterList[personNum][property]);
    }
    $("#instructions").css("display", "none");
}
function deleteProfile() {
    $("#person-" + selection).remove();
    $("#character-editor").css("display", "none");
    $("#instructions > p").text("Add or select a person.");
    $("#instructions").css("display", "block");
    numberOfPeople--;
}
function deleteSquadron() {
    if ($("#delete-squadron").text() == "Are you sure?") {
        $("#delete-squadron").text("Delete All Characters");
        $(".person-container").remove();
        $(".row p").text("");
        $("#character-editor").css("display", "none");
        $("#instructions > p").text("Add or select a person.");
        $("#instructions").css("display", "block");
        people = 0;
        numberOfPeople = 0;
    }
    else {
        $("#delete-squadron").text("Are you sure?");
        $("#delete-squadron").on("focusout", function () {
            $("#delete-squadron").text("Delete All Characters");
        });
    }
}
function movePersonLeft() {
    //Prevents the .person-container animation from playing again
    $(".person-container, img").css("animation", "none");
    setTimeout(function () {
        $("#person-" + selection).prev().insertAfter($("#person-" + selection));
    }, 1);
}
function movePersonRight() {
    $(".person-container, img").css("animation", "none");
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
            $("main").append('<div class="alert" role="alert">You cannot save a character list with no people in it.</div>');
            $(".alert").delay(longAlert).queue(function () {
                $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                    $(this).remove();
                }).dequeue();
            });
            return;
        }
        localStorage.setItem("character-list", JSON.stringify($("#character-container").html()));
        localStorage.setItem("profile", JSON.stringify($("#editor-container").html()));
        localStorage.setItem("people", JSON.stringify(people));
        localStorage.setItem("numberOfPeople", JSON.stringify(numberOfPeople));
        localStorage.setItem("character", JSON.stringify(characterList));
        localStorage.setItem("selection", JSON.stringify(selection));
        //Save the input values from the form
        for (var property in characterList[0]) {
            localStorage.setItem("saved-" + property, JSON.stringify($("#" + property).val()));
        }
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
        $("main").append('<div class="alert" role="alert">Cannot save character list. Photos must be cumulatively less than 5MB in size.</div>');
        $(".alert").delay(longAlert).queue(function () {
            $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                $(this).remove();
            }).dequeue();
        });
    }
}
function load() {
    if (localStorage.getItem("people") !== null) {
        $("#character-container").html(JSON.parse(localStorage.getItem("character-list")));
        $("#editor-container").html(JSON.parse(localStorage.getItem("profile")));
        people = JSON.parse(localStorage.getItem("people"));
        numberOfPeople = JSON.parse(localStorage.getItem("numberOfPeople"));
        characterList = JSON.parse(localStorage.getItem("character"));
        selection = JSON.parse(localStorage.getItem("selection"));
        $("#character-editor").css("display", "block");
        $("#instructions").css("display", "none");
        for (var property in characterList[0]) {
            $("#" + property).val(JSON.parse(localStorage.getItem("saved-" + property)));
        }
        checkFormChanges();
    }
}
