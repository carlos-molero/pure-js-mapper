import Mapper from '../src/index';
import { faker } from '@faker-js/faker';
import BasicSuperMarketDto from './__dtos__/BasicSuperMarketDto';

describe('[UNIT] - Covers the use of map() chain function', function () {
  it('No unknown properties', function () {
    const dto = Mapper()
      .map(
        {
          address: faker.address.street(),
          employees: faker.random.numeric(),
          location: faker.address.country(),
          systemPassword: faker.datatype.uuid(),
        },
        BasicSuperMarketDto,
      )
      .get();
    expect(dto.address).not.toBeUndefined();
    expect(dto.location).not.toBeUndefined();
    expect(dto.employees).not.toBeUndefined();
    expect(Object.keys(dto).length).toBe(3);
  });
});
