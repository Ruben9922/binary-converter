package com.ruben9922.binaryconverter;

import android.content.Context;
import android.os.Build;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.AdapterView;
import android.widget.RadioButton;
import android.widget.Spinner;
import android.widget.TextView;
import android.widget.Toast;


public class MainActivity extends ActionBarActivity {
    private Spinner inputSystemSpinner;
    private Spinner resultSystemSpinner;
    private TextView inputRadixTextView;
    private TextView resultRadixTextView;
    private TextView resultStringTextView;
    private static final String DIGITS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private String resultString = "";
    private String tempRadix1 = "";
    private String tempRadix2 = "";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        inputSystemSpinner = (Spinner)findViewById(R.id.input_system_spinner);
        resultSystemSpinner = (Spinner)findViewById(R.id.result_system_spinner);
        inputRadixTextView = (TextView)findViewById(R.id.input_radix_text);
        resultRadixTextView = (TextView)findViewById(R.id.result_radix_text);
        resultStringTextView = (TextView)findViewById(R.id.result_string_text);
        inputSystemSpinner.setSelection(1);
        resultSystemSpinner.setSelection(0);

        inputSystemSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                inputRadixTextView.setEnabled(inputSystemSpinner.getSelectedItem().toString().equals("Other system"));
                inputRadixTextView.setText(tempRadix2);
                tempRadix2 = "";
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
                inputRadixTextView.setEnabled(false);
                inputRadixTextView.setText("");
            }
        });
        resultSystemSpinner.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parentView, View selectedItemView, int position, long id) {
                resultRadixTextView.setEnabled(resultSystemSpinner.getSelectedItem().toString().equals("Other system"));
                resultRadixTextView.setText(tempRadix1);
                tempRadix1 = "";
            }

            @Override
            public void onNothingSelected(AdapterView<?> parentView) {
                resultRadixTextView.setEnabled(false);
                resultRadixTextView.setText("");
            }
        });
    }


