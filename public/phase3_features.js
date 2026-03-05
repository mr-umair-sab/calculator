// ===== PHASE 3 - ADVANCED FEATURES =====

// 1. BASIC CALCULUS CALCULATOR
function calculateCalculus() {
    const type = document.getElementById('calculusType').value;
    const operation = document.getElementById('calculusOperation').value;
    const coeff = parseFloat(document.getElementById('calculusCoeff').value) || 1;
    const power = parseFloat(document.getElementById('calculusPower').value);
    const resultDiv = document.getElementById('calculusResult');
    
    let original, result, explanation;
    
    if (type === 'power') {
        if (isNaN(power)) {
            resultDiv.innerHTML = '<p class="text-red-500">Please enter the power!</p>';
            return;
        }
        
        original = `${coeff}x^${power}`;
        
        if (operation === 'differentiate') {
            const newCoeff = coeff * power;
            const newPower = power - 1;
            result = newPower === 0 ? `${newCoeff}` : newPower === 1 ? `${newCoeff}x` : `${newCoeff}x^${newPower}`;
            explanation = `d/dx(${coeff}x^${power}) = ${power} × ${coeff}x^${power-1} = ${result}`;
        } else {
            const newCoeff = coeff / (power + 1);
            const newPower = power + 1;
            result = `${newCoeff.toFixed(4)}x^${newPower}`;
            explanation = `∫${coeff}x^${power}dx = ${coeff}/(${power}+1) × x^${power+1} = ${result} + C`;
        }
    } else if (type === 'trig') {
        if (operation === 'differentiate') {
            original = `${coeff}sin(x)`;
            result = `${coeff}cos(x)`;
            explanation = `d/dx(${coeff}sin(x)) = ${coeff}cos(x)`;
        } else {
            original = `${coeff}sin(x)`;
            result = `-${coeff}cos(x)`;
            explanation = `∫${coeff}sin(x)dx = -${coeff}cos(x) + C`;
        }
    } else if (type === 'exp') {
        original = `${coeff}e^x`;
        result = `${coeff}e^x`;
        if (operation === 'differentiate') {
            explanation = `d/dx(${coeff}e^x) = ${coeff}e^x`;
        } else {
            explanation = `∫${coeff}e^x dx = ${coeff}e^x + C`;
        }
    } else if (type === 'log') {
        if (operation === 'differentiate') {
            original = `${coeff}ln(x)`;
            result = `${coeff}/x`;
            explanation = `d/dx(${coeff}ln(x)) = ${coeff}/x`;
        } else {
            original = `${coeff}/x`;
            result = `${coeff}ln|x|`;
            explanation = `∫${coeff}/x dx = ${coeff}ln|x| + C`;
        }
    }
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">${operation === 'differentiate' ? 'Differentiation' : 'Integration'}:</h4>
        <p class="text-xl mb-2 text-gray-700 dark:text-gray-300">Original: ${original}</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400 mb-3">${result}</p>
        <div class="bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <p class="text-sm text-gray-700 dark:text-gray-300">${explanation}</p>
        </div>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-3">Note: This is basic calculus. For complex expressions, use specialized tools.</p>
    `;
}

// 2. STATISTICS CALCULATOR
function calculateStatistics() {
    const input = document.getElementById('statsData').value;
    const resultDiv = document.getElementById('statisticsResult');
    
    if (!input.trim()) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter numbers!</p>';
        return;
    }
    
    const numbers = input.split(',').map(n => parseFloat(n.trim())).filter(n => !isNaN(n));
    
    if (numbers.length === 0) {
        resultDiv.innerHTML = '<p class="text-red-500">No valid numbers found!</p>';
        return;
    }
    
    // Sort for median and quartiles
    const sorted = [...numbers].sort((a, b) => a - b);
    
    // Mean
    const mean = numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    
    // Median
    const mid = Math.floor(sorted.length / 2);
    const median = sorted.length % 2 === 0 
        ? (sorted[mid - 1] + sorted[mid]) / 2 
        : sorted[mid];
    
    // Mode
    const frequency = {};
    numbers.forEach(n => frequency[n] = (frequency[n] || 0) + 1);
    const maxFreq = Math.max(...Object.values(frequency));
    const modes = Object.keys(frequency).filter(k => frequency[k] === maxFreq).map(Number);
    const mode = maxFreq > 1 ? modes.join(', ') : 'No mode';
    
    // Range
    const range = sorted[sorted.length - 1] - sorted[0];
    
    // Variance and Standard Deviation
    const variance = numbers.reduce((sum, n) => sum + Math.pow(n - mean, 2), 0) / numbers.length;
    const stdDev = Math.sqrt(variance);
    
    // Min and Max
    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Statistical Analysis:</h4>
        <div class="grid grid-cols-2 gap-3">
            <div class="bg-blue-100 dark:bg-blue-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Count</p>
                <p class="text-xl font-bold text-blue-600 dark:text-blue-400">${numbers.length}</p>
            </div>
            <div class="bg-green-100 dark:bg-green-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Mean (x̄)</p>
                <p class="text-xl font-bold text-green-600 dark:text-green-400">${mean.toFixed(4)}</p>
            </div>
            <div class="bg-purple-100 dark:bg-purple-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Median</p>
                <p class="text-xl font-bold text-purple-600 dark:text-purple-400">${median.toFixed(4)}</p>
            </div>
            <div class="bg-orange-100 dark:bg-orange-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Mode</p>
                <p class="text-xl font-bold text-orange-600 dark:text-orange-400">${mode}</p>
            </div>
            <div class="bg-red-100 dark:bg-red-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Range</p>
                <p class="text-xl font-bold text-red-600 dark:text-red-400">${range.toFixed(4)}</p>
            </div>
            <div class="bg-pink-100 dark:bg-pink-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Std Dev (σ)</p>
                <p class="text-xl font-bold text-pink-600 dark:text-pink-400">${stdDev.toFixed(4)}</p>
            </div>
            <div class="bg-indigo-100 dark:bg-indigo-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Minimum</p>
                <p class="text-xl font-bold text-indigo-600 dark:text-indigo-400">${min}</p>
            </div>
            <div class="bg-teal-100 dark:bg-teal-900 p-3 rounded">
                <p class="text-sm text-gray-600 dark:text-gray-400">Maximum</p>
                <p class="text-xl font-bold text-teal-600 dark:text-teal-400">${max}</p>
            </div>
        </div>
        <div class="mt-3 bg-gray-100 dark:bg-gray-800 p-3 rounded">
            <p class="text-sm font-semibold mb-1 text-gray-800 dark:text-white">Variance (σ²):</p>
            <p class="text-sm text-gray-700 dark:text-gray-300">${variance.toFixed(6)}</p>
        </div>
    `;
}

