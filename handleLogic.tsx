import React from "react";

interface PROPS {
    btnVal: string,
    screenVal: string,
}
type Operators = {
    [key: string]: (a: number, b: number) => number;
}

const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'];
const operand = ['+', '-', '*', '/', '%'];
const priorityOpe = ['*', '/', '%'];
const brackets = ['(', ')'];
const dots = '.';
var operators: Operators = {
    '+': function (a: number, b: number) { return a + b },
    '-': function (a: number, b: number) { return a - b },
    '*': function (a: number, b: number) { return a * b },
    '/': function (a: number, b: number) { return a / b },
    '%': function (a: number, b: number) { return a % b },
};

let rs: string = '';
let subRs: string = '';

//main------------------------------------------------------------------------------------------------
export function Main({ btnVal, screenVal }: PROPS): string {
    let validInput = checkInput({ btnVal, screenVal });
    if (btnVal != '=') {
        return validInput;
    }
    console.log("Receive a string, turning to arr");
    let validArray: string[] = handleString(validInput);
    console.log(validArray);
    console.log("Calculating");
    console.log("Ans: " + calculate(validArray));
    return calculate(validArray)
}


//input constrain
function checkInput({ btnVal, screenVal }: PROPS): string {
    function updateValue() {
        subRs = screenVal + btnVal;
        return subRs;
    }

    if (numbers.includes(btnVal)) {
        if (screenVal == '0') {
            subRs = btnVal;
            return subRs;
        } else {
            return updateValue();
        }
    }
    // Cho phép nhập tối đa 2 toán tử liên tiếp toán tử và số âm
    if (operand.includes(btnVal)) {
        let temp = (screenVal + btnVal).split('');
        if ((priorityOpe.includes(temp[temp.length - 2]) || temp[temp.length - 2] == '+')
            && temp[temp.length - 1] == '-') {
            return updateValue();
        }
        if (temp[temp.length - 1] == temp[temp.length - 2]
            || operand.includes(temp[temp.length - 2])) {
            return screenVal;
        }
        return updateValue();
    }
    //Hạn chế đúng định dạng thập phân
    if (btnVal == dots) {
        if (!screenVal.includes('.')) {
            return updateValue();
        }
        let temp = screenVal.split('');
        for (let i = temp.length - 1; i >= 0; i--) {
            if (operand.includes(temp[i]) || brackets.includes(temp[i])) {
                return updateValue();
            } else if (temp[i] == dots) {
                return screenVal;
            }
        }
    }
    //Khi nhập ( trước số thì tự động thêm vào *
    if (brackets.includes(btnVal)) {
        let temp = screenVal.split('');
        temp.push(btnVal);
        if (numbers.includes(temp[temp.length - 2]) && temp[temp.length - 1] == '(') {
            temp.splice(temp.length - 1, 1, '*');
            temp.push(btnVal);
            subRs = temp.join('');
            return subRs;
        }
        return updateValue();
    }

    if (btnVal == 'AC') {
        return '';
    }

    if (btnVal == 'Del') {
        let temp = screenVal.split('');
        temp.splice(temp.length - 1, 1);
        subRs = temp.join('');
        return subRs;
    }

    return screenVal;
}
//xử lý string thành mảng và xử lý 1 số trg hợp đặc biệt
function handleString(validInput: string): string[] {
    let arrayValue: string[] = validInput.split(/([()+\-\*\%\/])/).filter(Boolean);
    for (let i = 0; i < arrayValue.length; i++) {
        if (i == 0 && (arrayValue[i] == '-' || arrayValue[i] == '+')) {
            if (arrayValue[i + 1] == undefined) {
                arrayValue = ["Err"];
                return arrayValue;
            }
            let temp = '';
            temp += arrayValue[i] + arrayValue[i + 1];
            arrayValue.splice(i, 2, temp);
        }
        //5*-2 = -10
        if (arrayValue[i] == '-' && operand.includes(arrayValue[i - 1])) {
            let temp = '-' + arrayValue[i + 1];
            arrayValue.splice(i, 2, temp);
        }
        // ['(', '+', '2', ')'] -> +2      ['(', '-', '2', ')'] -> -2
        if (arrayValue[i - 1] == '(' && arrayValue[i + 2] == ')') {
            if(arrayValue[i] == '+'){
                let temp = arrayValue[i + 1];
                arrayValue.splice(i - 1, 4, temp);
            }
            if(arrayValue[i] == '-'){
                let temp = '-' + arrayValue[i + 1];
                arrayValue.splice(i - 1, 4, temp);
            }
        }
        //['(', '2', ')'] -> 2
        if (arrayValue[i - 1] == '(' && arrayValue[i + 1] == ')') {
            let temp = arrayValue[i];
            arrayValue.splice(i - 1, 3, temp);
        }
        //['(', '-', '5', '+', '2', ')'] -> ['(', '-5', '+', '2', ')']
        if (arrayValue[i - 1] == '(' && arrayValue[i + 2] != ')') {
            if(arrayValue[i] == '+'){
                let temp = arrayValue[i + 1];
                arrayValue.splice(i, 2, temp);
            }
            if(arrayValue[i] == '-'){
                let temp = '-' + arrayValue[i + 1];
                arrayValue.splice(i, 2, temp);
            }
        }
    }

    return arrayValue;
}
//Thực hiện logic tính toán: các toán tử trong ngoặc -> các phép nhân chia -> cộng trừ
function calculate(validArray: string[]): string {
    if (validArray.includes('(') || validArray.includes(')')) {
        validArray = prioritizeParenthesis(validArray);
    }

    for (let i = 0; i < validArray.length; i++) {
        while (priorityOpe.includes(validArray[i])) {
            if (validArray[i - 1] != undefined && validArray[i + 1] != undefined) {
                validArray.splice(i - 1, 3, `${compute(validArray[i - 1], validArray[i], validArray[i + 1])}`);
            } else {
                rs = "Err";
                return rs;
            }
        }
    }

    for (let i = 0; i < validArray.length; i++) {
        while (operand.includes(validArray[i])) {
            if (validArray[i - 1] != undefined && validArray[i + 1] != undefined) {
                validArray.splice(i - 1, 3, `${compute(validArray[i - 1], validArray[i], validArray[i + 1])}`);
            } else {
                rs = "Err";
                return rs;
            }
        }
    }

    function compute(previous: string, operand: string, nexts: string): number {
        let temp: number = 0;
        const prev = +previous;
        const next = +nexts;
        const operands = operand.toString();
        temp = operators[operands](prev, next);
        return temp;
    }

    function prioritizeParenthesis(validArray: string[]) {
        for (let i = validArray.length - 1; i >= 0; i--) {
            if (validArray[i] == '(') {
                let j = i;
                //tính toán tử ưu tiên
                while (j < validArray.length - 1 && validArray[j] != ')') {
                    if (priorityOpe.includes(validArray[j]) && validArray[j - 1] != '(' && validArray[j + 1] != ')') {
                        validArray.splice(j - 1, 3, `${compute(validArray[j - 1], validArray[j], validArray[j + 1])}`);
                    } else {
                        j++;
                    }
                }
                //tính toán tử thường
                j = i;
                while (j < validArray.length - 1 && validArray[j] != ')') {
                    if (operand.includes(validArray[j]) && validArray[j - 1] != '(' && validArray[j + 1] != ')') {
                        validArray.splice(j - 1, 3, `${compute(validArray[j - 1], validArray[j], validArray[j + 1])}`);
                    } else {
                        j++;
                    }
                }
                let temp = validArray[i + 1];
                validArray.splice(i, 3, temp);
            }
        }
        return validArray;
    }


    rs = validArray.join('');
    if(rs.includes('NaN') || rs.includes(')')){
        rs = 'Wrong format!'
    }
    return rs;
}












//main sẽ nhận dữ liệu và xử lý input, với input trả về mặc định sẽ là giá trị màn hình screenVal
/**checkInput(){
 * Với btnVal là số thì gọi hàm checkInput - ok
 *            là các toán tử thì thực hiện hàm check toán tử, không cho nhập nhiều toán tử liên tiếp - ok
 *            là dấu chấm thì gọi hàm check dấu chấm - ok
 *            là dấu ngoặc thì nhận và thêm vào giá trị màn hình - ok
 *            là dấu nút del thì xóa 1 giá trị bên phải hiện tại - ok
 * }
 * 
 * 
 *            là dấu bằng thì thực hiện logic tính toán
 * Gọi 2 hàm, xử lý chuỗi thành mảng, fix những trường hợp đặc biệt handleString()
 * 
 *          Xử lý logic tính toán, ưu tiên tính những toán tử trong ngoặc, tính nhân chia %, tính +- calculate()
 * 
 * 827
 * 2+(5*(2+3-2)*(52+1+(1)+1))
 * 3+5*(2+2*(-5+1))
 */