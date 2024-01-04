//working


let currentInput = '';      
let shouldResetDisplay = false;
const display = document.getElementById('display');                                                   //reference htmlel
 
function updateDisplay() {
  display.value = currentInput;
}
 
function clea(){
  currentInput='';
  shouldResetDisplay = false;
  updateDisplay();
}
 
function getValue(value) {          //responsible for handling the input from user and concat,merging,and managing display.
  if (shouldResetDisplay) {
    currentInput = '';
    shouldResetDisplay = false;
  } else {
    // Check if the last character is an operator
    const lastCharIsOperator = /[+\-*/]$/.test(currentInput);
 
    // If the current value is an operator and the last character is an operator, replace the last operator
    if (/^[+\-*/]$/.test(value) && lastCharIsOperator) {
      currentInput = currentInput.slice(0, -1) + value;
    } else {
      currentInput += value;
    }
  }
 
  updateDisplay();
}
 

 
function calculateResult() {
  try {
    const result = evaluateExpression(currentInput);
    localStorage.setItem(document.getElementById('display').value, result);  
    currentInput = result.toString();
    shouldResetDisplay = true;
    updateDisplay();
  } catch (error) {
    currentInput = 'Error';
    shouldResetDisplay = true;
    updateDisplay();
  }
}
 
function evaluateExpression(expression) {
  const tokens = tokenizeExpression(expression);
  const postfix = infixToPostfix(tokens);
  return calculatePostfix(postfix);
}
 
// function tokenizeExpression(expression) {      //for validating the equation
//   return expression.match(/([0-9]+|\+|\-|\*|\/|\(|\))/g) || [];
// }

function tokenizeExpression(expression) {
  const matchResult = expression.match(/([0-9]+(?:\.[0-9]+)?|\+|\-|\*|\/|\(|\))/g);
 
  if (!matchResult) {
    throw new Error('Invalid expression');
  }
 
  const invalidCharacters = expression.replace(/([0-9]+(?:\.[0-9]+)?|\+|\-|\*|\/|\(|\))/g, '');
 
  if (invalidCharacters.trim() !== '') {
    throw new Error('Invalid characters in expression');
  }
 
  return matchResult;
}
 
 
function infixToPostfix(infixTokens) {
  const output = [];
  const stack = [];
 
  for (const token of infixTokens) {    
    if (!isNaN(parseFloat(token))) {
      output.push(token);
    } else if (token === '(') {
      stack.push(token);
    } else if (token === ')') {
      while (stack.length > 0 && stack[stack.length - 1] !== '(') {
        output.push(stack.pop());
      }
      stack.pop(); // Remove the '(' from the stack
    } else {
      while (
        stack.length > 0 &&
        getPrecedence(stack[stack.length - 1]) >= getPrecedence(token)
      ) {
        output.push(stack.pop());
      }
      stack.push(token);
    }
  }
 
  while (stack.length > 0) {
    output.push(stack.pop());
  }
 
  return output;
}
 
function calculatePostfix(postfixTokens) {
  const stack = [];
 
  for (const token of postfixTokens) {
    if (!isNaN(parseFloat(token))) {
      stack.push(parseFloat(token));
    } else {
      const operand2 = stack.pop();
      const operand1 = stack.pop();
 
      switch (token) {
        case '+':
          stack.push(operand1 + operand2);
          break;
        case '-':
          stack.push(operand1 - operand2);
          break;
        case '*':
          stack.push(operand1 * operand2);
          break;
        case '/':
          if (operand2 !== 0) {
            stack.push(operand1 / operand2);
          } else {
            throw new Error('Division by zero');
          }
          break;
        default:
          throw new Error('Invalid operator');
      }
    }
  }
 
  if (stack.length !== 1) {
    throw new Error('Invalid expression');
  }
 
  return stack.pop();
}
 
function getPrecedence(operator) {
  switch (operator) {
    case '+':
    case '-':
      return 1;
    case '*':
    case '/':
      return 2;
    default:
      return 0; // for parentheses
  }
}
 
updateDisplay();