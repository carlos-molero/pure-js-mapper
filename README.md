# Pure JS Mapper

[![Tests](https://github.com/carlos-molero/pure-js-mapper/actions/workflows/test.yml/badge.svg)](https://github.com/carlos-molero/pure-js-mapper/actions/workflows/test.yml)

Pure JS Mapper, as its name suggests, is a mapping library for converting entity to DTO classes and vice versa that can be used in projects written only with Javascript.

## Installation

npm

```bash
npm i @carlosmta/pure-js-mapper
```

yarn

```bash
yarn add @carlosmta/pure-js-mapper
```

## Usage

```javascript
const Mapper = require('@carlosmta/pure-js-mapper').default;

const MyEntity = new MyEntity({
  property1: 'property1',
  property2: 'property2',
  //...
});

const myDto = Mapper().map(MyEntity, MyEntityDTO).get();

// { property1: 'property1', 'property2: 'property2' }
```

## API

There are some chained functions that can be used as a result of the `Mapper()` function call.

### Global properties

At the moment you can set the `ignoreUnknownProperties` option globally the following way:

```javascript
Mapper().Globals({ ignoreUnknownProperties: true });
```

### Ignoring `undefined` or `null` properties

You may want to ignore some properties that your object does not have set or that are set to null. To do this you can chain `map()` with `ignoreUnknownProperties()` to remove them from your dto.

This works with all nesting levels.

```javascript
// MyEntityDTO.js
export default class MyEntityDTO {
  constructor({ property1, property2 }) {
    this.property1 = property1;
    this.property2 = property2;
  }
}

const MyEntity = new MyEntity({
  property1: 'property1',
  //...
});

const myDto = Mapper().map(MyEntity, MyEntityDTO).ignoreUnknownProperties().get();

// { property1: 'property1' }
```

### Using mappings

The `setMapping()` function allow nested values of your entity not to be added to the DTO with all its properties but to be mapped according to a specified DTO class.

To add mappings you can use the `setMapping()` method as many times as you want indicating the property that contains the object to be mapped and the class to which it should be mapped (your DTO in this case).

This works with all nesting levels.

```javascript
// MyEntityDTO.js
export default class MyEntityDTO {
  constructor({ property1, property2 }) {
    this.property1 = property1;
    this.property2 = property2;
  }
}

// MySubEntityDTO.js
export default class MySubEntityDTO {
  constructor({ subProperty1 }) {
    this.subProperty1 = subProperty1;
  }
}

const MyEntity = new MyEntity({
  property1: 'property1',
  mySubEntity: {
    subProperty1: 'subProperty1',
  }
  //...
});

const myDto = Mapper()
.map(MyEntity, MyEntityDTO)
.setMapping('mySubEntity', MySubEntityDTO)
.get();

// { property1: 'property1', mySubEntity: { subProperty1: 'subProperty1' } }
```

### Using aliases

Aliases work only in the first level of the object we are trying to map, they are useful when some properties of the source object have a different name than their corresponding mapping to the target object.

```javascript
// MyEntityDTO.js
export default class MyEntityDTO {
  constructor({ property1, property2 }) {
    this.property2 = property2;
  }
}

const MyEntity = new MyEntity({
  property1: 'property1',
  //...
});

const myDto = Mapper().map(MyEntity, MyEntityDTO).setAlias('property1', 'property2').get();

// { property1: 'property2' }
```
