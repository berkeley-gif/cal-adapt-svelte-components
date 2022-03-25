# Cal-Adapt Svelte Components

This repository is for developing new UI Components for [Cal-Adapt.org](https://cal-adapt.org). These components use the [Svelte](https://svelte.dev/) JavaScript framework and [IBM Carbon Design](https://www.carbondesignsystem.com/) system.

## Developing

Once you've created a project and installed dependencies with `npm install` start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Code Credits

### create-svelte

This project was bootstrapped using [SvelteKit](https://kit.svelte.dev)'s [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte) project generator:

```bash
npm init svelte@next cal-adapt-svelte-components
```
