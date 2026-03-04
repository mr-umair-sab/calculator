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
    // Physics Formulas - Mechanics
    { name: "Newton's Second Law", expression: "F = m × a", variables: ["F", "m", "a"], category: "physics", description: "Force = Mass × Acceleration" },
    { name: "Momentum", expression: "p = m × v", variables: ["p", "m", "v"], category: "physics", description: "Linear Momentum" },
    { name: "Impulse", expression: "J = F × Δt", variables: ["J", "F", "Δt"], category: "physics", description: "Impulse = Force × Time" },
    { name: "Work", expression: "W = F × d × cos(θ)", variables: ["W", "F", "d", "θ"], category: "physics", description: "Work done by force" },
    { name: "Kinetic Energy", expression: "KE = 0.5 × m × v²", variables: ["KE", "m", "v"], category: "physics", description: "Kinetic Energy formula" },
    { name: "Potential Energy", expression: "PE = m × g × h", variables: ["PE", "m", "g", "h"], category: "physics", description: "Gravitational Potential Energy" },
    { name: "Velocity", expression: "v = u + a × t", variables: ["v", "u", "a", "t"], category: "physics", description: "Final velocity with constant acceleration" },
    { name: "Distance", expression: "s = u × t + 0.5 × a × t²", variables: ["s", "u", "a", "t"], category: "physics", description: "Distance with constant acceleration" },
    { name: "Power", expression: "P = W / t", variables: ["P", "W", "t"], category: "physics", description: "Power = Work / Time" },
    { name: "Gravitational Force", expression: "F = G × m₁ × m₂ / r²", variables: ["F", "G", "m1", "m2", "r"], category: "physics", description: "Newton's Law of Gravitation (G = 6.67×10⁻¹¹)" },
    { name: "Centripetal Force", expression: "F = m × v² / r", variables: ["F", "m", "v", "r"], category: "physics", description: "Force in circular motion" },
    { name: "Pressure", expression: "P = F / A", variables: ["P", "F", "A"], category: "physics", description: "Pressure = Force / Area" },
    { name: "Density", expression: "ρ = m / V", variables: ["ρ", "m", "V"], category: "physics", description: "Density = Mass / Volume" },
    
    // Physics Formulas - Waves & Oscillations
    { name: "Wave Speed", expression: "v = f × λ", variables: ["v", "f", "λ"], category: "physics", description: "Wave velocity = Frequency × Wavelength" },
    { name: "Frequency", expression: "f = 1 / T", variables: ["f", "T"], category: "physics", description: "Frequency = 1 / Time Period" },
    
    // Physics Formulas - Electricity & Magnetism
    { name: "Ohm's Law", expression: "V = I × R", variables: ["V", "I", "R"], category: "physics", description: "Voltage = Current × Resistance" },
    { name: "Electric Power", expression: "P = V × I", variables: ["P", "V", "I"], category: "physics", description: "Electrical Power" },
    { name: "Resistance in Series", expression: "R = R₁ + R₂", variables: ["R", "R1", "R2"], category: "physics", description: "Total resistance in series" },
    { name: "Resistance in Parallel", expression: "1/R = 1/R₁ + 1/R₂", variables: ["R", "R1", "R2"], category: "physics", description: "Total resistance in parallel" },
    { name: "Capacitance", expression: "C = Q / V", variables: ["C", "Q", "V"], category: "physics", description: "Capacitance = Charge / Voltage" },
    { name: "Magnetic Force", expression: "F = B × I × L × sin(θ)", variables: ["F", "B", "I", "L", "θ"], category: "physics", description: "Force on current-carrying conductor" },
    
    // Physics Formulas - Optics
    { name: "Lens Formula", expression: "1/f = 1/v + 1/u", variables: ["f", "v", "u"], category: "physics", description: "Thin lens formula (f=focal length, v=image distance, u=object distance)" },
    { name: "Magnification", expression: "m = v / u", variables: ["m", "v", "u"], category: "physics", description: "Linear magnification" },
    
    // Mathematics Formulas - Algebra
    { name: "Quadratic Formula", expression: "x = (-b ± √(b² - 4ac)) / (2a)", variables: ["a", "b", "c"], category: "math", description: "Roots of quadratic equation" },
    { name: "Pythagorean Theorem", expression: "c² = a² + b²", variables: ["a", "b", "c"], category: "math", description: "Right triangle relationship" },
    { name: "Distance Formula", expression: "d = √((x₂-x₁)² + (y₂-y₁)²)", variables: ["x1", "y1", "x2", "y2"], category: "math", description: "Distance between two points" },
    { name: "Slope Formula", expression: "m = (y₂ - y₁) / (x₂ - x₁)", variables: ["x1", "y1", "x2", "y2"], category: "math", description: "Slope of a line" },
    
    // Mathematics Formulas - Statistics
    { name: "Arithmetic Mean", expression: "x̄ = Σx / n", variables: ["x", "n"], category: "math", description: "Average of numbers (sum divided by count)" },
    { name: "Variance", expression: "σ² = Σ(x-x̄)² / n", variables: ["x", "x̄", "n"], category: "math", description: "Measure of data spread" },
    { name: "Standard Deviation", expression: "σ = √(Σ(x-x̄)² / n)", variables: ["x", "x̄", "n"], category: "math", description: "Square root of variance" },
    
    // Mathematics Formulas - Combinatorics
    { name: "Permutation", expression: "nPr = n! / (n-r)!", variables: ["n", "r"], category: "math", description: "Arrangements where order matters" },
    { name: "Combination", expression: "nCr = n! / (r! × (n-r)!)", variables: ["n", "r"], category: "math", description: "Selections where order doesn't matter" },
    
    // Mathematics Formulas - Financial
    { name: "Simple Interest", expression: "SI = (P × R × T) / 100", variables: ["P", "R", "T"], category: "math", description: "Interest = Principal × Rate × Time / 100" },
    { name: "Compound Interest", expression: "A = P(1 + r/n)^(nt)", variables: ["P", "r", "n", "t"], category: "math", description: "Compound interest formula" },
    
    // Mathematics Formulas - Percentage & Profit/Loss
    { name: "Percentage", expression: "% = (part / whole) × 100", variables: ["part", "whole"], category: "math", description: "Convert fraction to percentage" },
    { name: "Profit Percentage", expression: "P% = ((SP - CP) / CP) × 100", variables: ["SP", "CP"], category: "math", description: "Profit % (SP=Selling Price, CP=Cost Price)" },
    { name: "Loss Percentage", expression: "L% = ((CP - SP) / CP) × 100", variables: ["CP", "SP"], category: "math", description: "Loss % (CP=Cost Price, SP=Selling Price)" },
    { name: "Discount", expression: "D = MP - SP", variables: ["MP", "SP"], category: "math", description: "Discount = Marked Price - Selling Price" },
    { name: "Discount Percentage", expression: "D% = ((MP - SP) / MP) × 100", variables: ["MP", "SP"], category: "math", description: "Discount % on Marked Price" },
    
    // Mathematics Formulas - Speed, Distance, Time
    { name: "Speed", expression: "Speed = Distance / Time", variables: ["Distance", "Time"], category: "math", description: "Speed = Distance / Time" },
    { name: "Distance", expression: "Distance = Speed × Time", variables: ["Speed", "Time"], category: "math", description: "Distance = Speed × Time" },
    { name: "Time", expression: "Time = Distance / Speed", variables: ["Distance", "Speed"], category: "math", description: "Time = Distance / Speed" },
    
    // Geometry Formulas - 2D Shapes
    { name: "Circle Area", expression: "A = π × r²", variables: ["A", "r"], category: "geometry", description: "Area of a circle" },
    { name: "Circle Circumference", expression: "C = 2 × π × r", variables: ["C", "r"], category: "geometry", description: "Circumference of a circle" },
    { name: "Rectangle Area", expression: "A = l × w", variables: ["A", "l", "w"], category: "geometry", description: "Area of rectangle" },
    { name: "Rectangle Perimeter", expression: "P = 2 × (l + w)", variables: ["P", "l", "w"], category: "geometry", description: "Perimeter of rectangle" },
    { name: "Square Area", expression: "A = a²", variables: ["A", "a"], category: "geometry", description: "Area of square" },
    { name: "Square Perimeter", expression: "P = 4 × a", variables: ["P", "a"], category: "geometry", description: "Perimeter of square" },
    { name: "Triangle Area", expression: "A = 0.5 × b × h", variables: ["A", "b", "h"], category: "geometry", description: "Area of triangle" },
    { name: "Triangle Perimeter", expression: "P = a + b + c", variables: ["P", "a", "b", "c"], category: "geometry", description: "Perimeter of triangle" },
    { name: "Trapezoid Area", expression: "A = 0.5 × (a + b) × h", variables: ["A", "a", "b", "h"], category: "geometry", description: "Area of trapezoid (a,b = parallel sides, h = height)" },
    { name: "Parallelogram Area", expression: "A = b × h", variables: ["A", "b", "h"], category: "geometry", description: "Area of parallelogram" },
    { name: "Rhombus Area", expression: "A = 0.5 × d₁ × d₂", variables: ["A", "d1", "d2"], category: "geometry", description: "Area using diagonals" },
    { name: "Ellipse Area", expression: "A = π × a × b", variables: ["A", "a", "b"], category: "geometry", description: "Area of ellipse (a,b = semi-axes)" },
    { name: "Sector Area", expression: "A = 0.5 × r² × θ", variables: ["A", "r", "θ"], category: "geometry", description: "Area of circular sector (θ in radians)" },
    { name: "Arc Length", expression: "L = r × θ", variables: ["L", "r", "θ"], category: "geometry", description: "Length of arc (θ in radians)" },
    
    // Geometry Formulas - 3D Shapes
    { name: "Cube Volume", expression: "V = a³", variables: ["V", "a"], category: "geometry", description: "Volume of cube" },
    { name: "Cube Surface Area", expression: "A = 6 × a²", variables: ["A", "a"], category: "geometry", description: "Total surface area of cube" },
    { name: "Cuboid Volume", expression: "V = l × w × h", variables: ["V", "l", "w", "h"], category: "geometry", description: "Volume of rectangular prism/cuboid" },
    { name: "Cuboid Surface Area", expression: "A = 2(lw + wh + lh)", variables: ["A", "l", "w", "h"], category: "geometry", description: "Total surface area of cuboid" },
    { name: "Sphere Volume", expression: "V = (4/3) × π × r³", variables: ["V", "r"], category: "geometry", description: "Volume of sphere" },
    { name: "Sphere Surface Area", expression: "A = 4 × π × r²", variables: ["A", "r"], category: "geometry", description: "Surface area of sphere" },
    { name: "Cylinder Volume", expression: "V = π × r² × h", variables: ["V", "r", "h"], category: "geometry", description: "Volume of cylinder" },
    { name: "Cylinder Surface Area", expression: "A = 2πr(r + h)", variables: ["A", "r", "h"], category: "geometry", description: "Total surface area of cylinder" },
    { name: "Cone Volume", expression: "V = (1/3) × π × r² × h", variables: ["V", "r", "h"], category: "geometry", description: "Volume of cone" },
    { name: "Cone Surface Area", expression: "A = πr(r + l)", variables: ["A", "r", "l"], category: "geometry", description: "Total surface area of cone (l = slant height)" },
    { name: "Cone Slant Height", expression: "l = √(r² + h²)", variables: ["l", "r", "h"], category: "geometry", description: "Slant height of cone" },
    { name: "Pyramid Volume", expression: "V = (1/3) × B × h", variables: ["V", "B", "h"], category: "geometry", description: "Volume of pyramid (B = base area)" },
    
    // Trigonometry Formulas - Basic Identities
    { name: "Pythagorean Identity", expression: "sin²θ + cos²θ = 1", variables: ["θ"], category: "trigonometry", description: "Fundamental trigonometric identity" },
    { name: "Tan Identity", expression: "tan(θ) = sin(θ) / cos(θ)", variables: ["θ"], category: "trigonometry", description: "Tangent in terms of sine and cosine" },
    { name: "Cot Identity", expression: "cot(θ) = cos(θ) / sin(θ)", variables: ["θ"], category: "trigonometry", description: "Cotangent identity" },
    { name: "Sec Identity", expression: "sec(θ) = 1 / cos(θ)", variables: ["θ"], category: "trigonometry", description: "Secant identity" },
    { name: "Cosec Identity", expression: "cosec(θ) = 1 / sin(θ)", variables: ["θ"], category: "trigonometry", description: "Cosecant identity" },
    
    // Trigonometry Formulas - Triangle Rules
    { name: "Sine Rule", expression: "a/sin(A) = b/sin(B) = c/sin(C)", variables: ["a", "b", "c", "A", "B", "C"], category: "trigonometry", description: "Sine rule for any triangle" },
    { name: "Cosine Rule", expression: "c² = a² + b² - 2ab×cos(C)", variables: ["a", "b", "c", "C"], category: "trigonometry", description: "Cosine rule for any triangle" },
    { name: "Triangle Area (Trig)", expression: "A = 0.5 × a × b × sin(C)", variables: ["A", "a", "b", "C"], category: "trigonometry", description: "Area using two sides and included angle" },
    
    // Trigonometry Formulas - Double Angle
    { name: "Sin Double Angle", expression: "sin(2θ) = 2×sin(θ)×cos(θ)", variables: ["θ"], category: "trigonometry", description: "Sine of double angle" },
    { name: "Cos Double Angle", expression: "cos(2θ) = cos²(θ) - sin²(θ)", variables: ["θ"], category: "trigonometry", description: "Cosine of double angle" },
    { name: "Tan Double Angle", expression: "tan(2θ) = 2×tan(θ) / (1 - tan²(θ))", variables: ["θ"], category: "trigonometry", description: "Tangent of double angle" },
    
    // Trigonometry Formulas - Sum & Difference
    { name: "Sin Sum", expression: "sin(A + B) = sin(A)×cos(B) + cos(A)×sin(B)", variables: ["A", "B"], category: "trigonometry", description: "Sine of sum of angles" },
    { name: "Cos Sum", expression: "cos(A + B) = cos(A)×cos(B) - sin(A)×sin(B)", variables: ["A", "B"], category: "trigonometry", description: "Cosine of sum of angles" },
    { name: "Sin Difference", expression: "sin(A - B) = sin(A)×cos(B) - cos(A)×sin(B)", variables: ["A", "B"], category: "trigonometry", description: "Sine of difference of angles" },
    { name: "Cos Difference", expression: "cos(A - B) = cos(A)×cos(B) + sin(A)×sin(B)", variables: ["A", "B"], category: "trigonometry", description: "Cosine of difference of angles" },
    
    // Algebra Formulas
    { name: "Difference of Squares", expression: "a² - b² = (a + b)(a - b)", variables: ["a", "b"], category: "algebra", description: "Factoring difference of squares" },
    { name: "Perfect Square", expression: "(a + b)² = a² + 2ab + b²", variables: ["a", "b"], category: "algebra", description: "Expanding perfect square" },
    { name: "Perfect Square Difference", expression: "(a - b)² = a² - 2ab + b²", variables: ["a", "b"], category: "algebra", description: "Expanding (a-b)²" },
    { name: "Sum of Cubes", expression: "a³ + b³ = (a + b)(a² - ab + b²)", variables: ["a", "b"], category: "algebra", description: "Factoring sum of cubes" },
    { name: "Difference of Cubes", expression: "a³ - b³ = (a - b)(a² + ab + b²)", variables: ["a", "b"], category: "algebra", description: "Factoring difference of cubes" },
    { name: "Sum of Arithmetic Series", expression: "S = n/2 × (a + l)", variables: ["S", "n", "a", "l"], category: "algebra", description: "Sum of arithmetic progression" },
    { name: "Arithmetic nth Term", expression: "aₙ = a + (n-1)×d", variables: ["a", "n", "d"], category: "algebra", description: "nth term of AP (d = common difference)" },
    { name: "Geometric nth Term", expression: "aₙ = a × r^(n-1)", variables: ["a", "r", "n"], category: "algebra", description: "nth term of GP (r = common ratio)" },
    { name: "Sum of Geometric Series", expression: "S = a(r^n - 1) / (r - 1)", variables: ["a", "r", "n"], category: "algebra", description: "Sum of GP when r ≠ 1" },
    
    // Chemistry Formulas - Basic
    { name: "Ideal Gas Law", expression: "PV = nRT", variables: ["P", "V", "n", "R", "T"], category: "chemistry", description: "Ideal gas equation (R = 8.314 J/mol·K)" },
    { name: "Molarity", expression: "M = n / V", variables: ["M", "n", "V"], category: "chemistry", description: "Molar concentration (mol/L)" },
    { name: "Molality", expression: "m = n / W", variables: ["m", "n", "W"], category: "chemistry", description: "Molality (mol/kg of solvent)" },
    { name: "Mole Concept", expression: "n = m / M", variables: ["n", "m", "M"], category: "chemistry", description: "Moles = mass / molar mass" },
    { name: "Avogadro Number", expression: "N = n × Nₐ", variables: ["N", "n"], category: "chemistry", description: "Number of particles (Nₐ = 6.022×10²³)" },
    { name: "Dilution Formula", expression: "M₁V₁ = M₂V₂", variables: ["M1", "V1", "M2", "V2"], category: "chemistry", description: "Dilution equation" },
    { name: "pH Formula", expression: "pH = -log[H⁺]", variables: ["H"], category: "chemistry", description: "pH calculation" },
    { name: "pOH Formula", expression: "pOH = -log[OH⁻]", variables: ["OH"], category: "chemistry", description: "pOH calculation" },
    { name: "pH + pOH", expression: "pH + pOH = 14", variables: ["pH", "pOH"], category: "chemistry", description: "Relationship at 25°C" },
    { name: "Density", expression: "d = m / V", variables: ["d", "m", "V"], category: "chemistry", description: "Density = mass / volume" },
    { name: "Percent Composition", expression: "% = (mass of element / total mass) × 100", variables: ["mass"], category: "chemistry", description: "Percentage by mass" },
    { name: "Empirical Formula Mass", expression: "n = Molecular Mass / Empirical Mass", variables: ["n"], category: "chemistry", description: "Ratio for molecular formula" },
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
            trigonometry: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
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
            trigonometry: 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200',
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


