# MobilecmsAdmin

### This project is the admin tool of [mobilecms](https://github.com/OlivierB29/mobilecms).

[![Build Status](https://travis-ci.org/OlivierB29/mobilecms-admin.svg?branch=master)](https://travis-ci.org/OlivierB29/mobilecms-admin)

Manage content for a sport organization : News, calendar events, public pages, documents, ...
Like any CMS, it is intended to post articles and attach files (images or documents).

The responsive design with [Material](https://material.angular.io/) can be used with a mobile phone.

Visit the [admin demo](https://olivierb29.github.io/mobilecms-demo/admin) on github pages.
Use any user-password combination on this version. API calls use a mocked API.

# Web site frontend
- visit the [demo](https://olivierb29.github.io/mobilecms-demo).
- [source code](https://github.com/OlivierB29/mobilecms)

# Server requirements
- Hosted on a cheap server, with no database available

## Dependencies
- Angular 5 + [Material](https://material.angular.io/)
- [@ngx-translate](http://www.ngx-translate.com/)
- A running API [mobilecms-api](https://github.com/OlivierB29/mobilecms-api)

## Dev dependencies

- NodeJS
- [Angular CLI](https://cli.angular.io/)

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run demo` | `ng serve --env=demo` for a live version without backend API.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

Build with specified web context : `npm run dist`
Demo build for github pages : `npm run demobuild`
