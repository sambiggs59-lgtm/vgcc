function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnavmobile") {
    x.className += " responsive";
  } else {
    x.className = "topnavmobile";
  }
}
