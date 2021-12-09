/* eslint-disable no-eval */
const path = require("path");
const fs = require("fs");
const log = require("debug")("cypress:cucumber");
const chokidar = require("chokidar");
const compile = require("cypress-cucumber-preprocessor/lib/loader.js");
const compileFeatures = require("cypress-cucumber-preprocessor/lib/featuresLoader.js");
const stepDefinitionPath = require("cypress-cucumber-preprocessor/lib/stepDefinitionPath.js");

const touch = (filename) => {
    fs.utimesSync(filename, new Date(), new Date());
};

let watcher;

const createBundler = require("@bahmutov/cypress-esbuild-preprocessor");

module.exports = (options = {}) => {
    if (typeof options !== "object") {
        throw new Error("Preprocessor options must be an object");
    }

    async function streamToString(stream) {
        const chunks = [];
        return new Promise((resolve, reject) => {
            stream.on('data', chunk => chunks.push(Buffer.from(chunk)));
            stream.on('error', reject);
            stream.on('end', () => {
                resolve(Buffer.concat(chunks).toString('utf8'))
            });
        })
    }

    const bundler = createBundler({
        ...options,
        define: {
            "__dirname": '"/"'
        },
        inject: [
            path.resolve(__dirname, "./process-shim.js")
        ],
        plugins: [{
            name: "cucumber",

            setup(build) {
                build.onResolve({filter: /^path$/}, () => {
                    return {
                        path: require.resolve("path-browserify"),
                    };
                });
                build.onResolve({filter: /\.features?$/}, (args) => {
                    return {
                        path: args.path,
                    };
                });
                build.onLoad({filter: /\.feature$/}, (args) => {
                    return {
                        contents: compile(fs.readFileSync(args.path), args.path)
                    }
                });
                build.onLoad({filter: /\.features$/}, (args) => {
                    return ({
                        contents: compileFeatures(_, args.path)
                    });
                });
            }
        }]
    });

    return async (file) => {
        if (file.shouldWatch) {
            if (watcher) {
                watcher.close();
            }
            watcher = chokidar
                .watch(
                    [
                        `${stepDefinitionPath()}*.js`,
                        `${stepDefinitionPath()}*.ts`,
                        `${stepDefinitionPath()}*.tsx`,
                    ],
                    {
                        ignoreInitial: true,
                    }
                )
                .on("all", () => {
                    touch(file.filePath);
                });
        }
        return bundler(file);
    };
};
