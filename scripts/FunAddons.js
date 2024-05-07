//begroeting
var hour = new Date().getHours();
var greeting;
if (hour >= 0 && hour < 12) {
    greeting = "Goedemorgen!";
} else if (hour >= 12 && hour < 18) {
    greeting = "Goede namiddag!";
} else {
    greeting = "Goedeavond!";
}
document.getElementById("greeting").textContent = greeting;

//cursor aanpassing
document.addEventListener("DOMContentLoaded", function() {
    var cursor = document.querySelector('.cursor');

    //cursor tonen
    document.addEventListener("mousemove", function(event) {
        cursor.style.visibility = 'visible';
        cursor.style.left = event.clientX + 'px';
        cursor.style.top = event.clientY + 'px';
    });

    // cursor weg
    document.addEventListener("mouseleave", function() {
        cursor.style.visibility = 'hidden';
    });
});