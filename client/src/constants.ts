import * as BBookToken from "./blockchain/abi/BBToken.json";
import * as Exchange from "./blockchain/abi/Exchange.json";
import * as BBookToken2 from "./blockchain/abi/BBToken.json";

export const TOPIC = "/libp2p/example/chat/1.0.0";
export const TOPIC_VALIDATOR = "/libp2p/example/validator/1.0.0";
export const EXCHANGE = "0x9A862B129908c972Ef76575c4D205cD4e3fE9F75";
export const TOKENONE = "0x940426f75901BaFAe7A02428925dF05073d22438";
export const TOKENTWO = "0xb91D590B64ca65E97bcA36d16e288a42b6A55578";


export const exchangeAbi = Exchange.abi;
export const tokenOneAbi = BBookToken.abi;
export const tokenTwoAbi = BBookToken2.abi;


export const token2Address = new Map([
    ["Token A", TOKENONE],
    ["Token B", TOKENTWO],
  ]);
  
  export const token2Id = new Map([
      ["Token A", 1],
      ["Token B", 2],
    ]);  

export const token2Abi = new Map([
    ["Token A", tokenOneAbi],
    ["Token B", tokenTwoAbi],
  ]);
