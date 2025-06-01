import { initializeDilithiumApi } from "../dilithium-api/initializeDilithiumApi";
import { generateKeypair } from "../dilithium-api/generateKeypair";
import { signMessage } from "../dilithium-api/signMessage";
import { verifySignature } from "../dilithium-api/verifySignature";

async function testDilithium() {
    console.log("Initializing Dilithium API...");
    const api = await initializeDilithiumApi();

    console.log("Generating keypair...");
    const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

    // Test 1: String message
    const message = "Hello, lattice post-quantum world!";
    console.log("Message to sign:", message);

    console.log("Signing message...");
    const { signature } = signMessage(api, message, secretKeyPtr);
    console.log("Signature (hex):", Buffer.from(signature).toString("hex"));

    console.log("Verifying signature...");
    const isValid = verifySignature(api, signature, message, publicKeyPtr);
    console.log(
        "String verification result:",
        isValid ? "Valid signature ✅" : "Invalid signature ❌"
    );

    // Test 2: Binary data (correct way - sign and verify the SAME data)
    console.log("\n--- Testing Binary Data ---");
    const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
    console.log("Signing binary data:", Array.from(binaryData));

    const { signature: binarySignature } = signMessage(
        api,
        binaryData,
        secretKeyPtr
    );
    console.log(
        "Binary signature (hex):",
        Buffer.from(binarySignature).toString("hex")
    );

    const isBinaryValid = verifySignature(
        api,
        binarySignature,
        binaryData,
        publicKeyPtr
    );
    console.log(
        "Binary data verification:",
        isBinaryValid
            ? "Valid binary signature ✅"
            : "Invalid binary signature ❌"
    );

    // Test 3: Cross-verification (should fail - this is what you were doing wrong)
    console.log("\n--- Testing Cross-Verification (Should Fail) ---");
    const isCrossValid = verifySignature(
        api,
        signature,
        binaryData,
        publicKeyPtr
    );
    console.log(
        "Cross-verification (string signature vs binary data):",
        isCrossValid ? "Valid (ERROR!) ❌" : "Invalid (correct behavior) ✅"
    );

    // Test 4: Tampered message (should fail)
    console.log("\n--- Testing Tampered Message (Should Fail) ---");
    const tamperedMessage = "Hello, tampered post-quantum world!";
    const isTamperedValid = verifySignature(
        api,
        signature,
        tamperedMessage,
        publicKeyPtr
    );
    console.log(
        "Tampered message verification:",
        isTamperedValid ? "Valid (ERROR!) ❌" : "Invalid (correct behavior) ✅"
    );

    // Test 5: Large binary data
    console.log("\n--- Testing Large Binary Data ---");
    const largeBinaryData = new Uint8Array(1000).fill(42);
    const { signature: largeSignature } = signMessage(
        api,
        largeBinaryData,
        secretKeyPtr
    );
    const isLargeValid = verifySignature(
        api,
        largeSignature,
        largeBinaryData,
        publicKeyPtr
    );
    console.log(
        "Large binary data verification:",
        isLargeValid ? "Valid large signature ✅" : "Invalid large signature ❌"
    );

    // Test 6: Empty message
    console.log("\n--- Testing Empty Message ---");
    const emptyMessage = "";
    const { signature: emptySignature } = signMessage(
        api,
        emptyMessage,
        secretKeyPtr
    );
    const isEmptyValid = verifySignature(
        api,
        emptySignature,
        emptyMessage,
        publicKeyPtr
    );
    console.log(
        "Empty message verification:",
        isEmptyValid ? "Valid empty signature ✅" : "Invalid empty signature ❌"
    );

    // Clean up allocated memory
    api._free(publicKeyPtr);
    api._free(secretKeyPtr);

    console.log("\n=== All tests completed ===");
}

testDilithium().catch((err) => {
    console.error("Error during test:", err);
    process.exit(1);
});
