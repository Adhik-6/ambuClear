# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

To Run the program:
1. clone the repo
2. make sure add a .env file with variables: VITE_GOOGLE_MAPS_API_KEY
3. Make sure you have node installed in your computer.
4. run: `npm i`
5. run: `npm run dev`

To push changes, run the following:
1. Navigate into ambuClear folder using `cd` command in terminal
2. Run: `git add .`
3. Run: `git commit -m "message_1"`
4. Run: `git push -u origin main`

To Pull changes:
1. Run: `git pull origin main`

Things to add:
1. Add 5 traffic signals
2. Nearby ambulance must be visible when the app is opened.
