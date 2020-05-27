const less = require('less');
const LessPluginCleanCSS = require('less-plugin-clean-css');
const LessPluginNpmImport = require('less-plugin-npm-import');
const fs = require('fs');
const darkThemeVars = require('@delon/theme/theme-dark');
const compactThemeVars = require('@delon/theme/theme-compact');
const appStyles = 'src/styles.less';
const themeContent = `@import '${appStyles}';`;

function gen(type) {
  return less
    .render(themeContent, {
      javascriptEnabled: true,
      plugins: [new LessPluginNpmImport({ prefix: '~' }), new LessPluginCleanCSS({ advanced: true })],
      modifyVars: {
        ...(type === 'dark' ? darkThemeVars : compactThemeVars),
      },
    })
    .then((data) => {
      fs.writeFileSync(
        `src/assets/style.${type}.css`,
        data.css,
      );
    })
    .catch((e) => {
      console.error(type, e);
    });
}

Promise.all([gen('dark'), gen('compact')]).then(() => {
  console.log('Success!');
});