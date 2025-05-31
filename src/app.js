document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('login-btn');
    if (loginBtn) {
        loginBtn.addEventListener('click', handleLogin);
    }
    const calcBtn = document.getElementById('calculate-btn');
    if (calcBtn) {
        calcBtn.addEventListener('click', handleBMICalc);
    }
});

// --- Utility Functions ---
function getInputValue(id) {
    return document.getElementById(id)?.value?.trim() || '';
}

function showSwal(type, title, text, color = '#6366f1') {
    Swal.fire({
        icon: type,
        title: title,
        text: text,
        confirmButtonColor: color
    });
}

function showSwalResult({icon, title, status, statusColor, warning, tdee, water, bmr, bodyFat, protein, swalColor}) {
    Swal.fire({
        icon: icon,
        title: title,
        html: `<div class="font-bold ${statusColor}">${status}</div><div class="mt-2">${warning}</div>` +
            `<div class='mt-4 text-left text-base'>
                <div><b>Calories/day (TDEE):</b> <span class='text-blue-600'>${tdee} kcal</span></div>
                <div><b>Water/day:</b> <span class='text-blue-600'>${water} L</span></div>
                <div><b>BMR:</b> <span class='text-green-600'>${bmr} kcal</span></div>
                <div><b>Body Fat %:</b> <span class='text-yellow-600'>${bodyFat}%</span></div>
                <div><b>Protein/day:</b> <span class='text-purple-600'>${protein} g</span></div>
            </div>`,
        confirmButtonColor: swalColor
    });
}

function setBoxResult({tdee, water, bmr, bodyFat, protein}) {
    const extraResult = document.getElementById('extra-result');
    const extraBox = document.getElementById('extra-result-box');
    if (extraResult && extraBox) {
        extraResult.innerHTML = `
            <div class="bmi-extra-row">
                <div class="bmi-extra-label">Calories/day (TDEE):</div>
                <div class="bmi-extra-value bmi-extra-blue">${tdee} kcal</div>
            </div>
            <div class="bmi-extra-row">
                <div class="bmi-extra-label">Water/day:</div>
                <div class="bmi-extra-value bmi-extra-blue">${water} L</div>
            </div>
            <div class="bmi-extra-row">
                <div class="bmi-extra-label">BMR:</div>
                <div class="bmi-extra-value bmi-extra-green">${bmr} kcal</div>
            </div>
            <div class="bmi-extra-row">
                <div class="bmi-extra-label">Body Fat %:</div>
                <div class="bmi-extra-value bmi-extra-yellow">${bodyFat}%</div>
            </div>
            <div class="bmi-extra-row">
                <div class="bmi-extra-label">Protein/day:</div>
                <div class="bmi-extra-value bmi-extra-purple">${protein} g</div>
            </div>
        `;
        extraBox.classList.remove('hidden');
    }
}

function resetBoxResult() {
    const extraResult = document.getElementById('extra-result');
    const extraBox = document.getElementById('extra-result-box');
    if (extraResult) extraResult.innerHTML = '';
    if (extraBox) extraBox.classList.add('hidden');
}

function resetMainResult() {
    document.getElementById('result').textContent = '';
    document.getElementById('bmi-status').textContent = '';
    document.getElementById('bmi-warning').textContent = '';
    document.getElementById('bmi-warning').className = 'text-base font-medium';
}

function setMainResult({bmi, status, statusColor, warning, warningColor}) {
    document.getElementById('result').textContent = `BMI: ${bmi}`;
    document.getElementById('bmi-status').textContent = status;
    document.getElementById('bmi-status').className = `text-lg font-semibold mb-2 ${statusColor}`;
    document.getElementById('bmi-warning').textContent = warning;
    document.getElementById('bmi-warning').className = `text-base font-medium px-3 py-2 rounded ${warningColor} mt-2`;
}

