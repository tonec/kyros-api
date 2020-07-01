export default (html, preloadedState, helmet) => `
    <!doctype html>
    <html>
      <head>
        ${helmet.title.toString()}
        ${helmet.meta.toString()}
        ${helmet.link.toString()}
        <link rel="icon" href="/dist/favicon.ico" type="image/ico" />
        <link href="/dist/main.css" rel="stylesheet">
      </head>
      <body>
        <div id="root">${html}</div>
        <script>
          window.__PRELOADED_STATE__ = ${JSON.stringify(preloadedState).replace(
    /</g,
    '\\u003c'
  )}
        </script>
        <script src="/dist/main.js"></script>
      </body>
    </html>
    `
