"use strict";
var day = 1;
var hour = 7;
var minute = 0;
var clockCycle = "AM";
var clockLength = 200;
var warningCount = 0;
var endDay = false;
var startDay = false;
var protocolViolated = false;
var penaltyReason = "";
var penaltyAmount = 0;
var fileName = "";
const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
const FIRST_NAME = ["James", "Sofia", "Ethan", "Emma", "Carter", "Scarlett", "Nathan", "Nora", "Muhammad", "Fatima", "Hamza", "Maria", "Antonio", "Sonia", "Mohammad", "Mia", "Nikola", "Alice", "Francisco", "Lucy", "Niko", "June", "Hao", "Astrid", "Omar", "Mary", "Daniel", "Valentina", "Agustin", "Olivia", "Jacob", "Abigail", "Alex", "Agnes", "Martin", "Emily", "Liam", "Grace", "Leonardo", "Isabelle", "Niko", "Valerie", "Charlie", "Charlotte", "Bob", "Anastasia", "Kazuya", "Mikazuki", "Sergei", "Yoko", "Ringo", "Julia"];
const LAST_NAME = ["Huang", "Gutierrez", "Robinson", "Watson", "Khalid", "Hasan", "Harrison", "Ferguson", "Cunningham", "Hoffman", "Chan", "Schroeder", "Weiss", "Singh", "Zhou", "Abubakar", "Romero", "Contreras", "Nakamura", "Yamamoto", "Kobayashi", "Blanco", "Torres", "Lee", "Harris", "Wright", "Flores", "Cooper", "Sullivan", "Delgado", "Atkinson", "Baxter", "McDonald", "McDuff", "McAllister", "McMahon", "McKee", "McGregor", "Fukumoto", "Kubota", "Ichikawa", "Nagata", "Aguilar", "Rivera", "Richardson"];
const SOURCE_IMG = ["uniassets.com", "assethaven.com", "stockloop.org", "piccolophotos.com"];
const SOURCE_VID = ["filmostock.com", "vestvideos.com", "uniassets.com", "assethaven.com"];
const SOURCE_MUS = ["hypomusique.com", "allsounds.com", "upcompose.com", "rigormusic.com"];
const FILE_TYPE = ["a video file", "a video", "a photo", "a photograph", "a picture", "an image", "an audio file", "a document"];
const VIDEO_TYPE = ["mov", "mp4", "avi", "flv", "webm"];
const IMAGE_TYPE = ["jpg", "png", "webp", "tiff", "raw"];
const AUDIO_TYPE = ["mp3", "ogg", "flac", "wav", "m4a"];
const DOCUMENT_TYPE = ["docx", "odt", "txt", "rtf", "pdf"];
const RESPONSE = ["I sent", "I sent you", "This is", "It's", "It is", "I've sent you", "The file should be", "The file is", "I think I sent", "I uploaded", "I've uploaded"];
//Ministry of agriculture, defense, education, energy, health, infrastructure, labour, transportation
const MINISTRY = ["AG", "DE", "ED", "EN", "HE", "IN", "LA", "TR"];
const ED_KEYWORDS = ["teacher", "teachers", "school", "education", "college", "building", "instructor", "student", "students", "research"];
const EN_KEYWORDS = ["power plant", "power", "electricity", "voltage", "energy", "building", "utilities"];
const LA_KEYWORDS = ["work", "workforce", "labour", "employee", "employment", "workplace", "job", "industry", "coworker", "colleague", "career", "occupation", "corporation", "company", "enterprise", "organization"];
const TR_KEYWORDS = ["road", "aircraft", "airplane", "plane", "jet plane", "flying", "airport", "train", "trains", "car", "highway", "ship", "ships", "boat", "vehicle", "vehicles"];
const HE_KEYWORDS = ["health", "hospital", "doctor", "nurse", "healthcare", "physician", "surgeon", "medic", "clinic", "ward", "emergency room", "surgery", "practitioner"];
const AG_KEYWORDS = ["farm", "farms", "farmland", "farmer", "crops", "agriculture", "harvest", "cultivation", "plow", "plants"];
const IN_KEYWORDS = ["building", "buildings", "skyscraper", "skyscrapers", "construction", "architecture", "house", "houses", "structure"];
const DE_KEYWORDS = ["military", "war", "weapons", "guns", "firearms", "army", "artillery", "infantry", "corps", "armaments", "troops", "squadron", "squad"];
const AUDIO_KEYWORDS = ["bass", "upbeat", "drums", "classical", "piano", "guitar", "trumpet", "saxophone", "relaxing", "violin"];
const DOCUMENT_KEYWORDS = ["finance", "financial", "document", "spreadsheet", "article", "record", "records", "accounts", "management", "archive", "data"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function openConnection() {
    if (startDay === false) {
        startDay = true;
        clock();
        openConnection();
    }
    else {
        $("#btn-open-connection").css({ "pointer-events": "none", "animation": "none", "opacity": "40%" });
        let fileType = FILE_TYPE[Math.floor(Math.random() * FILE_TYPE.length)];
        let response = RESPONSE[Math.floor(Math.random() * RESPONSE.length)];
        let name = generateName();
        Promise.resolve().then(() => delay(500))
            .then(() => $("#transcript-container div").append(`<p id="text-login-status">${name} has logged in</p>`))
            .then(() => delay(500))
            .then(() => $(".dialog-box").css("display", "flex"))
            .then(() => delay(1000))
            .then(() => {
            $(".dialog-box p").text("FILE RECEIVED");
            $(".dialog-box").addClass("dialog-box-exit");
        })
            .then(() => delay(500))
            .then(() => {
            $("#metadata-container").css("display", "flex");
            $(".dialog-box").removeClass("dialog-box-exit").hide();
            $(".dialog-box p").text("RECEIVING FILE...");
        })
            .then(() => delay(1000))
            .then(() => $("#transcript-container div").append(`<p class="name-admin">SysAdmin</p>
        <p class="transcript-admin">What is the file that you have sent?</p>`))
            .then(() => delay(2000))
            .then(() => $("#transcript-container div").append(`<p class="name-user">${name}</p>
        <p class="transcript-user">${response} ${fileType}.</p>`));
        generateMetadata(fileType);
    }
}
function generateMetadata(fileType) {
    violateProtocol();
    let ministry = MINISTRY[Math.floor(Math.random() * MINISTRY.length)];
    let author = generateName();
    let datePublished = generateDate(2047, 39);
    switch (fileType) {
        case "a video file":
        case "a video":
            generateFileName("video", ministry);
            const VIDEO_DIMENSIONS = ["1920px * 1080px", "2560px * 1440px", "3840px * 2160px", "7680px * 4320px"];
            const FRAME_RATE = [24, 30, 60];
            let videoLengthMin = Math.floor(Math.random() * 5 + 0);
            let videoLengthSec = Math.floor(Math.random() * 59 + 0);
            let videoDimensions = VIDEO_DIMENSIONS[Math.floor(Math.random() * VIDEO_DIMENSIONS.length)];
            let frameRate = FRAME_RATE[Math.floor(Math.random() * FRAME_RATE.length)];
            let fileSize = Math.floor(Math.random() * (30 * frameRate / 30) + (130 * videoLengthMin));
            break;
        case "a photo":
        case "a photograph":
        case "a picture":
        case "an image":
            generateFileName("image", ministry);
            break;
        case "an audio file":
            generateFileName("audio", ministry);
            break;
        case "a document":
            generateFileName("document", ministry);
            let source = `Ministry of ${convertToMinistryLong(ministry)}`;
    }
    let assetExpiryDate = generateDate(2088, 10);
}
function generateFileName(fileType, ministry) {
    if (fileType === "video" || fileType === "image") {
        switch (ministry) {
            case "ED":
                let ED = ["School", "Class", "College", "University", "Classroom", "LectureHall", "SchoolLibrary"];
                fileName = "MoED_" + ED[Math.floor(Math.random() * ED.length)] + "_";
                break;
            case "EN":
                let EN = ["NuclearPowerPlant", "CoalPowerPlant", "GasPowerPlant", "Windmill", "Windmills", "SolarPanel", "SolarPanels", "Geothermal", "Hydroelectric"];
                fileName = "MoEN_" + EN[Math.floor(Math.random() * EN.length)] + "_";
                break;
            case "LA":
                let LA = ["Office", "OfficeHeadquarters", "Offices", "Business", "Businesses", "Factory", "Factories", "Manufacturer", "ConvenienceStore", "RetailStore", "Supermarket"];
                fileName = "MoLA_" + LA[Math.floor(Math.random() * LA.length)] + "_";
                break;
            case "TR":
                let TR = ["Transportation", "Transport", "Shipping", "Transit", "Freight"];
                fileName = "MoTR_" + TR[Math.floor(Math.random() * TR.length)] + "_";
                break;
            case "HE":
                let HE = ["HealthClinic", "HospitalRoom", "NursingHome", "PsychiatricWard", "Infirmary", "IsolationWard", "IntensiveCareUnit"];
                fileName = "MoHE_" + HE[Math.floor(Math.random() * HE.length)] + "_";
                break;
            case "AG":
                let AG = ["TractorOnFarm", "FarmerCultivating", "FarmerHarvesting", "FarmerPlanting", "CountrysideFarm", "RooftopFarm"];
                fileName = "MoAG_" + AG[Math.floor(Math.random() * AG.length)] + "_";
                break;
            case "IN":
                let IN = ["CitySkyline", "Downtown", "CityDistrict", "UrbanDistrict", "CityArchitecture", "TallSkyscrapers", "TallBuildings", "OldArchitecture"];
                fileName = "MoIN_" + IN[Math.floor(Math.random() * IN.length)] + "_";
                break;
            case "DE":
                let DE = ["MilitaryBunker", "Bootcamp", "MilitaryTraining", "Soldiers", "Battalion", "UndergroundBunker", "UnitFormation"];
                fileName = "MoDE_" + DE[Math.floor(Math.random() * DE.length)] + "_";
                break;
        }
    }
    if (fileType === "audio") {
        let x = ["Audio", "Music", "Song"];
        fileName = "Mo" + ministry + "_" + x[Math.floor(Math.random() * x.length)] + "_";
    }
    if (fileType === "document") {
        let x = ["Form", "Letter", "Application", "DataSheet", "Chart", "Publication", "Guidelines", "Statement", "Census", "Statistics"];
        fileName = "Mo" + ministry + "_" + x[Math.floor(Math.random() * x.length)] + "_";
    }
    //All of the code above generates the first half of the file name
    //Next, we need to generate the date
    if (day < 10) {
        fileName = fileName + "2087M10D0" + day;
    }
    else {
        fileName = fileName + "2087M10D" + day;
    }
    //Lastly, we need to add a file extension
    fileName = fileName + "." + generateFileExtension(fileType);
    $("#metadata-container h2").text(fileName);
}
function generateDate(startingValue, plusMax) {
    let year = Math.floor(Math.random() * plusMax + startingValue);
    let month = MONTH[Math.floor(Math.random() * MONTH.length)];
    //Might code in a way to check if a month could have 31 days, but it's not important right now
    let day = Math.floor(Math.random() * 27 + 1);
    return addLeadingZero(year, month, day);
}
function addLeadingZero(year, month, day) {
    if (month < 10 && day < 10) {
        return year + "M0" + month + "D0" + day;
    }
    if (month < 10) {
        return year + "M0" + month + "D" + day;
    }
    if (day < 10) {
        return year + "M" + month + "D0" + day;
    }
    return year + "M" + month + "D" + day;
}
function generateFileExtension(fileType) {
    let fileExt = "";
    switch (fileType) {
        case "video":
            fileExt = VIDEO_TYPE[Math.floor(Math.random() * VIDEO_TYPE.length)];
            break;
        case "image":
            fileExt = IMAGE_TYPE[Math.floor(Math.random() * IMAGE_TYPE.length)];
            break;
        case "audio":
            fileExt = AUDIO_TYPE[Math.floor(Math.random() * AUDIO_TYPE.length)];
            break;
        case "document":
            fileExt = DOCUMENT_TYPE[Math.floor(Math.random() * DOCUMENT_TYPE.length)];
    }
    return fileExt;
}
function generateName() {
    let firstName = FIRST_NAME[Math.floor(Math.random() * FIRST_NAME.length)];
    let lastName = LAST_NAME[Math.floor(Math.random() * LAST_NAME.length)];
    return firstName + " " + lastName;
}
function convertToMinistryLong(ministry) {
    switch (ministry) {
        case "ED":
            return "Education";
        case "EN":
            return "Energy";
        case "LA":
            return "Labour";
        case "TR":
            return "Transportation";
        case "HE":
            return "Health";
        case "AG":
            return "Agriculture";
        case "IN":
            return "Infrastructure";
        case "DE":
            return "Defense";
    }
}
function violateProtocol() {
    let x = Math.floor(Math.random() * 1);
    switch (x) {
        case 0:
            protocolViolated = false;
            break;
        case 1:
            protocolViolated = true;
    }
}
function toggleRulebook() {
    if ($("#rulebook-container").is(":hidden")) {
        $("#rulebook-container").slideDown(500);
        $("#rulebook-container").css("display", "flex");
    }
    else {
        $("#rulebook-container").slideUp(500);
    }
}
function switchTab() {
    if ($("#rules-metadata + button").text() === "NEXT: METADATA") {
        $("#rules-metadata + button").text("PREVIOUS: FILE NAMING");
        $("#rulebook-container > h2").text("RULEBOOK: METADATA");
        $("#rules-file-naming").hide();
        $("#rules-metadata").show();
    }
    else {
        $("#rules-metadata + button").text("NEXT: METADATA");
        $("#rulebook-container > h2").text("RULEBOOK: FILE NAMING");
        $("#rules-file-naming").show();
        $("#rules-metadata").hide();
    }
}
function dayStart() {
    switch (day) {
        case 1:
            $("#notifications-container div").prepend(`<p class="notif-regular">Your position as a digital asset administrator is to filter out any incoming assets that do not adhere to government protocol. View the rulebook at the bottom for more details. When you're ready, you may begin accepting incoming connections.</p>`);
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
