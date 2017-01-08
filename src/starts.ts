import { starts } from 'starts';

starts({
  serve: {
    dir: './docs',
    port: 4000
  },
  run: [
    { cmd: 'npm run builddocs', watch: ['src/**', '!src/**/child.js'] },
    { cmd: 'npm run buildtsc -- -w', watch: ['src/**/*.ts', '!src/**/child.js'] }
  ]
})