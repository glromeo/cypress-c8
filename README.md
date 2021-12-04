# ![Cypress C8](cypress-c8.png) 
### no babel no cry...
![Tux, the Linux mascot](picture.png)

This project runs tests with `Cypress` and collect code coverage using `v8 native Profiler` and the `Chrome Debugger Protocol` for then generating reports using `c8`.

### Install
Well... in this case just clone the project and tailor it to your needs. Happy hacking!

### Quick Start
```bash
git clone https://github.com/glromeo/cypress-c8.git
cd cypress-c8
yarn install
yarn ci
yarn report
```
the report will be available in [coverage/index.html](https://glromeo.github.io/cypress-c8/coverage/index.html)

### Start server and test
This project follows the convention explained [here](https://github.com/bahmutov/start-server-and-test#use)

### Electron 
The only way I could get `electron` to enable CDP is to use the environment variable
```bash
ELECTRON_EXTRA_LAUNCH_ARGS=--remote-debugging-port=8315
``` 
...if anyone managed to get it working with **launchOptions**, please help!

### Many thanks to 

- The Cypress team for [cypress-example-kitchensink](https://github.com/cypress-io/cypress-example-kitchensink)
- Gleb Bahmutov for [cypress-native-chrome-code-coverage-example](https://github.com/bahmutov/cypress-native-chrome-code-coverage-example)
- Benjamin E. Coe for his amazing [c8 - native V8 code-coverage](https://github.com/bcoe/c8) 
- Andrea Cardaci for [chrome-remote-interface](https://github.com/cyrus-and/chrome-remote-interface)
