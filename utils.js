exports.defer = () => {
  const promise = {};
  promise.promise = new Promise((resolve, reject) => {
    promise.resolve = resolve;
    promise.reject = reject;
  });
  return promise;
};
