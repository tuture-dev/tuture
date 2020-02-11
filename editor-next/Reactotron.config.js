// Reactotron.config.js
import Reactotron from 'reactotron-react-js';
import { reactotronRedux } from 'reactotron-redux';

export default Reactotron.configure({
  name: 'Tuture editor',
})
  .use(reactotronRedux())
  // add other devtools here
  .connect();
