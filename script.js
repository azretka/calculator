const display = document.getElementById('display');
const historyEl = document.getElementById('history');

let currentValue = '0';
let operator = null;
let previousValue = null;
let justCalculated = false;

const opSymbols = { '+': '+', '-': '−', '*': '×', '/': '÷', '%': '%' };

function updateDisplay() {
    // Собираем всю строку в одном месте
    if (operator && previousValue !== null) {
        // Идёт набор: показываем previousValue + оператор + currentValue
        const line = previousValue + ' ' + opSymbols[operator] + (currentValue !== '0' ? ' ' + currentValue : '');
        display.innerText = line;
        historyEl.classList.add('hidden');
    } else {
        display.innerText = currentValue === '' ? '0' : currentValue;
        historyEl.classList.add('hidden');
    }

    const txt = display.innerText;
    if (txt.length > 12) display.style.fontSize = '28px';
    else if (txt.length > 9) display.style.fontSize = '36px';
    else if (txt.length > 6) display.style.fontSize = '48px';
    else display.style.fontSize = '64px';
}

function setActiveOp(op) {
    document.querySelectorAll('.btn-orange').forEach(b => b.classList.remove('active'));
    if (op) {
        document.querySelectorAll('.btn-orange').forEach(b => {
            if (b.innerText === opSymbols[op]) b.classList.add('active');
        });
    }
}

function appendNumber(number) {
    if (number === ',') {
        if (currentValue.includes(',')) return;
        currentValue = (currentValue === '0' || justCalculated) ? '0,' : currentValue + ',';
        justCalculated = false;
        updateDisplay();
        return;
    }
    if (justCalculated) {
        currentValue = number;
        justCalculated = false;
    } else {
        currentValue = currentValue === '0' ? number : currentValue + number;
    }
    setActiveOp(null);
    updateDisplay();
}

function clearDisplay() {
    currentValue = '0';
    previousValue = null;
    operator = null;
    justCalculated = false;
    setActiveOp(null);
    updateDisplay();
}

function backspace() {
    if (justCalculated) { clearDisplay(); return; }
    currentValue = currentValue.length > 1 ? currentValue.slice(0, -1) : '0';
    updateDisplay();
}

function toggleSign() {
    if (currentValue === '0') return;
    const n = parseFloat(currentValue.replace(',', '.')) * -1;
    currentValue = String(n).replace('.', ',');
    updateDisplay();
}

function setOperator(op) {
    if (operator && !justCalculated) calculate(true);
    operator = op;
    previousValue = currentValue;
    currentValue = '0';
    justCalculated = false;
    setActiveOp(op);
    updateDisplay();
}

function calculate(chain = false) {
    if (!operator || previousValue === null) return;
    const prev = parseFloat(previousValue.replace(',', '.'));
    const curr = parseFloat(currentValue.replace(',', '.'));
    if (isNaN(prev) || isNaN(curr)) return;

    let result;
    switch (operator) {
        case '+': result = prev + curr; break;
        case '-': result = prev - curr; break;
        case '*': result = prev * curr; break;
        case '/': result = curr !== 0 ? prev / curr : 'Ошибка'; break;
        case '%': result = prev % curr; break;
        default: return;
    }

    const resultStr = typeof result === 'number'
        ? parseFloat(result.toPrecision(10)).toString().replace('.', ',')
        : result;

    currentValue = resultStr;
    operator = null;
    previousValue = null;
    justCalculated = !chain;
    setActiveOp(null);
    updateDisplay();
}