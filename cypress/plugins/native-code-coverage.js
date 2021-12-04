const CDP = require("chrome-remote-interface");
const path = require("path");
const fs = require("fs");

const COVERAGE_TMP_DIR = require("path").resolve(__dirname, "../../coverage/tmp")
try {
    fs.mkdirSync(COVERAGE_TMP_DIR, {recursive: true});
} catch (e) {
}

let cdp, fileConter = 0;

module.exports = (on, config) => {

    on("before:browser:launch", function (browser, launchOptions) {
        if (browser.name === "chrome" || browser.name === "edge" || browser.name === "electron") {

            let rdpArgument = launchOptions.args.find(arg => arg.startsWith("--remote-debugging-port"));
            if (!rdpArgument) {
                rdpArgument = "--remote-debugging-port=8315";
                launchOptions.args.push(rdpArgument);
            }

            const port = parseInt(rdpArgument.split("=")[1]);
            console.log(`connecting to chrome debugging protocol on port ${port}`);

            const tryConnect = async () => {
                try {
                    cdp = await new CDP({port: port});
                    cdp.on("disconnect", () => {
                        console.log("chrome debugging protocol disconnected");
                        cdp = null;
                    });
                } catch (e) {
                    console.error(e.message);
                    setTimeout(tryConnect, 1000);
                }
            };
            setTimeout(tryConnect, 250);

            return launchOptions;
        }
        return null;
    });

    on("task", {

        ["coverage:before"]() {
            if (cdp) {
                console.log("starting code coverage");
                const callCount = true;
                const detailed = true;
                return Promise.all([
                    cdp.Profiler.enable(),
                    cdp.Profiler.startPreciseCoverage(callCount, detailed)
                ]);
            }
            return null;
        },

        ["coverage:after"]() {
            if (cdp) {
                console.log("stopping code coverage");
                return cdp.Profiler.takePreciseCoverage().then(coverage => {
                    const filename = path.join(COVERAGE_TMP_DIR, `coverage-${fileConter++}.json`);
                    return Promise.all([
                        fs.promises.writeFile(filename, JSON.stringify(coverage), "utf8"),
                        cdp.Profiler.stopPreciseCoverage()
                    ]);
                });
            }
            return null;
        }
    });
};
