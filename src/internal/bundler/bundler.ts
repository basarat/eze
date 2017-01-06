/**
 * @module wraps webpack in a nice api
 * 
 * TODO:
 * this should exec webpack in a seperate process.
 *  Otherwise its not really async.
 *  Create a process that internally uses the following bundle function.
 *  and simply calls exec.
 */
import * as webpack from 'webpack';
import * as fse from 'fs-extra';

/**
 * Creates a webpack bundle
 */
export function bundle(args: {
  entryPointName: string,
  outputFileName: string,
  prod: boolean
}) {
  return new Promise((res, rej) => {

    if (!fse.existsSync(args.entryPointName)) {
      /** Webpack ignores this siliently sadly so we need to catch it ourselves */
      rej(new Error(`Entry point does not exist: ${args.entryPointName}`));
    }

    const config = {
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

    const compiler = webpack(config);
    compiler.run(function(err, stats) {
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