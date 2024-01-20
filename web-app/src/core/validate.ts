import * as R from "ramda";
import alphabet from "./alphabet";
import { SignMode } from "./signMode";
import State from "./state";

export function validateValue(state: State): string {
  if (R.isEmpty(state.value)) {
    return "Value cannot be empty.";
  }

  if (validateInputRadix(state)) {
    return "";
  }

  const allowedDigits = computeAllowedDigits(state.inputRadix);
  const containsOnlyAllowedDigits = (x: string): boolean => R.isEmpty(R.difference(R.split("", x.toUpperCase()), allowedDigits));

  if (state.signedMode && state.inputRadix === 10) {
    if (!containsOnlyAllowedDigits(state.value) && (R.head(state.value) !== "-" || R.isEmpty(R.tail(state.value)) || !containsOnlyAllowedDigits(R.tail(state.value)))) {
      return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}. Value may start with a hyphen (-).`;
    }
  } else {
    if (!containsOnlyAllowedDigits(state.value)) {
      return `Value may only contain the following digits: ${R.join(", ", allowedDigits)}.`;
    }
  }

  return "";
}

export function validateInputRadix(state: State): string {
  return validateRadix(state.inputRadix, state.signedMode);
}

export function validateOutputRadix(state: State): string {
  return validateRadix(state.outputRadix, state.signedMode);
}

function validateRadix(radix: number | null, signedMode: boolean): string {
  if (radix === null) {
    return "Radix cannot be empty.";
  }

  if (signedMode && radix !== 2 && radix !== 10) {
    return "Radix must be 2 or 10 in signed mode.";
  }

  if (radix <= 0) {
    return "Radix must be greater than zero.";
  }

  if (radix > alphabet.length) {
    return `Radix must be less than or equal to ${alphabet.length}`;
  }

  return "";
}

export function validateInputSignMode(state: State): string {
  return validateSignMode(state.inputSignMode, state.inputRadix, state.signedMode);
}

export function validateOutputSignMode(state: State): string {
  return validateSignMode(state.outputSignMode, state.outputRadix, state.signedMode);
}

function validateSignMode(signMode: SignMode | null, radix: number | null, signedMode: boolean): string {
  if (signedMode && radix === 2 && signMode === null) {
    return "Sign mode cannot be left blank.";
  }

  return "";
}

export function computeAllowedDigits(inputRadix: number | null): string[] {
  return inputRadix === null ? [] : (
    inputRadix === 1
      ? ["1"]
      : R.split("", R.slice(0, inputRadix, alphabet))
  );
}

export function validate(state: State): boolean {
  return !validateInputRadix(state) && !validateOutputRadix(state) && !validateValue(state) && !validateInputSignMode(state) && !validateOutputSignMode(state);
}
