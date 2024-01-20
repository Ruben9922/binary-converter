import { SignMode } from "./signMode";

type Action =
  | { type: "set-value", value: string }
  | { type: "set-input-radix", inputRadix: number | null }
  | { type: "set-output-radix", outputRadix: number | null }
  | { type: "set-signed-mode", signedMode: boolean }
  | { type: "set-input-sign-mode", inputSignMode: SignMode | null }
  | { type: "set-output-sign-mode", outputSignMode: SignMode | null }
  | { type: "swap", outputValue: string | null };

export default Action;
