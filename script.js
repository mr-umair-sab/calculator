// Global Variables
let currentMode = 'basic';
let currentDisplay = '';
let powerMode = false;
let courseCount = 0;

// Theme Toggle
document.getElementById('themeToggle').addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
});

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
    } else if (mode === 'advanced') {
        document.getElementById('advancedCalculator').classList.remove('hidden');
        switchAdvancedTab('quadratic');
    }
    
    clearDisplay();
}

// Initialize with basic calculator
window.onload = () => {
    switchMode('basic');
};

// ===== BASIC & SCIENTIFIC CALCULATOR FUNCTIONS =====

function appendToDisplay(value) {
    if (currentDisplay.value === '0' || currentDisplay.value === 'Error') {
        currentDisplay.value = value;
    } else {
        currentDisplay.value += value;
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
        // Replace × and ÷ with * and /
        expression = expression.replace(/×/g, '*').replace(/÷/g, '/');
        
        // Handle percentage
        expression = expression.replace(/(\d+)%/g, '($1/100)');
        
        let result = eval(expression);
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
        <input type="text" placeholder="Course Name" class="input-field course-name">
        <input type="number" step="0.1" min="0" max="4" placeholder="Grade (0-4)" class="input-field course-grade">
        <input type="number" min="1" max="6" placeholder="Credits" class="input-field course-credits">
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
        @apply bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white py-4 rounded-lg shadow-md hover:shadow-lg transition-all font-semibold text-xl;
    }
    .btn-sci {
        @apply bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg shadow-md transition-all font-semibold;
    }
    .input-field {
        @apply bg-white dark:bg-gray-700 text-gray-900 dark:text-white p-3 rounded-lg shadow-inner border border-gray-300 dark:border-gray-600;
    }
`;
document.head.appendChild(style);
