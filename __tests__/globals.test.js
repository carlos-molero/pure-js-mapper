import { faker } from '@faker-js/faker';
import Mapper from '../src';
import BasicSuperMarketDto from './__dtos__/BasicSuperMarketDto';

Mapper().Globals({ ignoreUnknownProperties: true });

describe('[UNIT] - Global properties persist and are applied during runtime', function () {
  it('', function () {
    const { ignoreUnknownProperties } = Mapper().getGlobals();
    expect(ignoreUnknownProperties).toBe(true);
  });
  it('', function () {
    const { ignoreUnknownProperties } = Mapper().getGlobals();
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
    expect(ignoreUnknownProperties).toBe(true);
    expect(Object.keys(dto).length).toBe(3);
  });
});
