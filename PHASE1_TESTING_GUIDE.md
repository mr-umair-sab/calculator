# 🧪 Phase 1 - Testing Guide

## Quick Test Instructions

---

## 🚀 **How to Test All New Features**

### Prerequisites:
1. Open `public/index.html` in browser
2. Click on **"🔧 Utilities"** mode button
3. You'll see 5 new tabs added

---

## 1️⃣ **Test Prime Number Tools**

### Click: "🔢 Prime Tools"

#### Test 1: Check if Prime
```
Operation: Check if Prime
Input: 17
Expected: "17 is a Prime Number" ✓
```

#### Test 2: Prime Factorization
```
Operation: Prime Factorization
Input: 60
Expected: 60 = 2 × 2 × 3 × 5 = 2² × 3 × 5
```

#### Test 3: List Primes
```
Operation: List Primes up to N
Input: 50
Expected: 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47
Count: 15 primes
```

#### Test 4: Find Nth Prime
```
Operation: Find Nth Prime
Input: 10
Expected: The 10th prime number is: 29
```

---

## 2️⃣ **Test Sequence & Series**

### Click: "📈 Sequences"

#### Test 1: Arithmetic Progression
```
Type: Arithmetic Progression (AP)
First term (a): 2
Common difference (d): 3
Number of terms (n): 10

Expected Results:
- nth term: 29
- Sum of 10 terms: 155
```

#### Test 2: Geometric Progression
```
Type: Geometric Progression (GP)
First term (a): 2
Common ratio (r): 3
Number of terms (n): 5

Expected Results:
- nth term: 162
- Sum of 5 terms: 242
```

#### Test 3: Sum of Natural Numbers
```
Type: Sum of First N Natural Numbers
Enter N: 100

Expected: 5050
Formula: n(n+1)/2
```

#### Test 4: Sum of Squares
```
Type: Sum of Squares
Enter N: 10

Expected: 385
Formula: n(n+1)(2n+1)/6
```

#### Test 5: Sum of Cubes
```
Type: Sum of Cubes
Enter N: 5

Expected: 225
Formula: [n(n+1)/2]²
```

---

## 3️⃣ **Test Decimal ↔ Fraction**

### Click: "🔄 Dec↔Frac"

#### Test 1: Decimal to Fraction
```
Type: Decimal to Fraction
Input: 0.75

Expected: 3/4
```

#### Test 2: Decimal to Fraction (with mixed number)
```
Type: Decimal to Fraction
Input: 2.5

Expected: 
- Fraction: 5/2
- Mixed Number: 2 1/2
```

#### Test 3: Fraction to Decimal
```
Type: Fraction to Decimal
Numerator: 3
Denominator: 4

Expected: 0.75
```

#### Test 4: Complex Decimal
```
Type: Decimal to Fraction
Input: 0.125

Expected: 1/8
```

---

## 4️⃣ **Test Matrix 3×3**

### Click: "🔢 Matrix 3×3"

#### Test 1: Addition
```
Operation: Addition

Matrix A:
1  2  3
4  5  6
7  8  9

Matrix B:
9  8  7
6  5  4
3  2  1

Expected Result (A + B):
10  10  10
10  10  10
10  10  10
```

#### Test 2: Subtraction
```
Operation: Subtraction

Matrix A:
5  5  5
5  5  5
5  5  5

Matrix B:
1  2  3
4  5  6
7  8  9

Expected Result (A - B):
4   3   2
1   0  -1
-2  -3  -4
```

#### Test 3: Multiplication
```
Operation: Multiplication

Matrix A:
1  0  0
0  1  0
0  0  1

Matrix B:
5  6  7
8  9  10
11 12 13

Expected Result (A × B):
5   6   7
8   9   10
11  12  13
(Identity matrix property)
```

#### Test 4: Determinant
```
Operation: Determinant

Matrix A:
2  1  3
0  4  1
1  2  1

Expected: det(A) = 10
```

#### Test 5: Transpose
```
Operation: Transpose

Matrix A:
1  2  3
4  5  6
7  8  9

Expected Transpose (Aᵀ):
1  4  7
2  5  8
3  6  9
```

---

## 5️⃣ **Test Complex Numbers**

### Click: "🔢 Complex"

