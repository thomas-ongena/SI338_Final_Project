# TMGWebsite

`/app` contains the web assets

`/api` contains the code for the azure functions

To run API, in the `api` directory:

- Make sure you are using node 18 `nvm use 18`
- `npm install -g @azure/static-web-apps-cli` if you haven't already
- `swa start` to run it on http://localhost:3000/admin
- Directly call API at http://localhost:4280/api/locDunContent
