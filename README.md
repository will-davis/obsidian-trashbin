# Obsidian Trashbin Plugin

A simple, lightweight plugin for [Obsidian](https://obsidian.md) that adds a trash bin icon to the bottom of your sidebar ribbon. Drag files or folders to the bin to move them to your system trash.

![Trash Bin Icon](https://raw.githubusercontent.com/will-davis/obsidian-trashbin/refs/heads/main/assets/overview.png)

## Features

- **Drag-and-Drop Deletion**: Quickly delete notes or folders by dragging them to the ribbon.
- **System Trash Support**: Uses your system trash (or local Obsidian trash depends on your settings) for safe, recoverable deletions.
- **UI**: Integrates directly into the sidebar ribbon.

## Installation

### From within Obsidian

1. Open **Settings** > **Community Plugins**.
2. Browse or search for **Trash Bin** (once available on the store).
3. Click **Install**, then **Enable**.

### Manual Installation

1. Download the latest `main.js`, `manifest.json`, and `styles.css` from the [Latest Release](https://github.com/willdavis/trashbin-obsidian/releases).
2. Create a folder named `trashbin-obsidian` in your vault's `.obsidian/plugins/` directory.
3. Move the downloaded files into that folder.
4. Reload Obsidian and enable the plugin in **Settings** > **Community Plugins**.

## Development

If you'd like to build the plugin yourself:

1. Clone this repository.
2. Run `npm install` to install dependencies.
3. Run `npm run build` to compile the plugin.
4. The `main.js` file will be generated in the root directory.

## License

This project is licensed under the [MIT License](LICENSE).
