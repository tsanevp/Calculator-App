import express from "express";
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();

let currentResult = 0;
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
app.use(express.static("public"));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
    let body = req.body;
    if (body.operator) {
        operatorClicked = true;
        operator = body.operator;
    }

    if (body.number) {
        let num = body.number;
        if (operatorClicked) {
            num2 += num;
        } else {
            num1 += num;
        }
        console.log("num1: " + num1 + " num2: " + num2);
    }

    if (body.decimal) {
        let decimal = body.decimal;
        if (operatorClicked) {
            num2 += decimal;
        } else {
            num1 += decimal;
        }
    } 

    if (body.equals) {
        currentResult = calculateAnswer[operator](Number(num1), Number(num2)); 
        resetState();
    }
    console.log(body);
});

app.listen('3000', function() {
    console.log("server is running on port 3000");
});

function resetState () {
    num1 = "";
    num2 = "";
    operatorClicked = false;
}
