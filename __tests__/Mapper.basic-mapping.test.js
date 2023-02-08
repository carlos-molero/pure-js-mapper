import Mapper from '../src/index';
import { faker } from '@faker-js/faker';
import BasicSuperMarketEntity from './__entities__/BasicSuperMarketEntity';
import BasicSuperMarketDto from './__dtos__/BasicSuperMarketDto';

function createFakeBasicSuperMarketEntity() {
  return new BasicSuperMarketEntity({
    address: faker.address.street(),
    location: faker.address.country(),
    employees: faker.random.numeric(),
    systemPassword: faker.datatype.uuid(),
  });
}

function createIncompleteFakeBasicSuperMarketEntity() {
  return new BasicSuperMarketEntity({
    address: faker.address.street(),
    employees: faker.random.numeric(),
    systemPassword: faker.datatype.uuid(),
  });
}

describe('[UNIT] - Basic mapping', function () {
  it('1st level', function () {
    const dto = Mapper().map(createFakeBasicSuperMarketEntity(), BasicSuperMarketDto).get();
    expect(dto.address).not.toBeUndefined();
    expect(dto.location).not.toBeUndefined();
    expect(dto.employees).not.toBeUndefined();
  });
  it('1st level with non-present properties', function () {
    const dto = Mapper().map(createIncompleteFakeBasicSuperMarketEntity(), BasicSuperMarketDto).get();
    expect(dto.address).not.toBeUndefined();
    expect(dto.location).toBeUndefined();
    expect(dto.employees).not.toBeUndefined();
  });
  it('1st level with ignoreUnknownProperties() chaining', function () {
    const dto = Mapper()
      .map(createIncompleteFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .ignoreUnknownProperties()
      .get();
    expect(dto.address).not.toBeUndefined();
    expect(dto.location).toBeUndefined();
    expect(dto.employees).not.toBeUndefined();
  });
});
