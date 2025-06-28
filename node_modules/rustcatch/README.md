# rustcatch 🦀

[![NPM Version](https://img.shields.io/npm/v/rustcatch.svg)](https://www.npmjs.com/package/rustcatch) [![License](https://img.shields.io/npm/l/rustcatch.svg)](LICENSE) [![NPM Downloads](https://img.shields.io/npm/dm/rustcatch.svg)](https://www.npmjs.com/package/rustcatch)

A high-performance, cross-platform global keyboard event listener for Node.js, written in Rust.

`rustcatch` allows your Node.js application to listen for keyboard events from any application across the entire operating system, not just the focused terminal window.

## Why `rustcatch`?

-   🚀 **High Performance:** Built with Rust to ensure minimal overhead. It runs in a separate thread and does not block the Node.js event loop.
-   🌍 **Truly Global:** Captures keyboard events system-wide.
-   💻 **Cross-Platform:** Provides a single, consistent API for Windows, macOS, and Linux.
-   🛡️ **Safe & Reliable:** Leverages Rust's memory and thread safety guarantees to prevent common issues found in native C++ addons.
-   📦 **Simple Installation:** Designed to use pre-built binaries, removing the need for end-users to have a Rust toolchain installed.

## Platform Support

| OS            | Supported | Notes                                                               |
| :------------ | :-------: | :------------------------------------------------------------------ |
| Windows       |     ✅    | Works out of the box.                                               |
| macOS         |     ✅    | Requires Accessibility permissions for the terminal/app in settings.|
| Linux (X11)   |     ✅    | Requires `libxdo-dev`, `libxtst-dev`, and other X11 development libs. |

## Installation

```bash
# To install from GitHub (until published on NPM)
npm install GITHUB_USERNAME/rustcatch
```
*(Replace `GITHUB_USERNAME` with the actual GitHub username.)*

## Quick Start Example

Here is a simple example of how to use `rustcatch` to log key presses and releases.

```javascript
const rustcatch = require('rustcatch');

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
  console.log('Press any key (even in other windows)...');
} catch (error) {
  console.error('Failed to start listener:', error);
}

// Stop the listener after 30 seconds
setTimeout(() => {
  if (rustcatch.isRunning) {
    rustcatch.stop();
    console.log('Global listener stopped.');
  }
}, 30000);
```

## API Reference

The `rustcatch` module is an instance of `EventEmitter`.

### Methods

#### `rustcatch.start()`
Starts the global keyboard listener. It will begin emitting `keydown` and `keyup` events.

#### `rustcatch.stop()`
Stops the global keyboard listener. No more events will be emitted.

### Properties

#### `rustcatch.isRunning`
-   **Type:** `boolean` (Read-only)
-   Returns `true` if the listener is currently active, otherwise `false`.

### Events

#### `on('keydown', callback)`
-   **`callback(event)`**
    -   **`event`** `<Object>`
        -   `type` `<string>` - Always `'keydown'`.
        -   `key` `<string>` - A string representation of the key that was pressed (e.g., `'KeyA'`, `'Space'`, `'ControlLeft'`).
-   Emitted when any key is pressed down.

#### `on('keyup', callback)`
-   **`callback(event)`**
    -   **`event`** `<Object>`
        -   `type` `<string>` - Always `'keyup'`.
        -   `key` `<string>` - A string representation of the key that was released.
-   Emitted when any key is released.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.