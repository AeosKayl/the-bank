const API_ACCOUNTS = "/api/accounts";
const API_ACC = "/api/account/";

const createAccountForm = document.getElementById("create-account-form");
const accountsList = document.getElementById("accounts-list");
const accountDetails = document.getElementById("account-details");
const balanceInput = document.getElementById("balance");

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
// eventlistener on account cards to show details section
const addCardListeners = () => {
  const accountCards = document.querySelectorAll(".account-card");
  accountCards.forEach((card) =>
    card.addEventListener("click", () =>
      displayAccountDetails(card.dataset.accid)
    )
  );
};
//function that handles deposit/withdrawal and uses the appropriate route
const handleTransaction = async (e) => {
  e.preventDefault();
  const form = e.target;
  const transactionType = form.querySelector("#transaction-type").value;
  const transactionAmount = parseInt(
    form.querySelector("#transaction-amount").value
  );
  const accountId = form.dataset.accid;
  const account = accounts.find((acc) => acc._id === accountId);

  if (transactionAmount < 0) {
    alert("A a a, almost forgot, no negative amounts are allowed!");
    form.querySelector("#transaction-amount").value = "";
    return;
  }

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
};

const showAccounts = async () => {
  const res = await fetch(API_ACCOUNTS);
  accounts = await res.json();

  if (accounts.length === 0) {
    accountsList.innerHTML = `<h3>Oops, there are no accounts!</h3>`;
  } else {
    accountsList.innerHTML = accounts.map(accountTemplate).join("");
    addCardListeners();
  }
};

const displayAccountDetails = (accountId) => {
  // Clear previous account details
  clearAccountDetails();

  const account = accounts.find((acc) => acc._id === accountId);

  if (account) {
    // add event listeners
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
    if (account.balance < 0) {
      alert("A a a, almost forgot, no negative amounts are allowed!");
      balanceInput.value = "";
      return;
    }
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
