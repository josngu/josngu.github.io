const UPPERCASE = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const LOWERCASE = "abcdefghijklmnopqrstuvwxyz";
const NUMBERS = "1234567890";
const SYMBOLS = "!@#$%^&*";
const ADDITIONAL_SYMBOLS = "()[]{}<>?;:,.";
const STRANGE_SYMBOLS = "¶§╚╔╩╦╠╬█▄▀┘┌┐└┴┬├┼";
const GREEK_LETTERS = "ΑαΒβΓγΔδΕεΖζΗηΘθΙιΚκΛλΜμΝνΞξΟοΠπΡρΣσςΤτΥυΦφΧχΨψΩω";

var passwordHistory = "";
var generatedPassword = "";
var timesGenerated = 0;

$(function(){
    //Bind the slider to the number input box and vice-versa
    $("#length-slider").on("input", function(){
        $("#length-input-box").val($("#length-slider").val());
    });
    $("#length-input-box").on("input", function(){
        $("#length-slider").val($("#length-input-box").val());
    });
});

function generatePassword() {
    generatedPassword = "";
    //Choose whether to choose a random number, symbol, uppercase letter, lowercase letter, etc.
    for (let i = 0; i < $("#length-slider").val(); i++){
        let x = Math.floor(Math.random() * 7);
        if (x <= 3) {
            chooseCharacter(x);
        }
        //I need to find a better way to write the following code:
        if (x == 4 && $("#chk-additional-symbols").is(":checked")){
            generatedPassword = generatedPassword + ADDITIONAL_SYMBOLS[Math.floor(Math.random() * ADDITIONAL_SYMBOLS.length)];
        }
        if (x == 4 && $("#chk-additional-symbols").is(":checked") == false){
            let y = Math.floor(Math.random() * 4);
            chooseCharacter(y);
        }
        if (x == 5 && $("#chk-strange-symbols").is(":checked")){
            generatedPassword = generatedPassword + STRANGE_SYMBOLS[Math.floor(Math.random() * STRANGE_SYMBOLS.length)];
        }
        if (x == 5 && $("#chk-strange-symbols").is(":checked") == false){
            let y = Math.floor(Math.random() * 4);
            chooseCharacter(y);
        }
        if (x == 6 && $("#chk-greek-letters").is(":checked")){
            generatedPassword = generatedPassword + GREEK_LETTERS[Math.floor(Math.random() * GREEK_LETTERS.length)];
        }
        if (x == 6 && $("#chk-greek-letters").is(":checked") == false){
            let y = Math.floor(Math.random() * 4);
            chooseCharacter(y);
        }
    }
    timesGenerated++;
    //Cancel the animation before starting a new one
    $("#generated-password").css("animation", "none");
    setTimeout(function(){
        $("#generated-password").css("animation", "password-generation 0.5s forwards");
    }, 1);

    $("#generated-password").text(generatedPassword);
    //Creates a new <p> tag, then adds the text into it.
    passwordHistory = '<p class="password-item" id="password-' + timesGenerated + '" onclick="copyText(' + timesGenerated + ')"></p>';
    $("#password-history-container div").prepend(passwordHistory);
    $("#password-" + timesGenerated).text(generatedPassword);
}

function chooseCharacter(a) {
    switch (a){
        case 0:
            generatedPassword = generatedPassword + UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
            break;
        case 1:
            generatedPassword = generatedPassword + LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
            break;
        case 2:
            generatedPassword = generatedPassword + NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
            break;
        case 3:
            generatedPassword = generatedPassword + SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
            break;
    }
}

function clearHistory() {
    $(".password-item").css("animation", "list-unload 0.5s forwards");
    //Disable all buttons so that the animation won't be interrupted
    $("button").prop("disabled", true);
    setTimeout(function(){
        $(".password-item").remove();
        $("button").prop("disabled", false);
    }, 500);
    timesGenerated = 0;
}

function copyText(id) {
    $(".alert").remove();
    if (id == 0){
        navigator.clipboard.writeText($("#generated-password").text());
    } else {
        navigator.clipboard.writeText($("#password-" + id).text());
    }
    //Create toast
    $("main").append('<div class="alert" role="alert">Password Copied</div>');
    $(".alert").delay(2000).queue(function(){
        $(this).css("animation", "alert-leave 0.25s forwards").delay(250).queue(function(){
            $(this).remove();
        }).dequeue();
    });
}