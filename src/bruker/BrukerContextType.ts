export type Bedrift = string;

export interface BrukerContextType {
    innloggetBruker: InnloggetBruker;
    // valgtBedrift: Bedrift;
}

export interface InnloggetBruker {
    identifikator: string;
    // organisasjoner: Organisasjon[];
    // tilganger: Bedrift[];
}
