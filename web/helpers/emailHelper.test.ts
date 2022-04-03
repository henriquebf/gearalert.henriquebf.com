import { filterOverdueGear } from './emailHelper';

describe('filterOverdueGear', () => {
  it('receiving an empty array', () => {
    const filteredGears = filterOverdueGear([]);
    expect(filteredGears).toEqual([]);
  });
});
