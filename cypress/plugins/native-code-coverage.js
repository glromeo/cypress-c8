const CDP = require("chrome-remote-interface");
const path = require("path");
const fs = require("fs");
const v8ToIstanbul = require("v8-to-istanbul");
const libCoverage = require("istanbul-lib-coverage");
const libReport = require("istanbul-lib-report");
const reports = require("istanbul-reports");

const {readFile, writeFile} = fs.promises;

const BASEDIR = path.resolve(__dirname, "../..");
const PUBLIC = path.resolve(BASEDIR, "public");
const NYC_OUTPUT = path.resolve(BASEDIR, ".nyc_output");
try {
    fs.mkdirSync(NYC_OUTPUT, {recursive: true});
} catch (e) {
}

const NYC_OUTFILE = path.join(NYC_OUTPUT, `out.json`);
try {
    fs.rmSync(NYC_OUTFILE);
} catch (e) {
    if (e.code === "ENOENT") throw new Error("unable to delete previous coverage results");
}

let cdp;

module.exports = (on, config) => {

    on("before:browser:launch", function (browser, launchOptions) {
        console.log("before:browser:launch");
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
                    cdp = await CDP({port});
                    cdp.on("disconnect", () => {
                        console.log("chrome debugging protocol disconnected");
                        cdp = null;
                    });

                    console.log("starting code coverage");
                    await cdp.Profiler.enable();
                    await cdp.Profiler.startPreciseCoverage({
                        detailed: true,
                        callCount: true,
                        allowTriggeredUpdates: true
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

    on("after:spec", async (results) => {
        if (cdp) {
            console.log("stopping code coverage");
            const coverage = await cdp.Profiler.takePreciseCoverage();
            const coverageMap = libCoverage.createCoverageMap();

            try {
                const data = JSON.parse(await readFile(NYC_OUTFILE, "utf8"));
                coverageMap.merge(data);
            } catch (ignored) {
            }

            for (const {url, functions} of coverage.result) if (url) try {
                const {pathname} = new URL(url);
                if (pathname.startsWith("/lib/") && pathname.endsWith(".js")) {
                    const converter = v8ToIstanbul(
                        path.join(PUBLIC, pathname),
                        0,
                        null,
                        pathname => {
                            const relative = path.relative(BASEDIR, pathname).replaceAll("\\", "/");
                            const accept = relative.startsWith("src") || relative.startsWith("../../src");
                            return !accept;
                        }
                    );
                    await converter.load();
                    converter.applyCoverage(functions);
                    coverageMap.merge(converter.toIstanbul());
                }
            } catch (ignored) {
                console.error(ignored);
            }

            await writeFile(NYC_OUTFILE, JSON.stringify(coverageMap.toJSON()));

            const context = libReport.createContext({
                dir: path.resolve(BASEDIR, "coverage"),
                coverageMap
            });

            for (const reporter of ["html"]) {
                reports.create(reporter, {
                    skipEmpty: false
                }).execute(context);
            }

            await cdp.Profiler.stopPreciseCoverage();
        }
        return null;
    });
};
