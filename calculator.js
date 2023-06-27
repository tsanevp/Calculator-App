import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

const numbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const operators = ['+', '-', '/', '*'];
const decimal = '.';
const clear = 'ac';
const equals = '=';
const initialDisplayValue = 0;
const initialNumValue = "";

var result = initialDisplayValue;
var num1 = initialNumValue;
var num2 = initialNumValue;
var operator = operators[0];
var operatorClicked = false;

/**
 * Performs one of the following mathematical operations.
 */
var calculateAnswer = {
    '+': function (x, y) { return x + y },
    '-': function (x, y) { return x - y },
    '/': function (x, y) { return x / y },
    '*': function (x, y) { return x * y },
};

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function (req, res) {
    res.sendFile(__dirname + "/index.html");
    resetState();
});

app.post("/", function (req, res) {
    let buttonClicked = req.body.buttonClicked;

    // Call function that handles calculator logic
    calculatorLogic(buttonClicked);

    // Send number to display back to front end
    res.json({ result });
});

/**
 * Handles all the calculator logic.
 * @param {String} buttonClicked - The button selected on the calculator.
 */
function calculatorLogic(buttonClicked) {
    // AC clear button is clicked
    if (buttonClicked === clear) resetState();

    // Mathematical operator is clicked
    if (operators.includes(buttonClicked)) operatorWasClicked(buttonClicked);

    // Number is clicked after user has already solved for some value
    if (result !== initialDisplayValue && num2 !== initialNumValue && !operatorClicked && buttonClicked !== equals) {
        resetState();
    }

    // Add number to current number
    if (numbers.includes(buttonClicked)) appendNumber(buttonClicked);

    // Add decimal to current number
    if (buttonClicked === decimal) appendDecimal(buttonClicked);

    // Solve for some value
    if (buttonClicked === equals && num1 !== initialNumValue && num2 !== initialNumValue) {
        result = calculateAnswer[operator](Number(num1), Number(num2));
        operatorClicked = false;
    }

    // Current number to display
    if (num1 !== initialNumValue && num2 === initialNumValue) result = num1;
    if (num1 !== initialNumValue && num2 !== initialNumValue && operatorClicked) result = num2;
}

/**
 * Resets the internal state of the calculator.
 */
function resetState() {
    result = initialDisplayValue;
    num1 = initialNumValue;
    num2 = initialNumValue;
    operatorClicked = false;
}

/**
 * Handles logic for when a mathematical operator was clicked.
 * @param {String} buttonClicked - The operator clicked.
 */
function operatorWasClicked(buttonClicked) {
    if (result !== initialDisplayValue) {
        num1 = result;
        num2 = initialNumValue;
    }

    operatorClicked = true;
    operator = buttonClicked;
}

/**
 * Appends the number value of the button selected to the current number.
 * @param {String} num - The numerical button value selected on the calculator.
 */
function appendNumber(num) {
    operatorClicked ? num2 += num : num1 += num;
}

/**
 * Appends a decimal to the current number IF the current number does not already contain a decimal.
 * @param {String} decimal - The decimal to append to the current number.
 */
function appendDecimal(decimal) {
    if (operatorClicked) {
        num2.includes(decimal) ? {} : num2 += decimal;
    } else {
        num1.includes(decimal) ? {} : num1 += decimal;
    }
}

app.listen('3000', function () {
    console.log("server is running on port 3000");
});