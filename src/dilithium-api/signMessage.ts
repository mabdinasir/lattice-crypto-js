import type { DilithiumApi } from "../types/dilithium-api";
import type { Message, Signature } from "../types";

const DILITHIUM2_MAX_SIGNATURE_SIZE = 2420;

export function signMessage(
    api: DilithiumApi,
    message: Message,
    secretKeyPtr: number
): { signature: Signature } {
    // Convert message to bytes
    const encoder = new TextEncoder();
    const messageBytes =
        typeof message === "string" ? encoder.encode(message) : message;
    const messageLength = messageBytes.length;

    // Allocate memory for message, signature, and signature length
    const messagePtr = api._malloc(messageLength);
    const signaturePtr = api._malloc(DILITHIUM2_MAX_SIGNATURE_SIZE);
    const signatureLengthPtr = api._malloc(4); // 4 bytes for uint32

    // Check if memory allocation succeeded
    if (!messagePtr || !signaturePtr || !signatureLengthPtr) {
        // Clean up any successful allocations
        if (messagePtr) api._free(messagePtr);
        if (signaturePtr) api._free(signaturePtr);
        if (signatureLengthPtr) api._free(signatureLengthPtr);
        throw new Error("Memory allocation failed during signing");
    }

    try {
        // Copy message data to WASM memory
        api.HEAPU8.set(messageBytes, messagePtr);

        // Call the Dilithium signing function
        const result = api.sign(
            signaturePtr,
            signatureLengthPtr,
            messagePtr,
            messageLength,
            secretKeyPtr
        );

        // Check if signing succeeded
        if (result !== 0) {
            throw new Error(`Signing failed with error code ${result}`);
        }

        // Read the actual signature length from memory
        const signatureLength = api.HEAPU32[signatureLengthPtr >> 2];

        // Create a copy of the signature data
        const signature = new Uint8Array(
            api.HEAPU8.buffer,
            signaturePtr,
            signatureLength
        ).slice();

        return { signature };
    } finally {
        // Always clean up allocated memory
        api._free(messagePtr);
        api._free(signaturePtr);
        api._free(signatureLengthPtr);
    }
}
