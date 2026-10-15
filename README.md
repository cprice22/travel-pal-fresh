# TravelPal

TravelPal is a responsive travel discovery application built with React and Vite. Search for a destination, explore nearby restaurants, hotels, and attractions, and save places for future visits.

## Features

- Destination search powered by Google Geocoding.
- Nearby place searches returning up to 20 results within a 5 km radius.
- Interactive Google Maps markers connected to place cards and detail popups.
- Filters for place name, category, minimum rating, and saved places.
- Persistent saved place IDs using localStorage, with fresh details retrieved after a refresh.
- Direct links to open places in Google Maps.
- Loading states, error handling, and protection against outdated nearby-search responses.

## Technologies

React, JavaScript, Vite, CSS, @vis.gl/react-google-maps, and Google Maps Platform APIs.

## Learning Focus

Built to practice reusable components, props, state, event handling, effects, refs, asynchronous API requests, and browser storage.

Inspired by JavaScript Mastery’s Travel Advisor tutorial and adapted into a custom application using current React tooling and Google Places API integration.




# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
