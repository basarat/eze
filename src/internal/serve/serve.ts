import { Livereload, clientJsPath } from './client';
import { getPort } from './getPort';

import * as connect from 'connect';
import * as serveStatic from 'serve-static';
import * as http from 'http';
const injector = require('connect-injector')

export class Server {
  private app: connect.Server;
  private client: Livereload;
  private server: http.Server;

  async serve(dir: string) {
    this.app = connect();
    this.client = new Livereload();

    /** use our client's middlware */
    this.app.use(this.client.middleware);

    /** inject live reload script for html files */
    this.app.use(
      injector(
        function(req, res) {
          return res.getHeader('content-type') && res.getHeader('content-type').indexOf('text/html') !== -1
        },
        function(data, req, res, callback) {
          callback(null, data.toString().replace('</body>', `<script src="${clientJsPath}"></script></body>`));
        })
    );

    /** Also serve the directory */
    this.app.use(
      serveStatic(dir || '.')
    );

    const host = '0.0.0.0';
    const port = await getPort(4000);

    /** create http server */
    this.server = http.createServer(this.app);
    this.server.listen(port, host, () => {
      console.log('# listening at http://' + host + ':' + port);
      this.client.startWS(this.server); // websocket shares same as our server
    });

    /** Handle server errors */
    this.server.on('error', (err: any) => {
      console.log(err)
    });
  }

  triggerReload = () => this.client.triggerReload();
  triggerReloadCss = () => this.client.triggerReloadCss();
}