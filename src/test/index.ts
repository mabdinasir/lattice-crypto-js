import { initializeDilithiumApi } from "../dilithium-api/initializeDilithiumApi";
import { generateKeypair } from "../dilithium-api/generateKeypair";
import { signMessage } from "../dilithium-api/signMessage";
import { verifySignature } from "../dilithium-api/verifySignature";

async function testDilithium() {
    console.log("Initializing Dilithium API...");
    const api = await initializeDilithiumApi();

    console.log("Generating keypair...");
    const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

    const message = "Hello, lattice post-quantum world!";
    console.log("Message to sign:", message);

    console.log("Signing message...");
    const { signature } = signMessage(api, message, secretKeyPtr);
    console.log("Signature (hex):", Buffer.from(signature).toString("hex"));

    console.log("Verifying signature...");
    const isValid = verifySignature(api, signature, message, publicKeyPtr);

    console.log(
        "Verification result:",
        isValid ? "Valid signature ✅" : "Invalid signature ❌"
    );

    // Clean up allocated memory
    api._free(publicKeyPtr);
    api._free(secretKeyPtr);

    console.log("Test completed.");
}

testDilithium().catch((err) => {
    console.error("Error during test:", err);
    process.exit(1);
});
