A fork of [aschenkel/Peak](https://github.com/aschenkel/Peak) that uses:

- Expo (instead of react-native-cli)
- SFSafariViewController / Chrome Custom Tabs + Auth0 for Twitter authentication (instead of react-native-fabric-twitterkit)
- A [WebTask](https://webtask.io/) along with a non-interactive Auth0 client to call securely into Twitter (adapted from [this example](https://github.com/vikasjayaram/twitter-status-webtask)) (instead of storing secrets on client and polyfilling node core APIs to use a node Twitter client)

Play with it at: https://expo.io/@community/peak
