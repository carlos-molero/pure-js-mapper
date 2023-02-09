const Mapper = function () {
  let result: any = undefined;
  let ignoreUnknownProperties = false;
  let mappings: Array<{ property: string; target: any }> = [];

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

  function applyMappings(obj = result) {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      const m = mappings.find((m) => m.property === key);
      if (m && isObject(val)) {
        obj[key] = Array.isArray(val) ? val.map((rk: any) => new m.target({ ...rk })) : new m.target({ ...val });
      }
      if (isObject(val)) {
        applyMappings(obj[key]);
      }
    });
    return obj;
  }

  return {
    map: function (objA: any, objB: any) {
      result = new objB({ ...objA });
      return this;
    },
    setMapping: function (key: string, obj: any) {
      mappings.push({ property: key, target: obj });
      return this;
    },
    ignoreUnknownProperties: function () {
      ignoreUnknownProperties = true;
      return this;
    },
    get: function () {
      if (mappings.length > 0) {
        applyMappings();
      }

      if (ignoreUnknownProperties) {
        removeUnknownProperties();
      }

      return result;
    },
  };
};

export default Mapper;
