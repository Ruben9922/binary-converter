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
