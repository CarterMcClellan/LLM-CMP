# LLM-CMP

Typescript React application to generate output from multiple LLM Models in parallel and render them side by side for comparison...
<img src="readme_assets/llm_cmp.png" alt="llm cmp" width="300" height="300"/>

## View the Site

The website is live [here](https://cartermcclellan.github.io/LLM-CMP) if you are interested in playing around with it. To make updates to the site you can simple run

```bash
yarn run deploy
```

:warning: This will only work if your github credentials match those listed in `package.json`, and the repo name corresponds to your own repo name

## Quick Start

Install dependencies

```bash
yarn install
```

Start the devlopment server

```bash
yarn start
```

### Todo
* Mock provider hooks responses to test parsing/ rendering logic