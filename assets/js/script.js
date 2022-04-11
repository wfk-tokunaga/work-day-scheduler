// schedule object keeps track of all events in the time table
var schedule = {};

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

var loadSchedule = function() {
    // Check local storage to see if schedule has been saved yet
    schedule = JSON.parse(localStorage.getItem("schedule"));
    if (!schedule) {
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
    }

    // If the schedule does exist already, load it into the table
    $(".time-table .time-table-row").each(function(index, rowEl) {
        // console.log("Setting time table")
        var time = $(rowEl).attr("data-time").replace(":00", "");
        // 
        $(rowEl).find(".task-p").text(schedule[time]);
    });
}

var saveSchedule = function() {
    localStorage.setItem("schedule", JSON.stringify(schedule));
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

var initializeSchedule = function() {
    // Update header date
    $(".dateHeader").text(moment().format("dddd, MMMM Do YYYY"));
    loadSchedule();
    $(".time-table .time-table-row").each(function(index, el) {
        auditSchedule(el);
    });
};

// Turn an event-section into an input field
$(".time-table").on("click", ".event-section", function() {
    // Get old value
    var task = $(this).find("p").text().trim();
    var textInput = $("<textarea>").addClass("form-control").val(task);
    textInput.attr("rows", 1);
    // Change <p> to be a text input already filled in with the old value
    $(this).find(".task-p").replaceWith(textInput);
    textInput.trigger("focus");
});


// When done with entering text, change it back into the span element or whatever
$(".time-table").on("blur", "textarea", function() {

    // Get old value
    var task = $(this).val();
    // Make a new <p> element.
    var taskP = $("<p>").addClass("task-p").text(task);
    var taskTime = $(this)
        .closest(".time-table-row")
        .attr("data-time")
        .trim()
        .replace(":00", "");
    // 
    // 

    schedule[taskTime] = task;
    // 

    $(this).replaceWith(taskP);
    taskP.trigger("focus");
    // This call seems to be what fucks up the schedule
    saveSchedule();

});

setInterval(function() {
    $(".dateHeader")
        .text(moment()
            .format("dddd, MMMM Do YYYY"));
}, ((1000 * 60) * 60 * 24));

setInterval(function() {
    $(".time-table .time-table-row").each(function(index, el) {
        auditSchedule(el);
    });
}, (1000 * 60));

initializeSchedule();