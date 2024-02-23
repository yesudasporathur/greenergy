$(document).ready(function() {
    // Function to validate brand name
    function validateName() {
        const name = $("#name").val().trim();
        if (!/^[a-zA-Z]+$/.test(name)) {
            $("#nameError").text("Name should only contain alphabetic characters.");
            return false;
        } else {
            $("#nameError").text("");
            return true;
        }
    }

    function validateImages() {
        const files = $("#image").prop('files');
        const imgUpdateChecked = $("input[name='imgUpdate']").is(":checked");

        if (!imgUpdateChecked) {
            // If the checkbox is not checked, return true (no need for image uploads)
            $("#imagesError").text("");
            return true;
        }
        if (files.length === 0) {
            $("#imagesError").text("Please upload at least one image.");
            return false;
        } 
        else if (files.length >10) {
            $("#imagesError").text("Please upload at most ten images.");
            return false;
        }
        else {
            $("#imagesError").text("");
            return true;
        }
    }

    // Form submission handler
    $("#form").submit(function(event) {
        // Prevent default form submission
        event.preventDefault();

        // Validate brand name
        const isvalidateName = validateName();
        const isValidImages = validateImages();


        // If all fields are valid, submit the form
        if (isvalidateName && isValidImages) {
            this.submit();
        }
    });
});