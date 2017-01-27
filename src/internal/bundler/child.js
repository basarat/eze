"use strict";
/**
 * @module wraps webpack in a nice api
 */
var webpack = require("webpack");
var fse = require("fs-extra");
/**
 * Creates a webpack bundle
 */
function bundle(args) {
    return new Promise(function (res, rej) {
        if (!fse.existsSync(args.entryPointName)) {
            /** Webpack ignores this siliently sadly so we need to catch it ourselves */
            var error = "Entry point does not exist: " + args.entryPointName;
            console.error(error);
            rej(new Error(error));
        }
        var config = {
            devtool: 'source-map',
            entry: args.entryPointName,
            output: {
                filename: args.outputFileName
            },
            resolve: {
                extensions: ['', '.ts', '.tsx', '.js']
            },
            module: {
                loaders: [
                    { test: /\.tsx?$/, loader: 'ts-loader' }
                ]
            },
            /** minify */
            plugins: args.prod ? [
                new webpack.DefinePlugin({
                    'process.env': {
                        NODE_ENV: "'production'",
                    },
                }),
                new webpack.optimize.UglifyJsPlugin(),
            ] : [],
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
