# rustcatch 🦀

[![NPM Version](https://img.shields.io/npm/v/rustcatch.svg)](https://www.npmjs.com/package/rustcatch) [![License](https://img.shields.io/npm/l/rustcatch.svg)](LICENSE) [![NPM Downloads](https://img.shields.io/npm/dm/rustcatch.svg)](https://www.npmjs.com/package/rustcatch)

A high-performance, cross-platform global keyboard event listener for Node.js, written in Rust.

`rustcatch` allows your Node.js application to listen for keyboard events from any application across the entire operating system, not just the focused terminal window. It's ideal for creating system-wide hotkeys, shortcuts, or capturing input from devices that emulate a keyboard, like a USB barcode scanner.

## Why `rustcatch`?

-   🚀 **High Performance:** Built with Rust to ensure minimal overhead. It runs in a separate thread and does not block the Node.js event loop.
-   🌍 **Truly Global:** Captures keyboard events system-wide.
-   💻 **Cross-Platform:** Provides a single, consistent API for Windows, macOS, and Linux.
-   🛡️ **Safe & Reliable:** Leverages Rust's memory and thread safety guarantees to prevent common issues found in native C++ addons.
-   📦 **Simple Installation:** Uses pre-built binaries, removing the need for end-users to have a Rust toolchain installed.

## How It Works

This module uses a **pre-compiled binary** approach. When you install `rustcatch` via `npm`, it downloads a `.node` file that is already compiled for your operating system and architecture. This means you don't need Rust, C++ compilers, or any other build tools to use this package in your project.

## Platform Support

| OS            | Supported | Notes for Users                                                       |
| :------------ | :-------: | :------------------------------------------------------------------ |
| Windows       |     ✅    | Works out of the box.                                               |
| macOS         |    (TBD)  | Requires Accessibility permissions for the terminal/app in settings.|
| Linux (X11)   |    (TBD)  | Requires `libxdo-dev`, `libxtst-dev`, and other X11 development libs. |

## Installation

```bash
npm install rustcatch
```

The package will automatically download the correct pre-built binary for your system.

## Quick Start Example

Here is a simple example of how to use `rustcatch` to log key presses.

```javascript
const rustcatch = require('rustcatch');

console.log('Starting global listener... Press any key.');
console.log('This script will be kept alive by a timer. Press Ctrl+C to exit.');

// Add a listener for the 'keydown' event
rustcatch.on('keydown', (event) => {
  console.log('Key Down:', event);
  // Example event: { type: 'keydown', key: 'KeyA' }
});

// Add a listener for the 'keyup' event
rustcatch.on('keyup', (event) => {
  console.log('Key Up:  ', event);
  // Example event: { type: 'keyup', key: 'KeyA' }
});

// Start the global listener
try {
  rustcatch.start();
  console.log('Global listener started successfully.');
} catch (error) {
  console.error('Failed to start listener:', error);
  process.exit(1);
}

// See the "Important Note on Usage" below
setInterval(() => {}, 1000 * 60 * 60);

process.on('SIGINT', () => {
    if (rustcatch.isRunning) {
        rustcatch.stop();
        console.log('\nGlobal listener stopped.');
    }
    process.exit(0);
});
```

## ⚠️ Important Note on Usage

Because `rustcatch` runs its core logic in a separate background thread, the main Node.js process might not see any pending tasks and exit immediately after starting.

To prevent this, you must keep the Node.js event loop busy. You can do this by:
-   Running a web server (e.g., Express, Fastify).
-   Keeping a WebSocket connection open.
-   Using a simple `setInterval` as shown in the example above to keep the process alive indefinitely.

## API Reference

The `rustcatch` module is an instance of `EventEmitter`.

### Methods

#### `rustcatch.start()`
Starts the global keyboard listener. It will begin emitting `keydown` and `keyup` events. Throws an error if the listener cannot be started.

#### `rustcatch.stop()`
Stops the global keyboard listener. No more events will be emitted.

### Properties

#### `rustcatch.isRunning`
-   **Type:** `boolean` (Read-only)
-   Returns `true` if the listener is currently active, otherwise `false`.
-   **Note:** This property is updated asynchronously. It may not be `true` immediately after calling `start()`.

### Events

#### `on('keydown', callback)`
-   `callback(event)`: The event object.
    -   `event.type`: `'keydown'`
    -   `event.key`: A string representation of the key (e.g., `'KeyA'`, `'Space'`, `'Num1'`, `'Return'`).

#### `on('keyup', callback)`
-   `callback(event)`: The event object.
    -   `event.type`: `'keyup'`
    -   `event.key`: A string representation of the key.

## For Developers: Building from Source

If you want to contribute to the project or build the binaries for your own system, you'll need to compile the Rust source code.

### Prerequisites

1.  **Rust Toolchain:** Install via [rustup.rs](https://rustup.rs/).
2.  **Node.js:** v16 or later.
3.  **Build Tools:**
    *   **Windows:** Install "Desktop development with C++" from the Visual Studio Installer.
    *   **macOS:** Install Xcode Command Line Tools.
    *   **Linux:** Install `build-essential` and `libxdo-dev libxtst-dev`.

### Build Steps

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Xzdes/rustcatch.git
    cd rustcatch
    ```
2.  **Install JavaScript dependencies:**
    This will install development tools like `cargo-cp-artifact`.
    ```bash
    npm install
    ```
3.  **Build the native addon:**
    This command compiles the Rust code and copies the final `.node` file to the correct location (`build/Release/addon.node`).
    ```bash
    npm run build
    ```
4.  **Run tests (optional):**
    ```bash
    npm test
    ```

## Contributing

Contributions are welcome! Please feel free to open an issue to discuss a bug or feature, or submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.