// ===== ADVANCED CALCULATOR FEATURES =====

// 1. FRACTION CALCULATOR
function calculateFraction() {
    const num1 = parseFloat(document.getElementById('frac1Num').value);
    const den1 = parseFloat(document.getElementById('frac1Den').value);
    const operation = document.getElementById('fracOperation').value;
    const resultDiv = document.getElementById('fractionResult');
    
    if (isNaN(num1) || isNaN(den1) || den1 === 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid fractions!</p>';
        return;
    }
    
    if (operation === 'simplify') {
        const gcd = findGCD(Math.abs(num1), Math.abs(den1));
        const simpNum = num1 / gcd;
        const simpDen = den1 / gcd;
        resultDiv.innerHTML = `
            <h4 class="font-bold text-lg mb-2">Simplified:</h4>
            <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">${simpNum}/${simpDen}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Decimal: ${(simpNum/simpDen).toFixed(6)}</p>
        `;
        return;
    }
    
    const num2 = parseFloat(document.getElementById('frac2Num').value);
    const den2 = parseFloat(document.getElementById('frac2Den').value);
    
    if (isNaN(num2) || isNaN(den2) || den2 === 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter both fractions!</p>';
        return;
    }
    
    let resNum, resDen;
    
    switch(operation) {
        case 'add':
            resNum = num1 * den2 + num2 * den1;
            resDen = den1 * den2;
            break;
        case 'subtract':
            resNum = num1 * den2 - num2 * den1;
            resDen = den1 * den2;
            break;
        case 'multiply':
            resNum = num1 * num2;
            resDen = den1 * den2;
            break;
        case 'divide':
            resNum = num1 * den2;
            resDen = den1 * num2;
            break;
    }
    
    const gcd = findGCD(Math.abs(resNum), Math.abs(resDen));
    const simpNum = resNum / gcd;
    const simpDen = resDen / gcd;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-2">Result:</h4>
        <p class="text-2xl mb-2 text-gray-700 dark:text-gray-300">${num1}/${den1} ${getOperationSymbol(operation)} ${num2}/${den2}</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">${simpNum}/${simpDen}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Decimal: ${(simpNum/simpDen).toFixed(6)}</p>
    `;
}

function getOperationSymbol(op) {
    const symbols = { add: '+', subtract: '−', multiply: '×', divide: '÷' };
    return symbols[op] || op;
}

// 2. LCM/HCF CALCULATOR
function calculateLCMHCF() {
    const num1 = parseInt(document.getElementById('lcmNum1').value);
    const num2 = parseInt(document.getElementById('lcmNum2').value);
    const num3 = parseInt(document.getElementById('lcmNum3').value) || null;
    const resultDiv = document.getElementById('lcmhcfResult');
    
    if (isNaN(num1) || isNaN(num2) || num1 <= 0 || num2 <= 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid positive integers!</p>';
        return;
    }
    
    let hcf, lcm;
    
    if (num3 && num3 > 0) {
        hcf = findGCD(findGCD(num1, num2), num3);
        lcm = findLCM(findLCM(num1, num2), num3);
        resultDiv.innerHTML = `
            <h4 class="font-bold text-lg mb-3">Results for ${num1}, ${num2}, ${num3}:</h4>
            <div class="space-y-2">
                <p class="text-xl"><span class="font-semibold">HCF (GCD):</span> <span class="text-pink-600 dark:text-pink-400 font-bold">${hcf}</span></p>
                <p class="text-xl"><span class="font-semibold">LCM:</span> <span class="text-pink-600 dark:text-pink-400 font-bold">${lcm}</span></p>
            </div>
        `;
    } else {
        hcf = findGCD(num1, num2);
        lcm = findLCM(num1, num2);
        resultDiv.innerHTML = `
            <h4 class="font-bold text-lg mb-3">Results for ${num1} and ${num2}:</h4>
            <div class="space-y-2">
                <p class="text-xl"><span class="font-semibold">HCF (GCD):</span> <span class="text-pink-600 dark:text-pink-400 font-bold">${hcf}</span></p>
                <p class="text-xl"><span class="font-semibold">LCM:</span> <span class="text-pink-600 dark:text-pink-400 font-bold">${lcm}</span></p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Verification: ${num1} × ${num2} = ${num1*num2} = ${hcf} × ${lcm}</p>
            </div>
        `;
    }
}

function findGCD(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        let temp = b;
        b = a % b;
        a = temp;
    }
    return a;
}

function findLCM(a, b) {
    return Math.abs(a * b) / findGCD(a, b);
}

// 3. SIMULTANEOUS EQUATIONS SOLVER
function solveSimultaneous() {
    const a1 = parseFloat(document.getElementById('eq1a').value);
    const b1 = parseFloat(document.getElementById('eq1b').value);
    const c1 = parseFloat(document.getElementById('eq1c').value);
    const a2 = parseFloat(document.getElementById('eq2a').value);
    const b2 = parseFloat(document.getElementById('eq2b').value);
    const c2 = parseFloat(document.getElementById('eq2c').value);
    const resultDiv = document.getElementById('simultaneousResult');
    
    if ([a1, b1, c1, a2, b2, c2].some(isNaN)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please fill all coefficients!</p>';
        return;
    }
    
    const determinant = a1 * b2 - a2 * b1;
    
    if (determinant === 0) {
        resultDiv.innerHTML = `
            <h4 class="font-bold text-lg mb-2 text-orange-600">No Unique Solution!</h4>
            <p class="text-gray-700 dark:text-gray-300">The equations are either parallel (no solution) or identical (infinite solutions).</p>
        `;
        return;
    }
    
    const x = (c1 * b2 - c2 * b1) / determinant;
    const y = (a1 * c2 - a2 * c1) / determinant;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Solution:</h4>
        <div class="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg mb-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">Equation 1: ${a1}x + ${b1}y = ${c1}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400">Equation 2: ${a2}x + ${b2}y = ${c2}</p>
        </div>
        <div class="space-y-2">
            <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">x = ${x.toFixed(4)}</p>
            <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">y = ${y.toFixed(4)}</p>
        </div>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p class="font-semibold mb-1">Verification:</p>
            <p>Eq1: ${a1}(${x.toFixed(2)}) + ${b1}(${y.toFixed(2)}) = ${(a1*x + b1*y).toFixed(2)} ≈ ${c1}</p>
            <p>Eq2: ${a2}(${x.toFixed(2)}) + ${b2}(${y.toFixed(2)}) = ${(a2*x + b2*y).toFixed(2)} ≈ ${c2}</p>
        </div>
    `;
}

