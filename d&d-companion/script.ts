//The following variable only ensures that there will be no identical element IDs
var people = 0;

var numberOfPeople = 0;
var characterList = [];
var statList = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
var selection = 0;

var longAlert = 5000;
var shortAlert = 2500;

$(function() {
    checkFormChanges();
});

function checkFormChanges(){
    $(".row").on("focusout", function(){
        updateForm();
    });
}
function updateForm(){
    for (var property in characterList[0]){
        characterList[selection][property] = $("#" + property).val();
    }
    //Binds the input data to the playercard/character card data
    $("#name-" + selection).text($("#name").val().toString());
    if ($("#race").val() || $("#class").val() != ""){
        $("#race-class" + selection).text($("#race").val() + " " + $("#class").val());
        $("#race-class" + selection).text($("#race").val() + " " + $("#class").val());
    } else {
        $("#race-class" + selection).text("");
    }
    //Updates the character stats on focusout
    for (let i = 0; i < statList.length; i++){
        let x = $("#" + statList[i]).val();
        let y: number = +x;
        $("#" + statList[i]).val(y);
        //Add a plus prefix if the number is positive
        if (Math.floor((y-10)/2) > 0){
            $("#" + statList[i] + "-modifier").text("+" + Math.floor((y-10)/2));
        } else {
            $("#" + statList[i] + "-modifier").text(Math.floor((y-10)/2));
        }
    }
}

function addPerson(){
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
        strength: 0,
        dexterity: 0,
        constitution: 0,
        intelligence: 0,
        wisdom: 0,
        charisma: 0
    }
    //Have the first person be automatically selected
    if (numberOfPeople == 0){
        $("#character-freetext").css("animation", "enter-freetext 1s forwards");
        selectPerson(people);
    }
    people++;
    numberOfPeople++;
}

function selectPerson(personNum: number){
    $("#instructions").css("display", "none");
    //Allows the character to show that they are being currently selected
    $(".person-container").removeClass("person-container-selected");
    setTimeout(function(){
        $("#person-" + personNum).addClass("person-container-selected");
    }, 1);
    
    //This plays an animation whenever a person is selected
    $("#editor-container").after($("#editor-container").clone(true));
    $("#editor-container:last").remove();
    $("#stats-container").after($("#stats-container").clone(true));
    $("#stats-container:last").remove();
    //
    $("#character-editor").css("display", "block");
    $("#character-freetext").css("display", "block");
    selection = personNum;
    //Loads the object values into the character editor
    for (var property in characterList[0]){
        $("#" + property).val(characterList[personNum][property]);
    }
    updateForm();
}

function deleteCharacter(){
    $("#person-" + selection).remove();
    $("#character-editor").css("display", "none");
    $("#character-freetext").css("display", "none");
    $("#instructions > p").text("Add or select a person.");
    $("#instructions").css("display", "block");
    numberOfPeople--;
}
function nextPage(){
    $("#traits-container").hide();
    $("#traits-container-2").css("display", "flex");
}
function previousPage(){
    $("#traits-container-2").hide();
    $("#traits-container").css("display", "flex");
}
function increaseStat(statType: String){
    let x = $("#" + statType).val();
    let y: number = +x;
    if (y != 99){
        y++;
    }
    $("#" + statType).val(y);
    if (Math.floor((y-10)/2) > 0){
        $("#" + statType + "-modifier").text("+" + Math.floor((y-10)/2));
    } else {
        $("#" + statType + "-modifier").text(Math.floor((y-10)/2));
    }
}
function decreaseStat(statType: String){
    let x = $("#" + statType).val();
    let y: number = +x;
    if (y != 0){
        y--;
    }
    $("#" + statType).val(y);
    if (Math.floor((y-10)/2) > 0){
        $("#" + statType + "-modifier").text("+" + Math.floor((y-10)/2));
    } else {
        $("#" + statType + "-modifier").text(Math.floor((y-10)/2));
    }
}
function deleteCharacterList(){
    if ($("#delete-character-list").text() == "Are you sure?"){
        $("#delete-character-list").text("Delete All Characters");
        $(".person-container").remove();
        $("#character-editor").css("display", "none");
        $("#character-freetext").css("display", "none");
        $("#instructions > p").text("Add or select a person.");
        $("#instructions").css("display", "block");
        people = 0;
        numberOfPeople = 0;
    } else {
        $("#delete-character-list").text("Are you sure?");
        $("#delete-character-list").on("focusout", function(){
            $("#delete-character-list").text("Delete All Characters");
        });
    }
}

