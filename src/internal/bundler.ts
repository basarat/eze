/**
 * @module wraps webpack in a nice api
 */
import * as webpack from 'webpack';

/**
 * Creates a webpack bundle
 */
export function bundle(args: {
  entryPointName: string,
  outputFileName: string,
}) {
  console.log('Bundling request:', args);
  return new Promise((res,rej) => {
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
      console.log('Bundling done:', args, err);
      res();
    });
  });
}