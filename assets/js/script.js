var schedule = {};

var saveSchedule = function() {
    localStorage.setItem("schedule", JSON.stringify(schedule));
}

var loadSchedule = function() {
    var schedule = JSON.parse(localStorage.getItem("schedule"));
    if (!schedule) {
        // Initiate schedule
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
        }
    }

    // If the schedule does exist already, load it into the table

    console.log($(".time-table .time-table-row"));
    $(".time-table .time-table-row").each(function(index, rowEl) {
        var time = $(rowEl).attr("data-time").replace(":00", "");
        $(rowEl).find(".event-section").text(schedule[time]);
    });
}


// Add handler to check current time and adjust accordingly
var auditSchedule = function(timeTableRowEl) {
    var taskTime = timeTableRowEl.getAttribute("data-time");
    var taskMoment = moment(taskTime,"hh:mm");
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
$(".time-table").on("click", ".event-section", function () {
    // Get old value
    var task = $(this).find("p").text();
    var textInput = $("<textarea>").addClass("form-control").val(task);
    // Change <p> to be a text input already filled in with the old value
    $(this).find("p").replaceWith(textInput);
    textInput.trigger("focus");
});


// When done with entering text, change it back into the span element or whatever
$(".time-table").on("blur", "textarea", function () {
    // Get old value
    // var taskTime = this.getAttribute("data-time");
    var task = $(this).val();
    var taskP = $("<p>").text(task);
    var taskTime = $(this)
        .closest(".time-table-row")
        .attr("data-time")
        .replace(":00", "");
    schedule[taskTime] = task; 
    saveSchedule();

    $(this).replaceWith(taskP);
    taskP.trigger("focus");
});

loadSchedule();

$(".time-table .time-table-row").each(function (index, el) {
    auditSchedule(el);
});

// Update header date
$(".dateHeader").text(moment().format("dddd, MMMM Do YYYY"));
setInterval(function () {
    $(".dateHeader")
    .text(moment()
    .format("dddd, MMMM Do YYYY"));
  }, 
  ((1000 * 60) * 60 * 24));

setInterval(function () {
$(".time-table .time-table-row").each(function (index, el) {
    auditSchedule(el);
});
}, (1000 * 60) * 2);