function promiseAll<T>(
  arrayOfAsyncActions: Array<Promise<T> | T>
): Promise<T[]> {
  return new Promise((resolve, reject) => {
    if (arrayOfAsyncActions.length === 0) return resolve([]);

    const result: T[] = [];
    let total = 0;

    arrayOfAsyncActions.forEach((item, index) => {
      Promise.resolve(item)
        .then((res) => {
          result[index] = res;
          total++;
          if (total === arrayOfAsyncActions.length) resolve(result);
        })
        .catch((err) => {
          reject(err);
        });
    });
  });
}
