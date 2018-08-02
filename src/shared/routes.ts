import StepContent from '../components/StepContent';
import Introduction from '../components/Introduction';

const routes = [
  {
    path: '/steps/',
    component: Introduction,
  },
  {
    path: '/steps/:commit/',
    component: StepContent,
  },
];

export default routes;
