import Mapper from '../src';
import SuperMarketDto from './__dtos__/SuperMarketDto';

Mapper().Globals({ ignoreUnknownProperties: true });

describe('[UNIT] - Global properties persist and are applied during runtime', function () {
  it('', function () {
    const { ignoreUnknownProperties } = Mapper().getGlobals();
    expect(ignoreUnknownProperties).toBe(true);
  });
  it('', function () {
    const { ignoreUnknownProperties } = Mapper().getGlobals();
    const dto = Mapper().map({ address: '1' }, SuperMarketDto).get();
    expect(ignoreUnknownProperties).toBe(true);
    expect(Object.keys(dto).length).toBe(1);
  });
});
