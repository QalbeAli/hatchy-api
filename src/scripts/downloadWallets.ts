import fs from "fs";
import { createObjectCsvWriter } from "csv-writer";

import { ethers } from "ethers";
import { admin } from "../firebase/firebase";

// Firestore database reference
const db = admin.firestore();

// Function to fetch addresses and write to CSV
async function exportWalletAddresses() {
  try {
    const collectionRef = db.collection("wallet-users");
    const snapshot = await collectionRef.get();

    if (snapshot.empty) {
      console.log("No matching documents found!");
      return;
    }

    // Extract addresses
    const addresses = snapshot.docs.map((doc) => ({ address: doc.data().address }));

    // Write to CSV
    const csvWriter = createObjectCsvWriter({
      path: "wallet_addresses.csv",
      header: [{ id: "address", title: "address" }],
    });

    await csvWriter.writeRecords(addresses);
    console.log("CSV file created successfully: wallet_addresses.csv");
  } catch (error) {
    console.error("Error exporting wallet addresses:", error);
  }
}

// Run the function
exportWalletAddresses();