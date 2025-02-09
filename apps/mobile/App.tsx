import React from 'react'
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { TextInput } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useImmerReducer } from "use-immer";
import { SignMode } from "@binary-converter/core";
import { radixPresets } from "@binary-converter/core";
import { reducer } from "@binary-converter/core";
import { initialState } from '@binary-converter/core';
import { validate } from "@binary-converter/core";
import { convert } from "@binary-converter/core";
import InputSignMode from "./InputSignMode.tsx";
import Value from "./Value.tsx";

function App(): React.JSX.Element {
  const [state, dispatch] = useImmerReducer(reducer, initialState);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: '#000',
  };

  const isValid = validate(state);
  const outputValue = isValid ? convert(state) : null;

  const setValue = (value: string): void => dispatch({ type: "set-value", value });
  const setInputRadix = (inputRadix: number | null): void => dispatch({ type: "set-input-radix", inputRadix });
  const setOutputRadix = (outputRadix: number | null): void => dispatch({ type: "set-output-radix", outputRadix });
  const setSignedMode = (signedMode: boolean): void => dispatch({ type: "set-signed-mode", signedMode });
  const setInputSignMode = (inputSignMode: SignMode | null): void => dispatch({ type: "set-input-sign-mode", inputSignMode });
  const setOutputSignMode = (outputSignMode: SignMode | null): void => dispatch({ type: "set-output-sign-mode", outputSignMode });
  const swap = (): void => dispatch({ type: "swap", outputValue });

  return (
    <SafeAreaView style={[backgroundStyle, {flex: 1}]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <Value
            value={state.value}
            setValue={setValue}
            isValueDirty={state.isValueDirty}
            signedMode={state.signedMode}
            inputRadix={state.inputRadix}
          />

          {state.signedMode && state.inputRadix === 2 && (
            <InputSignMode
              inputRadix={state.inputRadix}
              signedMode={state.signedMode}
              inputSignMode={state.inputSignMode}
              setInputSignMode={setInputSignMode}
            />
          )}

          {/*<InputRadixPreset*/}
          {/*  inputRadix={state.inputRadix}*/}
          {/*  setInputRadix={setInputRadix}*/}
          {/*  signedMode={state.signedMode}*/}
          {/*/>*/}

          {/*<OutputRadixPreset*/}
          {/*  outputRadix={state.outputRadix}*/}
          {/*  setOutputRadix={setOutputRadix}*/}
          {/*  signedMode={state.signedMode}*/}
          {/*/>*/}

          {/*{state.signedMode && state.outputRadix === 2 && (*/}
          {/*  <OutputSignMode*/}
          {/*    outputRadix={state.outputRadix}*/}
          {/*    signedMode={state.signedMode}*/}
          {/*    outputSignMode={state.outputSignMode}*/}
          {/*    setOutputSignMode={setOutputSignMode}*/}
          {/*  />*/}
          {/*)}*/}

          {/*<SwapButton swap={swap} />*/}

          {/*<Output outputValue={outputValue} />*/}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
});

export default App;
