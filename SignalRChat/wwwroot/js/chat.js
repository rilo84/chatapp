"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;

connection.on("ReceiveMessage", function (user, message,location) {
    var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    var li = document.createElement("li");
   
    var encodedMsg =  user + " says " + msg + " | Sent from " + location;
    li.textContent = encodedMsg;

    document.getElementById("messagesList").appendChild(li);
});


connection.start().then(function () {
    document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
    return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", async function (event) {
    var user = document.getElementById("userInput").value;
    var message = document.getElementById("messageInput").value;
    var location = await getLocation();

    connection.invoke("SendMessage", user, message,location).catch(function (err) {
        return console.error(err.toString());
    });
    event.preventDefault();
});

async function getLocation() {
    if (navigator.geolocation) {

        async function getCoordinates() {
            return new Promise(function (resolve, reject) {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
        }

        const position = await Promise.resolve(getCoordinates());
        console.log(position);
        let loc = "Lat: " + position.coords.latitude + " Lon: " + position.coords.longitude;
        console.log(loc);
        return loc;
    } else {
        return "Geolocation is not supported by this browser.";
    }
}