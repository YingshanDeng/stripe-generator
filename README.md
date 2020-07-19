# stripe-generator
Generates a tiling, angled, stripe pattern. The pattern will always tiled continuously!

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![Code Style](https://img.shields.io/badge/eslint-airbnb-brightgreen)](https://github.com/iamturns/eslint-config-airbnb-typescript)

## Usage
- orientation should be 0°~180°
- support multi stripe configs
- return stripe canvas

```js
const stripeCanvas = stripeGenerator({
    stripe: [{
        size: 10,
        color: '#ff0000',
    }, {
        size: 10,
        color: '#278be8',
    }],
    space: {
        size: 10,
        color: '#fff',
    },
    orientation: 120,
})
```

## Dev
```sh
npm i
npm run dev
```

## Logic
![image.png](https://i.loli.net/2020/07/12/2Jit1BnmQsAeDSE.png)
![image.png](https://i.loli.net/2020/07/12/NsZYW2G58uKxcvT.png)
