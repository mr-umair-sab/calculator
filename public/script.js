// Global Variables
let currentMode = 'basic';
let currentDisplay = '';
let powerMode = false;
let courseCount = 0;
let angleMode = 'DEG'; // DEG or RAD
let calculationHistory = [];
let soundEnabled = false;

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

// Keyboard Support
document.addEventListener('keydown', (e) => {
    // Only work when calculator display is active (not in input fields)
    if (!currentDisplay || document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') {
        return;
    }
    
    // Number keys
    if (e.key >= '0' && e.key <= '9') {
        e.preventDefault();
        appendToDisplay(e.key);
        playSound();
    }
    // Operators
    else if (e.key === '+') {
        e.preventDefault();
        appendToDisplay('+');
        playSound();
    }
    else if (e.key === '-') {
        e.preventDefault();
        appendToDisplay('-');
        playSound();
    }
    else if (e.key === '*') {
        e.preventDefault();
        appendToDisplay('*');
        playSound();
    }
    else if (e.key === '/') {
        e.preventDefault();
        appendToDisplay('/');
        playSound();
    }
    // Decimal point
    else if (e.key === '.') {
        e.preventDefault();
        appendToDisplay('.');
        playSound();
    }
    // Enter key for calculate
    else if (e.key === 'Enter') {
        e.preventDefault();
        calculate();
        playSound();
    }
    // Backspace
    else if (e.key === 'Backspace') {
        e.preventDefault();
        backspace();
        playSound();
    }
    // Escape for clear
    else if (e.key === 'Escape') {
        e.preventDefault();
        clearDisplay();
        playSound();
    }
    // Parentheses
    else if (e.key === '(') {
        e.preventDefault();
        appendToDisplay('(');
        playSound();
    }
    else if (e.key === ')') {
        e.preventDefault();
        appendToDisplay(')');
        playSound();
    }
});

// Sound Effect Function
function playSound() {
    if (!soundEnabled) return;
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Toggle Sound
function toggleSound() {
    soundEnabled = !soundEnabled;
    const btn = document.getElementById('soundToggle');
    btn.innerHTML = soundEnabled ? '🔊 Sound' : '🔇 Sound';
    btn.className = soundEnabled 
        ? 'bg-green-500/30 hover:bg-green-500/40 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold border border-green-400/50'
        : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold border border-white/30';
}

// Save to History
function saveToHistory(expression, result) {
    const historyItem = {
        expression: expression,
        result: result,
        timestamp: new Date().toLocaleString()
    };
    calculationHistory.unshift(historyItem);
    
    // Keep only last 50 calculations
    if (calculationHistory.length > 50) {
        calculationHistory.pop();
    }
    
    // Save to localStorage
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
}

// Load History from localStorage
function loadHistory() {
    const saved = localStorage.getItem('calcHistory');
    if (saved) {
        calculationHistory = JSON.parse(saved);
        updateHistoryDisplay();
    }
}

// Update History Display
function updateHistoryDisplay() {
    const historyDiv = document.getElementById('historyList');
    if (!historyDiv) return;
    
    if (calculationHistory.length === 0) {
        historyDiv.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center py-4">No history yet</p>';
        return;
    }
    
    let html = '';
    calculationHistory.forEach((item, index) => {
        html += `
            <div class="bg-white dark:bg-gray-700 p-3 rounded-lg mb-2 shadow hover:shadow-md transition-all cursor-pointer" onclick="loadFromHistory(${index})">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <p class="text-sm text-gray-600 dark:text-gray-400">${item.expression}</p>
                        <p class="text-lg font-bold text-purple-600 dark:text-purple-400">= ${item.result}</p>
                    </div>
                    <button onclick="event.stopPropagation(); deleteHistoryItem(${index})" class="text-red-500 hover:text-red-700 ml-2">✕</button>
                </div>
                <p class="text-xs text-gray-400 mt-1">${item.timestamp}</p>
            </div>
        `;
    });
    historyDiv.innerHTML = html;
}

// Load calculation from history
function loadFromHistory(index) {
    if (currentDisplay) {
        currentDisplay.value = calculationHistory[index].expression;
    }
}

// Delete history item
function deleteHistoryItem(index) {
    calculationHistory.splice(index, 1);
    localStorage.setItem('calcHistory', JSON.stringify(calculationHistory));
    updateHistoryDisplay();
}

// Clear all history
function clearHistory() {
    if (confirm('Clear all history?')) {
        calculationHistory = [];
        localStorage.removeItem('calcHistory');
        updateHistoryDisplay();
    }
}

// Toggle History Panel
function toggleHistory() {
    const panel = document.getElementById('historyPanel');
    panel.classList.toggle('hidden');
}

// Copy Result to Clipboard
function copyResult() {
    if (!currentDisplay || currentDisplay.value === '0' || currentDisplay.value === 'Error') {
        alert('No result to copy!');
        return;
    }
    
    navigator.clipboard.writeText(currentDisplay.value).then(() => {
        const btn = document.getElementById('copyBtn');
        const originalText = btn.innerHTML;
        btn.innerHTML = '✓ Copied!';
        btn.className = 'bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl shadow-lg font-semibold border border-green-400';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.className = 'bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-6 py-2.5 rounded-xl shadow-lg hover:shadow-xl transition-all font-semibold border border-white/30';
        }, 1500);
    }).catch(() => {
        alert('Failed to copy!');
    });
}

