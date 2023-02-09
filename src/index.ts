const Mapper = function () {
  let result: any;
  let ignoreUnknownProperties = false;
  const mappings: { property: string; target: any }[] = [];

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
      const mapping = mappings.find((m) => m.property === key);
      if (mapping && isObject(val)) {
        obj[key] = Array.isArray(val)
          ? val.map((rk: any) => new mapping.target({ ...rk }))
          : new mapping.target({ ...val });
      }
      if (isObject(val)) {
        applyMappings(obj[key]);
      }
    });
    return obj;
  }

  return {
    map(objA: any, objB: any) {
      result = new objB({ ...objA });
      return this;
    },
    setMapping(key: string, obj: any) {
      mappings.push({ property: key, target: obj });
      return this;
    },
    ignoreUnknownProperties() {
      ignoreUnknownProperties = true;
      return this;
    },
    get() {
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