function movePersonLeft(){
    //Prevents the .person-container animation from playing again
    $(".person-container, img").css("animation", "none");
    setTimeout(function(){
        $("#person-" + selection).prev().insertAfter($("#person-" + selection));
    }, 1);
}

function movePersonRight(){
    $(".person-container, img").css("animation", "none");
    setTimeout(function(){
    //Prevent the person from being moved past the "Add Person" button
        if ($("#person-" + selection).next().text() != $(".add-person").text()){
            $("#person-" + selection).next().insertBefore($("#person-" + selection));
        }
    }, 1);
}

function uploadPicture(){
    const reader: any = new FileReader();
    var file = $("input[type=file]").get(0) as HTMLInputElement;
    reader.onload = function(){
        $("#profile-picture-" + selection).attr("src", reader.result);
    }
    reader.readAsDataURL(file.files[0]);
}

function save(){
    try {
        if (numberOfPeople == 0){
            $(".alert").remove();
            $("main").append('<div class="alert" role="alert">You cannot save a character list with no people in it.</div>');
            $(".alert").delay(longAlert).queue(function(){
                $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function(){
                    $(this).remove();
                }).dequeue();
            });
            return;
        }
        localStorage.setItem("character-list", JSON.stringify($("#character-container").html()));
        localStorage.setItem("profile", JSON.stringify($("#editor-container").html()));
        localStorage.setItem("stats", JSON.stringify($("#stats-container").html()));
        localStorage.setItem("people", JSON.stringify(people));
        localStorage.setItem("numberOfPeople", JSON.stringify(numberOfPeople));
        localStorage.setItem("character", JSON.stringify(characterList));
        localStorage.setItem("selection", JSON.stringify(selection));
        //Save the input values from the form
        for (var property in characterList[0]){
            localStorage.setItem("saved-" + property, JSON.stringify($("#" + property).val()));
        }
        $(".alert").remove();
        $("main").append('<div class="alert" role="alert">Save successful.</div>');
        $(".alert").delay(shortAlert).queue(function(){
            $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function(){
                $(this).remove();
            }).dequeue();
        });
    } catch(e) {
        $(".alert").remove();
        $("main").append('<div class="alert" role="alert">Cannot save character list. Photos must be cumulatively less than 5MB in size.</div>');
        $(".alert").delay(longAlert).queue(function(){
        $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function(){
                $(this).remove();
            }).dequeue();
        });
    }
}

function load(){
    if (localStorage.getItem("people") !== null){
        $("#character-container").html(JSON.parse(localStorage.getItem("character-list")));
        $("#editor-container").html(JSON.parse(localStorage.getItem("profile")));
        $("#stats-container").html(JSON.parse(localStorage.getItem("stats")));
        people = JSON.parse(localStorage.getItem("people"));
        numberOfPeople = JSON.parse(localStorage.getItem("numberOfPeople"));
        characterList = JSON.parse(localStorage.getItem("character"));
        selection = JSON.parse(localStorage.getItem("selection"));
        $("#character-editor").css("display", "block");
        $("#character-freetext").css("display", "block");
        $("#character-freetext").css("animation", "enter-freetext 1s forwards");
        $("#instructions").css("display", "none");

        for (var property in characterList[0]){
            $("#" + property).val(JSON.parse(localStorage.getItem("saved-" + property)));
        }
        //This plays an animation whenever a person is selected
        $("#editor-container").after($("#editor-container").clone(true));
        $("#editor-container:last").remove();
        $("#stats-container").after($("#stats-container").clone(true));
        $("#stats-container:last").remove();
        //
        checkFormChanges();
    }
}