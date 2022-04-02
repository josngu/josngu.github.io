// JavaScript Document
function showMenu(){
    var element = document.getElementById("menu-bar-mobile");
    
    if (element.classList.contains("menu-slide-in") != true){
      element.classList.remove("menu-slide-out");
      element.classList.add("menu-slide-in");
      document.getElementById("hamburger-menu").src = "images/close-button.svg";
    } else {
      element.classList.remove("menu-slide-in");
      element.classList.add("menu-slide-out");
      document.getElementById("hamburger-menu").src = "images/hamburger-menu.svg";
    }
}

function finalizeStew(){
  //var dialogBox = document.getElementById("stew-fusion-dialog-box");
  var adjectives = ["Shuman","Magnificent","Supreme","Spectacular","Stupendous","Sanguine","Succulent","Stunning","Striking","Suspicious","Demonic","Mystical","Trustworthy","Mysterious","Nefarious","2nd","Odd","Ancient","Evil","Peculiar","Prosperous","Rancid","Garbage","Gratuitous","Omnibenevolent","Abysmal","Beautiful","Handsome","Horrifying","Attractive","Illustrious","Illuminating","Sentient","Shimmering","Sickly","Sinister","Strange","Spooky","Stylish","Supernatural","Surreal","Delightful","Stinky","Deceptive","Crunchy"];

//These 4 variables will be unused for now
  var hunger = 0;
  var thirst = -40;
  var boredom = -4;
  var unhappiness = -4;
    
  var calories = 0;
  var carbohydrates = 0;
  var proteins = 0;
  var fat = 0;

  //The list must be in order as shown in the table
  var meatList = ["bacon","baconBits","beefJerky","chicken","fishFillet","frogMeat","meatPatty","mincedMeat","muttonChop","porkChop","rabbitMeat","salmon","steak"];
  var vegetableList = ["avocado","broccoli","cabbage","carrots","corn","eggplant","jalapeno","leek","onion","peas","potato","radish","tofu","tomato","zucchini"];
  var otherList = ["bread","cannedSpaghettiBolognese","cannedCarrots","cannedChili","cannedCorn","cannedCornedBeef","cannedPeas","cannedPotato","cannedSardines","cannedTomato","cannedTuna"];
  var ingredients = [];

/*
NOTE: IF I EVER WANT TO ADD THIS FEATURE
Base thirst value is -40 and the final value is divided by 2 once cooked
Each ingredient reduces unhappiness by 5
Base unhappiness and boredom levels at -4 with salt and pepper
*/

    
/*Scan the table. For each row, scan each column. Turn the data value into a floating point number. This method isn't accurate but I don't know what to do.*/
  var table = document.getElementById("stew-fusion-table");
    
for (let i = 0; i < meatList.length; i++){
    if (document.getElementById(meatList[i]).checked == true) {
      let row = table.rows[i+2];

      calories += parseFloat(row.cells[1].innerText);
      carbohydrates += parseFloat(row.cells[2].innerText);
      proteins += parseFloat(row.cells[3].innerText);
      fat += parseFloat(row.cells[4].innerText);
      //Add the ingredient to the array, so that a description can be made at the end
      ingredients.push(document.getElementById(meatList[i]).value);
    }
}
for (let i = 0; i < vegetableList.length; i++){
    if (document.getElementById(vegetableList[i]).checked == true) {
      let row = table.rows[i+16];
      
      calories += parseFloat(row.cells[1].innerText);
      carbohydrates += parseFloat(row.cells[2].innerText);
      proteins += parseFloat(row.cells[3].innerText);
      fat += parseFloat(row.cells[4].innerText);

      ingredients.push(document.getElementById(vegetableList[i]).value);
    }
}
for (let i = 0; i < otherList.length; i++){
    if (document.getElementById(otherList[i]).checked == true) {
      let row = table.rows[i+32];

      calories += parseFloat(row.cells[1].innerText);
      carbohydrates += parseFloat(row.cells[2].innerText);
      proteins += parseFloat(row.cells[3].innerText);
      fat += parseFloat(row.cells[4].innerText);

      ingredients.push(document.getElementById(otherList[i]).value);
    }
}
  //Check array length. If it's too long or short, stop the function.
  if (ingredients.length != 6) {
      
      return;
  }
  //Show dialog box
  document.getElementById("stew-fusion-dialog-box").style.display = "flex";
  document.getElementById("backdrop").style.display = "block";
    
  document.getElementById("stew-fusion-image").style.animation = "stew-fusion-image 1s";
  document.getElementById("stew-fusion-dialog-box").style.animation = "dialog-box 1s";
  document.getElementById("backdrop").style.animation = "backdrop 0.5s";
  
  //Randomly generate the stew name
  document.getElementById("stew-title").innerHTML = "The " + adjectives[Math.floor(Math.random()*adjectives.length)] + " Stew";

  //Automatically generate the stew description
  document.getElementById("stew-description").innerHTML = "A delicious stew with " + ingredients[0] + ", " + ingredients[1] + ", " + ingredients[2] + ", " + ingredients[3] + ", " + ingredients[4] + ", and " + ingredients[5] + ".";
  
  //Round the numbers (due to floating point imprecision), probably not a proper fix but this will work for now
  document.getElementById("calories").innerHTML = calories.toFixed(2);
  document.getElementById("carbohydrates").innerHTML = carbohydrates.toFixed(2);
  document.getElementById("proteins").innerHTML = proteins.toFixed(2);
  document.getElementById("fat").innerHTML = fat.toFixed(2);

/* MAY ADD THIS IN ONE DAY BUT IS NOT NEEDED FOR THE PROJECT
  document.getElementById("hunger").innerHTML = "Hunger: " + hunger;
  document.getElementById("thirst").innerHTML = "Thirst: " + thirst;
  document.getElementById("boredom").innerHTML = "Boredom: " + boredom;
  document.getElementById("unhappiness").innerHTML = "Unhappiness: " + unhappiness;
*/
}
function closeDialog(){
  document.getElementById("stew-fusion-dialog-box").style.display = "none";
  document.getElementById("backdrop").style.display = "none";
}