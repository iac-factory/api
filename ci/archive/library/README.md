## Usage ##

```bash
npm install .
tsc --build ./tsconfig.json
node "$(dirname "$(npm root)")"

# --> HTTP 2.0 (HTTPs)
node "$(dirname "$(npm root)")" --https
```
