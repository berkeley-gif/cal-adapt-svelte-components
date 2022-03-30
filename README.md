# Cal-Adapt Svelte Components

This repository is for developing new UI Components for [Cal-Adapt.org](https://cal-adapt.org). These components use the [Svelte](https://svelte.dev/) JavaScript framework and [IBM Carbon Design](https://www.carbondesignsystem.com/) system.

The rationale for this component repository is:

1. To reduce the time for developing and iterating on UI components for Cal-Adapt.

2. Develop components in isolation so that they may be compatible in other Cal-Adapt related projects.

## The Components

### Search with auto-suggest

A search box component with auto-suggest. Similar to the [CDS ComboBox](https://carbon-components-svelte.onrender.com/components/ComboBox) but with some corrections to `aria` and `role` attributes for improved accessibility.

- [Component code](./src/lib/Search/)
- [Demo](./src/routes/search.svelte)

#### Props

| Prop name    | Type                     | Default Value                        | Description                                        |
| ------------ | ------------------------ | ------------------------------------ | -------------------------------------------------- |
| description  | string                   | "Search for a place name or address" | Sets the input's label & placeholder text          |
| searchValue  | string                   | ""                                   | The value of the search input                      |
| suggestions  | SearchItem               | [ ]                                  | The list of suggestions.                           |
| outlineColor | string                   | "#fdd13a"                            | The outline color to use when the input is focused |
| inputRef     | HTMLInputElement \| null | null                                 | Reference to the search input HTML node.           |
| inputId      | string                   | `cac-${Math.random().toString(36)}`  | Optional id for the input element                  |
| size         | "sm"\|"lg"\|"xl"         | "sm"                                 | The size of the carbon components search bar.      |

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

To compile the components from the [`src/lib`](./src/lib/) component directory so that they may be used as a dependency within another project do:

```bash
npm run package
```

This will create a local `package/` directory with the compiled Svelte components, meaning all TypeScript will be converted to normal JavaScript and all Sass will be converted to normal CSS.

## Linking

The `package` directory of this repo may be [`npm link`](https://docs.npmjs.com/cli/v7/commands/npm-link)'d to another project for local development.

First, from the `./package` directory of this repository (assuming you have already done `npm run package`):

```bash
npm link
```

Then from the project directory that uses this component library:

```bash
npm link cal-adapt-svelte-components
```

Now when the `package` directory is updated the project using it will reflect those updates. This means whenever components are updated in `src/lib` the script `npm run package` will need to be run in order to reflect updates.

**Note** that if you have multiple versions of NodeJS installed that you need to make sure you're using `npm link` with the same NodeJS and NPM version.

**Note** that the `caladapt-website-2021` project uses [Sapper](https://sapper.svelte.dev) (the predecessor to SvelteKit) and in order to import components from this repo you must use the component's full path.

For example:

```js
import SomeComponent from "cal-adapt-svelte-components/SomeComponent/SomeComponent.svelte";
```

Sapper / Webpack will not be able to resolve the bare module import and thus the following will fail:

```js
import { SomeComponent } from "cal-adapt-svelte-components";
```

## Other NPM Scripts

### sass:check

The rebuild times for the project level / global Sass is a little slow with Vite. To verify that the project's Sass compiles successfully you may do:

```bash
npm run sass:check
```

If all goes well no output will be shown. Any errors will be printed to the console.

## Code Credits

### create-svelte

This project was bootstrapped using [SvelteKit](https://kit.svelte.dev)'s [`create-svelte`](https://github.com/sveltejs/kit/tree/master/packages/create-svelte) project generator:

```bash
npm init svelte@next cal-adapt-svelte-components
```
