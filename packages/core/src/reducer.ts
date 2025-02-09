import * as R from "ramda";
import { Action } from "./action";
import { getFilteredRadixPresets } from "./radixPreset";
import { State } from "./state";

export function reducer(draft: State, action: Action): void {
  switch (action.type) {
    case "set-value":
      draft.value = action.value;
      draft.isValueDirty = true;
      return;
    case "set-input-radix":
      draft.inputRadix = action.inputRadix;

      draft.inputSignMode = null;
      draft.outputSignMode = null;

      if (draft.signedMode) {
        if (draft.inputRadix === 2) {
          draft.outputRadix = 10;
        }
        if (draft.inputRadix === 10) {
          draft.outputRadix = 2;
        }
      }

      return;
    case "set-output-radix":
      draft.outputRadix = action.outputRadix;

      draft.inputSignMode = null;
      draft.outputSignMode = null;

      if (draft.signedMode) {
        if (draft.outputRadix === 2) {
          draft.inputRadix = 10;
        }
        if (draft.outputRadix === 10) {
          draft.inputRadix = 2;
        }
      }

      return;
    case "set-signed-mode":
      draft.signedMode = action.signedMode;

      draft.inputSignMode = null;
      draft.outputSignMode = null;

      // TODO: Refactor this - don't need to call filterRadixPresets for this
      const allowedRadices = R.map(radixPreset => radixPreset.radix, getFilteredRadixPresets(action.signedMode));

      if (action.signedMode) {
        if (!R.includes(draft.inputRadix, allowedRadices)) {
          draft.inputRadix = allowedRadices[0];
        }

        if (!R.includes(draft.outputRadix, allowedRadices)) {
          draft.outputRadix = allowedRadices[0];
        }

        if (draft.inputRadix === draft.outputRadix) {
          draft.inputRadix = allowedRadices[0];
          draft.outputRadix = allowedRadices[1];
        }
      }

      return;
    case "set-input-sign-mode":
      draft.inputSignMode = action.inputSignMode;
      return;
    case "set-output-sign-mode":
      draft.outputSignMode = action.outputSignMode;
      return;
    case "swap":
      const tempRadix = draft.inputRadix;
      draft.inputRadix = draft.outputRadix;
      draft.outputRadix = tempRadix;

      draft.value = action.outputValue ?? draft.value;

      if (draft.signedMode) {
        const tempSignMode = draft.inputSignMode;
        draft.inputSignMode = draft.outputSignMode;
        draft.outputSignMode = tempSignMode;
      }

      return;
  }
}
