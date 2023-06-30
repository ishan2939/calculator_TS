/*type*/
type strArray = string[];
type strnumberArray = (string | number)[];
type numberArray = number[];
type returnObj = { inputArr: strArray; calcArr: strnumberArray };

const input: HTMLInputElement = document.querySelector("input")!; //input element

let inputValues: strArray = []; //array to store what user is entering
let calcValues: strnumberArray = []; //array to store what should be added to expression itself actually
let memoryArray: number[] = []; //array to store memory operation values
let equalFlag: boolean = false; //indicates if user has already pressed equal button

function getMemory() {
  //get stored values from memory
  if (localStorage.getItem("memory")) {
    memoryArray = JSON.parse(localStorage.getItem("memory")!);
  }
}

getMemory();


function backspace(inputArr: strArray, calcArr: strnumberArray): returnObj {
  //function to handle backspace operation

  //if array is not empty then pop out element
  if (inputArr.length) {
    inputArr.pop();
  }

  if (calcArr.length) {
    calcArr.pop();
  }

  return { inputArr, calcArr };
}

//function to calculate expression
function evaluateExpression(calcArr: strnumberArray): number | string {
  try {
    let temp = calcArr.join(""); //get the expression

    let ans = eval(temp); //evaluate the expression

    ans = ans != undefined ? ans : ""; //handle the answer
    return ans;
  } catch {
    //if any error then show it
    alert("Please enter valid expressions only.");
    return 0;
  }
}

//display output to the screen
function display(inputArr: strArray, input: HTMLInputElement) {
  input.value = inputArr.join("");
}

function factorial(number: number) {
  //function to calculate factorial

  let ans = 1;

  for (let i = 1; i <= number; i++) {
    if (ans == Infinity) {
      return Infinity;
    }
    ans = ans * i;
  }
  return ans;
}

//function to handle sign inversion
function signInversion( inputArr: strArray, calcArr: strnumberArray ): (strArray | strnumberArray)[] {

  if (isNaN(Number(inputArr.join("")))) {
    //if expression is not just a number

    if (
      inputArr[0] == "-" &&
      inputArr[1] == "(" &&
      inputArr[inputArr.length - 1] == ")"
    ) {
      //if expression is already negative then remove -

      inputArr.splice(0, 2);
      calcArr.splice(0, 2);
      inputArr.pop();
      calcArr.pop();
    } else {
      //if expression is positive then make it

      inputArr = ["-", "(", ...inputArr, ")"];
      calcArr = ["-", "(", ...calcArr, ")"];
    }
  } else {
    //if expression is just a number

    let temp = Number(inputArr.join(""));

    if (temp < 0) {
      //if a number is negative then remove -

      inputArr.splice(0, 1);
      calcArr.splice(0, 1);
    } else if (temp > 0) {
      //if it is positive then make it negative

      inputArr = ["-", ...inputArr];
      calcArr = ["-", ...calcArr];
    }
  }

  return [inputArr, calcArr];
}

//function to hamdle trigonometry
function trigonometry(sign: string, deg: string): number {

  let ans: number = eval(`Math.${sign}(${deg})`).toFixed(2);
  return ans;

}

//push value to arrays
function pushValue(inputValue: string, calcValue: string | number) {

  inputValues.push(inputValue);
  calcValues.push(calcValue);

}

