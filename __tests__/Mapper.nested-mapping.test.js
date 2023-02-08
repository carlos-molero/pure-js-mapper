import { faker } from '@faker-js/faker';
import Mapper from '../src';
import BasicEmployeeDto from './__dtos__/BasicEmployeeDto';
import BasicSuperMarketDto from './__dtos__/BasicSuperMarketDto';
import BasicEmployeeEntity from './__entities__/BasicEmployeeEntity';
import BasicSuperMarketEntity from './__entities__/BasicSuperMarketEntity';

function createFakeNestedEmployees() {
  const employees = [];
  for (let i = 0; i < 10; i++) {
    employees.push(
      new BasicEmployeeEntity({
        name: faker.name.firstName(),
        surnames: faker.name.lastName(),
        phone: faker.phone.number(),
        username: faker.internet.userName(),
        address: faker.address.street(),
      }),
    );
  }
  return employees;
}

function createFakeBasicSuperMarketEntity() {
  const employees = createFakeNestedEmployees();
  return new BasicSuperMarketEntity({
    address: faker.address.street(),
    location: faker.address.country(),
    employees,
    systemPassword: faker.datatype.uuid(),
  });
}

describe('[UNIT] - Nested mapping', function () {
  it('Nested mapping', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .set('employees', BasicEmployeeDto)
      .get();
  });

  it('Nested mapping with ignoreUnkownProperties() chaining', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .set('employees', BasicEmployeeDto)
      .ignoreUnknownProperties()
      .get();
  });

  it('Nested mapping with set() chaining', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .set('employees', BasicEmployeeDto)
      .get();
  });

  it('Nested mapping with set() and ignoreUnknownProperties() chaining', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .ignoreUnknownProperties()
      .set('employees', BasicEmployeeDto)
      .get();
  });
});
