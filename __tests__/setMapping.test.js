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

describe('[UNIT] - Covers the use of setMapping() chain function', function () {
  it('Basic setMapping()', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .setMapping('employees', BasicEmployeeDto)
      .get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 5)).toBeTruthy();
  });

  it('Nested setMapping()', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .ignoreUnknownProperties()
      .setMapping('employees', BasicEmployeeDto)
      .get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 3)).toBeTruthy();
  });
  it('Nested 2o level setMapping()', function () {
    const dto = Mapper()
      .map(createFakeBasicSuperMarketEntityWith2LevelNesting(), BasicSuperMarketDto)
      .setMapping('employees', BasicEmployeeDto)
      .setMapping('managers', BasicManagerDto)
      .get();
    expect(dto.employees.length).toBe(10);
    expect(dto.employees.every((employee) => Object.keys(employee).length === 5)).toBeTruthy();
    expect(dto.employees[0].managers.every((manager) => Object.keys(manager).length === 4)).toBeTruthy();
  });
});
