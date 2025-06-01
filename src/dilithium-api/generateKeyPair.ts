import { DilithiumApi } from "../types/dilithium-api";

const DILITHIUM2_PUBLIC_KEY_SIZE = 1312;
const DILITHIUM2_SECRET_KEY_SIZE = 2560;

export function generateKeypair(api: DilithiumApi): {
    publicKeyPtr: number;
    secretKeyPtr: number;
} {
    const publicKeyPtr = api._malloc(DILITHIUM2_PUBLIC_KEY_SIZE);
    const secretKeyPtr = api._malloc(DILITHIUM2_SECRET_KEY_SIZE);

    if (!publicKeyPtr || !secretKeyPtr) {
        if (publicKeyPtr) api._free(publicKeyPtr);
        if (secretKeyPtr) api._free(secretKeyPtr);
        throw new Error("Memory allocation failed during keypair generation");
    }

    const status = api.keypair(publicKeyPtr, secretKeyPtr);

    if (status !== 0) {
        api._free(publicKeyPtr);
        api._free(secretKeyPtr);
        throw new Error("Failed to generate key pair");
    }

    return { publicKeyPtr, secretKeyPtr };
}
