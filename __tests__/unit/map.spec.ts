import Mapper from '../../src/index';
import SuperMarketDto from '../__dtos__/SuperMarketDto';

describe('[UNIT] - Covers the use of map() chain function', function () {
  it('No unknown properties', function () {
    const dto = Mapper().map({ address: '1', location: '2', employees: '3' }, SuperMarketDto).get<SuperMarketDto>();
    expect(dto.address).not.toBeUndefined();
    expect(dto.location).not.toBeUndefined();
    expect(dto.employees).not.toBeUndefined();
    expect(Object.keys(dto).length).toBe(4);
  });
  it('Unknown properties', function () {
    const dto = Mapper().map({ address: '1' }, SuperMarketDto).get<SuperMarketDto>();
    expect(dto.address).not.toBeUndefined();
    expect(dto.location).toBeUndefined();
    expect(dto.employees).toBeUndefined();
    expect(Object.keys(dto).length).toBe(4);
  });
});
