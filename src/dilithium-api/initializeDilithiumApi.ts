// @ts-ignore
import createDilithiumModule from "../wasm/dilithium.js";
import type { DilithiumApi } from "../types/dilithium-api.js";

export async function initializeDilithiumApi(): Promise<DilithiumApi> {
    const Module = await createDilithiumModule();

    return {
        keypair: Module.cwrap("crypto_sign_keypair_wrapper", "number", [
            "number",
            "number",
        ]),
        sign: Module.cwrap("crypto_sign_wrapper", "number", [
            "number",
            "number",
            "number",
            "number",
            "number",
        ]),
        verify: Module.cwrap("crypto_verify_wrapper", "number", [
            "number",
            "number",
            "number",
            "number",
            "number",
        ]),
        _malloc: Module._malloc,
        _free: Module._free,
        HEAPU8: Module.HEAPU8,
        HEAPU32: Module.HEAPU32,
    };
}