// 3. PROBABILITY CALCULATOR
function updateProbInputs() {
    const type = document.getElementById('probType')?.value;
    const container = document.getElementById('probInputs');
    
    if (!container) return;
    
    let html = '';
    
    if (type === 'single') {
        html = `
            <input type="number" step="any" id="probFavorable" placeholder="Favorable outcomes" class="input-field w-full">
            <input type="number" step="any" id="probTotal" placeholder="Total outcomes" class="input-field w-full">
        `;
    } else if (type === 'union' || type === 'intersection') {
        html = `
            <input type="number" step="any" id="probA" placeholder="P(A)" class="input-field w-full">
            <input type="number" step="any" id="probB" placeholder="P(B)" class="input-field w-full">
            ${type === 'union' ? '<input type="number" step="any" id="probAB" placeholder="P(A∩B)" class="input-field w-full">' : ''}
        `;
    } else if (type === 'conditional') {
        html = `
            <input type="number" step="any" id="probAB" placeholder="P(A∩B)" class="input-field w-full">
            <input type="number" step="any" id="probB" placeholder="P(B)" class="input-field w-full">
        `;
    } else if (type === 'permutation' || type === 'combination') {
        html = `
            <input type="number" id="probN" placeholder="n (total items)" class="input-field w-full">
            <input type="number" id="probR" placeholder="r (items to choose)" class="input-field w-full">
        `;
    }
    
    container.innerHTML = html;
}

