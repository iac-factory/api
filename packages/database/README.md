# `ts-esm-standard` #
 
A Node.js ESM Standard Template Package -- Extended via TypeScript

## Distribution ##

Distribution(s) are compliant back to `ES3`.

Compilation is achieved via `npm start` or `npm run start`.

Once compiled, a `node` process can then execute any one of the following:

- `./distribution`
- `./distribution/common-js`
- `./distribution/ecma`

```node
app.param('user', function (req, res, next, id) {
  // try to get the user details from the User model and attach it to the request object
  User.find(id, function (err, user) {
    if (err) {
      next(err)
    } else if (user) {
      req.user = user
      next()
    } else {
      next(new Error('failed to load user'))
    }
  })
})
```