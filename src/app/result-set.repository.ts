import { Injectable } from '@angular/core';
import { ResultSet } from './result-set';

@Injectable({ providedIn: 'root' })
export class ResultSetRepository {
  private _resultSets: Map<string, ResultSet> = new Map([
    [
      'rs_1',
      {
        id: 'rs_1',
        name: 'ResultSet 1',
        dataPath: 'data/rs_1.json',
        injections: [
          {
            name: 'Injection 1',
            chromatograms: [],
            peaks: [],
          },
          {
            name: 'Injection 2',
            chromatograms: [],
            peaks: [],
          },
        ],
      },
    ],
  ]);

  async fetchResultSet(resultSetId: string): Promise<ResultSet> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const resultSet = this._resultSets.get(resultSetId)!;
    if (!resultSet) {
      throw new Error(`ResultSet ${resultSetId} not found`);
    }
    return resultSet;
  }
}
