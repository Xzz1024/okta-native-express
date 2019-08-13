
## Running This Example


Then install dependencies:

```bash
npm install
```

Now you need to gather the following information from the Okta Developer Console:

- **Client ID** 

- **baseURL** -  For example, `https://dev-1234.okta.com/oauth2/default/v1`.



With variables set, start the app server:

```
node run
```

Now navigate to http://localhost:3001 in your browser.

If you see a home page that prompts you to login, then things are working!  Clicking the **Log in** button will render a custom login page, served by the Express application, that uses the Okta Sign-In Widget to perform authentication.

