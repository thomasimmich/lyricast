# Lyricast Realtime Lyrics Caster

This project is supposed to deliver real-time lyrics doing live gigs that mesmerize the audience with captivating kinetic type animation.

## Inspirations for Kinetic Type Animations:

- [Cool Lyrics Video](https://youtu.be/GWtfOHBF1_w?si=LyBN6-1jxKM9iPIY)
- [Spline 3D Text Animation](https://www.youtube.com/watch?v=t9mIHzS3ZQs&t=1s)
- [Spline Animation Loop](https://www.youtube.com/watch?v=UbtGZ1pncpo)
- [Spline Viewer](https://www.youtube.com/watch?v=NV6ImnrN0YU)

# Technology

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

### Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json", "./tsconfig.node.json"],
    tsconfigRootDir: __dirname,
  },
};
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list
