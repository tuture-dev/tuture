function escape(s: any) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const html = ({
  body,
  css,
  commits,
  introduction,
  content,
  diffItem,
}: {
  body: string;
  css: string;
  commits?: string;
  introduction?: string;
  content?: string;
  diffItem?: string;
}) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Awesome Tutorial</title>
    ${css}
    <script>
      window.__APP_INITIAL_COMMITS__ = ${escape(commits)};
      window.__APP_INITIAL_INTRODUCTION__ = ${escape(introduction)};
      window.__APP_INITIAL_CONTENT__ = ${escape(content)};
      window.__APP_INITIAL_DIFFITEM__ = ${escape(diffItem)};
    </script>
  </head>
  <body>
    <div id="root">${body}</div>
    <script src="js/client.js"></script>
  </body>
  </html>
`;

export default html;
