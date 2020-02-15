import { useSelector } from 'react-redux';

import Step from './Step';

function PageBody() {
  const { steps = [] } = useSelector((state) => state.collection.nowArticle);

  return (
    <div>
      {steps.map((step) => (
        <Step step={step} key={step.commit} />
      ))}
    </div>
  );
}

export default PageBody;
