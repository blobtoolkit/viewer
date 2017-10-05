

```
npm init
sudo npm install webpack-dev-server -g
npm install --save-dev nodemon mocha should mocha-mongoose
npm install --save promise mkdirp-promise jsonwebtoken mongoose bcrypt passport passport-jwt passport-local express body-parser expres-cors swagger-jsdoc supertest minimist d3 dotenv app-root-path webpack-dev-server webpack babel-core babel-loader babel-preset-es2015 babel-polyfill react react-dom babel-preset-react react-router-dom react-resizable style-loader css-loader extract-text-webpack-plugin webpack-combine-loaders sass-loader node-sass postcss-loader sass-web-fonts svg-sprite-loader svgo-loader redux react-redux redux-logger redux-thunk reselect deep-get-set redux actions babel-plugin-transform-object-rest-spread shallow-equal immutable-update konva react-konva
```

```
npm test
```

```
mkdir -p /tmp/data
mongod --dbpath=/tmp/data
#export DEBUG=express:*
npm run start
```


plots:
- canvas vs svg
- circle vs square vs hex
- z scale (range and type)
- z reduce function (min, max, sum, mean, median)
- secondary/tertiary plots
- bin plot order

scaling:
- manually set field domain
- change field scale type

fields:
- manually set field domain
- change field scale type
- convert variable to category
- improve display

filters:
- toggle on/off
- toggle inverse
- apply all inverse
- filtered data to new dataset

selection:
- field and filter type
- overlay
- adjacent cells

dataset:
- store/clear state when changing dataset
- hard filter incoming data

streaming:
- support reload/streaming of fields
- enable timestamping

buttons:
- make svg icons for each function

colors:
- alternate color palettes
- modify color palette
