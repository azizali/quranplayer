# TODO:

- [x] Overwrite play
- [x] Tracks in title
- [x] Design
- [x] Design 2
- [x] BUG: Safari not working
- [x] Get sound file from mp3 source
- [x] Tick sound on repeat
- [x] Seeking error
- [x] re-Start from start
- [x] Save prefence in localstorage
- [ ] Backup sound tracks from server
- [ ] BUG: stops in the middle and cant restart again
- [ ] BUG: When start and end track are same number, it does not play
- [ ] App as PWA + Explore Tinybase
- [ ] Reciter Selection
- [ ] Dark mode

# Welcome to Remix!

- [Remix Docs](https://remix.run/docs)
- [Netlify Functions Overview](https://docs.netlify.com/functions/overview)

## Netlify Setup

1. Install the [Netlify CLI](https://docs.netlify.com/cli/get-started/):

```sh
npm i -g netlify-cli
```

If you have previously installed the Netlify CLI, you should update it to the latest version:

```sh
npm i -g netlify-cli@latest
```

2. Sign up and log in to Netlify:

```sh
netlify login
```

3. Create a new site:

```sh
netlify init
```

## Development

Ensure all packages are installed by running:

```sh
npm install
```

Run

```sh
netlify dev
```

Open up [http://localhost:8888](http://localhost:8888), and you're ready to go!

### Serve your site locally

To serve your site locally in a production-like environment, run

```sh
netlify serve
```

Your site will be available at [http://localhost:8888](http://localhost:8888). Note that it will not auto-reload when you make changes.

## Deployment

There are two ways to deploy your app to Netlify, you can either link your app to your git repo and have it auto deploy changes to Netlify, or you can deploy your app manually. If you've followed the setup instructions already, all you need to do is run this:

```sh
# preview deployment
netlify deploy --build

# production deployment
netlify deploy --build --prod
```
