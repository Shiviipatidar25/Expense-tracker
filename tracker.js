// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', () => {
    
    // Select DOM elements
    const expenseForm = document.getElementById("expense-form"); // Form where expenses are added
    const expenseNameInput = document.getElementById("expense-name"); // Input field for expense name
    const expenseAmountInput = document.getElementById("expense-amount"); // Input field for expense amount
    const expenseList = document.getElementById("expense-list"); // The list where expenses will be shown
    const totalAmountDisplay = document.getElementById("total-amount"); // Element to display the total amount of all expenses

    // Initialize expenses array from localStorage, if it exists, or an empty array if none
    let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

    // Calculate the total amount of all expenses initially
    let totalAmount = calculateTotal();

    // Event listener for when the form is submitted
    expenseForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent form from reloading the page on submit

        // Get values from input fields and trim any unnecessary spaces
        const name = expenseNameInput.value.trim();
        const amount = parseFloat(expenseAmountInput.value.trim()); // Convert the string input to a number

        // Check if the name is not empty, amount is a valid number and greater than 0
        if (name !== "" && !isNaN(amount) && amount > 0) {
            // Create a new expense object with the current timestamp as the unique ID
            const newExpense = {
                id: Date.now(),
                name: name,
                amount: amount
            };

            // Add the new expense to the expenses array
            expenses.push(newExpense);

            // Save the updated expenses array to localStorage
            saveExpensesTolocal();

            // Re-render the expenses list on the page
            renderExpenses();

            // Update the total amount displayed on the page
            updateTotal();

            // Clear input fields after adding the expense
            expenseNameInput.value = "";
            expenseAmountInput.value = "";
        }
    });

    // Function to render all expenses to the page
    function renderExpenses() {
        // Clear the existing list before re-rendering
        expenseList.innerHTML = "";

        // Loop through all expenses and create a list item for each
        expenses.forEach((expense) => {
            const li = document.createElement('li'); // Create a new list item
            // Set the content of the list item with the expense name, amount, and a delete button
            li.innerHTML = `${expense.name} - $${expense.amount}<button data-id="${expense.id}">Delete</button>`;
            // Append the list item to the expense list
            expenseList.appendChild(li);
        });
    }

    // Function to calculate the total amount of all expenses
    function calculateTotal() {
        return expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }

    // Function to save expenses array to localStorage
    function saveExpensesTolocal() {
        localStorage.setItem("expenses", JSON.stringify(expenses));
    }

    // Function to update and display the total amount of all expenses
    function updateTotal() {
        totalAmount = calculateTotal(); // Recalculate total
        totalAmountDisplay.textContent = totalAmount.toFixed(2); // Display the total, formatted to 2 decimal places
    }

    // Event listener to handle delete button clicks
    expenseList.addEventListener('click', (e) => {
        // If the target is a delete button, remove the corresponding expense
        if (e.target.tagName === 'BUTTON') {
            // Get the ID of the expense to delete from the button's data-id attribute
            const expenseId = parseInt(e.target.getAttribute('data-id'));

            // Filter out the expense with the matching ID from the expenses array
            expenses = expenses.filter((expense) => expense.id !== expenseId);

            // Save the updated expenses array to localStorage
            saveExpensesTolocal();

            // Re-render the expenses list on the page
            renderExpenses();

            // Update the total amount displayed
            updateTotal();
        }
    });

});
