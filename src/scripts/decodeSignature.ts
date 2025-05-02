import { Contract, utils, ethers } from "ethers";
// Gnosis Safe contract address
const safeAddress = "0x9B";
const signer = "0x32C";
// Message nonce
const nonce = "8";
// Signature to validate
const signature =
  "0xa";


async function validateSafeSignature() {
  // Initialize provider
  const provider = new ethers.providers.JsonRpcProvider("https://api.avax.network/ext/bc/C/rpc");

  const abi = ['function isValidSignature(bytes32 _message, bytes _signature) public view returns (bytes4)'];
  const walletContract = new Contract(safeAddress, abi, provider);
  const message = `Welcome to Hatchy Pocket!\n\nThis request will not trigger a blockchain transaction or cost any gas fees.\n\nWallet address: ${safeAddress}\n\nNonce: ${nonce}`;
  const hashMessage = utils.hashMessage(message);
  try {
    const response = await walletContract.isValidSignature(hashMessage, signature);
    console.log(response);
    // The result should match the EIP-1271 magic value: 0x1626ba7e
    if (response === "0x1626ba7e") {
      console.log("Signature is valid!");
    } else {
      console.log("Signature is invalid.");
    }
  } catch (error) {
    console.error("Error validating signature:", error);
  }
}

// Run the validation
validateSafeSignature();