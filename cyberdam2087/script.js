"use strict";
var day = 1;
var hour = 7;
var minute = 0;
var clockCycle = "AM";
var clockLength = 250;
var username = "";
var warningCount = 0;
var endDay = false;
var startDay = false;
var money = 100;
var penaltyDeduction = 100;
var protocolViolated = false;
var penaltyReason = "";
var violationCount = -1;
var violationList = ["file name year", "file name month", "file name day", "file name date format", "missing file name extension", "missing file name ministry", "ministry abbreviation"];
var fileType = "";
var fileName = "";
var fileExt = "";
var keywordMinimum = 3;
const ALPHABET = "abcdefghijklmnopqrstvwxyz";
const FIRST_NAME = ["James", "Sofia", "Ethan", "Emma", "Carter", "Scarlett", "Nathan", "Nora", "Muhammad", "Fatima", "Hamza", "Maria", "Antonio", "Sonia", "Mohammad", "Mia", "Nikola", "Alice", "Francisco", "Lucy", "Niko", "June", "Hao", "Astrid", "Omar", "Mary", "Daniel", "Valentina", "Agustin", "Olivia", "Jacob", "Abigail", "Alex", "Agnes", "Martin", "Emily", "Liam", "Grace", "Leonardo", "Isabelle", "Niko", "Valerie", "Charlie", "Charlotte", "Bob", "Anastasia", "Kazuya", "Mikazuki", "Sergei", "Yoko", "Ringo", "Julia"];
const LAST_NAME = ["Huang", "Gutierrez", "Robinson", "Watson", "Khalid", "Hasan", "Harrison", "Ferguson", "Cunningham", "Hoffman", "Chan", "Schroeder", "Weiss", "Singh", "Zhou", "Abubakar", "Romero", "Contreras", "Nakamura", "Yamamoto", "Kobayashi", "Blanco", "Torres", "Lee", "Harris", "Wright", "Flores", "Cooper", "Sullivan", "Delgado", "Atkinson", "Baxter", "McDonald", "McDuff", "McAllister", "McMahon", "McKee", "McGregor", "Fukumoto", "Kubota", "Ichikawa", "Nagata", "Aguilar", "Rivera", "Richardson"];
const SOURCE_IMG = ["uniassets.com", "assethaven.com", "stockloop.org", "piccolophotos.com"];
const SOURCE_VID = ["filmostock.com", "vestvideos.com", "uniassets.com", "assethaven.com"];
const SOURCE_AUD = ["hypomusique.com", "allsounds.com", "upcompose.com", "rigormusic.com"];
const FILE_TYPE = ["a video file", "a video", "a photo", "a photograph", "a picture", "an image", "an audio file", "a document"];
const VIDEO_TYPE = ["mov", "mp4", "avi", "flv", "webm"];
const IMAGE_TYPE = ["jpg", "png", "webp", "tiff", "dng"];
const AUDIO_TYPE = ["mp3", "ogg", "flac", "wav", "m4a"];
const DOCUMENT_TYPE = ["docx", "odt", "txt", "rtf", "pdf"];
const OTHER_FILE_EXTENSIONS = ["apk", "exe", "zip", "rar", "obj", "cab", "bin", "tar", "dmg", "iso", "img"];
const RESPONSE = ["I sent", "I sent you", "I've sent you", "The file should be", "The file is", "I think I sent", "I uploaded", "I've uploaded", "I sent over"];
const RESPONSE_REJECT = ["I see.", "What? This is ridiculous.", "Hmm... I'll try again later.", "Huh?", "...", "Why?", "Maybe I'll try again later.", "What's wrong with the file?", "Sorry... I'm still new to this.", "Alright.", "What?", "Is there a problem with the file?", "I guess I'll try again another time.", "I hate this.", "This process is a little confusing.", "Hmm... That's weird.", "I don't understand what's wrong with the file?", "Right... I see.", "I don't understand the point of this."];
//Ministry of agriculture, defense, education, energy, health, infrastructure, labour, transportation
const MINISTRY = ["AG", "DE", "ED", "EN", "HE", "IN", "LA", "TR"];
const MINISTRY_FAKE = ["AR", "DF", "EU", "ER", "HT", "IM", "LR", "TA", "TN", "IR", "AM", "SE", "TO", "AC"];
const ED_KEYWORDS = ["teacher", "teachers", "school", "education", "college", "building", "instructor", "student", "students", "research"];
const EN_KEYWORDS = ["power plant", "power", "electricity", "voltage", "energy", "building", "utilities"];
const LA_KEYWORDS = ["work", "workforce", "labour", "employee", "employment", "workplace", "job", "industry", "coworker", "colleague", "career", "occupation", "corporation", "company", "enterprise", "organization"];
const TR_KEYWORDS = ["road", "aircraft", "airplane", "plane", "jet plane", "flying", "airport", "train", "trains", "car", "highway", "ship", "ships", "boat", "vehicle", "vehicles"];
const HE_KEYWORDS = ["health", "hospital", "doctor", "nurse", "healthcare", "physician", "surgeon", "medic", "clinic", "ward", "emergency room", "surgery", "practitioner"];
const AG_KEYWORDS = ["farm", "farms", "farmland", "farmer", "crops", "agriculture", "harvest", "cultivation", "plow", "plants"];
const IN_KEYWORDS = ["building", "buildings", "skyscraper", "skyscrapers", "construction", "architecture", "house", "houses", "structure"];
const DE_KEYWORDS = ["military", "war", "weapons", "guns", "firearms", "army", "artillery", "infantry", "corps", "armaments", "troops", "squadron", "squad"];
const AUDIO_KEYWORDS = ["bass", "upbeat", "drums", "classical", "instrument", "piano", "guitar", "trumpet", "saxophone", "relaxing", "violin", "woodwinds", "orchestra", "electronic"];
const DOCUMENT_KEYWORDS = ["finance", "financial", "document", "spreadsheet", "article", "record", "records", "accounts", "management", "archive", "data"];
const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
$(function () {
    $("#btn-open-connection, #btn-reject, #btn-approve").on("keydown", false);
});
function startGame() {
    $("#title-screen").hide();
    $("#intro-container").css({ "display": "flex" });
}
function approve() {
    Promise.resolve().then(() => {
        $("#btn-reject, #btn-approve").css({ "pointer-events": "none" });
        $("#metadata-container").addClass("metadata-container-approve");
    })
        .then(() => delay(250))
        .then(() => $("#metadata-container").slideUp(500))
        .then(() => delay(500))
        .then(() => {
        $("#btn-reject, #btn-approve").css({ "pointer-events": "auto" });
        $("#metadata-container").removeClass("metadata-container-approve");
        $("#transcript-container div").append(`<p class="name-admin">SysAdmin</p>
        <p class="transcript-admin">Your file has been approved. You may log off now.</p>`);
    })
        .then(() => delay(1500))
        .then(() => {
        $("#transcript-container div").append(`<p id="text-login-status">${username} has logged out</p>`);
        $("#btn-open-connection").removeClass("btn-open-connection-disabled");
    });
    checkViolation("approve");
}
function reject() {
    let delayTimer = 1500;
    Promise.resolve().then(() => {
        $("#btn-reject, #btn-approve").css({ "pointer-events": "none" });
        $("#metadata-container").addClass("metadata-container-reject");
    })
        .then(() => delay(250))
        .then(() => $("#metadata-container").slideUp(500))
        .then(() => delay(500))
        .then(() => {
        $("#btn-reject, #btn-approve").css({ "pointer-events": "auto" });
        $("#metadata-container").removeClass("metadata-container-reject");
        $("#transcript-container div").append(`<p class="name-admin">SysAdmin</p>
        <p class="transcript-admin">Your file has been rejected. You will be logged off now.</p>`);
    })
        .then(() => delay(1500))
        .then(() => {
        if (coinFlip(0.25) === true) {
            $("#transcript-container div").append(`<p class="name-user">${username}</p><p class="transcript-user">${RESPONSE_REJECT[Math.floor(Math.random() * RESPONSE_REJECT.length)]}</p>`);
        }
        else {
            delayTimer = 0;
        }
    })
        .then(() => delay(delayTimer))
        .then(() => {
        $("#transcript-container div").append(`<p id="text-login-status">${username} has logged out</p>`);
        $("#btn-open-connection").removeClass("btn-open-connection-disabled");
    });
    checkViolation("reject");
}
function createViolation() {
    let chooseViolation = violationList[Math.floor(Math.random() * violationList.length)];
    //Debugging variable
    //chooseViolation = "insufficient keywording";
    let textReplace = "";
    switch (chooseViolation) {
        case "file name year":
            textReplace = $("#metadata-container h2").text().replace("2087", Math.floor(Math.random() * 9 + 2077).toString());
            $("#metadata-container h2").text(textReplace);
            penaltyReason = "INCORRECT FILE NAME YEAR";
            break;
        case "file name month":
            textReplace = $("#metadata-container h2").text().replace("M10", "M0" + Math.floor(Math.random() * 8 + 1).toString());
            $("#metadata-container h2").text(textReplace);
            penaltyReason = "INCORRECT FILE NAME MONTH";
            break;
        case "file name day":
            textReplace = $("#metadata-container h2").text().replace("D0" + day, "D0" + (day + 1));
            $("#metadata-container h2").text(textReplace);
            penaltyReason = "INCORRECT FILE NAME DAY";
            break;
        case "file name date format":
            if (day < 10) {
                textReplace = $("#metadata-container h2").text().replace("2087M10D0" + day, "2087D0" + day + "M10");
                $("#metadata-container h2").text(textReplace);
            }
            else {
                textReplace = $("#metadata-container h2").text().replace("2087M10D" + day, "2087D" + day + "M10");
                $("#metadata-container h2").text(textReplace);
            }
            penaltyReason = "INCORRECT FILE NAME DATE FORMAT";
            break;
        case "missing file name extension":
            textReplace = $("#metadata-container h2").text().slice(0, -4);
            $("#metadata-container h2").text(textReplace);
            penaltyReason = "MISSING FILE NAME EXTENSION";
            break;
        case "missing file name ministry":
            textReplace = $("#metadata-container h2").text().slice(5);
            $("#metadata-container h2").text(textReplace);
            penaltyReason = "MISSING MINISTRY ABBREVIATION";
            break;
        case "ministry abbreviation":
            textReplace = "Mo" + MINISTRY_FAKE[Math.floor(Math.random() * MINISTRY_FAKE.length)] + $("#metadata-container h2").text().slice(4);
            $("#metadata-container h2").text(textReplace);
            penaltyReason = "INVALID MINISTRY ABBREVIATION";
            break;
        //Day 2
        case "file name extension":
            let fileExtension = $("#metadata-container h2").text().slice(-4);
            //Sometimes, removing the last 4 characters of the filename doesn't get rid of the period
            switch (fileExtension) {
                case "webm":
                case "webp":
                case "tiff":
                case "docx":
                case "flac":
                    textReplace = $("#metadata-container h2").text().slice(0, -4) + OTHER_FILE_EXTENSIONS[Math.floor(Math.random() * OTHER_FILE_EXTENSIONS.length)];
                    $("#metadata-container h2").text(textReplace);
                    break;
                default:
                    textReplace = $("#metadata-container h2").text().slice(0, -4) + "." + OTHER_FILE_EXTENSIONS[Math.floor(Math.random() * OTHER_FILE_EXTENSIONS.length)];
                    $("#metadata-container h2").text(textReplace);
            }
            penaltyReason = "FILE TYPE DOES NOT MATCH USER RESPONSE";
            break;
        //Day 3
        case "missing metadata entry":
            $(`#metadata tr:nth-last-child(${Math.floor(Math.random() * 5 + 1)}) td:nth-child(2)`).text("");
            penaltyReason = "MISSING METADATA ENTRY";
            break;
        case "invalid published date":
            $("#date-published").text(generateDateLong(2088, 9));
            penaltyReason = "INVALID PUBLISHED DATE";
            break;
        case "invalid expiry date":
            $("#asset-expiry-date").text(generateDateLong(2077, 9));
            penaltyReason = "INVALID ASSET EXPIRY DATE";
            break;
        //Day 4
        case "insufficient keywording":
            textReplace = $("#keywords").text().split(",").pop();
            $("#keywords").text(textReplace);
            penaltyReason = "INSUFFICIENT NUMBER OF KEYWORDS";
            break;
    }
}
function checkViolation(buttonValue) {
    if (buttonValue === "approve" && protocolViolated === false) {
        money += 50;
    }
    if (buttonValue === "approve" && protocolViolated === true) {
        assessPenalty();
    }
    if (buttonValue === "reject" && protocolViolated === false) {
        penaltyReason = "ASSET WAS CLEARED FOR APPROVAL";
        assessPenalty();
    }
    if (buttonValue === "reject" && protocolViolated === true) {
        money += 50;
    }
}
function assessPenalty() {
    //Sometimes the penalty reason can change before the delay finishes
    let x = penaltyReason;
    violationCount++;
    Promise.resolve().then(() => delay(3000))
        .then(() => {
        if ($("#rulebook-container").is(":visible")) {
            $("#rulebook-container").slideUp(500);
        }
        switch (violationCount) {
            case 0:
                $("#notifications-container div").prepend(`<p class="notif-warning">/!\\ PROTOCOL VIOLATED /!\\<br>${x}<br>FIRST WARNING - NO PENALTY</p>`);
                break;
            case 1:
                $("#notifications-container div").prepend(`<p class="notif-warning">/!\\ PROTOCOL VIOLATED /!\\<br>${x}<br>LAST WARNING - NO PENALTY</p>`);
                break;
            case 2:
                $("#notifications-container div").prepend(`<p class="notif-danger">/!\\ PROTOCOL VIOLATED /!\\<br>${x}<br>PENALTY - ${penaltyDeduction} EURO DEDUCTION</p>`);
                money -= penaltyDeduction;
                break;
            default:
                $("#notifications-container div").prepend(`<p class="notif-danger">/!\\ PROTOCOL VIOLATED /!\\<br>${x}<br>PENALTY - ${penaltyDeduction} EURO DEDUCTION</p>`);
                penaltyDeduction *= 2;
                money -= penaltyDeduction;
        }
    });
}
function openConnection() {
    $("#transcript-container div").empty();
    $("#metadata").empty();
    if (startDay === false) {
        startDay = true;
        clock();
        openConnection();
    }
    else {
        $("#btn-open-connection").addClass("btn-open-connection-disabled");
        let fileTypeResponse = FILE_TYPE[Math.floor(Math.random() * FILE_TYPE.length)];
        let response = RESPONSE[Math.floor(Math.random() * RESPONSE.length)];
        username = generateName();
        Promise.resolve().then(() => delay(250))
            .then(() => $("#transcript-container div").append(`<p id="text-login-status">${username} has logged in</p>`))
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
            $("#btn-reject, #btn-approve").hide();
            $(".dialog-box").removeClass("dialog-box-exit").hide();
            $(".dialog-box p").text("RECEIVING FILE...");
        })
            .then(() => delay(500))
            .then(() => $("#transcript-container div").append(`<p class="name-admin">SysAdmin</p>
        <p class="transcript-admin">Please state the type of file that you have uploaded.</p>`))
            .then(() => delay(1500))
            .then(() => {
            $("#transcript-container div").append(`<p class="name-user">${username}</p><p class="transcript-user">${response} ${fileTypeResponse}.</p>`);
            $("#btn-reject, #btn-approve").slideDown(250);
        });
        generateMetadata(fileTypeResponse);
    }
}
//I'm sorry about this long function
function generateMetadata(fileTypeResponse) {
    //Randomly decides if a part of the metadata should be incorrect (default 40% to be true)
    protocolViolated = Math.random() < 0.4;
    console.log(protocolViolated);
    let ministry = MINISTRY[Math.floor(Math.random() * MINISTRY.length)];
    //Note: Display the next 2 first
    let author = generateName();
    let datePublished = generateDateLong(2067, 19);
    createMetadataEntry("Author", author);
    createMetadataEntry("Date Published", datePublished);
    let fileSize = 0;
    let source = "";
    const COPYRIGHT_STATUS = ["Copyrighted", "Copyrighted", "Public Domain"];
    //Note: Display the next 3 last
    let copyrightStatus = COPYRIGHT_STATUS[Math.floor(Math.random() * COPYRIGHT_STATUS.length)];
    let usageRights = "Can be used for commercial purposes.";
    let assetExpiryDate = generateDateLong(2088, 10);
    switch (fileTypeResponse) {
        case "a video file":
        case "a video":
            fileType = "video";
            generateFileName(ministry);
            const VIDEO_DIMENSIONS = ["1920px * 1080px", "2560px * 1440px", "3840px * 2160px", "7680px * 4320px"];
            const FRAME_RATE = [24, 30, 60];
            let videoLengthMin = Math.floor(Math.random() * 5 + 0);
            let videoLengthSec = Math.floor(Math.random() * 49 + 10);
            let videoDimensions = VIDEO_DIMENSIONS[Math.floor(Math.random() * VIDEO_DIMENSIONS.length)];
            let frameRate = FRAME_RATE[Math.floor(Math.random() * FRAME_RATE.length)];
            fileSize = Math.floor(Math.random() * (60 * frameRate / 24) + (164.7 * videoLengthMin) + (3.7 * videoLengthSec));
            source = `${SOURCE_VID[Math.floor(Math.random() * SOURCE_VID.length)]}/${randomizeURL()}`;
            createMetadataEntry("File Size", fileSize.toFixed(1) + " MB");
            createMetadataEntry("Dimensions", videoDimensions);
            createMetadataEntry("Length", `${videoLengthMin}:${videoLengthSec}`);
            createMetadataEntry("Keywords", generateKeywords(ministry));
            break;
        case "a photo":
        case "a photograph":
        case "a picture":
        case "an image":
            fileType = "image";
            generateFileName(ministry);
            const IMAGE_DIMENSIONS = ["1920px * 1080px", "2560px * 1440px", "3840px * 2160px", "7680px * 4320px", "4000px * 3000px", "6000px * 4000px"];
            let imageDimensions = IMAGE_DIMENSIONS[Math.floor(Math.random() * IMAGE_DIMENSIONS.length)];
            switch (fileExt) {
                case "tiff":
                case "dng":
                    fileSize = Math.floor(Math.random() * 701 + 409) * 0.1;
                    break;
                case "png":
                    fileSize = Math.floor(Math.random() * 51 + 49) * 0.1;
                    break;
                case "jpg":
                    fileSize = Math.floor(Math.random() * 61 + 69) * 0.1;
                    break;
                case "webp":
                    fileSize = Math.floor(Math.random() * 41 + 39) * 0.1;
            }
            source = `${SOURCE_IMG[Math.floor(Math.random() * SOURCE_IMG.length)]}/${randomizeURL()}`;
            createMetadataEntry("File Size", fileSize.toFixed(1) + " MB");
            createMetadataEntry("Dimensions", imageDimensions);
            createMetadataEntry("Keywords", generateKeywords(ministry));
            break;
        case "an audio file":
            fileType = "audio";
            generateFileName(ministry);
            let audioLengthMin = Math.floor(Math.random() * 5 + 1);
            let audioLengthSec = Math.floor(Math.random() * 49 + 10);
            switch (fileExt) {
                case "mp3":
                case "ogg":
                case "m4a":
                    fileSize = Math.floor(Math.random() * 51 + 49) * 0.1;
                    break;
                case "flac":
                case "wav":
                    fileSize = Math.floor(Math.random() * 401 + 129) * 0.1;
            }
            source = `${SOURCE_AUD[Math.floor(Math.random() * SOURCE_AUD.length)]}/${randomizeURL()}`;
            createMetadataEntry("File Size", fileSize.toFixed(1) + " MB");
            createMetadataEntry("Length", `${audioLengthMin}:${audioLengthSec}`);
            createMetadataEntry("Keywords", generateKeywords("AUDIO"));
            break;
        case "a document":
            fileType = "document";
            generateFileName(ministry);
            fileSize = Math.floor(Math.random() * 106 + 22) * 0.1;
            source = `Ministry of ${convertToMinistryLong(ministry)}`;
            copyrightStatus = "Copyrighted";
            usageRights = "All rights reserved.";
            createMetadataEntry("File Size", fileSize.toFixed(1) + " KB");
            createMetadataEntry("Keywords", generateKeywords("DOCUMENT"));
    }
    createMetadataEntry("Source", source);
    createMetadataEntry("Copyright Status", copyrightStatus);
    createMetadataEntry("Usage Rights", usageRights);
    createMetadataEntry("Asset Expiry Date", assetExpiryDate);
    if (protocolViolated === true) {
        createViolation();
    }
}
function generateFileName(ministry) {
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
                let LA = ["Office", "OfficeHeadquarters", "Offices", "Business", "Businesses", "Factory", "Factories", "Manufacturer", "ConvenienceStore", "RetailStore", "Supermarket", "Laboratory"];
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
    fileName = fileName + "." + generateFileExtension();
    $("#metadata-container h2").text(fileName);
}
//Writes the metadata into a table
function createMetadataEntry(field, entry) {
    let id = field.replaceAll(" ", "-").toLowerCase();
    $("#metadata").append(`
    <tr>
        <th>${field}</th>
        <td id="${id}">${entry}</td>
    </tr>`);
}
//I should probably combine the next 2 functions together eventually
function generateDate(startingYear, plusMax) {
    let year = Math.floor(Math.random() * plusMax + startingYear);
    let month = MONTH[Math.floor(Math.random() * MONTH.length)];
    //Might code in a way to check if a month could have 31 days, but it's not important right now
    let day = Math.floor(Math.random() * 27 + 1);
    return addLeadingZero(year, month, day);
}
function generateDateLong(startingYear, plusMax) {
    let year = Math.floor(Math.random() * plusMax + startingYear);
    let month = MONTH[Math.floor(Math.random() * MONTH.length)];
    let day = Math.floor(Math.random() * 27 + 1);
    return `${month}. ${day}, ${year}`;
}
function generateKeywords(ministry) {
    let keywords = "";
    let currentKeyword = "";
    let arrayPosition = 0;
    //Stores the array constant into a variable so that we can remove keywords within the array
    let tempKeywordBank = eval(ministry + "_KEYWORDS").slice();
    //Generates the minimum amount of keywords
    for (let i = 0; i < keywordMinimum; i++) {
        arrayPosition = Math.floor(Math.random() * tempKeywordBank.length);
        currentKeyword = tempKeywordBank[arrayPosition];
        keywords = keywords + currentKeyword + ", ";
        tempKeywordBank.splice(arrayPosition, 1);
    }
    //Optionally generates an additional keyword
    let x = Math.random() < 0.5;
    switch (x) {
        case false:
            break;
        case true:
            keywords = keywords + tempKeywordBank[Math.floor(Math.random() * tempKeywordBank.length)] + ", ";
    }
    //Remove the last 2 characters (, ) of the keywords string
    return keywords.substring(0, keywords.length - 2);
}
function randomizeURL() {
    let urlEnding = "";
    for (let i = 0; i < 6; i++) {
        urlEnding = urlEnding + ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
    }
    return urlEnding;
}
//I think I made this function so that the month could actually be compared as a number (sometimes the month is a string)
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
function generateFileExtension() {
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
function coinFlip(chance) {
    return Math.random() < chance;
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
            $("#notifications-container div").prepend(`<p class="notif-regular">Your position as a digital asset administrator is to filter out any incoming assets that do not adhere to government protocol.<br><br>All files uploaded to the digital asset management (DAM) system must follow a strict naming convention. Be sure to look over the file name carefully.<br><br>View the rulebook at the bottom for more details. When you're ready, you may begin accepting incoming connections.</p>`);
            break;
        case 2:
            $("#notifications-container div").prepend(`<p class="notif-regular">We have been getting reports of employees accidentally uploading the wrong files to our DAM system. From now on, check the transcript and make sure that the file name extension matches the user's response.</p>`);
            violationList.push("file name extension");
            break;
        case 3:
            $("#notifications-container div").prepend(`<p class="notif-regular">We have identified some discrepancies in the metadata within some of our files. All metadata fields must be filled out. Be sure to look over the dates. The published date should not exceed today's date, and the expiry date should not be in the past. Your rulebook has been updated.</p>`);
            violationList.push("missing metadata entry");
            violationList.push("invalid published date");
            violationList.push("invalid expiry date");
            break;
        case 4:
            $("#notifications-container div").prepend(`<p class="notif-regular">We have been getting some complaints from employees who are saying that the assets don't have enough keywords to be easily searchable. From now on, all assets must have at least 5 keywords.</p>`);
            violationList.push("insufficient keywording");
            break;
    }
}
function changeDate() {
    if (day < 10) {
        $("#date").text("M10/D0" + day + "/2087");
    }
    else {
        $("#date").text("M10/D" + day + "/2087");
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
