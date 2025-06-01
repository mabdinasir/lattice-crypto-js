import type { DilithiumApi } from "../types/dilithium-api";
import type { Message, Signature } from "../types";

export function verifySignature(
    api: DilithiumApi,
    signature: Signature,
    message: Message,
    publicKeyPtr: number
): boolean {
    const encoder = new TextEncoder();
    const messageBytes =
        typeof message === "string" ? encoder.encode(message) : message;

    const signaturePtr = api._malloc(signature.length);
    const messagePtr = api._malloc(messageBytes.length);

    if (!signaturePtr || !messagePtr) {
        if (signaturePtr) api._free(signaturePtr);
        if (messagePtr) api._free(messagePtr);
        throw new Error("Memory allocation failed during verification");
    }

    try {
        api.HEAPU8.set(signature, signaturePtr);
        api.HEAPU8.set(messageBytes, messagePtr);

        const result = api.verify(
            signaturePtr,
            signature.length,
            messagePtr,
            messageBytes.length,
            publicKeyPtr
        );
        return result === 0;
    } finally {
        api._free(signaturePtr);
        api._free(messagePtr);
    }
}