//apply click event
document.querySelectorAll(".operations1, .operations2, .operations3, .operations4").forEach((i) => {

  i.addEventListener("click", (e: any) => {

    e.preventDefault();

    let temp: string | number, obj: any;

    //if user is already seeing the result and presses the equal button again
    if(equalFlag==true && e.target.id=='equal') //then keep the result on the screen
      return;
    else
      equalFlag = false;  //set it to false
    
    switch (e.target.id) {


      //degree operation
      case "deg":
        obj = evaluateExpression(calcValues);

        if (Number.isNaN(obj) || obj == "") return;

        inputValues = [obj];
        calcValues = [obj];

        temp = calcValues.join("");
        temp = (parseFloat(temp) * (180 / Math.PI)).toFixed(2);

        calcValues = [temp];
        inputValues = [temp];

        break;

      //exponential operation
      case "fe":
        obj = evaluateExpression(calcValues);

        if (Number.isNaN(obj) || obj == "") return;

        inputValues = [obj];
        calcValues = [obj];

        temp = calcValues.join("");
        temp = parseFloat(temp).toExponential();

        calcValues = [temp];
        inputValues = [temp];

        break;



      //memory operations
      case "m+":
        obj = evaluateExpression(calcValues);

        if (Number.isNaN(obj) || obj == "") return;

        inputValues = [obj];
        calcValues = [obj];

        if (!calcValues.length) temp = 0;
        else temp = parseFloat(calcValues.join(""));

        memoryArray.push(temp * 1);
        localStorage.setItem("memory", JSON.stringify(memoryArray));

        display(inputValues, input);

        break;

      case "m-":
        obj = evaluateExpression(calcValues);

        if (Number.isNaN(obj) || obj == "") return;

        inputValues = [obj];
        calcValues = [obj];

        if (!calcValues.length) temp = 0;
        else temp = parseFloat(calcValues.join(""));

        memoryArray.push(temp * -1);
        localStorage.setItem("memory", JSON.stringify(memoryArray));

        display(inputValues, input);
        break;

      case "mc":
        memoryArray = [];
        localStorage.clear();

        break;

      case "mr":
        getMemory();

        try {
          if (memoryArray.length == 0) return;

          let temp: string = memoryArray.join("+");

          temp = eval(temp);
          memoryArray = [parseFloat(temp)];

          inputValues = [temp];
          calcValues = [temp];

          localStorage.setItem("memory", JSON.stringify(memoryArray));

          display(inputValues, input);
        } catch {
          input.value = "Invalid Input";
        }
        break;



      //trigonometry operations
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



      //functions
      //square operation
      case "square":
        pushValue("^2", "**2");
        break;

      //1/x operation
      case "divBy1":
        obj = evaluateExpression(calcValues);

        if (Number.isNaN(obj) || obj == "") return;

        inputValues = [obj];
        calcValues = [obj];

        calcValues = [eval((1 / parseFloat(calcValues.join(""))).toString())];

        inputValues = [calcValues] as unknown as strArray;

        break;

      //module operation
      case "mod":
        pushValue("abs(", "Math.abs(");
        break;

      //e^ operation
      case "exp":
        pushValue("exp(", "Math.exp(");
        break;

      //random number generator
      case "rand":
        obj = Math.random() * 1000;

        inputValues = [obj];
        calcValues = [obj];

        break;

      //pie
      case "pie":
        pushValue("π", Math.PI);
        break;

      //e
      case "e":
        pushValue("e", Math.E);
        break;

      //square root operation
      case "root":
        pushValue("root(", "Math.sqrt(");

        break;

      //factorial  
      case "fac":
        pushValue("factorial(", "factorial(");
        break;

      //power operation
      case "pow":
        pushValue("^", "**");
        break;

      //10^x operation
      case "ten-pow":
        pushValue("10^", "10**");
        break;

      //log operation
      case "log":
        pushValue("log(", "Math.log10(");
        break;

      //ln operation
      case "ln":
        pushValue("ln(", "Math.log(");
        break;

      //sign inversion
      case "sign":
        obj = signInversion(inputValues, calcValues);

        inputValues = obj[0];
        calcValues = obj[1];

        break;

      //equal(ans OR =) operation
      case "equal":
        let ans: string | number = evaluateExpression(calcValues);

        ans = ans != undefined ? ans : "";

        inputValues = [ans.toString()];
        calcValues = [ans];

        display(inputValues, input);

        inputValues = [];
        calcValues = [];
        equalFlag = true;
        return;

      //clear operation
      case "clear":
        calcValues = [];
        inputValues = [];

        break;

      //backspace operation
      case "back":
        backspace(inputValues, calcValues);
        break;

      default:
        pushValue(e.target.id, e.target.id);
        break;
    }

    display(inputValues, input);

  });
  
});