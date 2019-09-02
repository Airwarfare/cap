export interface Internet {
  // offset: number;

  parse(buffer: Buffer, offset: number): Internet;
}