//    @Override
//    public boolean onCreateOptionsMenu(Menu menu) {
//        // Inflate the menu; this adds items to the action bar if it is present.
//        getMenuInflater().inflate(R.menu.menu_main, menu);
//        return true;
//    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void convertValue(View view) {
        String inputSystem = inputSystemSpinner.getSelectedItem().toString();
        String resultSystem = resultSystemSpinner.getSelectedItem().toString();
        boolean signed = ((RadioButton)findViewById(R.id.signed_radio_button)).isChecked();
        String inputString = ((TextView)findViewById(R.id.input_text)).getText().toString();
        boolean inputValid;
        boolean inputEmpty = inputString.equals("");
        boolean radixValid = true;
        int inputInt = 0;
        int inputRadix = 0;
        switch (inputSystem) {
            case "Binary":
                inputRadix = 2;
                break;
            case "Decimal":
                inputRadix = 10;
                break;
            case "Octal":
                inputRadix = 8;
                break;
            case "Hexadecimal":
                inputRadix = 16;
                break;
            case "Other system":
                try {
                    int base = Integer.parseInt(inputRadixTextView.getText().toString());
                    if (base >= 2 & base <= 36) {
                        inputRadix = base;
                    } else {
                        radixValid = false;
                    }
                } catch (NumberFormatException nfe) {
                    radixValid = false;
                }
                break;
        }
        int resultRadix = 0;
        switch (resultSystem) {
            case "Binary":
                resultRadix = 2;
                break;
            case "Decimal":
                resultRadix = 10;
                break;
            case "Octal":
                resultRadix = 8;
                break;
            case "Hexadecimal":
                resultRadix = 16;
                break;
            case "Other system":
                try {
                    int base = Integer.parseInt(resultRadixTextView.getText().toString());
                    if (base >= 2 & base <= 36) {
                        resultRadix = base;
                    } else {
                        radixValid = false;
                    }
                } catch (NumberFormatException nfe) {
                    radixValid = false;
                }
                break;
        }
        if (inputEmpty | !radixValid) {
            inputValid = false;
        } else {
            if (inputRadix == 10) {
                try {
                    inputInt = Integer.parseInt(inputString);
                    inputValid = signed | inputInt >= 0;
                } catch (NumberFormatException nfe) {
                    inputValid = false;
                }
            } else {
                inputValid = false;
                inputString = inputString.toUpperCase();
                for (char digit: inputString.toCharArray()) {
                    inputValid = false;
                    for (int i = 0; i < inputRadix; i++) {
                        if (digit == DIGITS.charAt(i)) {
                            inputValid = true;
                            break;
                        }
                    }
                    if (!inputValid) {
                        break;
                    }
                }
            }

//            switch (inputSystem) {
//                case "Binary":
//                    inputValid = true;
//                    for (char digit: inputString.toCharArray()) {
//                        if (digit != '0' & digit != '1') {
//                            inputValid = false;
//                        }
//                    }
//                    break;
//            }
        }
        if (inputValid) {
            if (inputSystem.equals(resultSystem)) {
                resultString = inputString;
            } else {
                if (inputRadix != 10) {
                    inputInt = convertToDec(inputString, inputRadix, signed);
                }
                if (resultRadix == 10) {
                    resultString = Integer.toString(inputInt);
                } else {
                    resultString = convertFromDec(inputInt, resultRadix, signed);
                }
            }
        } else {
            resultString = "";
            String toastText;
            if (inputEmpty) {
                toastText = "Please enter a value!";
            } else if (!radixValid) {
                toastText = "Please choose a base between 2 and 36 inclusive!";
            } else {
                toastText = "Please enter a valid value!";
            }
            Toast toast = Toast.makeText(getApplicationContext(), toastText, Toast.LENGTH_SHORT);
            toast.show();
        }
        resultStringTextView.setText(resultString);
        findViewById(R.id.copy_button).setEnabled(inputValid);
    }

    public void copyResult(View view) {
        if (Build.VERSION.SDK_INT < Build.VERSION_CODES.HONEYCOMB) {
            @SuppressWarnings("deprecation")
            android.text.ClipboardManager clipboard = (android.text.ClipboardManager)getSystemService(Context.CLIPBOARD_SERVICE);
            clipboard.setText(resultString);
        } else {
            android.content.ClipboardManager clipboard = (android.content.ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
            android.content.ClipData clip = android.content.ClipData.newPlainText("Result", resultString);
            clipboard.setPrimaryClip(clip);
        }
        Toast toast = Toast.makeText(getApplicationContext(), "Result copied to clipboard", Toast.LENGTH_SHORT);
        toast.show();
    }

    public void swapSystems(View view) {
        if (inputSystemSpinner.getSelectedItem().toString().equals("Other system")) {
            tempRadix1 = inputRadixTextView.getText().toString();
        }
        if (resultSystemSpinner.getSelectedItem().toString().equals("Other system")) {
            tempRadix2 = resultRadixTextView.getText().toString();
        }
        if (inputSystemSpinner.getSelectedItem().toString().equals("Other system") &
                resultSystemSpinner.getSelectedItem().toString().equals("Other system")) {
            inputRadixTextView.setText(tempRadix2);
            resultRadixTextView.setText(tempRadix1);
            tempRadix1 = "";
            tempRadix2 = "";
        } else {
            int tempIndex = inputSystemSpinner.getSelectedItemPosition();
            inputSystemSpinner.setSelection(resultSystemSpinner.getSelectedItemPosition());
            resultSystemSpinner.setSelection(tempIndex);
        }
    }

    public void clearValues(View view) {
        inputSystemSpinner.setSelection(1);
        resultSystemSpinner.setSelection(0);
        ((TextView)findViewById(R.id.input_text)).setText("");
        ((RadioButton)findViewById(R.id.unsigned_radio_button)).setChecked(true);
        resultStringTextView.setText("");
    }

    private int convertToDec(String inputString, int inputRadix, boolean signed) {
        char currentDigit;
        int result = 0;
        int digitCount = inputString.length();
        for (int i = 0; i < digitCount; i++) {
            currentDigit = inputString.charAt(digitCount - i - 1);
            result += DIGITS.indexOf(currentDigit) * (int)Math.pow(inputRadix, i);
        }
        if (signed) {
            int maxNumber = (int)Math.pow(inputRadix, digitCount);
            if (result >= maxNumber / 2) {
                result = result - maxNumber;
            }
        }
        return result;
    }

    private String convertFromDec(int inputInt, int resultRadix, boolean signed) {
        if (inputInt == 0) {
            return "0";
        }
        int inputInt2 = inputInt;
        if (signed & inputInt < 0) {
            int num1 = Math.abs(inputInt);
            int digitCount = (int)Math.ceil(Math.log(num1)/Math.log(resultRadix)) + 1;
//            //String test = ""; //test
//            while (num1 > 0) {
//                digitCount++;
//                //test += Integer.toString(inputAbs); //test
//                num1 /= resultRadix;
//            }
            int maxNumber = (int)Math.pow(resultRadix, digitCount);
            inputInt2 = maxNumber + inputInt;
            //return Integer.toString(inputInt2); //test
        }
        StringBuilder resultSb = new StringBuilder();
        while (inputInt2 > 0) {
            resultSb.insert(0, DIGITS.charAt(inputInt2 % resultRadix));
            inputInt2 /= resultRadix;
        }
        if (signed) {
            if (inputInt > 0 && DIGITS.indexOf(resultSb.charAt(0)) >= resultRadix / 2) {
                resultSb.insert(0, 0);
            }// else if (inputInt < 0 & DIGITS.indexOf(resultSb.charAt(0)) < resultRadix / 2) {
            //    resultSb.insert(0, DIGITS.charAt(resultRadix - 1));
            //}
        }
        return resultSb.toString();
    }
}
