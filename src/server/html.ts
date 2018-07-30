import { AppProps } from '../components/App';
const html = ({
  body,
  initialProps,
}: {
  body: string;
  initialProps: AppProps;
}) => `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>My Awesome Tutorial</title>
    <script>window.__APP_INITIAL_PROPS__ = 'hhhh' </script>
  </head>
  <body>
    <div id="root">${body}</div>
    <script src="js/client.js"></script>
  </body>
  </html>
`;

export default html;
