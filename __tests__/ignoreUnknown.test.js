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

describe('[UNIT] - Covers the use of ignoreUnknownProperties() chain function', function () {
  it('', function () {
    const dto = Mapper()
      .map(createIncompleteFakeBasicSuperMarketEntity(), BasicSuperMarketDto)
      .ignoreUnknownProperties()
      .get();
    expect(dto.address).not.toBeUndefined();
    expect(dto.employees).not.toBeUndefined();
    expect(Object.keys(dto).length).toBe(2);
  });
});
