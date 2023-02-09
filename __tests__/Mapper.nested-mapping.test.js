import { faker } from '@faker-js/faker';
import Mapper from '../src';
import BasicEmployeeDto from './__dtos__/BasicEmployeeDto';
import BasicManagerDto from './__dtos__/BasicManagerDto';
import BasicSuperMarketDto from './__dtos__/BasicSuperMarketDto';
import BasicEmployeeEntity from './__entities__/BasicEmployeeEntity';
import BasicSuperMarketEntity from './__entities__/BasicSuperMarketEntity';

function createEmployee() {
  return {
    name: faker.name.firstName(),
    surnames: faker.name.lastName(),
    phone: faker.phone.number(),
    username: faker.internet.userName(),
    address: faker.address.street(),
  };
}

function createManager() {
  return {
    name: faker.name.firstName(),
    surnames: faker.name.lastName(),
    phone: faker.phone.number(),
  };
}

function createFakeNestedEmployees() {
  const employees = [];
  for (let i = 0; i < 10; i++) {
    employees.push(new BasicEmployeeEntity({ ...createEmployee() }));
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

function createFakeNestedEmployeesWithManagers() {
  const employees = [];
  for (let i = 0; i < 10; i++) {
    const employee = createEmployee();
    employee.managers = [];
    for (let j = 0; j < 3; j++) {
      employee.managers.push({ ...createManager() });
    }
    employees.push(new BasicEmployeeEntity(employee));
  }
  return employees;
}

function createFakeBasicSuperMarketEntityWith2LevelNesting() {
  const employees = createFakeNestedEmployeesWithManagers();
  return new BasicSuperMarketEntity({
    address: faker.address.street(),
    location: faker.address.country(),
    employees,
    systemPassword: faker.datatype.uuid(),
  });
}

describe('[UNIT] - Nested mapping', function () {
  it('Nested mapping', function () {
    const dto = Mapper().map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto).get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => typeof employee.email === 'undefined')).toBeTruthy();
    expect(dto.employees.every((employee) => Object.keys(employee).length === 7)).toBeTruthy();
  });

  it('Nested mapping with ignoreUnkownProperties() chaining', function () {
    const dto = Mapper().map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto).ignoreUnknownProperties().get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 5)).toBeTruthy();
  });

  it('Nested mapping with set() chaining', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .set('employees', BasicEmployeeDto)
      .get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 5)).toBeTruthy();
  });

  it('Nested mapping with set() and ignoreUnknownProperties() chaining', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .ignoreUnknownProperties()
      .set('employees', BasicEmployeeDto)
      .get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 3)).toBeTruthy();
  });
  it('Nested with 2 levels with set() and ignoreUnknownProperties() chaining', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntityWith2LevelNesting(), BasicSuperMarketDto)
      .ignoreUnknownProperties()
      .set('employees', BasicEmployeeDto)
      .set('managers', BasicManagerDto)
      .get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 4)).toBeTruthy();
    expect(dto.employees[0].managers.every((manager) => Object.keys(manager).length === 2)).toBeTruthy();
  });
});