// 4. LOGARITHM CALCULATOR
function calculateLogarithm() {
    const logType = document.getElementById('logType').value;
    const value = parseFloat(document.getElementById('logValue').value);
    const resultDiv = document.getElementById('logarithmResult');
    
    if (isNaN(value) || value <= 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter a positive number!</p>';
        return;
    }
    
    let result, base, formula;
    
    switch(logType) {
        case 'log10':
            result = Math.log10(value);
            base = 10;
            formula = `log₁₀(${value})`;
            break;
        case 'ln':
            result = Math.log(value);
            base = 'e';
            formula = `ln(${value})`;
            break;
        case 'log2':
            result = Math.log2(value);
            base = 2;
            formula = `log₂(${value})`;
            break;
        case 'custom':
            const customBase = parseFloat(document.getElementById('logBase').value);
            if (isNaN(customBase) || customBase <= 0 || customBase === 1) {
                resultDiv.innerHTML = '<p class="text-red-500">Please enter a valid base (> 0, ≠ 1)!</p>';
                return;
            }
            result = Math.log(value) / Math.log(customBase);
            base = customBase;
            formula = `log₍${customBase}₎(${value})`;
            break;
    }
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Result:</h4>
        <p class="text-xl mb-2 text-gray-700 dark:text-gray-300">${formula}</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">${result.toFixed(8)}</p>
        <div class="mt-4 text-sm text-gray-600 dark:text-gray-400">
            <p>Verification: ${base}^${result.toFixed(4)} ≈ ${Math.pow(base === 'e' ? Math.E : base, result).toFixed(4)}</p>
        </div>
    `;
}

// Show/hide custom base input
document.getElementById('logType')?.addEventListener('change', function() {
    const baseInput = document.getElementById('logBase');
    if (this.value === 'custom') {
        baseInput.classList.remove('hidden');
    } else {
        baseInput.classList.add('hidden');
    }
});

// 5. VECTOR CALCULATOR
function calculateVector() {
    const operation = document.getElementById('vectorOperation').value;
    const ax = parseFloat(document.getElementById('vecAx').value) || 0;
    const ay = parseFloat(document.getElementById('vecAy').value) || 0;
    const az = parseFloat(document.getElementById('vecAz').value) || 0;
    const resultDiv = document.getElementById('vectorResult');
    
    if (operation === 'magnitude') {
        const magnitude = Math.sqrt(ax*ax + ay*ay + az*az);
        resultDiv.innerHTML = `
            <h4 class="font-bold text-lg mb-3">Magnitude:</h4>
            <p class="text-xl mb-2 text-gray-700 dark:text-gray-300">Vector A = (${ax}, ${ay}, ${az})</p>
            <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">|A| = ${magnitude.toFixed(6)}</p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Formula: √(x² + y² + z²)</p>
        `;
        return;
    }
    
    const bx = parseFloat(document.getElementById('vecBx').value) || 0;
    const by = parseFloat(document.getElementById('vecBy').value) || 0;
    const bz = parseFloat(document.getElementById('vecBz').value) || 0;
    
    let result, resultText;
    
    switch(operation) {
        case 'add':
            result = { x: ax + bx, y: ay + by, z: az + bz };
            resultText = `A + B = (${result.x}, ${result.y}, ${result.z})`;
            break;
        case 'subtract':
            result = { x: ax - bx, y: ay - by, z: az - bz };
            resultText = `A - B = (${result.x}, ${result.y}, ${result.z})`;
            break;
        case 'dot':
            const dotProduct = ax*bx + ay*by + az*bz;
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-3">Dot Product:</h4>
                <p class="text-sm mb-2 text-gray-700 dark:text-gray-300">A = (${ax}, ${ay}, ${az})</p>
                <p class="text-sm mb-3 text-gray-700 dark:text-gray-300">B = (${bx}, ${by}, ${bz})</p>
                <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">A · B = ${dotProduct.toFixed(6)}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Formula: A·B = x₁x₂ + y₁y₂ + z₁z₂</p>
            `;
            return;
        case 'cross':
            const cx = ay*bz - az*by;
            const cy = az*bx - ax*bz;
            const cz = ax*by - ay*bx;
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-3">Cross Product:</h4>
                <p class="text-sm mb-2 text-gray-700 dark:text-gray-300">A = (${ax}, ${ay}, ${az})</p>
                <p class="text-sm mb-3 text-gray-700 dark:text-gray-300">B = (${bx}, ${by}, ${bz})</p>
                <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">A × B = (${cx.toFixed(4)}, ${cy.toFixed(4)}, ${cz.toFixed(4)})</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">Magnitude: ${Math.sqrt(cx*cx + cy*cy + cz*cz).toFixed(6)}</p>
            `;
            return;
        case 'angle':
            const magA = Math.sqrt(ax*ax + ay*ay + az*az);
            const magB = Math.sqrt(bx*bx + by*by + bz*bz);
            const dotProd = ax*bx + ay*by + az*bz;
            const cosTheta = dotProd / (magA * magB);
            const angleRad = Math.acos(cosTheta);
            const angleDeg = angleRad * 180 / Math.PI;
            resultDiv.innerHTML = `
                <h4 class="font-bold text-lg mb-3">Angle Between Vectors:</h4>
                <p class="text-sm mb-2 text-gray-700 dark:text-gray-300">A = (${ax}, ${ay}, ${az})</p>
                <p class="text-sm mb-3 text-gray-700 dark:text-gray-300">B = (${bx}, ${by}, ${bz})</p>
                <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">θ = ${angleDeg.toFixed(4)}°</p>
                <p class="text-xl text-pink-500 dark:text-pink-300">θ = ${angleRad.toFixed(6)} radians</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mt-2">cos θ = (A·B) / (|A||B|)</p>
            `;
            return;
    }
    
    if (result) {
        resultDiv.innerHTML = `
            <h4 class="font-bold text-lg mb-3">Result:</h4>
            <p class="text-sm mb-2 text-gray-700 dark:text-gray-300">A = (${ax}, ${ay}, ${az})</p>
            <p class="text-sm mb-3 text-gray-700 dark:text-gray-300">B = (${bx}, ${by}, ${bz})</p>
            <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">${resultText}</p>
        `;
    }
}

// Show/hide vector B input based on operation
document.getElementById('vectorOperation')?.addEventListener('change', function() {
    const vectorBInput = document.getElementById('vectorBInput');
    if (this.value === 'magnitude') {
        vectorBInput.classList.add('hidden');
    } else {
        vectorBInput.classList.remove('hidden');
    }
});

// Show/hide fraction 2 input based on operation
document.getElementById('fracOperation')?.addEventListener('change', function() {
    const frac2Input = document.getElementById('frac2Input');
    if (this.value === 'simplify') {
        frac2Input.classList.add('hidden');
    } else {
        frac2Input.classList.remove('hidden');
    }
});
