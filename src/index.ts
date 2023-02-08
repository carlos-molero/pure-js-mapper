const Mapper = function () {
  let result: any = undefined;
  let ignoreUnknownProperties = false;
  let transformers: Array<{ property: string; target: any }> = [];

  function isObject(property: any) {
    return typeof property === 'object';
  }

  function removeUnknownProperties(obj = result): any {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      if (!val) {
        delete obj[key];
      } else if (isObject(val)) {
        obj[key] = removeUnknownProperties(val);
      }
    });
    return obj;
  }

  function applyTransformers(obj = result) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      const t = transformers.find((t) => t.property === key);
      if (t && isObject(val)) {
        obj[key] = Array.isArray(val) ? val.map((rk: any) => new t.target({ ...rk })) : new t.target({ ...val });
      }
      if (isObject(val)) {
        applyTransformers(obj[key]);
      }
    });
    return obj;
  }

  return {
    map: function (objA: any, objB: any) {
      result = new objB({ ...objA });
      return this;
    },
    set: function (key: string, obj: any) {
      transformers.push({ property: key, target: obj });
      return this;
    },
    ignoreUnknownProperties: function () {
      ignoreUnknownProperties = true;
      return this;
    },
    get: function () {
      if (transformers.length > 0) {
        applyTransformers();
      }

      if (ignoreUnknownProperties) {
        removeUnknownProperties();
      }

      return result;
    },
  };
};

export default Mapper;