// Mode Switching
function switchMode(mode) {
    currentMode = mode;
    
    // Hide all calculators
    document.querySelectorAll('.calculator-mode').forEach(calc => {
        calc.classList.add('hidden');
    });
    
    // Show selected calculator
    if (mode === 'basic') {
        document.getElementById('basicCalculator').classList.remove('hidden');
        currentDisplay = document.getElementById('basicDisplay');
    } else if (mode === 'scientific') {
        document.getElementById('scientificCalculator').classList.remove('hidden');
        currentDisplay = document.getElementById('scientificDisplay');
    } else if (mode === 'intermediate') {
        document.getElementById('intermediateCalculator').classList.remove('hidden');
        currentDisplay = document.getElementById('intermediateDisplay');
    } else if (mode === 'advanced') {
        document.getElementById('advancedCalculator').classList.remove('hidden');
        switchAdvancedTab('quadratic');
    } else if (mode === 'utilities') {
        document.getElementById('utilitiesCalculator').classList.remove('hidden');
        switchUtilityTab('unit');
        updateUnitOptions();
    } else if (mode === 'formulas') {
        document.getElementById('formulasCalculator').classList.remove('hidden');
        switchFormulaTab('library');
        initFormulaLibrary();
    }
    
    if (currentDisplay) {
        clearDisplay();
    }
}

// Initialize with basic calculator
window.onload = () => {
    switchMode('basic');
    loadHistory();
};

// ===== BASIC & SCIENTIFIC CALCULATOR FUNCTIONS =====

function appendToDisplay(value) {
    if (!currentDisplay) return;
    
    if (currentDisplay.value === '0' || currentDisplay.value === 'Error') {
        currentDisplay.value = value;
    } else {
        currentDisplay.value += value;
    }
    
    // Add button animation if triggered by button click
    if (window.event && window.event.target) {
        const target = window.event.target;
        target.classList.add('scale-95');
        setTimeout(() => target.classList.remove('scale-95'), 100);
    }
}

function clearDisplay() {
    if (currentDisplay) {
        currentDisplay.value = '0';
    }
    powerMode = false;
}

function backspace() {
    if (currentDisplay.value.length > 1) {
        currentDisplay.value = currentDisplay.value.slice(0, -1);
    } else {
        currentDisplay.value = '0';
    }
}

function calculate() {
    try {
        let expression = currentDisplay.value;
        const originalExpression = expression;
        
        // Replace × and ÷ with * and /
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Handle percentage
        expression = expression.replace(/(\d+)%/g, '($1/100)');
        
        // Handle power operator (^)
        expression = expression.replace(/(\d+\.?\d*)\^(\d+\.?\d*)/g, 'Math.pow($1,$2)');
        
        let result = eval(expression);
        
        // Save to history
        saveToHistory(originalExpression, result);
        
        // Animate result
        currentDisplay.classList.add('scale-105');
        setTimeout(() => currentDisplay.classList.remove('scale-105'), 200);
        
        currentDisplay.value = result;
    } catch (error) {
        currentDisplay.value = 'Error';
    }
}

// ===== SCIENTIFIC FUNCTIONS =====

function scientificFunc(func) {
    try {
        let value = parseFloat(currentDisplay.value);
        let result;
        
        switch(func) {
            case 'sin':
                result = Math.sin(value * Math.PI / 180);
                break;
            case 'cos':
                result = Math.cos(value * Math.PI / 180);
                break;
            case 'tan':
                result = Math.tan(value * Math.PI / 180);
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'square':
                result = Math.pow(value, 2);
                break;
            case 'power':
                powerMode = true;
                appendToDisplay('^');
                return;
        }
        
        currentDisplay.value = result.toFixed(8).replace(/\.?0+$/, '');
    } catch (error) {
        currentDisplay.value = 'Error';
    }
}

// ===== 12th CLASS INTERMEDIATE FUNCTIONS =====

function toggleAngleMode() {
    angleMode = angleMode === 'DEG' ? 'RAD' : 'DEG';
    document.getElementById('angleMode').textContent = angleMode;
}

