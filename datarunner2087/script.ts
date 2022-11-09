var day = 1;
var hour = 7;
var minute = 0;
var clockCycle = "AM";
var clockLength = 200;

//Ministry of education, energy, employment, security, transportation, health, finance, agriculture, immigration, infrastructure, defense, tourism, global affairs, public services
const MINISTRY = ["ED", "EN", "EM", "SE", "TR", "HE", "FI", "AG", "IM", "IN", "DE", "TO", "GL", "PU"];

const MONTH = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function clock(){
    if (minute >= 0 && minute <= 9){
        $("#time").text(`${hour}:0${minute} ${clockCycle}`);
        minute++;
        if (minute === 60){
            minute = 0;
            hour++;
        }
    } else {
        $("#time").text(`${hour}:${minute} ${clockCycle}`);
        minute++;
        if (minute === 60){
            minute = 0;
            hour++;
        }
    }
    if (hour === 13){
        hour = 1;
        clockCycle = "PM";
    }
    setTimeout("clock()", clockLength);
}