function calculateProbability() {
    const type = document.getElementById('probType').value;
    const resultDiv = document.getElementById('probabilityResult');
    
    switch(type) {
        case 'single':
            calculateSingleProb(resultDiv);
            break;
        case 'union':
            calculateUnionProb(resultDiv);
            break;
        case 'intersection':
            calculateIntersectionProb(resultDiv);
            break;
        case 'conditional':
            calculateConditionalProb(resultDiv);
            break;
        case 'permutation':
            calculatePermutation(resultDiv);
            break;
        case 'combination':
            calculateCombination(resultDiv);
            break;
    }
}

function calculateSingleProb(resultDiv) {
    const favorable = parseFloat(document.getElementById('probFavorable').value);
    const total = parseFloat(document.getElementById('probTotal').value);
    
    if (isNaN(favorable) || isNaN(total) || total === 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid values!</p>';
        return;
    }
    
    const probability = favorable / total;
    const percentage = probability * 100;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Probability:</h4>
        <p class="text-lg mb-2 text-gray-700 dark:text-gray-300">Favorable outcomes: ${favorable}</p>
        <p class="text-lg mb-3 text-gray-700 dark:text-gray-300">Total outcomes: ${total}</p>
        <p class="text-4xl font-bold text-pink-600 dark:text-pink-400">P = ${probability.toFixed(6)}</p>
        <p class="text-2xl text-green-600 dark:text-green-400 mt-2">${percentage.toFixed(2)}%</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Formula: P = Favorable/Total</p>
    `;
}

function calculateUnionProb(resultDiv) {
    const pA = parseFloat(document.getElementById('probA').value);
    const pB = parseFloat(document.getElementById('probB').value);
    const pAB = parseFloat(document.getElementById('probAB').value);
    
    if ([pA, pB, pAB].some(isNaN)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter all probabilities!</p>';
        return;
    }
    
    const pUnion = pA + pB - pAB;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Union Probability:</h4>
        <p class="text-lg mb-2 text-gray-700 dark:text-gray-300">P(A) = ${pA}</p>
        <p class="text-lg mb-2 text-gray-700 dark:text-gray-300">P(B) = ${pB}</p>
        <p class="text-lg mb-3 text-gray-700 dark:text-gray-300">P(A∩B) = ${pAB}</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">P(A∪B) = ${pUnion.toFixed(6)}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Formula: P(A∪B) = P(A) + P(B) - P(A∩B)</p>
    `;
}

function calculateIntersectionProb(resultDiv) {
    const pA = parseFloat(document.getElementById('probA').value);
    const pB = parseFloat(document.getElementById('probB').value);
    
    if ([pA, pB].some(isNaN)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter both probabilities!</p>';
        return;
    }
    
    const pIntersection = pA * pB;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Intersection (Independent Events):</h4>
        <p class="text-lg mb-2 text-gray-700 dark:text-gray-300">P(A) = ${pA}</p>
        <p class="text-lg mb-3 text-gray-700 dark:text-gray-300">P(B) = ${pB}</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">P(A∩B) = ${pIntersection.toFixed(6)}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Formula: P(A∩B) = P(A) × P(B) (for independent events)</p>
    `;
}

function calculateConditionalProb(resultDiv) {
    const pAB = parseFloat(document.getElementById('probAB').value);
    const pB = parseFloat(document.getElementById('probB').value);
    
    if ([pAB, pB].some(isNaN) || pB === 0) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid probabilities (P(B) ≠ 0)!</p>';
        return;
    }
    
    const pConditional = pAB / pB;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Conditional Probability:</h4>
        <p class="text-lg mb-2 text-gray-700 dark:text-gray-300">P(A∩B) = ${pAB}</p>
        <p class="text-lg mb-3 text-gray-700 dark:text-gray-300">P(B) = ${pB}</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">P(A|B) = ${pConditional.toFixed(6)}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Formula: P(A|B) = P(A∩B) / P(B)</p>
    `;
}

