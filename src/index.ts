type Class<T> = new (...args: any[]) => T;
type MapperGlobals = {
  ignoreUnknownProperties?: boolean;
};

let Globals: MapperGlobals = {};

const Mapper = function () {
  let result: Record<any, any>;
  let ignoreUnknownProperties = false;
  const mappings: { property: string; target: any }[] = [];

  /**
   * Checks if a property inside a given object is an object itself.
   *
   * @param {any} property
   * @returns {boolean} true or false
   */
  function isObject(property: any): boolean {
    return typeof property === 'object';
  }

  /**
   * Deletes undefined or null properties recursively from an object.
   *
   * @param {Record<any, any>} obj
   * @returns {Record<any, any>} the modified object
   */
  function deleteUndefinedOrNullProperties(obj: Record<any, any> = result): Record<any, any> {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      if (!val) {
        delete obj[key];
      } else if (isObject(val)) {
        obj[key] = deleteUndefinedOrNullProperties(val);
      }
    });
    return obj;
  }

  /**
   * Maps nested properties to the given mappings DTO classes recursively.
   *
   * @param {Record<any, any>} obj
   * @returns {Record<any, any>} the modified object
   */
  function applyMappings(obj: Record<any, any> = result): Record<any, any> {
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
    /**
     * Sets the global configuration for the Mapper() function.
     * This configuration will persist through function calls.
     *
     * @param globals.ignoreUnknownProperties
     */
    Globals(globals: MapperGlobals): void {
      Globals = {
        ...Globals,
        ...globals,
      };
    },
    /**
     * Returns the global configuration for the Mapper() function.
     *
     * @returns {MapperGlobals} Mapper global options.
     */
    getGlobals(): MapperGlobals {
      return Globals;
    },
    /**
     * Maps an object to another.
     *
     * @param objA Can be an initialized class instance or an object.
     * @param objB Must be a class reference.
     * @returns {Mapper} Mapper
     */
    map(objA: Object, objB: Class<any>) {
      result = new objB({ ...objA });
      return this;
    },
    /**
     * Sets a mapping, useful if you need to map subproperties of your object to given DTO classes.
     * You can chain as many mappings as you want.
     *
     * @param {string} key The key of the property that should be mapped to the passed DTO class object.
     * @param {string} obj Must be a class reference.
     * @returns {Mapper} Mapper
     */
    setMapping(key: string, obj: Class<any>) {
      mappings.push({ property: key, target: obj });
      return this;
    },
    /**
     * Sets the ignoreUnknownProperties option to true for this mapping.
     *
     * @returns {Mapper} Mapper
     */
    ignoreUnknownProperties() {
      ignoreUnknownProperties = true;
      return this;
    },
    /**
     * Gets the mapping result.
     *
     * @returns {Record<any,any>} result
     */
    get(): Record<any, any> {
      if (mappings.length > 0) {
        applyMappings();
      }

      if (Globals.ignoreUnknownProperties === true || ignoreUnknownProperties) {
        deleteUndefinedOrNullProperties();
      }

      return result;
    },
  };
};

export default Mapper;
