import Step from './Step';

function PageBody() {
  return (
    <div>
      PageBody
      {['step1', 'step2', 'step3'].map((step) => (
        <Step step={step} key={step} />
      ))}
    </div>
  );
}

export default PageBody;
