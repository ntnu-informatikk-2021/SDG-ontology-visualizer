declare module '@innotrade/enapso-graphdb-client' {
  export type EndpointOptions = {
    baseURL: string;
    repository: string;
    prefixes: Prefix[];
    queryPath: string | undefined;
    updatePath: string | undefined;
    queryURL: ?string;
    updateURL: ?string;
    defaultContext: ?string;
    transform: ?string;
  };

  type TransformBindingsOptions = {
    dropPrefixes: boolean;
  };

  interface Format {
    name: string;
    type: string;
    extension: string;
  }

  interface Prefix {
    prefix: string;
    iri: string;
  }

  interface ResultSet {
    total: number;
    success: boolean;
    records: any[];
  }

  interface EnapsoGraphDBClientType {
    Endpoint: (aOptions: EndpointOptions) => void;
    transformBindingsToResultSet: (aBindings: any, aOptions: TransformBindingsOptions) => ResultSet;
    parsePrefixes: (sparql: string) => Prefix[];
    FORMAT_JSON: Format;
    FORMAT_JSON_LD: Format;
    FORMAT_RDF_XML: Format;
    FORMAT_N3: Format;
    FORMAT_N_TRIPLES: Format;
    FORMAT_N_QUADS: Format;
    FORMAT_TURTLE: Format;
    FORMAT_TRIX: Format;
    FORMAT_TRIG: Format;
    FORMAT_BINARY_PDF: Format;
    PREFIX_OWL: Prefix;
    PREFIX_RDF: Prefix;
    PREFIX_RDFS: Prefix;
    PREFIX_SESAME: Prefix;
    PREFIX_XSD: Prefix;
    PREFIX_FN: Prefix;
    PREFIX_SFN: Prefix;
    PREFIX_PROTONS: Prefix;
    PREFIX_ENTEST: Prefix;
    PREFIX_ONTOFN: Prefix;
    PREFIX_SPIF: Prefix;
    PREFIX_APROPF: Prefix;
    PREFIX_ALIST: Prefix;
  }

  export const EnapsoGraphDBClient: EnapsoGraphDBClientType;

  export type GraphDBError = {
    statusCode: number;
    message: string;
    success: boolean;
  };

  export type LoginResponse = {
    success: boolean;
    message: string;
    statusCode: number;
  };
}
