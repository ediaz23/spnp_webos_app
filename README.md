## About

This is an app for LG smart TVs that allows you to play content from media server.


## Disclaimer

This software is intended for personal use only.


## How to run on local? (Linux)

1) Install and configure a media server, I use minidlna server.

```bash
sudo apt install minidlna
```

2) Install git, node and npm. I use node version v14.20.0 and npm version 6.14.17 (google it), example:

```bash
sudo apt install git
sudo apt install nodejs
sudo apt install npm
```

3) Install enact client (version 5.1.3):

```bash
npm install -g @enact/cli
```

4) Create a new folder or go to where you want to download source code, example:

```bash
mkdir ~/media-player-test
cd ~/media-player-test
```

5) Download necessary source code from github, example:

```bash
git clone https://github.com/ediaz23/spnp_webos_app --recursive --single-branch --branch=master --depth 3
git clone https://github.com/ediaz23/spnp_webos_service --single-branch --branch=master --depth 3
git clone https://github.com/ediaz23/spnp_webos_server --single-branch --branch=master --depth 3
```

6) Run npm install for each project.

```bash
cd spnp_webos_app && npm install && cd ..
cd spnp_webos_service && npm install && cd ..
cd spnp_webos_server && npm install && cd ..
```

7) In one terminal run server:

```bash
cd spnp_webos_server && npm run play
```

8) In other terminal run front-end:

```bash
cd ~/media-player-test/spnp_webos_app && npm run serve
```


## How to create local package? (Linux)

7) Follow previously 5 steps and run build-dev for development or build-p for production,
  and app will be created in ~/webos-crunchy-test/crunchyroll-webos-stream/bin:

```bash
cd ~/media-player-test/spnp_webos_app && npm run build-dev
```


## Help

Control back event.

```
window.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 461 }))
```


## ⚖ License

This project is released under [Apache 2.0 License](LICENSE)
