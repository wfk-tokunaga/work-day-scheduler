/* 
schedule object keeps track of all events in the time table

*/
var schedule = {};

var loadSchedule = function() {
    console.log("ON LOAD START");

    // Check local storage to see if schedule has been saved yet
    schedule = JSON.parse(localStorage.getItem("schedule"));
    if (!schedule) {
        console.log("Setting up a new schedule");
        // If not, initialize schedule
        schedule = {
            "9": "",
            "10": "",
            "11": "",
            "12": "",
            "13": "",
            "14": "",
            "15": "",
            "16": "",
            "17": "",
        };
    } else {
        console.log("Schedule already exists: ", schedule)
    }

    // If the schedule does exist already, load it into the table

    $(".time-table .time-table-row").each(function(index, rowEl) {
        // console.log("Setting time table")
        var time = $(rowEl).attr("data-time").replace(":00", "");
        // console.log(schedule[time]);
        $(rowEl).find(".task-p").text(schedule[time]);
    });
    console.log(schedule);
    console.log("ON LOAD END");
}

loadSchedule();

var saveSchedule = function() {
    console.log("SAVE SCHEDULE START");
    console.log(schedule);
    localStorage.setItem("schedule", JSON.stringify(schedule));
    console.log(schedule);
    console.log("SAVE SCHEDULE END");
}

// Add handler to check current time and adjust accordingly
var auditSchedule = function(timeTableRowEl) {
    var taskTime = timeTableRowEl.getAttribute("data-time");
    var taskMoment = moment(taskTime, "hh:mm");
    var currentMoment = moment();
    if (currentMoment.isBefore(taskMoment)) {
        $(timeTableRowEl.children[1]).addClass("bg-success");
    } else if (currentMoment.diff(taskMoment, "hours") < 1) {
        $(timeTableRowEl).find(".event-section").addClass("bg-danger");
    } else {
        $(timeTableRowEl.children[1]).addClass("bg-secondary");
    }
}

// Turn an event-section into an input field
// For some reason, the schedule is being cleared whenever I reload it
$(".time-table").on("click", ".event-section", function() {
    console.log("CLICK START");
    // Right here, it's clearing the schedule which is weird
    console.log(schedule);
    // Get old value
    var task = $(this).find("p").text().trim();
    var textInput = $("<textarea>").addClass("form-control").val(task);
    // Change <p> to be a text input already filled in with the old value
    $(this).find(".task-p").replaceWith(textInput);
    textInput.trigger("focus");
    console.log("CLICK END");
});


// When done with entering text, change it back into the span element or whatever
$(".time-table").on("blur", "textarea", function() {
    console.log("BLUR START");
    // Get old value
    var task = $(this).val();
    // Make a new <p> element.
    var taskP = $("<p>").addClass("task-p").text(task);
    var taskTime = $(this)
        .closest(".time-table-row")
        .attr("data-time")
        .trim()
        .replace(":00", "");
    // console.log("taskTime: ", taskTime);
    // console.log("BEFORE ADDING THING: ", schedule);
    console.log("schedule[taskTime]: ", schedule[taskTime]);
    schedule[taskTime] = task;
    // console.log("schedule[taskTime] AFTER ADD: ", schedule[taskTime]);

    $(this).replaceWith(taskP);
    taskP.trigger("focus");
    // This call seems to be what fucks up the schedule
    saveSchedule();
    console.log("BLUR END");
});

// Update header date
$(".dateHeader").text(moment().format("dddd, MMMM Do YYYY"));

setInterval(function() {
    $(".dateHeader")
        .text(moment()
            .format("dddd, MMMM Do YYYY"));
}, ((1000 * 60) * 60 * 24));

$(".time-table .time-table-row").each(function(index, el) {
    auditSchedule(el);
});

setInterval(function() {
    $(".time-table .time-table-row").each(function(index, el) {
        auditSchedule(el);
    });
}, (1000 * 60));