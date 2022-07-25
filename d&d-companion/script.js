"use strict";
//The following variable only ensures that there will be no identical element IDs
var people = 0;
var numberOfPeople = 0;
var characterList = [];
var statList = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
const EXP_ADVANCEMENTS = [0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000, 120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000, 355000];
var selection = 0;
var longAlert = 5000;
var shortAlert = 2500;
var durationMedium = 500;
$(function () {
    checkFormChanges();
});
function checkFormChanges() {
    $(".row").on("focusout", function () {
        updateForm();
    });
    $("textarea").on("focusout", function () {
        updateForm();
    });
    $("input").on("focusout", function () {
        updateForm();
    });
}
function updateForm() {
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
    //Updates the character stats on focusout
    for (let i = 0; i < statList.length; i++) {
        let x = $("#" + statList[i]).val();
        let y = +x;
        $("#" + statList[i]).val(y);
        //Add a plus sign prefix if the number is positive
        if (Math.floor((y - 10) / 2) > 0) {
            $("#" + statList[i] + "-modifier").text("+" + Math.floor((y - 10) / 2));
        }
        else {
            $("#" + statList[i] + "-modifier").text(Math.floor((y - 10) / 2));
        }
    }
    //Updates the health bars
    let hpMaximum = characterList[selection].hpMaximum;
    if (hpMaximum < 1) {
        hpMaximum = 1;
        $("#hpMaximum").val(1);
    }
    if (parseInt(characterList[selection].hpCurrent) > parseInt(hpMaximum)) {
        characterList[selection].hpCurrent = hpMaximum;
        $("#hpCurrent").val(hpMaximum);
    }
    let hpWidth = characterList[selection].hpCurrent / hpMaximum * 100;
    $(".hp-bar-large").css("width", hpWidth + "%");
    //Updates the EXP bars
    let expCurrent = characterList[selection].expCurrent;
    if (expCurrent < 0) {
        expCurrent = 0;
        $("#expCurrent").val(0);
    }
    //Levels up the character once the EXP threshold is hit
    let characterLevel = characterList[selection].characterLevel;
    while (expCurrent >= EXP_ADVANCEMENTS[characterLevel]) {
        characterLevel++;
        if (characterLevel > 20) {
            characterLevel = 20;
        }
        $("#characterLevel").val(characterLevel);
        if (expCurrent >= 355000 && characterLevel == 20) {
            break;
        }
    }
    //Prevents the user from setting a character level higher than 20
    if (characterLevel > 20) {
        characterLevel = 20;
        $("#characterLevel").val(20);
    }
    //Automatically raise the maximum EXP value once the threshold is hit
    characterList[selection].expMaximum = EXP_ADVANCEMENTS[characterLevel];
    $("#expMaximum").val(EXP_ADVANCEMENTS[characterLevel]);
    let expWidth = expCurrent / characterList[selection].expMaximum * 100;
    if (expWidth > 100) {
        expWidth = 100;
    }
    $(".exp-bar-large").css("width", expWidth + "%");
    //Sets the proficiency bonus once the level threshold is hit
    if (characterLevel <= 4) {
        $("#proficiencyBonus").text("Proficiency Bonus: +2");
    }
    if (characterLevel > 4 && characterLevel < 9) {
        $("#proficiencyBonus").text("Proficiency Bonus: +3");
    }
    if (characterLevel >= 9 && characterLevel < 13) {
        $("#proficiencyBonus").text("Proficiency Bonus: +4");
    }
    if (characterLevel >= 13 && characterLevel < 17) {
        $("#proficiencyBonus").text("Proficiency Bonus: +5");
    }
    if (characterLevel >= 17) {
        $("#proficiencyBonus").text("Proficiency Bonus: +6");
    }
}
function selectInfo() {
    $("a").removeClass("tab-selected");
    $("#character-info").addClass("tab-selected");
    $("#character-stats").hide();
    $("#character-skills").hide();
    $("#character-editor").show();
    $("#character-freetext").removeClass("animate-freetext-enter");
    $("#character-freetext").removeClass("animate-freetext-leave");
    $("#character-freetext").show();
}
function selectStats() {
    $("a").removeClass("tab-selected");
    $("#stats-and-skills").addClass("tab-selected");
    $("#character-editor").hide();
    $("#character-freetext").hide();
    $("#character-stats").show();
    $("#character-skills").removeClass("animate-freetext-enter");
    $("#character-skills").removeClass("animate-freetext-leave");
    $("#character-skills").show();
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
        hair: "",
        personality: "",
        ideals: "",
        bonds: "",
        flaws: "",
        features: "",
        proficiencies: "",
        allies: "",
        backstory: "",
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0,
        armorClass: 0,
        initiative: 0,
        speed: "0ft",
        characterLevel: 1,
        hpCurrent: 1,
        hpMaximum: 1,
        hpTemporary: 0,
        expCurrent: 0,
        expMaximum: EXP_ADVANCEMENTS[1]
    };
    //Have the first person be automatically selected
    if (numberOfPeople == 0) {
        selectPerson(people);
    }
    people++;
    numberOfPeople++;
}
function selectPerson(personNum) {
    $("#instructions").css("display", "none");
    //Allows the character to show that they are being currently selected
    $(".person-container").removeClass("person-container-selected");
    setTimeout(function () {
        $("#person-" + personNum).addClass("person-container-selected");
    }, 1);
    //The following 8 lines play an animation whenever a person is selected
    $("#editor-container").after($("#editor-container").clone(true));
    $("#editor-container:last").remove();
    $("#traits-container").after($("#traits-container").clone(true));
    $("#traits-container:last").remove();
    $("#traits-container-2").after($("#traits-container-2").clone(true));
    $("#traits-container-2:last").remove();
    $("#stats-container").after($("#stats-container").clone(true));
    $("#stats-container:last").remove();
    $("nav").show();
    //Animation
    $("nav").removeClass("nav-leave");
    $("nav").addClass("nav-enter");
    //The next 2 "if" statements are for animation purposes
    if ($("#character-info").hasClass("tab-selected") && $("#character-editor").is(":hidden")) {
        $("#character-freetext").removeClass("animate-freetext-leave");
        $("#character-freetext").addClass("animate-freetext-enter");
        $("#character-editor").show();
        $("#character-freetext").show();
    }
    if ($("#stats-and-skills").hasClass("tab-selected") && $("#character-stats").is(":hidden")) {
        $("#character-skills").removeClass("animate-freetext-leave");
        $("#character-skills").addClass("animate-freetext-enter");
        $("#character-stats").show();
        $("#character-skills").show();
    }
    selection = personNum;
    //Loads the object values into the character editor
    for (var property in characterList[0]) {
        $("#" + property).val(characterList[personNum][property]);
    }
    updateForm();
}
function deleteCharacter() {
    if ($(".delete-person p").text() == "Delete the currently selected character?") {
        $(".delete-person p").text("Delete Character");
        $("#person-" + selection).remove();
        $("#character-editor").css("display", "none");
        $("#character-stats").css("display", "none");
        $("#character-freetext").removeClass("animate-freetext-enter");
        $("#character-freetext").addClass("animate-freetext-leave");
        $("#character-skills").removeClass("animate-freetext-enter");
        $("#character-skills").addClass("animate-freetext-leave");
        $("#instructions > p").text("Add or select a person.");
        $("#instructions").css("display", "block");
        $("nav").removeClass("nav-enter");
        $("nav").addClass("nav-leave");
        numberOfPeople--;
    }
    else {
        $(".delete-person p").text("Delete the currently selected character?");
        $(".delete-person").on("focusout", function () {
            $(".delete-person p").text("Delete Character");
        });
    }
}
function nextPage() {
    $("#traits-container").hide();
    $("#traits-container-2").css("display", "flex");
}
function previousPage() {
    $("#traits-container-2").hide();
    $("#traits-container").css("display", "flex");
}
function increaseStat(statType) {
    let x = $("#" + statType).val();
    let y = +x;
    if (y != 99) {
        y++;
    }
    $("#" + statType).val(y);
    if (Math.floor((y - 10) / 2) > 0) {
        $("#" + statType + "-modifier").text("+" + Math.floor((y - 10) / 2));
    }
    else {
        $("#" + statType + "-modifier").text(Math.floor((y - 10) / 2));
    }
}
function decreaseStat(statType) {
    let x = $("#" + statType).val();
    let y = +x;
    if (y != 0) {
        y--;
    }
    $("#" + statType).val(y);
    if (Math.floor((y - 10) / 2) > 0) {
        $("#" + statType + "-modifier").text("+" + Math.floor((y - 10) / 2));
    }
    else {
        $("#" + statType + "-modifier").text(Math.floor((y - 10) / 2));
    }
}
function deleteCharacterList() {
    if ($("#delete-character-list").text() == "Are you sure?") {
        $("#delete-character-list").text("Delete All Characters");
        $(".person-container").remove();
        $("#character-editor").css("display", "none");
        $("#character-freetext").removeClass("animate-freetext-enter");
        $("#character-freetext").addClass("animate-freetext-leave");
        $("#instructions > p").text("Add or select a person.");
        $("#instructions").css("display", "block");
        $("nav").removeClass("nav-enter");
        $("nav").addClass("nav-leave");
        people = 0;
        numberOfPeople = 0;
    }
    else {
        $("#delete-character-list").text("Are you sure?");
        $("#delete-character-list").on("focusout", function () {
            $("#delete-character-list").text("Delete All Characters");
        });
    }
}
function movePersonUp() {
    //Prevents the .person-container animation from playing again
    $(".person-container, img").css("animation", "none");
    setTimeout(function () {
        $("#person-" + selection).prev().insertAfter($("#person-" + selection));
    }, 1);
}
function movePersonDown() {
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
function toggleFooter() {
    //There has to be a better way of switching between these two states
    if ($("#toggle-footer").text() == "Show Tools") {
        $("#toggle-footer").text("Hide Tools");
    }
    else {
        $("#toggle-footer").text("Show Tools");
    }
}
function save() {
    try {
        if (numberOfPeople == 0) {
            $(".alert").remove();
            $("main").append('<div class="alert" role="alert">You cannot save a character list with no one in it.</div>');
            $(".alert").delay(longAlert).queue(function () {
                $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function () {
                    $(this).remove();
                }).dequeue();
            });
            return;
        }
        localStorage.setItem("nav", JSON.stringify($("nav").html()));
        localStorage.setItem("character-list", JSON.stringify($("#character-container").html()));
        localStorage.setItem("profile", JSON.stringify($("#editor-container").html()));
        localStorage.setItem("stats", JSON.stringify($("#stats-container").html()));
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
    if ($("#character-freetext").css("display") == "none" && $("#character-skills").css("display") == "none") {
        $("#character-freetext").addClass("animate-freetext-enter");
        $("#character-skills").addClass("animate-freetext-enter");
    }
    //Hide everything first so that not every column shows up at the same time
    $("#character-editor").hide();
    $("#character-freetext").hide();
    $("#character-stats").hide();
    $("#character-skills").hide();
    if (localStorage.getItem("people") !== null) {
        $("nav").html(JSON.parse(localStorage.getItem("nav")));
        $("#character-container").html(JSON.parse(localStorage.getItem("character-list")));
        $("#editor-container").html(JSON.parse(localStorage.getItem("profile")));
        $("#stats-container").html(JSON.parse(localStorage.getItem("stats")));
        people = JSON.parse(localStorage.getItem("people"));
        numberOfPeople = JSON.parse(localStorage.getItem("numberOfPeople"));
        characterList = JSON.parse(localStorage.getItem("character"));
        selection = JSON.parse(localStorage.getItem("selection"));
        if ($("#character-info").hasClass("tab-selected")) {
            $("#character-editor").show();
            $("#character-freetext").show();
        }
        if ($("#stats-and-skills").hasClass("tab-selected")) {
            $("#character-stats").show();
            $("#character-skills").show();
        }
        $("#instructions").css("display", "none");
        $("nav").show();
        $("nav").removeClass("nav-leave");
        $("nav").addClass("nav-enter");
        for (var property in characterList[0]) {
            $("#" + property).val(JSON.parse(localStorage.getItem("saved-" + property)));
        }
        /*This was in the code before but I don't know why
        $("#editor-container").after($("#editor-container").clone(true));
        $("#editor-container:last").remove();
        $("#traits-container").after($("#traits-container").clone(true));
        $("#traits-container:last").remove();
        $("#traits-container-2").after($("#traits-container-2").clone(true));
        $("#traits-container-2:last").remove();
        $("#stats-container").after($("#stats-container").clone(true));
        $("#stats-container:last").remove();
        */
        checkFormChanges();
    }
}
