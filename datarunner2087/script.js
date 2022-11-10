"use strict";
var day = 1;
var hour = 7;
var minute = 0;
var clockCycle = "AM";
var clockLength = 200;
var warningCount = 0;
var endDay = false;
var startDay = false;
var penaltyReason = "";
var penaltyAmount = 0;
const FIRST_NAME = ["James", "Sofia", "Ethan", "Emma", "Carter", "Scarlett", "Nathan", "Nora", "Muhammad", "Fatima", "Hamza", "Maria", "Antonio", "Sonia", "Mohammad", "Mia", "Nikola", "Alice", "Francisco", "Lucy", "Niko", "June", "Hao", "Astrid", "Omar", "Mary", "Daniel", "Valentina", "Agustin", "Olivia", "Jacob", "Abigail", "Alex", "Agnes", "Martin", "Emily", "Liam", "Grace", "Leonardo", "Isabelle", "Niko", "Valerie", "Charlie", "Charlotte", "Bob", "Anastasia", "Kazuya", "Mikazuki", "Sergei", "Yoko", "Ringo", "Julia"];
const LAST_NAME = ["Huang", "Gutierrez", "Robinson", "Watson", "Khalid", "Hasan", "Harrison", "Ferguson", "Cunningham", "Hoffman", "Chan", "Schroeder", "Weiss", "Singh", "Zhou", "Abubakar", "Romero", "Contreras", "Nakamura", "Yamamoto", "Kobayashi", "Blanco", "Torres", "Lee", "Harris", "Wright", "Flores", "Cooper", "Sullivan", "Delgado", "Atkinson", "Baxter", "McDonald", "McDuff", "McAllister", "McMahon", "McKee", "McGregor", "Fukumoto", "Kubota", "Ichikawa", "Nagata", "Aguilar", "Rivera", "Richardson"];
//Ministry of education, energy, employment, security, transportation, health, finance, agriculture, immigration, infrastructure, defense, tourism, global affairs, public services
const MINISTRY = ["ED", "EN", "EM", "SE", "TR", "HE", "FI", "AG", "IM", "IN", "DE", "TO", "GL", "PU"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function openConnection() {
    if (startDay === false) {
        startDay = true;
        clock();
        openConnection();
    }
    else {
        let firstName = FIRST_NAME[Math.floor(Math.random() * FIRST_NAME.length)];
        let lastName = LAST_NAME[Math.floor(Math.random() * LAST_NAME.length)];
        Promise.resolve().then(() => delay(1000))
            .then(() => $("#transcript-container div").append(`<p id="text-login-status">${firstName} ${lastName} has logged in</p>`))
            .then(() => delay(500))
            .then(() => $(".dialog-box").css("display", "flex"))
            .then(() => delay(1000))
            .then(() => $(".dialog-box p").text("FILE RECEIVED"))
            .then(() => $(".dialog-box").addClass("dialog-box-exit"))
            .then(() => delay(500))
            .then(() => $("#metadata-container").css("display", "flex"))
            .then(() => $(".dialog-box").removeClass("dialog-box-exit").hide())
            .then(() => delay(1000))
            .then(() => $("#transcript-container div").append(`<p class="name-admin">SysAdmin</p>
        <p class="transcript-admin">What is the purpose of this file?</p>`))
            .then(() => delay(2000))
            .then(() => $("#transcript-container div").append(`<p class="name-user">${firstName} ${lastName}</p>
        <p class="transcript-user">This is a video file.</p>`));
    }
}
function dayStart() {
    switch (day) {
        case 1:
            $("#notifications-container div").prepend(`<p class="notif-regular">Your position as a digital asset administrator is to filter out any incoming assets that do not adhere to government protocol. Check the rulebook on your desktop for more details. When you're ready, you may begin accepting incoming connections.</p>`);
            break;
    }
}
function clock() {
    if (minute >= 0 && minute <= 9) {
        $("#time").text(`${hour}:0${minute} ${clockCycle}`);
        minute++;
        if (minute === 60) {
            minute = 0;
            hour++;
        }
    }
    else {
        $("#time").text(`${hour}:${minute} ${clockCycle}`);
        minute++;
        if (minute === 60) {
            minute = 0;
            hour++;
        }
    }
    if (hour === 12) {
        clockCycle = "PM";
    }
    if (hour === 13) {
        hour = 1;
    }
    //Checks if the time is 9:00 PM
    if (hour === 9 && minute === 0 && clockCycle === "PM") {
        return $("#time").text(`${hour}:0${minute} ${clockCycle}`);
    }
    setTimeout("clock()", clockLength);
}
function delay(duration) {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}
