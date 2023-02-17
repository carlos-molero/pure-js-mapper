# Pure JS Mapper

[![Tests](https://github.com/carlos-molero/pure-js-mapper/actions/workflows/test.yml/badge.svg)](https://github.com/carlos-molero/pure-js-mapper/actions/workflows/test.yml)
![Version](https://img.shields.io/badge/Version-1.0.1-blue)

Pure JS Mapper, as its name suggests, is a mapping library for converting entities to DTO classes and vice versa that can be used in javascript projects.

## Installation

npm

```bash
npm i @carlosmta/pure-js-mapper
```

yarn

```bash
yarn add @carlosmta/pure-js-mapper
```

## Importing/Requiring

The library output is CommonJS for maximum compatibility.

```javascript
const Mapper = require('@carlosmta/pure-js-mapper').default; // CommonJS
import Mapper from '@carlosmta/pure-js-mapper'; // ES
```

## Usage

```javascript
// SupermarketDto.js
export default class SuperMarketDto {
  constructor({ address, location, employees }) {
    this.address = address;
    this.location = location;
    this.employees = employees;
  }
}

const Supermarket = {
  address: 'X Street',
  location: 'Spain',
};

const dto = Mapper().map(Supermarket, SupermarketDto).get();

// Outputs

{
  address: 'X Street',
  location: 'Spain',
  employees: undefined
}
```

## API

There are several chained functions that can be used to modify the output.

### Global properties

You can set the `ignoreUnknownProperties` option globally the following way:

```javascript
Mapper().Globals({ ignoreUnknownProperties: true });
```

### Ignoring `undefined` or `null` properties

You may want to ignore some properties that your object does not have set or that are set to null. To do this you can chain `map()` with `ignoreUnknownProperties()` to remove them from your dto.

This works with all nesting levels.

```javascript
// SupermarketDto.js
export default class SuperMarketDto {
  constructor({ address, location, employees }) {
    this.address = address;
    this.location = location;
    this.employees = employees;
  }
}

const Supermarket = {
  address: 'X Street',
  location: 'Spain',
};

const dto = Mapper().map(Supermarket, SupermarketDto).ignoreUnkownProperties().get();

// Outputs

{
  address: 'X Street',
  location: 'Spain',
}
```

### Using mappings

The `setMapping()` function allow nested values of your entity not to be added to the DTO with all its properties but to be mapped according to a specified DTO class.

To add mappings you can use the `setMapping()` method as many times as you want indicating the property that contains the object to be mapped and the class to which it should be mapped (your DTO in this case).

This works with all nesting levels.

```javascript
// SupermarketDto.js
export default class SuperMarketDto {
  constructor({ address, location, employees }) {
    this.address = address;
    this.location = location;
    this.employees = employees;
  }
}

// EmployeeDto.js
export default class EmployeeDto {
  constructor({ name, surnames, email, phone, managers }) {
    this.name = name;
    this.email = email;
    this.phone = phone;
  }
}


const Supermarket = {
  address: 'X Street',
  location: 'Spain',
  employees: [
    {
      name: 'Carlos',
      email: 'carlos@carlos.com',
      phone: '+34 213 12 321',
      password: '1234'
    }
  ]
};

const dto = Mapper().map(Supermarket, SupermarketDto).setMapping('employees', EmployeeDto).get();

// Outputs

{
  address: 'X Street',
  location: 'Spain',
  employees: [
    {
      name: 'Carlos',
      email: 'carlos@carlos.com',
      phone: '+34 213 12 321',
      password: undefined
    }
  ]
}
```

### Using aliases

Aliases functionality uses `lodash` under the hood. You can set the path to the value in the source object that should be mapped to a property in your target class.

```javascript
// SupermarketDto.js
export default class SuperMarketDto {
  constructor({ address, location, employees }) {
    this.address = address;
    this.location = location;
    this.employees = employees;
  }
}

const Supermarket = {
  address: 'X Street',
  location: 'Spain',
  count: {
    employeeNumber: 10
  }
};

const dto = Mapper().map(Supermarket, SupermarketDto).setAlias("count.employeeNumber", "employees").get();

// Outputs

{
  address: 'X Street',
  location: 'Spain',
  employees: 10
}
```
