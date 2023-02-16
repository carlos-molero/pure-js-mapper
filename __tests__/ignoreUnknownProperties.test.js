import Mapper from '../src/index';
import SuperMarketDto from './__dtos__/SuperMarketDto';

describe('[UNIT] - Covers the use of ignoreUnknownProperties() chain function', function () {
  it('', function () {
    const dto = Mapper().map({ address: '1' }, SuperMarketDto).ignoreUnknownProperties().get();
    expect(dto.address).not.toBeUndefined();
    expect(Object.keys(dto).length).toBe(1);
  });
});
