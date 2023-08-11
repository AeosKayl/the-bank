// Define the URL of your backend API
const API_URL = "/api/accounts";

// Get the elements from the HTML document
const createAccountForm = document.getElementById("create-account-form");
const accountsList = document.getElementById("accounts-list");
const accountDetails = document.getElementById("account-details");
// Define a function to fetch all the accounts from the backend and display them in the accounts list

const FORM_MODES = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
};
async function fetchAndDisplayAccounts() {
  try {
    // Try to fetch the accounts from the backend using the fetch API
    const response = await fetch(API_URL);
    // If the response is ok, parse it as JSON and loop through the accounts array
    if (response.ok) {
      const accounts = await response.json();
      // Clear the accounts list before adding new elements
      accountsList.innerHTML = "";
      // Create a heading element for the accounts list
      const heading = document.createElement("h2");
      heading.textContent = "Accounts List";
      // Append the heading element to the accounts list
      accountsList.appendChild(heading);
      // Loop through each account object in the accounts array
      for (const account of accounts) {
        // Create a div element for each account
        const div = document.createElement("div");
        // Add some CSS classes to style the div element
        div.classList.add("account-card");
        // Create a paragraph element for the account name
        const name = document.createElement("p");
        name.textContent = `Name: ${account.name}`;
        // Create a paragraph element for the account balance
        const balance = document.createElement("p");
        balance.textContent = `Balance: ${account.balance}`;
        // Append the name and balance elements to the div element
        div.appendChild(name);
        div.appendChild(balance);
        // Add an event listener to the div element that will display the account details when clicked on
        div.addEventListener("click", () => {
          displayAccountDetails(account);
        });
        // Append the div element to the accounts list
        accountsList.appendChild(div);
      }
    } else {
      // If the response is not ok, throw an error with the status text
      throw new Error(response.statusText);
    }
  } catch (error) {
    // If an error occurs, display it in an alert box
    alert(`Error fetching accounts: ${error}`);
  }
}
// Define a function to display a single account details in the account details div
function displayAccountDetails(account) {
  // Clear the account details div before adding new elements
  accountDetails.innerHTML = "";
  // Create a heading element for the account details div
  const heading = document.createElement("h2");
  heading.textContent = "Account Details";
  // Append the heading element to the account details div
  accountDetails.appendChild(heading);
  // Create a paragraph element for the account name
  const name = document.createElement("p");
  name.textContent = `Name: ${account.name}`;
  // Create a paragraph element for the account balance
  const balance = document.createElement("p");
  balance.textContent = `Balance: ${account.balance}`;
  // Append the name and balance elements to the account details div
  accountDetails.appendChild(name);
  accountDetails.appendChild(balance);
}
// Define a function to create a new account using the form data and send it to the backend
async function createAccount(event) {
  // Prevent the default behavior of the form submission
  event.preventDefault();
  try {
    // Try to get the form data using the FormData API
    const formData = new FormData(createAccountForm);
    // Convert the form data to a JSON object
    const account = Object.fromEntries(formData.entries());
    // Send the account object to the backend using the fetch API with a POST method and a JSON body
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
    // If the response is ok, parse it as JSON and display a success message
    if (response.ok) {
      const result = await response.json();
      alert(`Account created successfully: ${result.account.name}`);
      // Clear the form fields after creating the account
      createAccountForm.reset();
      // Fetch and display the updated accounts list
      fetchAndDisplayAccounts();
    } else {
      // If the response is not ok, throw an error with the status text
      throw new Error(response.statusText);
    }
  } catch (error) {
    // If an error occurs, display it in an alert box
    alert(`Error creating account: ${error}`);
  }
}

// Add an event listener to the create account form that will call the createAccount function when submitted
createAccountForm.addEventListener("submit", createAccount);

// Call the fetchAndDisplayAccounts function when the web page loads
fetchAndDisplayAccounts();
