import type { PublicKey, SecretKey, Signature, Message } from ".";

export interface DilithiumApi {
    keypair: (publicKeyPtr: number, secretKeyPtr: number) => number;
    sign: (
        signaturePtr: number,
        signatureLengthPtr: number,
        messagePtr: number,
        messageLength: number,
        secretKeyPtr: number
    ) => number;
    verify: (
        signaturePtr: number,
        signatureLength: number,
        messagePtr: number,
        messageLength: number,
        publicKeyPtr: number
    ) => number;

    _malloc: (size: number) => number;
    _free: (ptr: number) => void;
    HEAPU8: Uint8Array;
    HEAPU32: Uint32Array;
}
