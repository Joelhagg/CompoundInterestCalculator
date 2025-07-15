# Compound Interest Calculator

### A nice visual tool for calculating your expected total savings amount with compound interest

This is a project where I'm looking at new technologies and just having fun exploring! Bun seems so fast and sweet, Svelte is on the rise and I have thought about ChartJS for some time!

When I started this project I had to get Bun running on a Windows machine which was not supported at the time. It was tricky but I got it going with WSL!
Now that I'm revisiting this project, Bun is supported on Windows which is great!
I had to create the settings.json file to be able to run Bun.

Svelte has been awesome to try out and ChartJS is sweet! I use Vercel for the CI/CD which is so smooth!

Take a look and test how many years you have to save to be able to retire 😊

<h3>
Now live! Please take a look
<a href="https://compound-interest-calculator-chart.vercel.app/" target="_blank">Compound Interest Calculator</a>
</h3>

Hope you like it and find it interesting! /Joel ❤️

<br>

## Svelte

Everything you need to build a Svelte project, powered by [`create-svelte`](https://github.com/sveltejs/kit/tree/main/packages/create-svelte).

<br>

## Getting Started with Bun on Windows

To get started with this project using Bun on Windows, follow these steps:


- To get started with this project using Bun on Windows, first open PowerShell and install Bun by running the command `iwr https://bun.sh/install.ps1 -UseBasicParsing | iex`. 

- If you are using WSL or another Unix-like shell, you can instead run `curl -fsSL https://bun.sh/install | bash`. 

- After installing Bun, clone this repository with `git clone https://github.com/Joelhagg/CompoundInterestCalculator.git` and navigate into the project folder using `cd CompoundInterestCalculator`. 

- Then, install all dependencies by running `bun install`. 

- Finally, start the development server with `bun run dev` and open [http://localhost:5173](http://localhost:5173) in your browser to use the

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```bash
# create a new project in the current directory
bun create svelte@latest

# create a new project in my-app
bun create svelte@latest my-app
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
bun run dev

# or start the server and open the app in a new browser tab
bun run dev -- --open
```

## Building

To create a production version of your app:

```bash
bun run build
```



> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
