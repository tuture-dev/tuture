export default function createChainableState(config) {
  const { state, transaction } = config;
  let { selection } = transaction;
  let { doc } = transaction;
  let { storedMarks } = transaction;

  return {
    ...state,
    schema: state.schema,
    plugins: state.plugins,
    apply: state.apply.bind(state),
    applyTransaction: state.applyTransaction.bind(state),
    reconfigure: state.reconfigure.bind(state),
    toJSON: state.toJSON.bind(state),
    get storedMarks() {
      return storedMarks;
    },
    get selection() {
      return selection;
    },
    get doc() {
      return doc;
    },
    get tr() {
      selection = transaction.selection;
      doc = transaction.doc;
      storedMarks = transaction.storedMarks;

      return transaction;
    },
  };
}
