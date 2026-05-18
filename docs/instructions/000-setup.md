# Setup

## 📦 Install stuff

### Install git `>= 2.23`

https://git-scm.com/downloads

:::warning
Make sure to pick a git version `>= 2.23`
:::

### Install NodeJS `>=24.0.0`

:::warning
Make sure to pick a NodeJS version `>=24.0.0`
:::

https://nodejs.org/en/download

### Install pnpm

https://pnpm.io/installation

```sh
corepack enable
```

or if you are using [Volta](https://volta.sh/)

```sh
volta install pnpm
```

## 📥 Retrieve source code and install dependencies

```sh
git clone https://github.com/marmicode/react-vitest-mini-workshop.git

cd react-vitest-mini-workshop

pnpm install
```

## ⌨️ Cook CLI

The `cook` CLI allows you to cook exercises:

- select an exercise from a list
- checkout the implementation when the test is ready _(♻️ TDD mode)_
- go to the solution

```sh
pnpm cook
```

## 🤖 Agentic Tutor

Whenever you need help, you can ask the agentic tutor for a hint.

You can use Claude or Cursor custom command: `/next-hint` or simply ask your favorite agent about "next hint".

Supported Agents:

- Claude
- Cursor
- Gemini
