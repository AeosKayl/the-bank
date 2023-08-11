// const API_ACCOUNTS = "/api/accounts";
// const API_ACC = "/api/account/";

// const createAccountForm = document.getElementById("create-account-form");
// const accountsList = document.getElementById("accounts-list");
// const accountDetails = document.getElementById("account-details");

// // Define a function to fetch all the accounts from the backend and display them in the accounts list

// const FORM_MODES = {
//   DEPOSIT: "deposit",
//   WITHDRAW: "withdraw",
// };

// let accounts = [];

// const accountTemplate = (account) =>
//   `
//   <div class="account-card" data-accid="${account._id}">
//     <p>Name: ${account.name}</p>
//     <p>Balance: ${account.balance}</p>
//   </div>
//   `;

// const accountDetailsTemplate = (account) => `
//   <div class="account-card" data-accid="${account._id}">
//     <p>Name: ${account.name}</p>
//     <p>Balance: ${account.balance}</p>
//     <p>Account ID: ${account._id}</p>
//     <form id="transaction-form" data-accid="${account._id}">
//       <input type="hidden" id="transaction-id" name="id">
//       <label for="transaction-type">Transaction Type:</label>
//       <select id="transaction-type" name="type" required>
//         <option value="" selected disabled>Select an option</option>
//         <option value="withdraw">Withdraw</option>
//         <option value="deposit">Deposit</option>
//       </select>
//       <label for="transaction-amount">Transaction Amount:</label>
//       <input type="number" id="transaction-amount" name="amount" required>
//       <button type="submit">Submit</button>
//     </form>
//     <button data-function="delete" data-accid="${account._id}">Delete Account</button>
//   </div>
//   `;

// // const addButtonListeners = () => {
// //   const accountCards = document.querySelectorAll(".account-card");
// //   accountCards.forEach((card, account) =>
// //     card.addEventListener("click", displayAccountdetails(account))
// //   );
// // };

// // const showAccounts = async () => {
// //   const res = await fetch("/api/accounts");
// //   accounts = await res.json();

// //   accountsList.innerHTML = accounts.map(accountTemplate).join("");
// //   addButtonListeners();
// // };

// // const displayAccountDetails = async (account) => {
// //   accountDetails.innerHTML = accountDetailsTemplate(account);
// // };
// const addCardListeners = () => {
//   const accountCards = document.querySelectorAll(".account-card");
//   accountCards.forEach((card) =>
//     card.addEventListener("click", () =>
//       displayAccountDetails(card.dataset.accid)
//     )
//   );
// };
// // Get the elements from the HTML document

// const handleTransaction = async (e) => {
//   e.preventDefault();
//   // const transactionForm = document.getElementById("transaction-form");
//   // const transactionType = document.getElementById("transaction-type");
//   // const transactionAmount = document.getElementById("transaction-amount");
//   const form = document.getElementById("transaction-form");
//   const transactionType = form.querySelector("#transaction-type").value;
//   const transactionAmount = parseInt(
//     form.querySelector("#transaction-amount").value
//   );
//   // const accountId = form.querySelector("#transaction-id").value;
//   console.log(transactionType, transactionAmount);
//   // console.log(accountId);
//   console.log(e.target.dataset.accid);

//   const apiRoute =
//     transactionType === FORM_MODES.DEPOSIT
//       ? `${API_ACC}${e.target.dataset.accid}/deposit`
//       : `${API_ACC}${e.target.dataset.accid}/withdraw`;

//   const response = await fetch(apiRoute, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify({
//       amount: transactionAmount,
//     }),
//   });
//   // If the response is ok, parse it as JSON and display a success message
//   if (response.ok) {
//     const result = await response.json();
//     alert(`Transaction successful: ${result.message}`);
//     // Clear the form fields after performing the transaction
//     // form.reset();
//     // Fetch and display the updated accounts list and details
//     showAccounts();
//     displayAccountDetails(e.target.dataset.accid);
//   } else {
//     // If the response is not ok, throw an error with the status text
//     throw new Error(response.statusText);
//   }
// };

