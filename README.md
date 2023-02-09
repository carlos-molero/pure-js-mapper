# Pure JS Mapper

[![Tests](https://github.com/carlos-molero/pure-js-mapper/actions/workflows/test.yml/badge.svg)](https://github.com/carlos-molero/pure-js-mapper/actions/workflows/test.yml)

Pure JS Mapper, as its name suggests, is a mapping library for converting entity classes to DTO classes and vice versa that can be used in projects written only with Javascript.

The library exposes a `Mapper()` function that provides the developer with functions that can be chained together to achieve mappings.

## Usage

```javascript
import Mapper from '@carlos-molero/pure-js-mapper';

const MyEntity = new MyEntity({
  property1: 'property1',
  property2: 'property2',
  //...
});

const myDto = Mapper().map(MyEntity, MyEntityDTO).get();

// { property1: 'property1', 'property2: 'property2' }
```

## API

As mentioned above there are some chained functions that can be used as a result of the `Mapper()` function.

### Ignoring `undefined` or `null` properties

You may want to ignore some properties that your entity does not have set or that are set to null. To do this you can chain `map()` with `ignoreUnknownProperties()` to remove them from your dto.

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

To add mappings you can use the `setMapping()` method as many times as you want indicating the property that contains the object to be transformed and the class to which it should be mapped (your DTO).

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
  constructor({ subProperty1, subProperty2 }) {
    this.subProperty1 = subProperty1;
    this.subProperty2 = subProperty2;
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
.ignoreUnknownProperties()
.get();

// { property1: 'property1', mySubEntity: { subProperty1: 'subProperty1' } }
```
