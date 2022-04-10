// Add activity
// Click on the time area, change it to a text input field 

// Turn an event-section into an input field
$(".timeTable").on("click", ".event-section", function () {
    // Get old value
    var task = $(this).text();
    var textInput = $("<textarea>").addClass("form-control").val(task);
    $(this).replaceWith(textInput);
    textInput.trigger("focus");
    console.log(text);
});

