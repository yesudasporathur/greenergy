document.addEventListener("DOMContentLoaded", function () {
    // Initialize Flatpickr
    const calendarBtn = document.getElementById("calendarBtn");
    const expiryDateInput = document.getElementById("expiryDate");

    const datePicker = flatpickr(expiryDateInput, {
        dateFormat: "d-m-Y",
        onClose: function (selectedDates, dateStr, instance) {
            // Validate the selected date if needed
        }
    });

    // Open the calendar when the button is clicked
    calendarBtn.addEventListener("click", function () {
        datePicker.open();
    });
});