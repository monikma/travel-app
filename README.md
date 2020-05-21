# Travel App

This app allows you to plan your trips, and display them along with photos.

# Used tools

## Third party APIs:
- [Pixabay](https://pixabay.com/api/docs/?)
- [Weatherbit](https://www.weatherbit.io/)
- [Geonames](http://www.geonames.org/manageaccount)

## npm modules
- see `package.json` file

This project uses Webpack.

# Running the site

Open the `dist/index.jtml` file.

# Building the site manually

For production run:

`npm run build-prod`

and check the `dist` folder.

# Development setup

To build the site for dev environment run:

`npm run build`

and check the `dist` folder.

For development webpack-dev-server run:

`npm run build-dev`

# Optional task

The optional task I did is falling back to country image if a city image could not be found, see `pixabay.js`