# `lattice-crypto-js`

> 🛡️ A lightweight, modular JavaScript/TypeScript wrapper for the **Dilithium** post-quantum digital signature scheme compiled to WebAssembly.

---

**Jump to:**
[What is This?](#-what-is-this) |
[Folder Structure](#-folder-structure) |
[Getting Started](#-getting-started) |
[Usage Example](#️-usage-example) | [Types](#-types) |
[Testing](#-testing) |
[License](#-license)

---

## 🔐 What is This?

`lattice-crypto-js` is a TypeScript-first package that wraps the [Dilithium](https://pq-crystals.org/dilithium/) C reference implementation using WebAssembly. It enables secure, quantum-resistant digital signatures in both **Node.js** and **browser** environments.

This package provides:

-   Post-quantum-safe **keypair generation**
-   **Message signing** with Dilithium
-   **Signature verification**
-   A clean, modular API designed for developers

---

## 📁 Folder Structure

```
lattice-crypto-js/
├── src/
│
├── dilithium-api/              # High-level TypeScript wrappers
│   ├── generateKeypair.ts      # Generates public/secret keypair
│   ├── signMessage.ts          # Signs a string or Uint8Array
│   ├── verifySignature.ts      # Verifies a Dilithium signature
│   ├── initializeDilithiumApi.ts  # Loads WASM + wraps C exports
│   └── index.ts                # Entry point to all API exports
│
├── wasm/                       # WebAssembly bindings
│   ├── dilithium.wasm          # Compiled WASM binary
│   └── dilithium.js            # Emscripten glue code
│
├── types/                      # Shared TypeScript types
│   ├── index.ts                # PublicKey, SecretKey, Signature, etc.
│   └── dilithium-api.ts        # Internal DilithiumApi interface
│
├── test/                       # Test files for manual verification
│   └── index.ts                # Sample test script with console logs
│
└── README.md
```

---

## 🚀 Getting Started

### 1. Install

```bash
npm install lattice-crypto-js
```

### 2. Import and Initialize

```ts
import {
    initializeDilithiumApi,
    generateKeypair,
    signMessage,
    verifySignature,
} from "lattice-crypto-js";
```

---

## ✍️ Usage Example

### Key Generation

```ts
const api = await initializeDilithiumApi();

const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

// You can extract Uint8Array values from WASM memory if needed
const publicKey = new Uint8Array(api.HEAPU8.buffer, publicKeyPtr, 1312);
const secretKey = new Uint8Array(api.HEAPU8.buffer, secretKeyPtr, 2560);
```

### Signing a Message

```ts
const message = "Hello post-quantum world!";
const { signature } = signMessage(api, message, secretKeyPtr);
```

### Verifying a Signature

```ts
const isValid = verifySignature(api, signature, message, publicKeyPtr);
console.log("Signature valid?", isValid);
```

---

## 📦 Features

-   ✅ **Dilithium2** keypair generation
-   ✅ Message signing and verification
-   ✅ WebAssembly for high performance
-   ✅ Modular TypeScript codebase
-   ✅ Runs in both Node.js and browser

---

## 📋 Types

You can import reusable cryptographic types:

```ts
import type {
    PublicKey,
    SecretKey,
    Signature,
    Message,
} from "lattice-crypto-js"/types";
```

---

## 🧪 Testing

This project includes a test script in the `test/` folder for quick validation.

### Run it using ts-node:

```bash
npx ts-node test/index.ts
```

This test will:

-   Initialize the Dilithium API
-   Generate a keypair
-   Sign a message
-   Verify the signature
-   Output results to the console

Example output:

```
Initializing Dilithium API...
Generating keypair...
Message to sign: Hello, lattice post-quantum world!
Signing message...
Signature (hex): <hex value>
Verifying signature...
Verification result: Valid signature ✅
Test completed.
```

## 🧪 Example Integration

```ts
import {
    initializeDilithiumApi,
    generateKeypair,
    signMessage,
    verifySignature,
} from "lattice-crypto-js";

(async () => {
    const api = await initializeDilithiumApi();
    const { publicKeyPtr, secretKeyPtr } = generateKeypair(api);

    const message = "Quantum-safe test";
    const { signature } = signMessage(api, message, secretKeyPtr);

    const isValid = verifySignature(api, signature, message, publicKeyPtr);
    console.log("Valid?", isValid);
})();
```

---

## 📜 License

Based on the [PQ-Crystals Dilithium](https://github.com/pq-crystals/dilithium) implementation, which is in the public domain and under a permissive license.

---

Built with ❤️ for cryptography enthusiasts and post-quantum readiness.
