import { filterOverdueGear } from './emailHelper';

describe('filterOverdueGear', () => {
  it('receiving an empty array', () => {
    const gear = [];
    const filteredGears = filterOverdueGear(gear);
    expect(filteredGears).toStrictEqualqw([]);
  });
});
