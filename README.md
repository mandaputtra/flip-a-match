# Flip A Match

A simple game to find match of two colors.

## Contributing

This project uses [Vite](https://vitejs.dev/) with [Typescript](https://www.typescriptlang.org/). Follow these step to contribute to this repository. 

### Requirements

In order to run this project on your machine you need to install this :
    
- [Node.js](https://nodejs.org/en)
- [Git](https://git-scm.com/)
- [pnpm](https://pnpm.io/)

### Development

After cloning the repository, go inside the folder and install dependencies using terminal

```bash
pnpm i
```

After that you could run the app with below terminal command, you could open the app on your browser with url that displayed on your terminal

```bash
pnpm dev
```

### Deployment

If you want to deploy this

```bash
pnpm build
```

Drag and Drop the `dist` folder to [Netlify drop](https://app.netlify.com/drop). Either way you could host it in every static side hosting possible.

### Pull Request

To contribute code to this repository, please [fork this repository](https://github.com/mandaputtra/flip-a-match/fork). After that make a branch and pull request with your changes. 
Pull request title follow standard rules that can be [read here](https://namingconvention.org/git/pull-request-naming.html).

Example : 

```txt
#28 - Fix bug on finish game
```

#28 is issue number, and the rest is your title. If you dont have any issue number just write what is your pull request tried to change

## Roadmaps

- [ ] Better Animations (smooth flip, flip all card on enter)
- [ ] Adding levels or difficulties (adding more tiles, adding more selection)
- [ ] Multiplayer using P2P (GunJS)
- [ ] Explore TWA (Trusted Web App) and release it on mobile platform
