function escape(s: any) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const html = ({
  body,
  title,
  css,
  tuture,
  diff,
}: {
  body: string;
  title: string;
  css: string;
  tuture: string;
  diff: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>${title}</title>
    ${css}
    <script>
      window.__APP_INITIAL_TUTURE__ = ${escape(tuture)};
      window.__APP_INITIAL_DIFF__ = ${escape(diff)};
    </script>
  </head>
  <body>
    <div id="root">${body}</div>
    <script src="js/client.js"></script>
  </body>
  </html>
`;

export default html;
