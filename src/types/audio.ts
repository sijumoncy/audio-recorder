export interface IIngredient {
  checksum: { md5: string };
  mimeType: string;
  size: number;
  role?: string;
}

export interface IAudioBurrito {
  format: 'scripture burrito';
  meta: {
    version: string;
    category: string;
    generator: {
      softwareName: string;
      softwareVersion: string;
      userName: string;
    };
    defaultLocale: string;
    dateCreated: string;
    comments: string[];
  };
  idAuthorities: {
    scribe: {
      id: string;
      name: { en: string };
    };
  };
  identification: {
    primary: {
      [key: string]: {
        [key: string]: {
          revision: string;
          timestamp: string;
        };
      };
    };
    name: { en: string };
    description: { en: string };
    abbreviation: { en: string };
  };
  languages: {
    tag: string;
    name: string;
    scriptDirection: 'rtl' | 'ltr';
  }[];
  type: {
    flavorType: {
      name: 'scripture';
      flavor: {
        name: 'audioTranslation';
        performance: string[];
        formats: {
          format1: {
            compression: 'wav';
            trackConfiguration: '1/0 (Mono)';
            bitRate: number;
            bitDepth: number;
            samplingRate: 48000 | 44000;
          };
        };
      };
      currentScope: { [key: string]: [] };
    };
  };
  confidential: boolean;
  agencies: [{}] | [];
  targetAreas: any[];
  localizedNames: {};
  ingredients: { [key: string]: IIngredient };
  copyright:
    | {
        shortStatements: string[];
      }
    | {
        licenses: { [key: string]: string }[];
      };
}
