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

let result = 0;
let num1 = "";
let num2 = "";
let operator = '+';
let operatorClicked = false;

var calculateAnswer = {
    '+': function(x, y) {return x + y},
    '-': function(x, y) {return x - y},
    '/': function(x, y) {return x / y},
    '*': function(x, y) {return x * y},
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
    resetState();
});

app.post("/", function(req, res) {
    let buttonClicked = req.body.buttonClicked;

    if (operators.includes(buttonClicked)) {
        if (result !== 0) {
            num1 = result;
            num2 = "";
        }

        operatorClicked = true;
        operator = buttonClicked;
    }

    if (numbers.includes(buttonClicked)) {
        let num = buttonClicked;
        if (result !== 0 && num2 !== "" && !operatorClicked) {
            resetState();
        }

        if (operatorClicked) {
            num2 += num;
        } else {
            num1 += num;
        }
    }

    if (buttonClicked === decimal) {
        let decimal = buttonClicked;
        if (operatorClicked) {
            num2 += decimal;
        } else {
            num1 += decimal;
        }
    } 

    if (buttonClicked === equals) {
        result = calculateAnswer[operator](Number(num1), Number(num2));
        operatorClicked = false;
    }

    if (num2 === "") {
        result = num1;
    }

    if (num1 !== "" && num2 !== "" && operatorClicked) {
        result = num2;
    }

    if (buttonClicked === clear) {
        resetState();
    }

    res.json({ result });
});

function resetState () {
    num1 = "";
    num2 = "";
    operatorClicked = false;
    result = 0;
}

app.listen('3000', function() {
    console.log("server is running on port 3000");
});