function calculatePermutation(resultDiv) {
    const n = parseInt(document.getElementById('probN').value);
    const r = parseInt(document.getElementById('probR').value);
    
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid values (0 ≤ r ≤ n)!</p>';
        return;
    }
    
    let result = 1;
    for (let i = 0; i < r; i++) {
        result *= (n - i);
    }
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Permutation:</h4>
        <p class="text-xl mb-3 text-gray-700 dark:text-gray-300">ⁿPᵣ where n=${n}, r=${r}</p>
        <p class="text-4xl font-bold text-pink-600 dark:text-pink-400">${result}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Formula: nPr = n!/(n-r)!</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Order matters in permutations</p>
    `;
}

function calculateCombination(resultDiv) {
    const n = parseInt(document.getElementById('probN').value);
    const r = parseInt(document.getElementById('probR').value);
    
    if (isNaN(n) || isNaN(r) || n < 0 || r < 0 || r > n) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid values (0 ≤ r ≤ n)!</p>';
        return;
    }
    
    const result = binomialCoefficient(n, r);
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Combination:</h4>
        <p class="text-xl mb-3 text-gray-700 dark:text-gray-300">ⁿCᵣ where n=${n}, r=${r}</p>
        <p class="text-4xl font-bold text-pink-600 dark:text-pink-400">${result}</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Formula: nCr = n!/(r! × (n-r)!)</p>
        <p class="text-xs text-gray-500 dark:text-gray-400 mt-2">Order doesn't matter in combinations</p>
    `;
}

// Initialize probability inputs
window.addEventListener('load', () => {
    updateProbInputs();
    updateRatioInputs();
});

// 4. RATIO & PROPORTION CALCULATOR
function updateRatioInputs() {
    const type = document.getElementById('ratioType')?.value;
    const container = document.getElementById('ratioInputs');
    
    if (!container) return;
    
    let html = '';
    
    if (type === 'simplify') {
        html = `
            <input type="number" id="ratioA" placeholder="First number" class="input-field w-full">
            <input type="number" id="ratioB" placeholder="Second number" class="input-field w-full">
        `;
    } else if (type === 'proportion') {
        html = `
            <p class="text-gray-700 dark:text-gray-300 mb-2">Solve: a:b = c:d (find missing value)</p>
            <div class="grid grid-cols-2 gap-3">
                <input type="number" id="ratioA" placeholder="a" class="input-field">
                <input type="number" id="ratioB" placeholder="b" class="input-field">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <input type="number" id="ratioC" placeholder="c (or leave empty)" class="input-field">
                <input type="number" id="ratioD" placeholder="d (or leave empty)" class="input-field">
            </div>
        `;
    } else if (type === 'divide') {
        html = `
            <input type="number" id="ratioAmount" placeholder="Total amount" class="input-field w-full">
            <input type="text" id="ratioValues" placeholder="Ratio (e.g., 2:3:5)" class="input-field w-full">
        `;
    } else if (type === 'percent') {
        html = `
            <input type="number" id="ratioA" placeholder="First number" class="input-field w-full">
            <input type="number" id="ratioB" placeholder="Second number" class="input-field w-full">
        `;
    }
    
    container.innerHTML = html;
}

function calculateRatio() {
    const type = document.getElementById('ratioType').value;
    const resultDiv = document.getElementById('ratioResult');
    
    switch(type) {
        case 'simplify':
            simplifyRatio(resultDiv);
            break;
        case 'proportion':
            solveProportion(resultDiv);
            break;
        case 'divide':
            divideInRatio(resultDiv);
            break;
        case 'percent':
            ratioToPercent(resultDiv);
            break;
    }
}

