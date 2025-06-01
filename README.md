# `lattice-crypto-js`

> 🛡️ A lightweight, modular JavaScript/TypeScript wrapper for the **Dilithium** post-quantum digital signature scheme compiled to WebAssembly.

---

**Jump to:**
[What is This?](#-what-is-this) |
[Installation](#-installation) |
[Quick Start](#-quick-start) |
[Usage Examples](#️-usage-examples) |
[API Reference](#-api-reference) |
[Types](#-types) |
[Browser Support](#-browser-support) |
[License](#-license)

---

## 🔐 What is This?

`lattice-crypto-js` is a TypeScript-first package that brings post-quantum cryptography to JavaScript. It wraps the [Dilithium](https://pq-crystals.org/dilithium/) C reference implementation using WebAssembly, enabling secure, quantum-resistant digital signatures in both **Node.js** and **browser** environments.

### Why Post-Quantum Cryptography?

Traditional cryptographic algorithms like RSA and ECDSA will be vulnerable to quantum computers. Dilithium is a quantum-resistant digital signature scheme standardized by NIST, ensuring your applications remain secure in the post-quantum era.

### Key Features

-   🔒 **Quantum-resistant** digital signatures using Dilithium2
-   ⚡ **High performance** via WebAssembly
-   🌐 **Universal compatibility** - works in Node.js and browsers
-   📝 **TypeScript-first** with full type definitions
-   🎯 **Simple API** - easy to integrate into existing projects
-   📦 **Lightweight** - minimal dependencies

---

## 📦 Installation

```bash
npm install lattice-crypto-js
```

---

## 🚀 Quick Start

```ts
import {
    initializeDilithiumApi,
    generateKeypair,
    signMessage,
    verifySignature,
} from "lattice-crypto-js";

async function example() {
    // Initialize the API (loads WebAssembly)
    const api = await initializeDilithiumApi();

    // Generate a quantum-safe keypair
    const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

    // Sign a message
    const message = "Hello, post-quantum world!";
    const { signature } = signMessage(api, message, secretKeyPtr);

    // Verify the signature
    const isValid = verifySignature(api, signature, message, publicKeyPtr);
    console.log("Signature valid?", isValid); // true
}

example();
```

---

## ✍️ Usage Examples

### Complete Workflow

```ts
import {
    initializeDilithiumApi,
    generateKeypair,
    signMessage,
    verifySignature,
} from "lattice-crypto-js";

(async () => {
    // Step 1: Initialize the API
    console.log("Loading Dilithium WebAssembly...");
    const api = await initializeDilithiumApi();

    // Step 2: Generate keypair
    console.log("Generating quantum-safe keypair...");
    const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

    // Step 3: Sign a message
    const message = "This message is quantum-safe!";
    console.log(`Signing: "${message}"`);
    const { signature } = signMessage(api, message, secretKeyPtr);

    // Step 4: Verify signature
    const isValid = verifySignature(api, signature, message, publicKeyPtr);
    console.log(`Verification result: ${isValid ? "✅ Valid" : "❌ Invalid"}`);

    // Optional: Extract raw key data
    const publicKey = new Uint8Array(api.HEAPU8.buffer, publicKeyPtr, 1312);
    const secretKey = new Uint8Array(api.HEAPU8.buffer, secretKeyPtr, 2560);
    console.log(`Public key length: ${publicKey.length} bytes`);
    console.log(`Secret key length: ${secretKey.length} bytes`);
})();
```

### Signing Binary Data

```ts
const binaryData = new Uint8Array([1, 2, 3, 4, 5]);
const { signature } = signMessage(api, binaryData, secretKeyPtr);
const isValid = verifySignature(api, signature, binaryData, publicKeyPtr);
```

### Error Handling

```ts
try {
    const api = await initializeDilithiumApi();
    const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

    const message = "Important document";
    const { signature } = signMessage(api, message, secretKeyPtr);

    if (verifySignature(api, signature, message, publicKeyPtr)) {
        console.log("✅ Document authenticity verified");
    } else {
        console.error("❌ Document verification failed");
    }
} catch (error) {
    console.error("Cryptographic operation failed:", error);
}
```

---

## 📚 API Reference

### `initializeDilithiumApi()`

Loads and initializes the WebAssembly module.

```ts
const api = await initializeDilithiumApi();
```

**Returns:** `Promise<DilithiumApi>` - The initialized API instance

### `generateKeypair(api)`

Generates a Dilithium2 public/secret keypair.

```ts
const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);
```

**Parameters:**

-   `api: DilithiumApi` - The initialized API instance

**Returns:** `{ publicKeyPtr: number, secretKeyPtr: number }` - Memory pointers to the keys

### `signMessage(api, message, secretKeyPtr)`

Signs a message using the secret key.

```ts
const { signature } = signMessage(api, message, secretKeyPtr);
```

**Parameters:**

-   `api: DilithiumApi` - The initialized API instance
-   `message: string | Uint8Array` - The message to sign
-   `secretKeyPtr: number` - Pointer to the secret key

**Returns:** `{ signature: Uint8Array }` - The digital signature

### `verifySignature(api, signature, message, publicKeyPtr)`

Verifies a signature against a message using the public key.

```ts
const isValid = verifySignature(api, signature, message, publicKeyPtr);
```

**Parameters:**

-   `api: DilithiumApi` - The initialized API instance
-   `signature: Uint8Array` - The signature to verify
-   `message: string | Uint8Array` - The original message
-   `publicKeyPtr: number` - Pointer to the public key

**Returns:** `boolean` - `true` if signature is valid, `false` otherwise

---

## 📋 Types

Import TypeScript types for better development experience:

```ts
import type {
    PublicKey,
    SecretKey,
    Signature,
    Message,
} from "lattice-crypto-js/types";
```

**Available Types:**

-   `PublicKey: Uint8Array` - 1312 bytes
-   `SecretKey: Uint8Array` - 2560 bytes
-   `Signature: Uint8Array` - Variable length
-   `Message: string | Uint8Array` - Input message format

---

## 🌐 Browser Support

This package works in all modern browsers that support WebAssembly:

-   ✅ Chrome 57+
-   ✅ Firefox 52+
-   ✅ Safari 11+
-   ✅ Edge 16+
-   ✅ Node.js 8+

---

## 🔧 Key Sizes & Performance

| Component  | Size         | Description                |
| ---------- | ------------ | -------------------------- |
| Public Key | 1,312 bytes  | Safe to share publicly     |
| Secret Key | 2,560 bytes  | Keep secure and private    |
| Signature  | ~2,420 bytes | Varies slightly by message |

**Performance:** Typical operations complete in under 10ms on modern hardware.

---

## 🛡️ Security Notes

-   **Keep secret keys secure** - Never expose them in client-side code or logs
-   **Verify all signatures** - Always check return values from `verifySignature()`
-   **Use HTTPS** - Protect key transmission over networks
-   **Regular updates** - Keep the package updated for security patches

---

## 📜 License

Based on the [PQ-Crystals Dilithium](https://github.com/pq-crystals/dilithium) implementation, which is in the public domain under a permissive license.

---

## 🤝 Contributing

Found a bug or want to contribute? Please visit our [GitHub repository](https://github.com/mabdinasir/lattice-crypto-js) to report issues or submit pull requests.

---

**Built with ❤️ for a quantum-safe future.**