#### Test 1: Addition
```
Operation: Addition
First: a=3, b=4 (3+4i)
Second: c=1, d=2 (1+2i)

Expected: 4 + 6i
```

#### Test 2: Subtraction
```
Operation: Subtraction
First: a=5, b=3 (5+3i)
Second: c=2, d=1 (2+1i)

Expected: 3 + 2i
```

#### Test 3: Multiplication
```
Operation: Multiplication
First: a=2, b=3 (2+3i)
Second: c=1, d=-2 (1-2i)

Expected: 8 - 1i
Calculation: (2×1 - 3×(-2)) + (2×(-2) + 3×1)i = 8 - 1i
```

#### Test 4: Division
```
Operation: Division
First: a=4, b=2 (4+2i)
Second: c=1, d=1 (1+1i)

Expected: 3 - 1i
```

#### Test 5: Conjugate
```
Operation: Conjugate
Input: a=3, b=4 (3+4i)

Expected: z̄ = 3 - 4i
```

#### Test 6: Modulus
```
Operation: Modulus
Input: a=3, b=4 (3+4i)

Expected: |z| = 5
Calculation: √(3² + 4²) = √25 = 5
```

#### Test 7: Polar Form
```
Operation: Convert to Polar Form
Input: a=1, b=1 (1+1i)

Expected:
- r = 1.414214 (√2)
- θ = 45° = 0.7854 rad
- z = 1.4142 ∠ 45°
- z = 1.4142 e^(i0.7854)
```

---

## 🎯 **Quick Verification Checklist**

### For Each Feature:
- [ ] UI loads correctly
- [ ] Input fields are visible
- [ ] Dropdown menus work
- [ ] Calculate button responds
- [ ] Results display properly
- [ ] Dark mode works
- [ ] Mobile responsive
- [ ] Error messages show for invalid input

---

## 🐛 **Common Issues & Solutions**

### Issue 1: "Cannot read property of undefined"
**Solution:** Refresh the page, ensure all JavaScript is loaded

### Issue 2: Results not showing
**Solution:** Check browser console for errors, ensure all inputs are filled

### Issue 3: Dark mode not working
**Solution:** Click the theme toggle button in header

### Issue 4: Mobile layout broken
**Solution:** Zoom out or rotate device to landscape

---

## 📱 **Mobile Testing**

### Test on:
- [ ] iPhone (Safari)
- [ ] Android (Chrome)
- [ ] Tablet (iPad/Android)

### Check:
- [ ] Buttons are tappable
- [ ] Input fields are accessible
- [ ] Results are readable
- [ ] No horizontal scroll

---

## 🎨 **Visual Testing**

### Light Mode:
- [ ] All text is readable
- [ ] Buttons have proper contrast
- [ ] Results are highlighted
- [ ] No color clashes

### Dark Mode:
- [ ] All text is visible
- [ ] Input fields are clear
- [ ] Results stand out
- [ ] Comfortable on eyes

---

## ⚡ **Performance Testing**

### Prime Tools:
- [ ] Check prime (instant for n < 1000)
- [ ] Factorization (instant for n < 10000)
- [ ] List primes (< 1 second for n < 1000)

### Matrix Operations:
- [ ] All operations instant
- [ ] No lag on calculation

### Complex Numbers:
- [ ] All operations instant
- [ ] Polar conversion smooth

---

## ✅ **Final Checklist**

Before marking Phase 1 complete:

### Functionality:
- [ ] All 5 features work
- [ ] All sub-features tested
- [ ] Error handling works
- [ ] Results are accurate

### UI/UX:
- [ ] Responsive design
- [ ] Dark mode support
- [ ] Clear labels
- [ ] Helpful error messages

### Documentation:
- [ ] PHASE1_QUICK_WINS_ADDED.md created
- [ ] Testing guide created
- [ ] Examples provided

---

## 🎉 **Test Results**

### Expected Outcome:
✅ All 5 features working perfectly
✅ No console errors
✅ Smooth user experience
✅ Accurate calculations

---

## 📞 **Support**

If you find any bugs or issues:
1. Check browser console for errors
2. Verify all inputs are correct
3. Try refreshing the page
4. Test in different browser

---

**Happy Testing!** 🚀

**Phase 1 Status:** ✅ COMPLETE
