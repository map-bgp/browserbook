import * as nacl from "tweetnacl";
import * as naclUtil from "tweetnacl-util";

export type EthEncryptedData = {
  version: string;
  nonce: string;
  ephemPublicKey: string;
  ciphertext: string;
};

export type EncryptionScheme = {
  publicKey: string;
  data: unknown;
  version: string;
};

/**
 * Returns `true` if the given value is nullish.
 *
 * @param value - The value being checked.
 * @returns Whether the value is nullish.
 */
const isNullish = (value: unknown) => {
  return value === null || value === undefined;
};

/**
 * Encrypt a message.
 *
 * @param options - The encryption options.
 * @param options.publicKey - The public key of the message recipient.
 * @param options.data - The message data.
 * @param options.version - The type of encryption to use.
 * @returns The encrypted data.
 */
export const encrypt = ({
                          publicKey,
                          data,
                          version,
                        }: EncryptionScheme): EthEncryptedData => {
  if (isNullish(publicKey)) {
    throw new Error("Missing publicKey parameter");
  } else if (isNullish(data)) {
    throw new Error("Missing data parameter");
  } else if (isNullish(version)) {
    throw new Error("Missing version parameter");
  }

  switch (version) {
    case "x25519-xsalsa20-poly1305": {
      if (typeof data !== "string") {
        throw new Error("Message data must be given as a string");
      }
      // generate ephemeral keypair
      const ephemeralKeyPair = nacl.box.keyPair();

      // assemble encryption parameters - from string to UInt8
      let pubKeyUInt8Array;
      try {
        pubKeyUInt8Array = naclUtil.decodeBase64(publicKey);
      } catch (err) {
        console.log("Error", err);
        throw new Error("Bad public key");
      }

      const msgParamsUInt8Array = naclUtil.decodeUTF8(data);
      const nonce = nacl.randomBytes(nacl.box.nonceLength);

      // encrypt
      const encryptedMessage = nacl.box(
        msgParamsUInt8Array,
        nonce,
        pubKeyUInt8Array,
        ephemeralKeyPair.secretKey
      );

      // handle encrypted data
      const output = {
        version: "x25519-xsalsa20-poly1305",
        nonce: naclUtil.encodeBase64(nonce),
        ephemPublicKey: naclUtil.encodeBase64(ephemeralKeyPair.publicKey),
        ciphertext: naclUtil.encodeBase64(encryptedMessage),
      };
      // return encrypted msg data
      return output;
    }

    default:
      throw new Error("Encryption type/version not supported");
  }
};