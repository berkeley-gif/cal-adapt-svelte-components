# Cal-Adapt Svelte Components

This repository is for developing new UI Components for [Cal-Adapt.org](https://cal-adapt.org). These components use the [Svelte](https://svelte.dev/) JavaScript framework and [IBM Carbon Design](https://www.carbondesignsystem.com/) system.

The rationale for this component repository is:

1. To reduce the time for developing and iterating on UI components for Cal-Adapt.

2. Develop components in isolation so that they may be compatible in other Cal-Adapt related projects.

## Developing

Once you've installed dependencies with `npm install`, start a development server:

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

**Note:** To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.

## Packaging

To compile the components from the [`src/lib`](./src/lib/) component directory do:

```bash
npm run package
```

This will create a local `package/` directory with the compiled Svelte components, meaning all TypeScript will be converted to normal JavaScript and all Sass will be converted to normal CSS.

The `package` directory may then be [`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link)'d to the Cal-Adapt repository for local development.

## Code Credits

### create-svelte

This project was bootstrapped using [SvelteKit](https://kit.svelte.dev)'s [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte) project generator:

```bash
npm init svelte@next cal-adapt-svelte-components
```
