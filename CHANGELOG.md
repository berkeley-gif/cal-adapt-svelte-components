# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2023-05-16

This major release fully focuses on getting in sync with the wider SvelteKit ecosystem and doesn't in itself introduce any new rules or features compared to version 1.1.2.

### Major changes

- Update `@sveltejs/kit` to `1.5.0`
- Use `JSDoc` annotations for type checking instead of `TypeScript` as reccomended for Svelte libraries
- Use `Vitest` for unit testing instead of `Jest`
- Update node version to `18.16.0`

### Changed features

- Update all npm dependencies
- Update default configs
- Use folder based routing
- Move preload function to seprate file
- Move reusable type declarations to a common file under lib root
- Reorganize styles and remove unused styles
- Move unit tests to components
