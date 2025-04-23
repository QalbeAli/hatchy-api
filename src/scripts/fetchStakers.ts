import fs from "fs";
import csv from "csv-parser";
import { createObjectCsvWriter } from "csv-writer";
import { ethers } from "ethers";
// Contract ABI and address
const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "user",
        "type": "address",
      },
    ],
    "name": "getStakedTokens",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256",
      },
    ],
    "stateMutability": "view",
    "type": "function",
  },
];
const CONTRACT_ADDRESS = "0xae1BAd89f7cb5615917f685e6AB17BF431052587";
const NETWORK = "https://api.avax.network/ext/bc/C/rpc"; // Avalanche Mainnet RPC URL

// Initialize provider and contract
const provider = new ethers.providers.JsonRpcProvider(
  NETWORK
);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Input and output CSV files
const INPUT_CSV = "wallet_addresses.csv";
const OUTPUT_CSV = "stakers.csv";

// Read addresses from CSV file, check balance, and write to new CSV
async function processAddresses() {
  const addresses = [];

  // Step 1: Read addresses from input CSV
  fs.createReadStream(INPUT_CSV)
    .pipe(csv())
    .on("data", (row) => {
      addresses.push(row.address);
    })
    .on("end", async () => {
      console.log(`Read ${addresses.length} addresses from ${INPUT_CSV}`);

      const stakers = [];

      // Step 2: Check staked balance for each address
      for (const address of addresses) {
        try {
          const balance = await contract.getStakedTokens(address);
          console.log(`Address: ${address}, Staked Balance: ${balance.toString()}`);

          // Step 3: Store addresses with balance > 0
          if (balance > 0) {
            stakers.push({ address });
          }
        } catch (error) {
          console.error(`Error fetching balance for address ${address}:`, error);
        }
      }

      // Step 4: Write stakers to output CSV
      const csvWriter = createObjectCsvWriter({
        path: OUTPUT_CSV,
        header: [{ id: "address", title: "address" }],
      });

      await csvWriter.writeRecords(stakers);
      console.log(`Stakers with balance > 0 written to ${OUTPUT_CSV}`);
    });
}

// Execute the function
processAddresses().catch((error) => {
  console.error("Error processing addresses:", error);
});