# auth

Auth0 wiring for the np-aspire apps: `provideNpAuth()` configures the Auth0 Angular SDK
(Authorization Code + PKCE, tokens in memory). The API validates tokens and enforces access;
this library never decides it. The HTTP interceptor and the permission helpers land here with
the generated API client (milestone 2).

## Running unit tests

Run `nx test auth` to execute the unit tests.
