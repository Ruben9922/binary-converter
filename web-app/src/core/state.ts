import { SignMode } from "./signMode";

export default interface State {
  value: string;
  isValueDirty: boolean;
  inputRadix: number | null;
  outputRadix: number | null;
  signedMode: boolean;
  inputSignMode: SignMode | null;
  outputSignMode: SignMode | null;
}

export const initialState: State = {
  value: "",
  isValueDirty: false,
  inputRadix: 2,
  outputRadix: 16,
  signedMode: false,
  inputSignMode: null,
  outputSignMode: null,
};
