# SimpCity Thread Grid

Responsive card grid for SimpCity thread lists and sidebar latest posts, with a polished settings UI.

## Install

1. Install [Tampermonkey](https://www.tampermonkey.net/).
2. Open the raw userscript URL:
   <https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/simpcity-thread-grid.user.js>
3. Tampermonkey will detect the `.user.js` file and prompt you to install it.

## Updates

Tampermonkey checks the metadata file declared in `@updateURL`:

<https://raw.githubusercontent.com/vylix-dev/simpcity-thread-grid/main/simpcity-thread-grid.meta.js>

Keep `@version` in `simpcity-thread-grid.user.js`, `simpcity-thread-grid.meta.js`, and `CHANGELOG.md` aligned for every release.

## Features

- Converts SimpCity thread lists into responsive cards.
- Preserves thumbnail aspect ratios with caching and image probing.
- Optionally fills missing, broken, black, or social-logo thumbnails with a cached image found from the thread page posts.
- Adds a Thumbnail Fit setting for crop-to-fill or full uncropped image display.
- Adds configurable card width, gaps, title lines, page-number visibility, latest-post visibility, sidebar grid, and hover animation controls.
- Provides a Tampermonkey menu and accessible settings modal.
- Supports the `simpcity.cr` domain.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT © vylix-dev.
