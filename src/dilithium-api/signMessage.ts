import type { DilithiumApi } from "../types/dilithium-api";
import type { Message, Signature } from "../types";

const DILITHIUM2_MAX_SIGNATURE_SIZE = 2420;

export function signMessage(
    api: DilithiumApi,
    message: Message,
    secretKeyPtr: number
): Signature {
    const encoder = new TextEncoder();
    const messageBytes =
        typeof message === "string" ? encoder.encode(message) : message;
    const messageLength = messageBytes.length;

    const messagePtr = api._malloc(messageLength);
    const signaturePtr = api._malloc(DILITHIUM2_MAX_SIGNATURE_SIZE);
    const signatureLengthPtr = api._malloc(4);

    if (!messagePtr || !signaturePtr || !signatureLengthPtr) {
        if (messagePtr) api._free(messagePtr);
        if (signaturePtr) api._free(signaturePtr);
        if (signatureLengthPtr) api._free(signatureLengthPtr);
        throw new Error("Memory allocation failed during signing");
    }

    try {
        api.HEAPU8.set(messageBytes, messagePtr);

        const result = api.sign(
            signaturePtr,
            signatureLengthPtr,
            messagePtr,
            messageLength,
            secretKeyPtr
        );

        if (result !== 0) {
            throw new Error(`Signing failed with error code ${result}`);
        }

        const signatureLength = api.HEAPU32[signatureLengthPtr >> 2];
        return new Uint8Array(
            api.HEAPU8.buffer,
            signaturePtr,
            signatureLength
        ).slice();
    } finally {
        api._free(messagePtr);
        api._free(signaturePtr);
        api._free(signatureLengthPtr);
    }
}
