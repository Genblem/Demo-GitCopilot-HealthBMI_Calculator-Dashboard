const { calculateBMR, calculateBodyFat, calculateProtein, calculateTDEE, calculateWater } = require('./app');

describe('Nutrition & Health Calculation Functions', () => {
  // Test Case 1: Male, 25y, 70kg, 175cm
  test('calculateBMR (male)', () => {
    const bmr = calculateBMR(70, 1.75, 25, 'male');
    expect(Math.round(bmr)).toBe(1724); // 88.362 + (13.397*70) + (4.799*175) - (5.677*25)
  });

  // Test Case 2: Female, 30y, 60kg, 160cm
  test('calculateBMR (female)', () => {
    const bmr = calculateBMR(60, 1.60, 30, 'female');
    expect(Math.round(bmr)).toBe(1367); // 447.593 + (9.247*60) + (3.098*160) - (4.33*30)
  });

  // Test Case 3: calculateBodyFat
  test('calculateBodyFat (male)', () => {
    // BMI = 22.86, age = 25, male
    expect(Number(calculateBodyFat(22.86, 25, 'male'))).toBeCloseTo(17.6, 1);
  });
  test('calculateBodyFat (female)', () => {
    // BMI = 23.44, age = 30, female
    expect(Number(calculateBodyFat(23.44, 30, 'female'))).toBeCloseTo(23.7, 1);
  });

  // Test Case 4: calculateProtein
  test('calculateProtein', () => {
    expect(Number(calculateProtein(70))).toBeCloseTo(105.0, 1);
    expect(Number(calculateProtein(60))).toBeCloseTo(90.0, 1);
  });

  // Test Case 5: calculateTDEE
  test('calculateTDEE', () => {
    expect(Number(calculateTDEE(1724))).toBeCloseTo(2672, 0);
    expect(Number(calculateTDEE(1367))).toBeCloseTo(2119, 0);
  });

  // Test Case 6: calculateWater
  test('calculateWater', () => {
    expect(Number(calculateWater(70))).toBeCloseTo(2.10, 2);
    expect(Number(calculateWater(60))).toBeCloseTo(1.80, 2);
  });

  // Edge Case: Zero or negative input
  test('calculateBMR with zero/negative', () => {
    expect(calculateBMR(0, 0, 0, 'male')).toBeCloseTo(88.362, 2);
    expect(calculateBMR(-10, 1.7, 20, 'female')).toBeLessThan(447.593);
  });
});