// const deleteAccount = async (e) => {
//   console.log(e.target.dataset.accid);
//   await fetch(`${API_ACC}${e.target.dataset.accid}/delete`, {
//     method: "DELETE",
//   });

//   showAccounts();
// };

// const showAccounts = async () => {
//   const res = await fetch(API_ACCOUNTS); // Use API_ACCOUNTS instead of hardcoded path
//   accounts = await res.json();

//   accountsList.innerHTML = accounts.map(accountTemplate).join("");
//   addCardListeners();
// };

// const displayAccountDetails = (accountId) => {
//   // Clear previous account details
//   accountDetails.innerHTML = "";
//   const account = accounts.find((acc) => acc._id === accountId);

//   console.log("clicked");
//   if (account) {
//     accountDetails.innerHTML = accountDetailsTemplate(account);
//     const deleteButton = document.querySelector('[data-function="delete"]');
//     console.log(deleteButton);
//     deleteButton.addEventListener("click", deleteAccount);
//     const transactionForm = document.getElementById("transaction-form");
//     if (transactionForm) {
//       transactionForm.addEventListener("submit", handleTransaction);
//     }
//   }
// };

// // Define a function to create a new account using the form data and send it to the backend
// async function createAccount(event) {
//   // Prevent the default behavior of the form submission
//   event.preventDefault();
//   try {
//     // Try to get the form data using the FormData API
//     const formData = new FormData(createAccountForm);
//     // Convert the form data to a JSON object
//     const account = Object.fromEntries(formData.entries());
//     // Send the account object to the backend using the fetch API with a POST method and a JSON body
//     const response = await fetch(API_ACCOUNTS, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify(account),
//     });
//     // If the response is ok, parse it as JSON and display a success message
//     if (response.ok) {
//       const result = await response.json();
//       alert(`Account created successfully: ${result.account.name}`);
//       // Clear the form fields after creating the account
//       createAccountForm.reset();
//       // Fetch and display the updated accounts list
//       showAccounts();
//     } else {
//       // If the response is not ok, throw an error with the status text
//       throw new Error(response.statusText);
//     }
//   } catch (error) {
//     // If an error occurs, display it in an alert box
//     alert(`Error creating account: ${error}`);
//   }
// }

// // Add an event listener to the create account form that will call the createAccount function when submitted
// createAccountForm.addEventListener("submit", createAccount);

// showAccounts();

const API_ACCOUNTS = "/api/accounts";
const API_ACC = "/api/account/";

const createAccountForm = document.getElementById("create-account-form");
const accountsList = document.getElementById("accounts-list");
const accountDetails = document.getElementById("account-details");

const FORM_MODES = {
  DEPOSIT: "deposit",
  WITHDRAW: "withdraw",
};

let accounts = [];

const clearAccountDetails = () => {
  accountDetails.innerHTML = "";
};

const accountTemplate = (account) => `
  <div class="account-card list-item" data-accid="${account._id}">
    <p>Name: ${account.name}</p>
    <p>Balance: ${account.balance} SEK</p>
  </div>
`;

const accountDetailsTemplate = (account) => `
  <div class="account-card" data-accid="${account._id}">
    <p>Name: ${account.name}</p>
    <p>Balance: ${account.balance} SEK</p>
    <p>ID: ${account._id}</p>
    <form id="transaction-form" data-accid="${account._id}">
      <input type="hidden" id="transaction-id" name="id">
      <label for="transaction-type">Transaction Type:</label>
      <select id="transaction-type" name="type" required>
        <option value="" selected disabled>Select an option</option>
        <option value="withdraw">Withdraw</option>
        <option value="deposit">Deposit</option>
      </select>
      <label for="transaction-amount">Transaction Amount:</label>
      <input type="number" id="transaction-amount" name="amount" required>
      <button type="submit">Submit</button>
    </form>
    <button class="deleteBtn" data-function="delete" data-accid="${account._id}">Delete Account</button>
  </div>
`;

