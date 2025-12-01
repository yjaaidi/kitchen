export interface ResultSet {
  id: string;
  name: string;
  dataPath: string;
  injections: Injection[];
}

interface Injection {
  chromatograms: Chromatogram[];
  name: string;
  peaks: Peak[];
}

interface Chromatogram {
  id: string;
  name: string;
  data: number[];
}

interface Peak {
  id: string;
  name: string;
  data: number[];
}
