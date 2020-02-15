import { useSelector, useStore } from 'react-redux';

import Step from './Step';

function PageBody() {
  const store = useStore();
  const { steps = [] } = useSelector(store.select.collection.nowArticle);

  return (
    <div>
      {steps.map((step) => (
        <Step step={step} key={step.commit} />
      ))}
    </div>
  );
}

export default PageBody;
