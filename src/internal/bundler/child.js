"use strict";
/**
 * @module wraps webpack in a nice api
 */
var webpack = require("webpack");
/**
 * Creates a webpack bundle
 */
function bundle(args) {
    return new Promise(function (res, rej) {
        var config = {
            devtool: 'source-map',
            entry: args.entryMap,
            output: {
                filename: args.outputDirName + '/[name].js'
            },
            resolve: {
                extensions: ['', '.ts', '.tsx', '.js']
            },
            module: {
                loaders: [
                    { test: /\.tsx?$/, loader: 'ts-loader' }
                ]
            },
            /** Decrease noise */
            stats: {
                hash: false, version: false, timings: false, assets: false,
                chunks: false, modules: false, reasons: false, children: false,
                source: false, publicPath: false, warnings: true,
                /** Errors only */
                errors: true,
                errorDetails: true,
            },
            /**
             * Custom compiler options for demo building.
             * Effectively what would be in each app tsconfig.json
             **/
            ts: {
                compilerOptions: {
                    "jsx": "react",
                    "target": "es5",
                    "moduleResolution": "node",
                    "experimentalDecorators": true,
                    "lib": [
                        "es6",
                        "dom"
                    ]
                }
            }
        };
        var compiler = webpack(config);
        compiler.run(function (err, stats) {
            if (err) {
                console.error("BUNDLING FAILED:", args);
                console.error(err);
                rej(err);
                return;
            }
            res();
        });
    });
}
exports.bundle = bundle;
var args = JSON.parse(process.argv[2]);
bundle(args);
