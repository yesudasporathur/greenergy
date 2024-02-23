$(document).ready(function() {
        // Function to validate product name
        function validateName() {
            const name = $("#name").val().trim();
            if (name === '') {
                $("#nameError").text("Please enter the product name.");
                return false;
            } else {
                $("#nameError").text("");
                return true;
            }
        }

        // Function to validate description
        function validateDescription() {
            const description = $("#description").val().trim();
            if (description === '') {
                $("#descriptionError").text("Please enter the description.");
                return false;
            } else {
                $("#descriptionError").text("");
                return true;
            }
        }

        // Function to validate brand
        function validateBrand() {
            const brand = $("#brand").val().trim();
            if (brand === '') {
                $("#brandError").text("Please select a brand.");
                return false;
            } else {
                $("#brandError").text("");
                return true;
            }
        }


        // Function to validate MRP
        function validateMRP() {
            const mrp = $("#mrp").val().trim();
            if (mrp === '') {
                $("#mrpError").text("Please enter the MRP.");
                return false;
            } else {
                $("#mrpError").text("");
                return true;
            }
        }

        // Function to validate selling price
        function validateSP() {
            const sp = $("#sp").val().trim();
            if (sp === '') {
                $("#spError").text("Please enter the selling price.");
                return false;
            } else {
                $("#spError").text("");
                return true;
            }
        }

        // Function to validate category
        function validateCategory() {
            const category = $("#category").val().trim();
            if (category === '') {
                $("#categoryError").text("Please select a category.");
                return false;
            } else {
                $("#categoryError").text("");
                return true;
            }
        }

        // Function to validate image uploads
        function validateImages() {
            const files = $("#images").prop('files');
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

        // Event listener for form submission
        $("#form").submit(function(event) {
            // Prevent default form submission
            event.preventDefault();

            // Validate each field
            const isValidName = validateName();
            const isValidDescription = validateDescription();
            const isValidBrand = validateBrand();
            const isValidMRP = validateMRP();
            const isValidSP = validateSP();
            const isValidCategory = validateCategory();
            const isValidImages = validateImages();

            // If all fields are valid, submit the form
            if (isValidName && isValidDescription && isValidBrand && isValidMRP && isValidSP && isValidCategory && isValidImages) {
                this.submit();
            }
        });
    });