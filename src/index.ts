/**
 * MIT License
 *
 * Copyright (c) 2023 Carlos Molero Mata
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */

import { set, get } from 'lodash';

type Class<T> = new (...args: any[]) => T;

type MapperGlobals = {
  ignoreUnknownProperties?: boolean;
};

type Mapping = {
  property: string;
  target: Class<any>;
};

type Alias = {
  source: string;
  target: string;
};

type Mapper = {
  Globals(globals: MapperGlobals): void;
  getGlobals(): MapperGlobals;
  map(objA: Record<any, any>, objB: Class<any>): Mapper;
  setAlias(source: string, target: string): Mapper;
  setMapping(key: string, obj: Class<any>): Mapper;
  ignoreUnknownProperties(): Mapper;
  get<T>(): T;
};

let _globals: MapperGlobals = {};

const Mapper = function (): Mapper {
  let _sourceObj: Record<any, any>;
  let _result: Record<any, any>;
  let _ignoreUnknownProperties = false;
  const _aliases: Alias[] = [];
  const _mappings: Mapping[] = [];

  /**
   * Checks if a property inside a given object is an object itself.
   *
   * @param {any} property
   *
   * @returns {boolean} boolean
   */
  function isObject(property: any): boolean {
    return typeof property === 'object';
  }

  /**
   * Deletes undefined or null properties recursively from an object.
   *
   * @param {Record<any, any>} obj
   *
   * @returns {Record<any, any>} Record<any, any>
   */
  function deleteUndefinedOrNullProperties(obj: Record<any, any> = _result): Record<any, any> {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      if (typeof val === 'undefined' || val === null) {
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
   *
   * @returns {Record<any, any>} Record<any, any>
   */
  function applyMappings(obj: Record<any, any> = _result): Record<any, any> {
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      const val = obj[key];
      const mapping = _mappings.find((m) => m.property === key);
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

  /**
   * Applies the aliases, if any, using lodash
   */
  function applyAliases() {
    _aliases.forEach((alias) => {
      const { source, target } = alias;
      set(_result, target, get(_sourceObj, source));
    });
  }

  return {
    /**
     * Sets the global configuration for the Mapper() function.
     * This configuration will persist through function calls.
     */
    Globals(globals: MapperGlobals): void {
      _globals = {
        ..._globals,
        ...globals,
      };
    },

    /**
     * Returns the global configuration for the Mapper() function.
     *
     * @returns {MapperGlobals} MapperGlobals
     */
    getGlobals(): MapperGlobals {
      return _globals;
    },

    /**
     * Maps an object to another.
     *
     * @param {Record<any,any>|Class<any>} objA Can be an initialized class instance or an object
     * @param {Class<any>} objB Must be a class reference
     *
     * @returns {Mapper} Mapper
     */
    map(objA: Record<any, any>, objB: Class<any>): Mapper {
      _sourceObj = objA;
      _result = new objB({ ...objA });
      return this;
    },

    /**
     * Sets an alias. This function is useful
     * when some properties of the source object have
     * a different name than their corresponding
     * mapping to the target object.
     *
     * @param {string} source the path to the value in the source object
     * @param {string} target the path to the value in the target object
     *
     * @returns {Mapper} Mapper
     */
    setAlias(source: string, target: string): Mapper {
      _aliases.push({ source, target });
      return this;
    },

    /**
     * Sets a mapping, useful if you need to map subproperties
     * of your object to a given class. You can chain as
     * many mappings as you want.
     *
     * @param {string} key The key of the property that should be mapped
     * @param {Class<any>} obj Must be a class reference
     *
     * @returns {Mapper} Mapper
     */
    setMapping(key: string, obj: Class<any>): Mapper {
      _mappings.push({ property: key, target: obj });
      return this;
    },

    /**
     * Sets the ignoreUnknownProperties option to true for this mapping.
     *
     * @returns {Mapper} Mapper
     */
    ignoreUnknownProperties(): Mapper {
      _ignoreUnknownProperties = true;
      return this;
    },

    /**
     * Gets the mapping result.
     *
     * @returns {Record<any,any>} Record<any,any>
     */
    get<T>(): T {
      if (_aliases.length > 0) {
        applyAliases();
      }

      if (_mappings.length > 0) {
        applyMappings();
      }

      if (_globals.ignoreUnknownProperties === true || _ignoreUnknownProperties) {
        deleteUndefinedOrNullProperties();
      }

      return _result;
    },
  };
};

export default Mapper;
