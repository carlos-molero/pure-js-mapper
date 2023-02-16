import Mapper from '../src/index';
import SuperMarketDto from './__dtos__/SuperMarketDto';

const supermarket = {
  address: '1',
  location: '2',
  employeeNumber: '4',
};

describe('[UNIT] - Covers the use of setAlias() chain function', function () {
  it('Basic alias', function () {
    const dto = Mapper()
      .map({ ...supermarket }, SuperMarketDto)
      .setAlias('employeeNumber', 'employees')
      .get();
    expect(dto.employees).not.toBeUndefined();
    expect(dto.employees).toBe('4');
  });
  it('Nested alias', function () {
    delete supermarket.employeeNumber;
    supermarket.other = {
      employeeNumber: '4',
    };

    const dto = Mapper()
      .map({ ...supermarket }, SuperMarketDto)
      .setAlias('other.employeeNumber', 'employees')
      .get();
    expect(dto.employees).not.toBeUndefined();
    expect(dto.employees).toBe('4');
  });
  it('2o nesting level', function () {
    delete supermarket.other;
    supermarket.other = {
      data: {
        employeeNumber: '4',
      },
    };

    const dto = Mapper()
      .map({ ...supermarket }, SuperMarketDto)
      .setAlias('other.data.employeeNumber', 'employees')
      .get();
    expect(dto.employees).not.toBeUndefined();
    expect(dto.employees).toBe('4');
  });
});