function simplifyRatio(resultDiv) {
    const a = parseFloat(document.getElementById('ratioA').value);
    const b = parseFloat(document.getElementById('ratioB').value);
    
    if ([a, b].some(isNaN)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter both numbers!</p>';
        return;
    }
    
    const gcd = findGCD(Math.abs(a), Math.abs(b));
    const simplifiedA = a / gcd;
    const simplifiedB = b / gcd;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Simplified Ratio:</h4>
        <p class="text-xl mb-2 text-gray-700 dark:text-gray-300">Original: :</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400">:</p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">GCD = </p>
    `;
}

function solveProportion(resultDiv) {
    const a = parseFloat(document.getElementById('ratioA').value);
    const b = parseFloat(document.getElementById('ratioB').value);
    const c = parseFloat(document.getElementById('ratioC').value);
    const d = parseFloat(document.getElementById('ratioD').value);
    
    let missing, result, explanation;
    
    if (isNaN(d)) {
        // Find d: a:b = c:d => d = (b×c)/a
        if (isNaN(a) || isNaN(b) || isNaN(c) || a === 0) {
            resultDiv.innerHTML = '<p class="text-red-500">Invalid values!</p>';
            return;
        }
        result = (b * c) / a;
        missing = 'd';
        explanation = `d = (b × c) / a = ( × ) /  = `;
    } else if (isNaN(c)) {
        // Find c: a:b = c:d => c = (a×d)/b
        if (isNaN(a) || isNaN(b) || isNaN(d) || b === 0) {
            resultDiv.innerHTML = '<p class="text-red-500">Invalid values!</p>';
            return;
        }
        result = (a * d) / b;
        missing = 'c';
        explanation = `c = (a × d) / b = ( × ) /  = `;
    } else {
        resultDiv.innerHTML = '<p class="text-orange-500">Please leave one value empty to solve!</p>';
        return;
    }
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Proportion Solution:</h4>
        <p class="text-xl mb-3 text-gray-700 dark:text-gray-300">: = :</p>
        <p class="text-3xl font-bold text-pink-600 dark:text-pink-400"> = </p>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3"></p>
    `;
}

function divideInRatio(resultDiv) {
    const amount = parseFloat(document.getElementById('ratioAmount').value);
    const ratioStr = document.getElementById('ratioValues').value;
    
    if (isNaN(amount) || !ratioStr) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter amount and ratio!</p>';
        return;
    }
    
    const ratios = ratioStr.split(':').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
    
    if (ratios.length < 2) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter valid ratio (e.g., 2:3:5)!</p>';
        return;
    }
    
    const total = ratios.reduce((sum, r) => sum + r, 0);
    const parts = ratios.map(r => (amount * r) / total);
    
    let html = `
        <h4 class="font-bold text-lg mb-3">Divide in Ratio:</h4>
        <p class="text-xl mb-2 text-gray-700 dark:text-gray-300">Total Amount: </p>
        <p class="text-xl mb-3 text-gray-700 dark:text-gray-300">Ratio: </p>
        <div class="space-y-2">
    `;
    
    parts.forEach((part, i) => {
        html += `<p class="text-lg"><span class="font-semibold">Part :</span> <span class="text-pink-600 dark:text-pink-400 font-bold"></span></p>`;
    });
    
    html += `
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Each part = (Amount × Ratio) / Total Ratio</p>
    `;
    
    resultDiv.innerHTML = html;
}

function ratioToPercent(resultDiv) {
    const a = parseFloat(document.getElementById('ratioA').value);
    const b = parseFloat(document.getElementById('ratioB').value);
    
    if ([a, b].some(isNaN)) {
        resultDiv.innerHTML = '<p class="text-red-500">Please enter both numbers!</p>';
        return;
    }
    
    const total = a + b;
    const percentA = (a / total) * 100;
    const percentB = (b / total) * 100;
    
    resultDiv.innerHTML = `
        <h4 class="font-bold text-lg mb-3">Ratio to Percentage:</h4>
        <p class="text-xl mb-3 text-gray-700 dark:text-gray-300">Ratio: :</p>
        <div class="space-y-2">
            <p class="text-2xl font-bold text-pink-600 dark:text-pink-400">First part: %</p>
            <p class="text-2xl font-bold text-green-600 dark:text-green-400">Second part: %</p>
        </div>
        <p class="text-sm text-gray-600 dark:text-gray-400 mt-3">Total: % + % = 100%</p>
    `;
}