// --- Calculation Functions ---
function calculateBMR(weight, height, age, gender) {
    if (gender === 'male') {
        return 88.362 + (13.397 * weight) + (4.799 * (height * 100)) - (5.677 * age);
    } else {
        return 447.593 + (9.247 * weight) + (3.098 * (height * 100)) - (4.330 * age);
    }
}

function calculateBodyFat(bmi, age, gender) {
    return (1.20 * bmi + 0.23 * age - (gender === 'male' ? 16.2 : 5.4)).toFixed(1);
}

function calculateProtein(weight) {
    return (weight * 1.5).toFixed(1);
}

function calculateTDEE(bmr) {
    return (bmr * 1.55).toFixed(0);
}

function calculateWater(weight) {
    return (weight * 0.03).toFixed(2);
}

// Export calculation functions for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateBMR,
        calculateBodyFat,
        calculateProtein,
        calculateTDEE,
        calculateWater
    };
}

// --- Main Event Handlers ---
function handleLogin() {
    const username = getInputValue('username');
    const password = getInputValue('password');
    if (!username || !password) {
        showSwal('warning', 'Required Field', 'Please fill in both Username and Password.');
        return;
    }
    if (username === 'demo' && password === 'dome') {
        Swal.fire({
            icon: 'success',
            title: 'Login Success',
            showConfirmButton: false,
            timer: 1200
        }).then(() => {
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('bmi-section').classList.remove('hidden');
        });
    } else {
        showSwal('error', 'Login Failed', 'Username or Password is incorrect.', '#ef4444');
    }
}

function handleBMICalc() {
    const weightInput = getInputValue('weight');
    const heightInput = getInputValue('height');
    const ageInput = getInputValue('age');
    const genderInput = getInputValue('gender');
    resetMainResult();
    resetBoxResult();
    if (!weightInput || !heightInput || !ageInput || !genderInput) {
        showSwal('warning', 'Required Field', 'Please enter weight, height, age, and gender.');
        return;
    }
    const weight = parseFloat(weightInput);
    const height = parseFloat(heightInput) / 100;
    const age = parseInt(ageInput);
    const gender = genderInput;
    const bmi = (weight / (height * height)).toFixed(2);
    let status = '', warning = '', statusColor = '', warningColor = '', swalIcon = '', swalColor = '';
    if (bmi < 18.5) {
        status = 'Underweight';
        statusColor = 'text-blue-600';
        warning = 'You are underweight. Consider eating a balanced diet.';
        warningColor = 'bg-blue-100 text-blue-700';
        swalIcon = 'info';
        swalColor = '#3b82f6';
    } else if (bmi < 25) {
        status = 'Normal weight';
        statusColor = 'text-green-600';
        warning = 'Your weight is normal. Keep up the good work!';
        warningColor = 'bg-green-100 text-green-700';
        swalIcon = 'success';
        swalColor = '#22c55e';
    } else if (bmi < 30) {
        status = 'Overweight';
        statusColor = 'text-yellow-600';
        warning = 'You are overweight. Consider exercising and eating healthy.';
        warningColor = 'bg-yellow-100 text-yellow-700';
        swalIcon = 'warning';
        swalColor = '#facc15';
    } else {
        status = 'Obese';
        statusColor = 'text-red-600';
        warning = 'You are obese. Please consult a healthcare provider.';
        warningColor = 'bg-red-100 text-red-700';
        swalIcon = 'error';
        swalColor = '#ef4444';
    }
    setMainResult({bmi, status, statusColor, warning, warningColor});
    // Calculate extra
    const bmr = calculateBMR(weight, height, age, gender).toFixed(0);
    const tdee = calculateTDEE(bmr);
    const water = calculateWater(weight);
    const bodyFat = calculateBodyFat(bmi, age, gender);
    const protein = calculateProtein(weight);
    setBoxResult({tdee, water, bmr, bodyFat, protein});
    showSwalResult({icon: swalIcon, title: `BMI: ${bmi}`, status, statusColor, warning, tdee, water, bmr, bodyFat, protein, swalColor});
}