function factorial(n) {
    if (n < 0) return NaN;
    if (n === 0 || n === 1) return 1;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

function intermediateFunc(func) {
    try {
        let value = parseFloat(currentDisplay.value);
        let result;
        
        // Convert to radians if in DEG mode for trig functions
        const toRadians = (deg) => deg * Math.PI / 180;
        const toDegrees = (rad) => rad * 180 / Math.PI;
        
        switch(func) {
            case 'sin':
                result = angleMode === 'DEG' ? Math.sin(toRadians(value)) : Math.sin(value);
                break;
            case 'cos':
                result = angleMode === 'DEG' ? Math.cos(toRadians(value)) : Math.cos(value);
                break;
            case 'tan':
                result = angleMode === 'DEG' ? Math.tan(toRadians(value)) : Math.tan(value);
                break;
            case 'asin':
                result = Math.asin(value);
                result = angleMode === 'DEG' ? toDegrees(result) : result;
                break;
            case 'acos':
                result = Math.acos(value);
                result = angleMode === 'DEG' ? toDegrees(result) : result;
                break;
            case 'atan':
                result = Math.atan(value);
                result = angleMode === 'DEG' ? toDegrees(result) : result;
                break;
            case 'log':
                result = Math.log10(value);
                break;
            case 'ln':
                result = Math.log(value);
                break;
            case 'exp':
                result = Math.exp(value);
                break;
            case 'sqrt':
                result = Math.sqrt(value);
                break;
            case 'square':
                result = Math.pow(value, 2);
                break;
            case 'cube':
                result = Math.pow(value, 3);
                break;
            case 'factorial':
                if (value < 0 || !Number.isInteger(value)) {
                    currentDisplay.value = 'Error: n must be positive integer';
                    return;
                }
                result = factorial(value);
                break;
            case 'abs':
                result = Math.abs(value);
                break;
            case 'power':
                appendToDisplay('^');
                return;
        }
        
        // Format result
        if (isNaN(result) || !isFinite(result)) {
            currentDisplay.value = 'Error';
        } else {
            currentDisplay.value = result.toFixed(10).replace(/\.?0+$/, '');
        }
    } catch (error) {
        currentDisplay.value = 'Error';
    }
}

// ===== ADVANCED CALCULATOR FUNCTIONS =====

function switchAdvancedTab(tab) {
    // Hide all tabs
    document.querySelectorAll('.adv-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Show selected tab
    if (tab === 'quadratic') {
        document.getElementById('quadraticTab').classList.remove('hidden');
    } else if (tab === 'matrix') {
        document.getElementById('matrixTab').classList.remove('hidden');
    } else if (tab === 'gpa') {
        document.getElementById('gpaTab').classList.remove('hidden');
        if (courseCount === 0) {
            addCourse();
        }
    }
}

// Quadratic Solver
function solveQuadratic() {
    const a = parseFloat(document.getElementById('coeffA').value);
    const b = parseFloat(document.getElementById('coeffB').value);
    const c = parseFloat(document.getElementById('coeffC').value);
    const resultDiv = document.getElementById('quadraticResult');
    
    if (isNaN(a) || isNaN(b) || isNaN(c)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter all coefficients!</p>';
        return;
    }
    
    if (a === 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Coefficient "a" cannot be zero!</p>';
        return;
    }
    
    const discriminant = b * b - 4 * a * c;
    
    let html = `<h4 class="font-bold text-lg mb-2">Solution:</h4>`;
    html += `<p class="mb-2">Equation: ${a}x² + ${b}x + ${c} = 0</p>`;
    html += `<p class="mb-2">Discriminant (Δ) = b² - 4ac = ${discriminant.toFixed(2)}</p>`;
    
    if (discriminant > 0) {
        const x1 = (-b + Math.sqrt(discriminant)) / (2 * a);
        const x2 = (-b - Math.sqrt(discriminant)) / (2 * a);
        html += `<p class="text-green-600 dark:text-green-400 font-semibold">Two Real Roots:</p>`;
        html += `<p>x₁ = ${x1.toFixed(4)}</p>`;
        html += `<p>x₂ = ${x2.toFixed(4)}</p>`;
    } else if (discriminant === 0) {
        const x = -b / (2 * a);
        html += `<p class="text-blue-600 dark:text-blue-400 font-semibold">One Real Root:</p>`;
        html += `<p>x = ${x.toFixed(4)}</p>`;
    } else {
        const realPart = (-b / (2 * a)).toFixed(4);
        const imagPart = (Math.sqrt(-discriminant) / (2 * a)).toFixed(4);
        html += `<p class="text-purple-600 dark:text-purple-400 font-semibold">Two Complex Roots:</p>`;
        html += `<p>x₁ = ${realPart} + ${imagPart}i</p>`;
        html += `<p>x₂ = ${realPart} - ${imagPart}i</p>`;
    }
    
    resultDiv.innerHTML = html;
}

// Matrix Addition
function addMatrices() {
    const a11 = parseFloat(document.getElementById('a11').value) || 0;
    const a12 = parseFloat(document.getElementById('a12').value) || 0;
    const a21 = parseFloat(document.getElementById('a21').value) || 0;
    const a22 = parseFloat(document.getElementById('a22').value) || 0;
    
    const b11 = parseFloat(document.getElementById('b11').value) || 0;
    const b12 = parseFloat(document.getElementById('b12').value) || 0;
    const b21 = parseFloat(document.getElementById('b21').value) || 0;
    const b22 = parseFloat(document.getElementById('b22').value) || 0;
    
    const c11 = a11 + b11;
    const c12 = a12 + b12;
    const c21 = a21 + b21;
    const c22 = a22 + b22;
    
    const resultDiv = document.getElementById('matrixResult');
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Result Matrix (A + B):</h4>
        <div class="flex justify-center">
            <div class="grid grid-cols-2 gap-4 text-center">
                <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded font-bold text-xl">${c11}</div>
                <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded font-bold text-xl">${c12}</div>
                <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded font-bold text-xl">${c21}</div>
                <div class="bg-blue-100 dark:bg-blue-900 p-4 rounded font-bold text-xl">${c22}</div>
            </div>
        </div>
    `;
}

// GPA Calculator
function addCourse() {
    courseCount++;
    const container = document.getElementById('courseContainer');
    const courseDiv = document.createElement('div');
    courseDiv.className = 'grid grid-cols-1 md:grid-cols-3 gap-4 mb-3';
    courseDiv.innerHTML = `
        <input type="text" placeholder="Course Name" class="input-field course-name placeholder:text-gray-400 dark:placeholder:text-gray-500">
        <input type="number" step="0.1" min="0" max="4" placeholder="Grade (0-4)" class="input-field course-grade placeholder:text-gray-400 dark:placeholder:text-gray-500">
        <input type="number" min="1" max="6" placeholder="Credits" class="input-field course-credits placeholder:text-gray-400 dark:placeholder:text-gray-500">
    `;
    container.appendChild(courseDiv);
}

function calculateGPA() {
    const courses = document.getElementById('courseContainer').children;
    let totalPoints = 0;
    let totalCredits = 0;
    let courseList = '';
    
    for (let course of courses) {
        const name = course.querySelector('.course-name').value || 'Unnamed';
        const grade = parseFloat(course.querySelector('.course-grade').value) || 0;
        const credits = parseFloat(course.querySelector('.course-credits').value) || 0;
        
        if (credits > 0) {
            totalPoints += grade * credits;
            totalCredits += credits;
            courseList += `<p>${name}: ${grade.toFixed(2)} × ${credits} credits</p>`;
        }
    }
    
    const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : 0;
    
    const resultDiv = document.getElementById('gpaResult');
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-2">GPA Calculation:</h4>
        ${courseList}
        <hr class="my-3 border-gray-300 dark:border-gray-600">
        <p class="font-semibold">Total Credits: ${totalCredits}</p>
        <p class="font-semibold">Total Grade Points: ${totalPoints.toFixed(2)}</p>
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-2">GPA: ${gpa}</p>
    `;
}

// Add CSS classes dynamically
const style = document.createElement('style');
style.textContent = `
    .btn-calc {
        background: linear-gradient(145deg, #f3f4f6, #e5e7eb);
        color: #1f2937;
        padding: 1rem;
        border-radius: 16px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6);
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 1.25rem;
        border: 1px solid rgba(255, 255, 255, 0.3);
    }
    
    .btn-calc:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.6);
    }
    
    .btn-calc:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .dark .btn-calc {
        background: linear-gradient(145deg, #4b5563, #374151);
        color: #f9fafb;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .dark .btn-calc:hover {
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    }
    
    .btn-sci {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
        padding: 0.625rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(99, 102, 241, 0.3);
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 0.95rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-sci:hover {
        background: linear-gradient(135deg, #4f46e5, #4338ca);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(99, 102, 241, 0.4);
    }
    
    .btn-sci:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(99, 102, 241, 0.3);
    }
    
    .dark .btn-sci {
        background: linear-gradient(135deg, #818cf8, #6366f1);
        box-shadow: 0 4px 6px rgba(129, 140, 248, 0.4);
    }
    
    .dark .btn-sci:hover {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        box-shadow: 0 6px 12px rgba(129, 140, 248, 0.5);
    }
    
    .btn-inter {
        background: linear-gradient(135deg, #f97316, #dc2626);
        color: white;
        padding: 0.625rem;
        border-radius: 12px;
        box-shadow: 0 4px 6px rgba(249, 115, 22, 0.3);
        transition: all 0.2s ease;
        font-weight: 600;
        font-size: 0.875rem;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }
    
    .btn-inter:hover {
        background: linear-gradient(135deg, #ea580c, #b91c1c);
        transform: translateY(-2px);
        box-shadow: 0 6px 12px rgba(249, 115, 22, 0.4);
    }
    
    .btn-inter:active {
        transform: translateY(0);
        box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3);
    }
    
    .dark .btn-inter {
        background: linear-gradient(135deg, #fb923c, #f87171);
        box-shadow: 0 4px 6px rgba(251, 146, 60, 0.4);
    }
    
    .dark .btn-inter:hover {
        background: linear-gradient(135deg, #f97316, #ef4444);
        box-shadow: 0 6px 12px rgba(251, 146, 60, 0.5);
    }
    
    .input-field {
        background-color: white;
        color: #1f2937;
        padding: 0.75rem;
        border-radius: 12px;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.06);
        border: 2px solid #e5e7eb;
        transition: all 0.3s ease;
    }
    
    .input-field:focus {
        outline: none;
        border-color: #a855f7;
        box-shadow: 0 0 0 4px rgba(168, 85, 247, 0.1), inset 0 2px 4px rgba(0, 0, 0, 0.06);
    }
    
    .dark .input-field {
        background-color: #374151;
        color: white;
        border-color: #4b5563;
        box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .dark .input-field:focus {
        border-color: #c084fc;
        box-shadow: 0 0 0 4px rgba(192, 132, 252, 0.2), inset 0 2px 4px rgba(0, 0, 0, 0.3);
    }
`;
document.head.appendChild(style);


// ===== UTILITY CALCULATORS =====

// Unit Converter
function convertUnit() {
    const value = parseFloat(document.getElementById('unitValue').value);
    const fromUnit = document.getElementById('fromUnit').value;
    const toUnit = document.getElementById('toUnit').value;
    const category = document.getElementById('unitCategory').value;
    const resultDiv = document.getElementById('unitResult');
    
    if (isNaN(value)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter a valid number!</p>';
        return;
    }
    
    let result;
    
    if (category === 'length') {
        const meters = convertToMeters(value, fromUnit);
        result = convertFromMeters(meters, toUnit);
    } else if (category === 'weight') {
        const kg = convertToKg(value, fromUnit);
        result = convertFromKg(kg, toUnit);
    } else if (category === 'temperature') {
        result = convertTemperature(value, fromUnit, toUnit);
    }
    
    resultDiv.innerHTML = `<p class="text-2xl font-bold text-purple-600 dark:text-purple-400">${value} ${fromUnit} = ${result.toFixed(4)} ${toUnit}</p>`;
}

function convertToMeters(value, unit) {
    const conversions = { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254 };
    return value * conversions[unit];
}

function convertFromMeters(meters, unit) {
    const conversions = { m: 1, km: 1000, cm: 0.01, mm: 0.001, mile: 1609.34, yard: 0.9144, foot: 0.3048, inch: 0.0254 };
    return meters / conversions[unit];
}

function convertToKg(value, unit) {
    const conversions = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 };
    return value * conversions[unit];
}

function convertFromKg(kg, unit) {
    const conversions = { kg: 1, g: 0.001, mg: 0.000001, lb: 0.453592, oz: 0.0283495 };
    return kg / conversions[unit];
}

function convertTemperature(value, from, to) {
    if (from === to) return value;
    
    // Convert to Celsius first
    let celsius;
    if (from === 'C') celsius = value;
    else if (from === 'F') celsius = (value - 32) * 5/9;
    else if (from === 'K') celsius = value - 273.15;
    
    // Convert from Celsius to target
    if (to === 'C') return celsius;
    else if (to === 'F') return celsius * 9/5 + 32;
    else if (to === 'K') return celsius + 273.15;
}

function updateUnitOptions() {
    const category = document.getElementById('unitCategory').value;
    const fromUnit = document.getElementById('fromUnit');
    const toUnit = document.getElementById('toUnit');
    
    let options = '';
    if (category === 'length') {
        options = '<option value="m">Meter</option><option value="km">Kilometer</option><option value="cm">Centimeter</option><option value="mm">Millimeter</option><option value="mile">Mile</option><option value="yard">Yard</option><option value="foot">Foot</option><option value="inch">Inch</option>';
    } else if (category === 'weight') {
        options = '<option value="kg">Kilogram</option><option value="g">Gram</option><option value="mg">Milligram</option><option value="lb">Pound</option><option value="oz">Ounce</option>';
    } else if (category === 'temperature') {
        options = '<option value="C">Celsius</option><option value="F">Fahrenheit</option><option value="K">Kelvin</option>';
    }
    
    fromUnit.innerHTML = options;
    toUnit.innerHTML = options;
}

// Percentage Calculator
function calculatePercentage() {
    const type = document.getElementById('percentType').value;
    const num1 = parseFloat(document.getElementById('percentNum1').value);
    const num2 = parseFloat(document.getElementById('percentNum2').value);
    const resultDiv = document.getElementById('percentResult');
    
    if (isNaN(num1) || isNaN(num2)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid numbers!</p>';
        return;
    }
    
    let result, explanation;
    
    if (type === 'of') {
        result = (num1 / 100) * num2;
        explanation = `${num1}% of ${num2} = ${result.toFixed(2)}`;
    } else if (type === 'is') {
        result = (num1 / num2) * 100;
        explanation = `${num1} is ${result.toFixed(2)}% of ${num2}`;
    } else if (type === 'change') {
        result = ((num2 - num1) / num1) * 100;
        explanation = `Change from ${num1} to ${num2} = ${result.toFixed(2)}%`;
    }
    
    resultDiv.innerHTML = `<p class="text-2xl font-bold text-purple-600 dark:text-purple-400">${explanation}</p>`;
}

// Age Calculator
function calculateAge() {
    const birthDate = new Date(document.getElementById('birthDate').value);
    const resultDiv = document.getElementById('ageResult');
    
    if (!birthDate || isNaN(birthDate)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter a valid date!</p>';
        return;
    }
    
    const today = new Date();
    let years = today.getFullYear() - birthDate.getFullYear();
    let months = today.getMonth() - birthDate.getMonth();
    let days = today.getDate() - birthDate.getDate();
    
    if (days < 0) {
        months--;
        days += new Date(today.getFullYear(), today.getMonth(), 0).getDate();
    }
    
    if (months < 0) {
        years--;
        months += 12;
    }
    
    const totalDays = Math.floor((today - birthDate) / (1000 * 60 * 60 * 24));
    const totalMonths = years * 12 + months;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-2">Your Age:</h4>
        <p class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-3">${years} Years, ${months} Months, ${days} Days</p>
        <p class="text-gray-700 dark:text-gray-300">Total: ${totalMonths} months or ${totalDays} days</p>
    `;
}

// BMI Calculator
function calculateBMI() {
    const weight = parseFloat(document.getElementById('bmiWeight').value);
    const height = parseFloat(document.getElementById('bmiHeight').value) / 100; // Convert to meters
    const resultDiv = document.getElementById('bmiResult');
    
    if (isNaN(weight) || isNaN(height) || height <= 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid values!</p>';
        return;
    }
    
    const bmi = weight / (height * height);
    let category, color;
    
    if (bmi < 18.5) {
        category = 'Underweight';
        color = 'text-blue-600 dark:text-blue-400';
    } else if (bmi < 25) {
        category = 'Normal weight';
        color = 'text-green-600 dark:text-green-400';
    } else if (bmi < 30) {
        category = 'Overweight';
        color = 'text-orange-600 dark:text-orange-400';
    } else {
        category = 'Obese';
        color = 'text-red-600 dark:text-red-400';
    }
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-2">Your BMI:</h4>
        <p class="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">${bmi.toFixed(1)}</p>
        <p class="text-xl font-semibold ${color}">${category}</p>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Underweight: < 18.5</p>
            <p>Normal: 18.5 - 24.9</p>
            <p>Overweight: 25 - 29.9</p>
            <p>Obese: ≥ 30</p>
        </div>
    `;
}

// Currency Converter (using static rates - in real app, use API)
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const from = document.getElementById('fromCurrency').value;
    const to = document.getElementById('toCurrency').value;
    const resultDiv = document.getElementById('currencyResult');
    
    if (isNaN(amount)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter a valid amount!</p>';
        return;
    }
    
    // Static exchange rates (relative to USD)
    const rates = {
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 149.50,
        INR: 83.12,
        PKR: 278.50,
        AUD: 1.52,
        CAD: 1.36
    };
    
    const result = (amount / rates[from]) * rates[to];
    
    resultDiv.innerHTML = `
        <p class="text-2xl font-bold text-purple-600 dark:text-purple-400">${amount} ${from} = ${result.toFixed(2)} ${to}</p>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Note: Using static exchange rates</p>
    `;
}

