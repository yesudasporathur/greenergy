$(document).ready(function() {
    function validateCode() {
        const code = $("#code").val().trim();
        if (code === '') {
            $("#codeError").text("Please enter coupon code.");
            return false;
        }  
        else {
            $("#codeError").text("");
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

    

    function validateMaxAmount() {
        const maxAmount = $("#maxAmount").val().trim();
        if (maxAmount === '') {
            $("#maxAmountError").text("Please enter the amount.");
            return false;
        } else if (!/^\d+$/.test(maxAmount)) {
            $("#maxAmountError").text("Please enter only numbers for the amount.");
            return false;
        }else {
            $("#maxAmountError").text("");
            return true;
        }
    }

    function validateDiscount() {
        const discount = parseInt($("#discount").val().trim());
        const maxAmount = parseInt($("#maxAmount").val().trim());
    
        if (discount === '') {
            $("#discountError").text("Please enter the amount.");
            return false;
        } else if (!/^\d+$/.test(discount)) {
            $("#discountError").text("Please enter only numbers for the amount.");
            return false;
        } else if (discount > maxAmount) {
            $("#discountError").text("Discount cannot be greater than the max amount.");
            return false;
        } else {
            $("#discountError").text("");
            return true;
        }
    }
    

   

    function validateMinAmount() {
        const minAmount = $("#minAmount").val().trim();
        const maxAmount = $("#maxAmount").val().trim();
    
        if (minAmount === '') {
            $("#minAmountError").text("Please enter the amount.");
            return false;
        } else if (!/^\d+$/.test(minAmount)) {
            $("#minAmountError").text("Please enter only numbers for the amount.");
            return false;
        } else if (parseInt(minAmount) <= 0) {
            $("#minAmountError").text("Please enter an amount greater than zero.");
            return false;
        } else if (maxAmount === '') {
            $("#minAmountError").text("Please enter the maximum amount.");
            return false;
        } else if (!/^\d+$/.test(maxAmount)) {
            $("#minAmountError").text("Please enter only numbers for the maximum amount.");
            return false;
        } else if (parseInt(minAmount) > parseInt(maxAmount)) {
            $("#minAmountError").text("Minimum amount cannot be greater than maximum amount.");
            return false;
        } else {
            $("#minAmountError").text("");
            return true;
        }
    }
    

    function validateDate() {
        var dateRec = $('#expiryDate').val();
            var isValidDate = /^\d{2}-\d{2}-\d{4}$/.test(dateRec);
            
            function convertDateToTimestamp(dateString) {
                const [day, month, year] = dateString.split('-').map(Number);
            
                const dateObject = new Date(year, month - 1, day);
            
                const timestamp = dateObject.getTime();
            
                return timestamp;
            }
    
            const expiryDate = dateRec; 
            const timestamp = convertDateToTimestamp(expiryDate);

            if (!isValidDate) {
                $('#dateError').text('Please enter a valid date in the format YYYY-MM-DD.');
                return false;
            } else if (isValidDate && timestamp<Date.now()) {
                $('#dateError').text('Please enter an upcoming date');
                return false;
            }
            else{
                $('#dateError').text('');
                return true
            }
    }

    $("#form").submit(function(event) {
        event.preventDefault();

        const isValidCode = validateCode()
        const isValidDescription = validateDescription();
        const isValidMaxAmount= validateMaxAmount();
        const isValidDiscount = validateDiscount()
        const isValidMinAmount = validateMinAmount();
        const isValidDate = validateDate();

        if (isValidCode && isValidMaxAmount && isValidDescription && isValidDiscount && isValidMinAmount && isValidDate) {
            this.submit();
        }
    });
});