/**
 * @module client side code for live reload
 */

import { TypedEvent } from '../utils';
import * as parseUrl from 'parseurl';
import { Server as WebSocketServer } from 'ws';
import * as WebSocket from 'ws';
import * as http from 'http';

/**
 * Client constants
 */
const prefix = '/__livereload__';
export const clientJsPath = prefix + '/reload-client.js'

/**
 * Used to trigger reloads
 */
const triggerPath = prefix + '/trigger'
const triggerCSSPath = prefix + '/triggercss'

/**
 * Used for communication between client script and our generated js
 */
const reloadKey = 'r';
const reloadCssKey = 'rcss';


/**
 * The JS we send down to the client to detect live reload requests
 */
const clientJsContent = `
var ws
function socket() {
  ws = new WebSocket("ws://" + window.location.host)
  ws.onmessage = function (e) {
    var data = JSON.parse(e.data)
    if (data.${reloadKey}) {
      location.reload()
    }
    if (data.${reloadCssKey}) {
      refreshCSS()
    }
  }
}
function refreshCSS() {
  console.log("reload css at:" + new Date())
  var sheets = document.getElementsByTagName("link");
  for (var i = 0; i < sheets.length; i++) {
    var elem = sheets[i];
    var rel = elem.rel;
    if (elem.href && elem.href.substring(0, 5) !== "data:" && (typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet")) {
      var url = elem.href.replace(/(&|\\?)_cacheOverride=\\d+/, "");
      elem.href = url + (url.indexOf("?") >= 0 ? "&" : "?") + "_cacheOverride=" + (new Date().valueOf());
    }
  }
}
socket()
setInterval(function () {
  if (ws) {
    if (ws.readyState !== 1) {
      socket()
    }
  } else {
    socket()
  }
}, 3000)
`;

export class Livereload {
  /** Register this as a connect middleware */
  middleware = (req, res, next) => {
    var pathname = parseUrl(req).pathname
    if (pathname.indexOf(prefix) == -1) {
      next()
      return
    }

    if (req.method == 'GET' && pathname == clientJsPath) {
      res.writeHead(200)
      res.end(clientJsContent)
      return
    }

    if (pathname == triggerPath) {
      res.writeHead(200)
      res.end('ok')
      this.triggerReload();
      return;
    }

    if (pathname == triggerCSSPath) {
      res.writeHead(200)
      res.end('ok')
      this.triggerReloadCss();
      return;
    }

    next()
  }

  /**
   * Websocket management
   */
  wss?: WebSocketServer;
  wsArray: WebSocket[] = [];
  /**
   * Starts a websocket server
   */
  startWS = (server: http.Server) => {
    this.wss = new WebSocketServer({ server: server });

    this.wss.on('connection', (ws) => {
      this.wsArray.push(ws)
      ws.on('close', () => {
        var index = this.wsArray.indexOf(ws)
        if (index > -1) {
          this.wsArray.splice(index, 1);
        }
      })
    });
  }

  triggerReload = () => {
    this.wsArray.forEach((w) => {
      w.send(JSON.stringify({ [reloadKey]: Date.now().toString() }), function(e) {
        if (e) { console.log('websocket send error: ' + e) }
      })
    });
  }

  triggerReloadCss = () => {
    this.wsArray.forEach((w) => {
      w.send(JSON.stringify({ [reloadCssKey]: Date.now().toString() }), function(e) {
        if (e) { console.log('websocket send error: ' + e) }
      })
    });
  }
}
