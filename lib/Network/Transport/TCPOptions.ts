export enum TCPOptionCodes {
  NONE = 0,
  NOP = 1, // No-Operation
  MSS = 2, // Maximum segment size
  WS = 3, // Window scale
  SACK = 4 // SACK permitted
}

export class TCPOptionsDecoder {
  static parse(buffer: Buffer): TCPOption[] {
    let offset = 0;
    let ret = [];
    while (buffer.length > offset) {
      const trimed = buffer.slice(offset, buffer.length);
      const optionCode = parseInt(trimed[0].toString(16));
      const [option, length] = this.getOptionType(trimed, optionCode);
      ret.push(option);
      offset += length;
    }
    return ret;
  }

  static getOptionType(buffer: Buffer, option: number): [TCPOption, number] {
    switch (option) {
      case TCPOptionCodes.NOP:
        return [new TCPOption(TCPOptionCodes.NOP), 1];
      case TCPOptionCodes.MSS:
        return [
          new TCPOption(TCPOptionCodes.MSS, [
            parseInt(buffer.slice(2, 4).toString("hex"), 16)
          ]),
          4
        ];
      case TCPOptionCodes.WS:
        return [
          new TCPOption(TCPOptionCodes.WS, [
            parseInt(buffer.slice(2, 3).toString("hex"), 16)
          ]),
          3
        ];
      case TCPOptionCodes.SACK:
        return [new TCPOption(TCPOptionCodes.SACK), 2];
      default:
        return [new TCPOption(TCPOptionCodes.NONE), 0];
    }
  }
}

export class TCPOption {
  public kind: TCPOptionCodes;
  public data: any[];

  constructor(kind: TCPOptionCodes, data: any[] = []) {
    this.kind = kind;
    this.data = data;
  }
}
