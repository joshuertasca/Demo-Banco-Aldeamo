module.exports = {
    // Opciones de configuración del plugin
    options: {
      // Archivos o directorios a excluir del análisis
      exclude: ["**/node_modules/**", "**/dist/**"],
    },
    // Rutas de los archivos que se van a analizar
    files: [
      {
        path: "./package.json",
        package: true,
      },
      {
        path: "./src/",
        ignore: ["**/*.test.js", "**/*.spec.js", "**/*.stories.js"],
      },
    ],
  };