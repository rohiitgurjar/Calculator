let display = document.getElementById('display');
let currentInput = '0';
let shouldResetDisplay = false;

function updateDisplay() {
    display.textContent = currentInput;
    display.classList.add('active');
    setTimeout(() => display.classList.remove('active'), 100);
}

function clearDisplay() {
    currentInput = '0';
    shouldResetDisplay = false;
    updateDisplay();
}

function appendToDisplay(value) {
    if (shouldResetDisplay && !isOperator(value)) {
        currentInput = '0';
        shouldResetDisplay = false;
    }

    if (currentInput === '0' && value !== '.' && !isOperator(value)) {
        currentInput = value;
    } else if (isOperator(value) && isOperator(currentInput[currentInput.length - 1])) {
        currentInput = currentInput.slice(0, -1) + value;
    } else if (value === '.' && currentInput.includes('.') && !hasOperatorAfterLastDecimal()) {
        return;
    } else {
        currentInput += value;
    }
    
    updateDisplay();
}

function isOperator(char) {
    return ['+', '-', '*', '/'].includes(char);
}

function hasOperatorAfterLastDecimal() {
    let lastDecimalIndex = currentInput.lastIndexOf('.');
    if (lastDecimalIndex === -1) return false;
    
    for (let i = lastDecimalIndex + 1; i < currentInput.length; i++) {
        if (isOperator(currentInput[i])) return true;
    }
    return false;
}

function deleteLast() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

function calculate() {
    try {
        // Remove trailing operators
        while (isOperator(currentInput[currentInput.length - 1])) {
            currentInput = currentInput.slice(0, -1);
        }
        
        // Evaluate the expression
        let result = Function('"use strict"; return (' + currentInput + ')')();
        
        // Handle division by zero
        if (!isFinite(result)) {
            currentInput = 'Error';
        } else {
            // Round to avoid floating point issues
            result = Math.round(result * 100000000) / 100000000;
            currentInput = result.toString();
        }
        
        shouldResetDisplay = true;
    } catch (error) {
        currentInput = 'Error';
        shouldResetDisplay = true;
    }
    updateDisplay();
}

// Keyboard support
document.addEventListener('keydown', function(event) {
    if (event.key >= '0' && event.key <= '9') {
        appendToDisplay(event.key);
    } else if (event.key === '.') {
        appendToDisplay('.');
    } else if (event.key === '+' || event.key === '-' || event.key === '*' || event.key === '/') {
        appendToDisplay(event.key);
    } else if (event.key === 'Enter' || event.key === '=') {
        calculate();
    } else if (event.key === 'Escape' || event.key === 'c' || event.key === 'C') {
        clearDisplay();
    } else if (event.key === 'Backspace') {
        deleteLast();
    }
});