module.exports = {
  rollup(config, options) {
    const { localDev, name } = options;
    const outputDirectory = (() => {
      if (localDev) {
        return `example/${name}`;
      }

      return `dist`;
    })();

    if (localDev) {
      config.output.file = config.output.file.replace("dist", outputDirectory);
    }

    return config;
  },
};
