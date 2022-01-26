import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../Store";

type SignerState = {
  signerAddress: string | null;
  encryptedSignerKey: string | null;
};

const initialState: SignerState = {
  signerAddress: null,
  encryptedSignerKey: null,
};

export const signerSlice = createSlice({
  name: "signer",
  initialState,
  reducers: {
    setSignerAddress: (state, action: PayloadAction<string>) => {
      state.signerAddress = action.payload;
    },
    setEncryptedSignerKey: (state, action: PayloadAction<string>) => {
      state.encryptedSignerKey = action.payload;
    },
  },
});

export const { setSignerAddress, setEncryptedSignerKey } = signerSlice.actions;

export const selectSignerAddress = (state: RootState): string | null =>
  state.signer.signerAddress;

export const selectEncryptedSignerKey = (state: RootState): string | null =>
  state.signer.encryptedSignerKey;

export default signerSlice.reducer;
