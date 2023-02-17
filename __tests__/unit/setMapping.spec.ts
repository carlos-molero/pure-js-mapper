import Mapper from '../../src';
import EmployeeDto from '../__dtos__/EmployeeDto';
import ManagerDto from '../__dtos__/ManagerDto';
import SuperMarketDto from '../__dtos__/SuperMarketDto';

const employees = [
  {
    name: '1',
    surnames: '2',
    email: '3',
    managers: [
      {
        name: '1',
        surnames: '2',
        username: '3',
        address: '4',
      },
    ],
  },
  {
    name: '1',
    surnames: '2',
    email: '3',
  },
  {
    name: '1',
    surnames: '2',
    email: '3',
  },
];

describe('[UNIT] - Covers the use of setMapping() chain function', function () {
  it('Basic setMapping()', function () {
    const dto = Mapper().map({ employees }, SuperMarketDto).setMapping('employees', EmployeeDto).get<SuperMarketDto>();
    expect(dto.employees.length).toBe(3);
    expect(dto.employees.every((employee: typeof EmployeeDto) => Object.keys(employee).length === 5)).toBeTruthy();
  });
  it('Nested setMapping()', function () {
    const dto = Mapper()
      .map({ employees }, SuperMarketDto)
      .setMapping('employees', EmployeeDto)
      .setMapping('managers', ManagerDto)
      .get<SuperMarketDto>();
    expect(dto.employees.length).toBe(3);
    expect(dto.employees.every((employee: typeof EmployeeDto) => Object.keys(employee).length === 5)).toBeTruthy();
    expect(
      dto.employees[0].managers.every((manager: typeof ManagerDto) => Object.keys(manager).length === 4),
    ).toBeTruthy();
  });
});
