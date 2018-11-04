var config = {
    apiKey: "AIzaSyAVHaEYvFo270i7DNWTDmtjj3V2lPWD_yQ",
    authDomain: "train-scheduler-47b86.firebaseapp.com",
    databaseURL: "https://train-scheduler-47b86.firebaseio.com",
    projectId: "train-scheduler-47b86",
    storageBucket: "train-scheduler-47b86.appspot.com",
    messagingSenderId: "628426124799"
  };
//initialize firebase
firebase.initializeApp(config);

var database = firebase.database();

$("#add-train").on("click", function (event) {
    event.preventDefault();

    //STORE user input in variables
    var name = $("#input-name").val().trim();
    var destination = $("#input-destination").val().trim();
    var firstTime = $("#input-time").val().trim();
    var frequency = $("#input-frequency").val().trim();

    //Moment formulas
    var firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
    var tRemainder = timeDiff % frequency;
    var minAway = frequency - tRemainder;
    var nextTrain = moment().add(minAway, "minutes").format("HH:mm");

    //SAVE user input and calculations in an object
    var newTrain = {
        train: name,
        trainDestination: destination,
        trainStart: firstTime,
        trainFrequency: frequency,
        trainAway: minAway,
        trainNext: nextTrain
    }
    //PUSH object to firebase
    database.ref().push(newTrain);

    //CLEAR input fields
    $("#input-name").val("");
    $("#input-destination").val("");
    $("#input-time").val("");
    $("#input-frequency").val("");

})

database.ref().on("child_added", function(childSnapshot) {
    console.log(childSnapshot.val());
    //DISPLAY results on page
    var newRow = $("<tr>");
    
    var name = childSnapshot.val().train
    var destination = childSnapshot.val().trainDestination;
    var frequency = childSnapshot.val().trainFrequency;
    var nextTrain = childSnapshot.val().trainNext;
    var minAway = childSnapshot.val().trainAway;

    newRow.append("<td>" + name + "</td>");
    newRow.append("<td>" + destination + "</td>");
    newRow.append("<td>" + frequency + "</td>");
    newRow.append("<td>" + nextTrain+ "</td>");
    newRow.append("<td>" + minAway + "</td>");

    $(".table tbody").prepend(newRow);
 
  });
  