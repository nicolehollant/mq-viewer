<img src="./app/public/logo.png" alt="mq-viewer logo" width="128" />

# mq-viewer

WIP: This is a little app to help look at sites across different viewports. Sorta like a lightweight [sizzy](https://sizzy.co/)-clone.

## Download

#### Mac
[MQ Viewer-0.1.0-mac.zip](https://spaces.colehollant.com/mq-viewer/dist/MQ%20Viewer-0.1.0-mac.zip)
#### Windows
[MQ Viewer Setup 0.1.0.exe](https://spaces.colehollant.com/mq-viewer/dist/MQ%20Viewer%20Setup%200.1.0.exe)
#### Linux
[mq-viewer_0.1.0_amd64.snap](https://spaces.colehollant.com/mq-viewer/dist/mq-viewer_0.1.0_amd64.snap)

[MQ Viewer-0.1.0.AppImage](https://spaces.colehollant.com/mq-viewer/dist/MQ%20Viewer-0.1.0.AppImage)

## Or Build

Clone repo, run:
```sh
yarn install
yarn electron:build
```

And grab proper image

## Features

- [ ] url bar
  - [X] visit site by url
  - [X] update based on page nav
  - [X] search engine integration
  - [ ] history
  - [ ] bookmarks?
  - [ ] maaaaybe tabs
- [ ] device sync
  - [X] url sync
  - [ ] scroll sync
  - [ ] find element?
- [X] widths
  - [X] render multiple widths
  - [X] new device form
  - [X] default widths
- [ ] height support?

## Screenshot

![my site on the app](mysite.png)