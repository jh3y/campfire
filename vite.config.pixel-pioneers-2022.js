const { resolve } = require('path')
const { defineConfig } = require('vite')
const { globby } = require('globby')


const demos = {
  horizontal_basic: resolve(__dirname, 'horizontal/basic/index.html'),
  horizontal_fullbleed: resolve(__dirname, 'horizontal/fullbleed/index.html'),
  horizontal_paged: resolve(__dirname, 'horizontal/paged/index.html'),
  horizontal_variable: resolve(__dirname, 'horizontal/variable/index.html'),
  horizontal_smart: resolve(__dirname, 'horizontal/smart/index.html'),
  horizontal_target: resolve(__dirname, 'horizontal/target/index.html'),

  vertical_basic: resolve(__dirname, 'vertical/basic/index.html'),
  vertical_fullbleed: resolve(__dirname, 'vertical/fullbleed/index.html'),
  vertical_paged: resolve(__dirname, 'vertical/paged/index.html'),
  vertical_target: resolve(__dirname, 'vertical/target/index.html'),

  both_basic: resolve(__dirname, '2d/basic/index.html'),
  both_target: resolve(__dirname, '2d/target/index.html'),
  both_table: resolve(__dirname, '2d/table/index.html'),
}

module.exports = defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'pixel-pioneers-2022/index.html'),
        {...demos}
      }
    }
  }
})