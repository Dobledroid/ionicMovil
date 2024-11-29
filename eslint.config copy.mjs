import globals from "globals";
import pluginReact from "eslint-plugin-react";
import pluginJSXA11y from "eslint-plugin-jsx-a11y"; // Importar el plugin

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,jsx}"], // Incluye archivos .js, .mjs, .cjs y .jsx
    languageOptions: { globals: globals.browser },
    plugins: {
      react: pluginReact, // Registrar el plugin React
      "jsx-a11y": pluginJSXA11y // Registrar el plugin JSX Accessibility
    },
    rules: {
      "jsx-a11y/anchor-is-valid": "off"
    }
  },
  pluginReact.configs.flat.recommended, // Reglas recomendadas de React
  {
    settings: {
      react: {
        version: "detect" // Detectar automáticamente la versión de React
      }
    }
  }
];
