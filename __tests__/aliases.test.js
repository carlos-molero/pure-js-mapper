import Mapper from '../src/index';
import { faker } from '@faker-js/faker';
import BasicSuperMarketDto from './__dtos__/BasicSuperMarketDto';

describe.only('[UNIT] - Covers the use of setAlias() chain function', function () {
  it('', function () {
    const dto = Mapper()
      .map(
        {
          address: faker.address.street(),
          employeeNumber: faker.random.numeric(),
          location: faker.address.country(),
          systemPassword: faker.datatype.uuid(),
        },
        BasicSuperMarketDto,
      )
      .setAlias('employeeNumber', 'employees')
      .get();
    expect(dto.employees).not.toBeUndefined();
  });
});
