import Mapper from '../../src/index';
import SuperMarketDto from '../__dtos__/SuperMarketDto';

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
      .get<SuperMarketDto>();
    expect(dto.employees).not.toBeUndefined();
    expect(dto.employees).toBe('4');
  });
  it('Nested alias', function () {
    delete (supermarket as any).employeeNumber;
    (supermarket as any).other = {
      employeeNumber: '4',
    };

    const dto = Mapper()
      .map({ ...supermarket }, SuperMarketDto)
      .setAlias('other.employeeNumber', 'employees')
      .get<SuperMarketDto>();
    expect(dto.employees).not.toBeUndefined();
    expect(dto.employees).toBe('4');
  });
  it('2o nesting level', function () {
    delete (supermarket as any).other;
    (supermarket as any).other = {
      data: {
        employeeNumber: '4',
      },
    };

    const dto = Mapper()
      .map({ ...supermarket }, SuperMarketDto)
      .setAlias('other.data.employeeNumber', 'employees')
      .get<SuperMarketDto>();
    expect(dto.employees).not.toBeUndefined();
    expect(dto.employees).toBe('4');
  });
});
