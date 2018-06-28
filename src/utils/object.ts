const isObjectEmpty = (obj: any): boolean => {
  const keyArray = Object.keys(obj);
  return keyArray.length === 0;
};

export { isObjectEmpty };
