import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const port = 3000;
const app = express();

const client = new MongoClient("mongodb://127.0.0.1:27017");
await client.connect();
const db = client.db("banken");
const accountsCollection = db.collection("accounts");

app.use(express.static("public"));
app.use(express.json());

//route to get all accounts
app.get("/api/accounts", async (req, res) => {
  try {
    const accounts = await accountsCollection.find().toArray();
    if (accounts) {
      res.json(accounts);
    } else {
      // If the collection is null, send a 500 status code and an error message
      res.status(500).json({
        success: false,
        message: "Error getting accounts",
      });
    }
  } catch (error) {
    // If an error occurs, send a 500 status code and an error message
    res.status(500).json({
      success: false,
      message: `Error getting accounts: ${error}`,
    });
  }
});

//route to get a single account
app.get("/api/account/:id", async (req, res) => {
  try {
    if (ObjectId.isValid(req.params.id)) {
      const account = await accountsCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.json(account);
    } else {
      // If it is not valid, send an error message with a 400 status code
      res.status(400).send("Invalid ObjectId");
    }
  } catch (error) {
    console.error(error);
    res.status(404).send("No account found");
  }
});

//route to create an account
app.post("/api/accounts", async (req, res) => {
  try {
    if (accountsCollection) {
      const account = {
        name: req.body.name,
        balance: parseInt(req.body.balance), //parsing to make sure that it's of type number
      };

      await accountsCollection.insertOne(account);
      console.log(typeof account.balance === "number");
      res.status(201).json({
        success: true,
        account,
      });
    } else {
      // If the collection is null, send a 500 status code and an error message
      res.status(500).json({
        success: false,
        message: "Error getting accounts collection",
      });
    }
  } catch (error) {
    // If an error occurs, send a 500 status code and an error message
    res.status(500).json({
      success: false,
      message: `Error creating account: ${error}`,
    });
  }
});

// route to deposit an amount
app.put("/api/account/:id/deposit", async (req, res) => {
  const id = req.params.id;
  const amount = req.body.amount;
  try {
    if (ObjectId.isValid(id) && amount) {
      // Validate the id and the amount
      const result = await accountsCollection.updateOne(
        { _id: new ObjectId(id) },
        { $inc: { balance: amount } }
      );

      if (result.modifiedCount === 1) {
        console.log(`Deposited ${amount} to account ${id}`);
        res.status(200).json({
          success: true,
          message: `Deposited ${amount} to account ${id}`,
        });
      }
    } else {
      // If the update was not successful or id is not valid and no amount specified, send a 404 status code and an error message
      console.log(`failed to deposit into ${id}, no such account id`);
      res.status(400).json({
        success: false,
        message: `Invalid id or amount`,
      });
    }
  } catch (error) {
    // If an error occurs, send a 500 status code and an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error depositing to account ${id}: ${error}`,
    });
  }
});

// route to withdraw amount
app.put("/api/account/:id/withdraw", async (req, res) => {
  const id = req.params.id;
  const amount = req.body.amount;
  // Validate the id and the amount
  try {
    if (ObjectId.isValid(id) && amount) {
      console.log(typeof amount);
      // Try to find the account by id using the MongoDB findOne method
      const account = await accountsCollection.findOne({
        _id: new ObjectId(id),
      });
      // If the account exists, check if the balance is enough to withdraw the amount
      if (account) {
        if (account.balance >= amount) {
          // If the balance is enough, update the account balance by subtracting the amount using the MongoDB updateOne method and $inc in mongodb, works with numbers
          const result = await accountsCollection.updateOne(
            { _id: new ObjectId(id) },
            { $inc: { balance: -amount } }
          );
          // If the update was successful, send a 200 status code and a success message
          if (result.modifiedCount === 1) {
            res.status(200).json({
              success: true,
              message: `Withdrew ${amount} from account ${id}`,
            });
          } else {
            // If the update was not successful, send a 404 status code and an error message
            res.status(404).json({
              success: false,
              message: `Account ${id} not found`,
            });
          }
        } else {
          // If the balance is not enough, send a 400 status code and an error message
          console.log(
            `Insufficient balance to withdraw ${amount} from account ${id}`
          );
          res.status(400).json({
            success: false,
            message: `Insufficient balance to withdraw ${amount} from account ${id}`,
          });
        }
      } else {
        // If the account does not exist, send a 404 status code and an error message
        console.log(`Account ${id} not found`);
        res.status(404).json({
          success: false,
          message: `Account ${id} not found`,
        });
      }
    } else {
      // If the id or the amount is missing or invalid, send a 400 status code and an error message
      console.log("Invalid id or amount");
      res.status(400).json({
        success: false,
        message: "Invalid id or amount",
      });
    }
  } catch (error) {
    // If an error occurs, send a 500 status code and an error message
    console.log(error);
    res.status(500).json({
      success: false,
      message: `Error withdrawing from account ${id}: ${error}`,
    });
  }
});

// route for deleting an account by id
app.delete("/api/account/:id/delete", async (req, res) => {
  const id = req.params.id;
  // Validate the id
  if (ObjectId.isValid(id)) {
    try {
      // Try to delete the account by id using the MongoDB deleteOne method
      const result = await accountsCollection.deleteOne({
        _id: new ObjectId(id),
      });
      // If the delete was successful, send a 200 status code and a success message
      if (result.deletedCount === 1) {
        res.status(200).json({
          success: true,
          message: `Deleted account ${id}`,
        });
      } else {
        // If the delete was not successful or the account is deleted, send a 404 status code and an error message
        res.status(404).json({
          success: false,
          message: `Account ${id} not found`,
        });
      }
    } catch (error) {
      // If an error occurs, send a 500 status code and an error message
      res.status(500).json({
        success: false,
        message: `Error deleting account ${id}: ${error}`,
      });
    }
  } else {
    // If the id is missing or invalid, send a 400 status code and an error message
    console.log("id is missing");
    res.status(400).json({
      success: false,
      message: "Invalid id",
    });
  }
});

app.listen(port, () => console.log(`Listening on port: ${port}`));
