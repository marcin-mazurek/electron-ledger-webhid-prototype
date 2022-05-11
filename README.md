## How to run the project?

```bash
yarn
yarn start
```

When the Electron app launches, before doing anything, plug in Ledger, enter the PIN and launch Cardano app.

This is just a prototype which does not have any error handling nor retry capability. If anything goes wrong, you need to kill te Electron process and reconnect your Ledger.