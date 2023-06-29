type strArray = string[];
type strnumberArray = (string | number)[];
type numberArray = number[];
type equalObj = { inputArr: strArray; calcArr: strnumberArray };

const input: HTMLInputElement = document.querySelector("input")!;
let calcValues: strnumberArray = [];
let inputValues: strArray = [];
let memoryArray: number[] = [];

function getMemory() {
  if (localStorage.getItem("memory")) {
    memoryArray = JSON.parse(localStorage.getItem("memory")!);
  }
}
getMemory();

function backspace(inputArr: strArray, calcArr: strnumberArray) {
  if (inputArr.length) {
    inputArr.pop();
  }
  if (calcArr.length) {
    calcArr.pop();
  }
  return { inputArr, calcArr };
}

function display(
  inputArr: strArray,
  calcArr: strnumberArray,
  input: HTMLInputElement
) {
  input.value = inputArr.join("");
}

// function enable(item) {
//     item.classList.toggle('disable', false)
//     // return { inputArr, calcArr }
// }

function equal(inputArr: strArray, calcArr: strnumberArray): (number | string) {
  try {
    let temp = calcArr.join("");
    let ans = eval(temp);
    ans = ans!=undefined?ans:'';
    return ans;
  } catch {
    alert("Please enter valid expressions only.");
    return 0;
  }
}

function fac(number: number) {
  let ans = 1;
  for (let i = 1; i <= number; i++) {
    if (ans == Infinity) {
      return Infinity;
    }
    ans = ans * i;
  }
  return ans;
}

function sign(inputArr: strArray, calcArr: strnumberArray) {
  if (isNaN(Number(inputArr.join("")))) {
    if (
      inputArr[0] == "-" &&
      inputArr[1] == "(" &&
      inputArr[inputArr.length - 1] == ")"
    ) {
      inputArr.splice(0, 2);
      calcArr.splice(0, 2);
      inputArr.pop();
      calcArr.pop();
    } else {
      inputArr = ["-", "(", ...inputArr, ")"];
      calcArr = ["-", "(", ...calcArr, ")"];
    }
  } else {
    if (Number(inputArr.join("")) < 0) {
      inputArr.splice(0, 1);
      calcArr.splice(0, 1);
    } else if (Number(inputArr.join("")) > 0) {
      inputArr = ["-", ...inputArr];
      calcArr = ["-", ...calcArr];
    }
  }
  console.log(inputArr, calcArr);

  return [ inputArr, calcArr ];
}

function trigonometry(sign: string, deg: string): number {
  let ans: number = eval(`Math.${sign}(${deg})`).toFixed(2);
  return ans;
}

document
  .querySelectorAll(".operations1, .operations2, .operations3, .operations4")
  .forEach((i) => {
    console.log();
    i.addEventListener("click", (e: any) => {
      e.preventDefault();
      console.log("hello", e.target.id);
      if (e.target.className.includes("simple")) {
        if (e.target.id == "pie") {
          pushValue("π", Math.PI);
        } else if (e.target.id == "e") {
          pushValue("e", Math.E);
        } else if (e.target.id == "pow") {
          pushValue("^", "**");
        } else {
          pushValue(e.target.id, e.target.id);
        }
      } else {
        let t: string, obj: any;

        switch (e.target.id) {
          case "fac":
            pushValue("fac(", "fac(");
            break;

          case "deg":
            obj = equal(inputValues, calcValues);
            inputValues = [obj];
            calcValues = [obj];
            t = calcValues.join("");
            t = (parseFloat(t) * (180 / Math.PI)).toFixed(2);
            calcValues = [t];
            inputValues = [t];
            break;

          case "fe":
            obj = equal(inputValues, calcValues);
            inputValues = obj.inputArray;
            calcValues = obj.calcArray;
            t = parseFloat(calcValues.join("")).toString();
            t = parseFloat(t).toExponential();
            calcValues = [t];
            inputValues = [t];
            break;

          case "ten-pow":
            pushValue("10^", "10**");
            break;

          case "log":
            pushValue("log(", "Math.log10(");
            break;

          case "ln":
            pushValue("ln(", "Math.log(");
            break;

          case "sign":
            obj = sign(inputValues, calcValues);
            inputValues = obj[0];
            calcValues = obj[1];
            break;

          case "root":
            pushValue("root(", "Math.sqrt(");
            break;

          case "sin":
            pushValue("sin(", "trigonometry('sin',");
            break;

          case "cos":
            pushValue("cos(", "trigonometry('cos',");
            break;

          case "tan":
            pushValue("tan(", "trigonometry('tan',");
            break;

          case "sinh":
            pushValue("sinh(", "trigonometry('sinh',");
            break;

          case "cosh":
            pushValue("cosh(", "trigonometry('cosh',");
            break;

          case "tanh":
            pushValue("tanh(", "trigonometry('tanh',");
            break;

          case "square":
            pushValue("^2", "**2");
            break;

          case "divBy":
            obj = equal(inputValues, calcValues);
            
            inputValues = [obj];
            calcValues = [obj];
            calcValues = [
              eval((1 / parseFloat(calcValues.join(""))).toString()),
            ];
            inputValues = [calcValues] as unknown as strArray;
            break;

          case "absolute":
            pushValue("abs(", "Math.abs(");
            break;

          case "exp":
            pushValue("exp(", "Math.exp(");
            break;

          case "equal":
            let ans:(string | number) = equal(inputValues, calcValues);
            ans = ans!=undefined?ans:'';
            inputValues = [ans.toString()];
            calcValues = [ans];
            display(inputValues, calcValues, input);
            inputValues = [];
            calcValues = [];
            return;

          case "clear":
            calcValues = [];
            inputValues = [];
            break;

          case "back":
            backspace(inputValues, calcValues);
            break;

          default:
            break;
        }
      }
      console.log(inputValues, calcValues);
      display(inputValues, calcValues, input);
    });
  });

document.querySelectorAll(".memory").forEach((i) => {
  i.addEventListener("click", (e: any) => {
    e.preventDefault();

    let value: number, obj: any;
    switch (e.target.id) {
      case "m+":
        obj = equal(inputValues, calcValues);
        inputValues = obj.inputArr;
        calcValues = obj.calcArr;
        if (!calcValues.length) {
          value = 0;
        } else {
          value = parseFloat(calcValues.join(""));
        }

        memoryArray.push(value * 1);
        localStorage.setItem("memory", JSON.stringify(memoryArray));
        display(inputValues, calcValues, input);
        break;

      case "m-":
        obj = equal(inputValues, calcValues);
        inputValues = obj.inputArray;
        calcValues = obj.calcArray;
        if (!calcValues.length) {
          value = 0;
        } else {
          value = parseFloat(calcValues.join(""));
        }

        memoryArray.push(value * -1);
        localStorage.setItem("memory", JSON.stringify(memoryArray));
        display(inputValues, calcValues, input);
        break;

      case "mc":
        memoryArray = [];
        localStorage.clear();
        break;

      case "mr":
        getMemory();
        try {
          let temp: string = memoryArray.join("+");
          temp = eval(temp);
          memoryArray = [parseFloat(temp)];
          inputValues = [temp];
          calcValues = [temp];
          localStorage.setItem("memory", JSON.stringify(memoryArray));
          display(inputValues, calcValues, input);
        } catch {
          input.value = "Invalid Input";
        }
        break;

      default:
        break;
    }
  });
});

function pushValue(inputValue: string, calcValue: string | number) {
  inputValues.push(inputValue);
  calcValues.push(calcValue);
}