// Switch Utility Tab
function switchUtilityTab(tab) {
    document.querySelectorAll('.utility-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.getElementById(tab + 'Tab').classList.remove('hidden');
}

// ===== FORMULA STORAGE SYSTEM =====

// Pre-loaded Formula Library
const formulaLibrary = [
    // Physics Formulas
    { name: "Newton's Second Law", expression: "F = m × a", variables: ["F", "m", "a"], category: "physics", description: "Force = Mass × Acceleration" },
    { name: "Kinetic Energy", expression: "KE = 0.5 × m × v²", variables: ["KE", "m", "v"], category: "physics", description: "Kinetic Energy formula" },
    { name: "Potential Energy", expression: "PE = m × g × h", variables: ["PE", "m", "g", "h"], category: "physics", description: "Gravitational Potential Energy" },
    { name: "Velocity", expression: "v = u + a × t", variables: ["v", "u", "a", "t"], category: "physics", description: "Final velocity with constant acceleration" },
    { name: "Distance", expression: "s = u × t + 0.5 × a × t²", variables: ["s", "u", "a", "t"], category: "physics", description: "Distance with constant acceleration" },
    { name: "Power", expression: "P = W / t", variables: ["P", "W", "t"], category: "physics", description: "Power = Work / Time" },
    { name: "Ohm's Law", expression: "V = I × R", variables: ["V", "I", "R"], category: "physics", description: "Voltage = Current × Resistance" },
    { name: "Density", expression: "ρ = m / V", variables: ["ρ", "m", "V"], category: "physics", description: "Density = Mass / Volume" },
    
    // Mathematics Formulas
    { name: "Quadratic Formula", expression: "x = (-b ± √(b² - 4ac)) / (2a)", variables: ["a", "b", "c"], category: "math", description: "Roots of quadratic equation" },
    { name: "Pythagorean Theorem", expression: "c² = a² + b²", variables: ["a", "b", "c"], category: "math", description: "Right triangle relationship" },
    { name: "Distance Formula", expression: "d = √((x₂-x₁)² + (y₂-y₁)²)", variables: ["x1", "y1", "x2", "y2"], category: "math", description: "Distance between two points" },
    { name: "Slope Formula", expression: "m = (y₂ - y₁) / (x₂ - x₁)", variables: ["x1", "y1", "x2", "y2"], category: "math", description: "Slope of a line" },
    { name: "Compound Interest", expression: "A = P(1 + r/n)^(nt)", variables: ["P", "r", "n", "t"], category: "math", description: "Compound interest formula" },
    
    // Geometry Formulas
    { name: "Circle Area", expression: "A = π × r²", variables: ["A", "r"], category: "geometry", description: "Area of a circle" },
    { name: "Circle Circumference", expression: "C = 2 × π × r", variables: ["C", "r"], category: "geometry", description: "Circumference of a circle" },
    { name: "Rectangle Area", expression: "A = l × w", variables: ["A", "l", "w"], category: "geometry", description: "Area of rectangle" },
    { name: "Triangle Area", expression: "A = 0.5 × b × h", variables: ["A", "b", "h"], category: "geometry", description: "Area of triangle" },
    { name: "Sphere Volume", expression: "V = (4/3) × π × r³", variables: ["V", "r"], category: "geometry", description: "Volume of sphere" },
    { name: "Cylinder Volume", expression: "V = π × r² × h", variables: ["V", "r", "h"], category: "geometry", description: "Volume of cylinder" },
    
    // Algebra Formulas
    { name: "Difference of Squares", expression: "a² - b² = (a + b)(a - b)", variables: ["a", "b"], category: "algebra", description: "Factoring difference of squares" },
    { name: "Perfect Square", expression: "(a + b)² = a² + 2ab + b²", variables: ["a", "b"], category: "algebra", description: "Expanding perfect square" },
    { name: "Sum of Arithmetic Series", expression: "S = n/2 × (a + l)", variables: ["S", "n", "a", "l"], category: "algebra", description: "Sum of arithmetic progression" },
    
    // Chemistry Formulas
    { name: "Ideal Gas Law", expression: "PV = nRT", variables: ["P", "V", "n", "R", "T"], category: "chemistry", description: "Ideal gas equation" },
    { name: "Molarity", expression: "M = n / V", variables: ["M", "n", "V"], category: "chemistry", description: "Molar concentration" },
    { name: "pH Formula", expression: "pH = -log[H⁺]", variables: ["H"], category: "chemistry", description: "pH calculation" },
];

// User's saved formulas (loaded from localStorage)
let savedFormulas = [];

// Load saved formulas from localStorage
function loadSavedFormulas() {
    const saved = localStorage.getItem('savedFormulas');
    if (saved) {
        savedFormulas = JSON.parse(saved);
    }
}

// Save formulas to localStorage
function saveTolocalStorage() {
    localStorage.setItem('savedFormulas', JSON.stringify(savedFormulas));
}

// Initialize formula library display
function initFormulaLibrary() {
    loadSavedFormulas();
    displayFormulaLibrary();
    displaySavedFormulas();
}

// Display formula library
function displayFormulaLibrary() {
    const container = document.getElementById('formulaLibraryList');
    if (!container) return;
    
    const category = document.getElementById('formulaCategory')?.value || 'all';
    const searchTerm = document.getElementById('formulaSearch')?.value.toLowerCase() || '';
    
    let filteredFormulas = formulaLibrary;
    
    if (category !== 'all') {
        filteredFormulas = filteredFormulas.filter(f => f.category === category);
    }
    
    if (searchTerm) {
        filteredFormulas = filteredFormulas.filter(f => 
            f.name.toLowerCase().includes(searchTerm) || 
            f.description.toLowerCase().includes(searchTerm) ||
            f.expression.toLowerCase().includes(searchTerm)
        );
    }
    
    if (filteredFormulas.length === 0) {
        container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center col-span-2 py-8">No formulas found</p>';
        return;
    }
    
    let html = '';
    filteredFormulas.forEach((formula, index) => {
        const categoryColors = {
            physics: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
            math: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            chemistry: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            geometry: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
            algebra: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200'
        };
        
        html += `
            <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-all">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg text-gray-800 dark:text-white">${formula.name}</h4>
                    <span class="text-xs px-2 py-1 rounded ${categoryColors[formula.category]}">${formula.category}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${formula.description}</p>
                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm mb-3 text-gray-800 dark:text-white">
                    ${formula.expression}
                </div>
                <div class="flex gap-2">
                    <button onclick="useFormula(${index}, 'library')" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold transition-all">
                        🧮 Use Formula
                    </button>
                    <button onclick="saveToMyFormulas(${index})" class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded text-sm font-semibold transition-all">
                        💾 Save
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Display saved formulas
function displaySavedFormulas() {
    const container = document.getElementById('savedFormulasList');
    if (!container) return;
    
    if (savedFormulas.length === 0) {
        container.innerHTML = '<p class="text-gray-500 dark:text-gray-400 text-center col-span-2 py-8">No saved formulas yet. Add your own or save from library!</p>';
        return;
    }
    
    let html = '';
    savedFormulas.forEach((formula, index) => {
        const categoryColors = {
            physics: 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200',
            math: 'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200',
            chemistry: 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200',
            geometry: 'bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200',
            algebra: 'bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200',
            custom: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
        };
        
        html += `
            <div class="bg-white dark:bg-gray-700 p-4 rounded-lg shadow hover:shadow-lg transition-all">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="font-bold text-lg text-gray-800 dark:text-white">${formula.name}</h4>
                    <span class="text-xs px-2 py-1 rounded ${categoryColors[formula.category]}">${formula.category}</span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">${formula.description || 'No description'}</p>
                <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded font-mono text-sm mb-3 text-gray-800 dark:text-white">
                    ${formula.expression}
                </div>
                <div class="flex gap-2">
                    <button onclick="useFormula(${index}, 'saved')" class="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded text-sm font-semibold transition-all">
                        🧮 Use Formula
                    </button>
                    <button onclick="deleteSavedFormula(${index})" class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm font-semibold transition-all">
                        🗑️ Delete
                    </button>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// Save custom formula
function saveCustomFormula() {
    const name = document.getElementById('newFormulaName').value.trim();
    const expression = document.getElementById('newFormulaExpression').value.trim();
    const variablesStr = document.getElementById('newFormulaVariables').value.trim();
    const category = document.getElementById('newFormulaCategory').value;
    const description = document.getElementById('newFormulaDescription').value.trim();
    
    if (!name || !expression || !variablesStr) {
        alert('Please fill in all required fields (Name, Expression, Variables)');
        return;
    }
    
    const variables = variablesStr.split(',').map(v => v.trim());
    
    const newFormula = {
        name,
        expression,
        variables,
        category,
        description: description || 'Custom formula'
    };
    
    savedFormulas.push(newFormula);
    saveTolocalStorage();
    displaySavedFormulas();
    
    // Clear form
    document.getElementById('newFormulaName').value = '';
    document.getElementById('newFormulaExpression').value = '';
    document.getElementById('newFormulaVariables').value = '';
    document.getElementById('newFormulaDescription').value = '';
    
    alert('Formula saved successfully! ✅');
}

// Save from library to my formulas
function saveToMyFormulas(index) {
    const formula = formulaLibrary[index];
    
    // Check if already saved
    const alreadySaved = savedFormulas.some(f => f.name === formula.name && f.expression === formula.expression);
    
    if (alreadySaved) {
        alert('This formula is already in your saved formulas!');
        return;
    }
    
    savedFormulas.push({...formula});
    saveTolocalStorage();
    displaySavedFormulas();
    
    alert('Formula saved to My Formulas! ✅');
}

// Delete saved formula
function deleteSavedFormula(index) {
    if (confirm('Are you sure you want to delete this formula?')) {
        savedFormulas.splice(index, 1);
        saveTolocalStorage();
        displaySavedFormulas();
    }
}

// Use formula for calculation
function useFormula(index, source) {
    const formula = source === 'library' ? formulaLibrary[index] : savedFormulas[index];
    
    switchFormulaTab('calculator');
    
    const container = document.getElementById('formulaCalculatorContent');
    
    let html = `
        <h4 class="font-bold text-xl mb-3 text-gray-800 dark:text-white">${formula.name}</h4>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">${formula.description}</p>
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded font-mono text-lg mb-4 text-center text-gray-800 dark:text-white">
            ${formula.expression}
        </div>
        <h5 class="font-semibold mb-3 text-gray-800 dark:text-white">Enter Values:</h5>
        <div class="space-y-3" id="formulaInputs">
    `;
    
    formula.variables.forEach(variable => {
        html += `
            <div class="flex items-center gap-3">
                <label class="w-20 font-semibold text-gray-700 dark:text-gray-300">${variable} =</label>
                <input type="number" step="any" id="var_${variable}" placeholder="Enter ${variable}" class="input-field flex-1">
            </div>
        `;
    });
    
    html += `
        </div>
        <button onclick="calculateFormula('${source}', ${index})" class="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all">
            Calculate
        </button>
    `;
    
    container.innerHTML = html;
}

// Calculate formula result
function calculateFormula(source, index) {
    const formula = source === 'library' ? formulaLibrary[index] : savedFormulas[index];
    const resultDiv = document.getElementById('formulaCalculatorResult');
    
    let expression = formula.expression;
    let values = {};
    let allFilled = true;
    
    // Get all variable values
    formula.variables.forEach(variable => {
        const input = document.getElementById(`var_${variable}`);
        if (input) {
            const value = parseFloat(input.value);
            if (isNaN(value)) {
                allFilled = false;
            } else {
                values[variable] = value;
            }
        }
    });
    
    if (!allFilled) {
        resultDiv.innerHTML = '<p class="text-red-500 font-semibold">⚠️ Please fill in all variables!</p>';
        resultDiv.classList.remove('hidden');
        return;
    }
    
    // Try to calculate (simplified - works for basic formulas)
    try {
        // Replace variables with values
        let calcExpression = expression;
        
        // Replace common symbols
        calcExpression = calcExpression.replace(/×/g, '*');
        calcExpression = calcExpression.replace(/÷/g, '/');
        calcExpression = calcExpression.replace(/π/g, 'Math.PI');
        
        // Replace variables
        Object.keys(values).forEach(variable => {
            const regex = new RegExp(variable, 'g');
            calcExpression = calcExpression.replace(regex, values[variable]);
        });
        
        // Remove subscripts and special characters for calculation
        calcExpression = calcExpression.replace(/[₀₁₂₃₄₅₆₇₈₉⁺⁻]/g, '');
        
        let result;
        
        // Handle special cases
        if (calcExpression.includes('±')) {
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-2 text-gray-800 dark:text-white">Result:</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-2">This formula has multiple solutions (±)</p>
                <p class="text-lg text-gray-800 dark:text-white">Please calculate manually or use the quadratic solver in Advanced mode.</p>
            `;
        } else {
            // Try to evaluate
            result = eval(calcExpression);
            
            let valuesHtml = '<div class="mb-3">';
            Object.keys(values).forEach(variable => {
                valuesHtml += `<p class="text-sm text-gray-600 dark:text-gray-400">${variable} = ${values[variable]}</p>`;
            });
            valuesHtml += '</div>';
            
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-2 text-gray-800 dark:text-white">Result:</h4>
                ${valuesHtml}
                <p class="text-3xl font-bold text-indigo-600 dark:text-indigo-400">${result.toFixed(6).replace(/\.?0+$/, '')}</p>
            `;
        }
        
        resultDiv.classList.remove('hidden');
        
    } catch (error) {
        resultDiv.innerHTML = `
            <p class="text-orange-500 font-semibold">⚠️ Cannot auto-calculate this formula</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">This formula may require manual calculation or special handling.</p>
        `;
        resultDiv.classList.remove('hidden');
    }
}

// Switch formula tab
function switchFormulaTab(tab) {
    document.querySelectorAll('.formula-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    document.getElementById(tab + 'Tab').classList.remove('hidden');
    
    if (tab === 'library') {
        displayFormulaLibrary();
    } else if (tab === 'saved') {
        displaySavedFormulas();
    }
}

// Filter formulas by category
function filterFormulas() {
    displayFormulaLibrary();
}

// Search formulas
function searchFormulas() {
    displayFormulaLibrary();
}
