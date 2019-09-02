export interface Link {
  offset: number;
  type: number;

  parse(buffer: Buffer): Link;
}