const addCardListeners = () => {
  const accountCards = document.querySelectorAll(".account-card");
  accountCards.forEach((card) =>
    card.addEventListener("click", () =>
      displayAccountDetails(card.dataset.accid)
    )
  );
};

// const handleTransaction = async (e) => {
//   e.preventDefault();
//   const form = e.target;
//   const transactionType = form.querySelector("#transaction-type").value;
//   const transactionAmount = parseInt(
//     form.querySelector("#transaction-amount").value
//   );
//   const accountId = form.dataset.accid;
//   const account = accounts.find((acc) => acc._id === accountId);

//   if (transactionType === FORM_MODES.DEPOSIT) {
//     account.balance += transactionAmount;
//   } else if (transactionType === FORM_MODES.WITHDRAW) {
//     account.balance -= transactionAmount;
//   }

//   // Update the displayed account details
//   displayAccountDetails(accountId);
// };
const handleTransaction = async (e) => {
  e.preventDefault();
  const form = e.target;
  const transactionType = form.querySelector("#transaction-type").value;
  const transactionAmount = parseInt(
    form.querySelector("#transaction-amount").value
  );
  const accountId = form.dataset.accid;
  const account = accounts.find((acc) => acc._id === accountId);

  if (transactionType === FORM_MODES.DEPOSIT) {
    account.balance += transactionAmount;
  } else if (transactionType === FORM_MODES.WITHDRAW) {
    if (transactionAmount > account.balance) {
      alert("We warned you, you can't withdraw more than your total balance!");
      form.querySelector("#transaction-amount").value = "";
      return;
    }
    account.balance -= transactionAmount;
  }

  const apiRoute =
    transactionType === FORM_MODES.DEPOSIT
      ? `${API_ACC}${accountId}/deposit`
      : `${API_ACC}${accountId}/withdraw`;

  const response = await fetch(apiRoute, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      amount: transactionAmount,
    }),
  });

  if (response.ok) {
    const result = await response.json();
    alert(`Transaction successful: ${result.message}`);
    // Fetch and display the updated accounts list and details
    showAccounts();
    displayAccountDetails(accountId);
  } else {
    // If the response is not ok, throw an error with the status text
    throw new Error(response.statusText);
  }
};

const deleteAccount = async (e) => {
  const accountId = e.target.dataset.accid;
  await fetch(`${API_ACC}${accountId}/delete`, {
    method: "DELETE",
  });

  showAccounts();
  clearAccountDetails();
  // accountDetails.innerHTML = "";
};

const showAccounts = async () => {
  const res = await fetch(API_ACCOUNTS);
  accounts = await res.json();
  // if (accounts) {
  if (accounts.length === 0) {
    accountsList.innerHTML = `<h3>Oops, there are no accounts!</h3>`;
  } else {
    accountsList.innerHTML = accounts.map(accountTemplate).join("");
    addCardListeners();
  }
  // }
};

const displayAccountDetails = (accountId) => {
  // Clear previous account details
  // accountDetails.innerHTML = "";
  clearAccountDetails();

  const account = accounts.find((acc) => acc._id === accountId);

  if (account) {
    accountDetails.innerHTML = accountDetailsTemplate(account);
    const deleteButton = document.querySelector('[data-function="delete"]');
    deleteButton.addEventListener("click", deleteAccount);
    const transactionForm = document.getElementById("transaction-form");
    if (transactionForm) {
      transactionForm.addEventListener("submit", handleTransaction);
    }
  }
};

async function createAccount(event) {
  event.preventDefault();
  try {
    const formData = new FormData(createAccountForm);
    const account = Object.fromEntries(formData.entries());
    const response = await fetch(API_ACCOUNTS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(account),
    });
    if (response.ok) {
      const result = await response.json();
      alert(`Account created successfully: ${result.account.name}`);
      createAccountForm.reset();
      showAccounts();
    } else {
      throw new Error(response.statusText);
    }
  } catch (error) {
    alert(`Error creating account: ${error}`);
  }
}

createAccountForm.addEventListener("submit", createAccount);

showAccounts();
