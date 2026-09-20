/**
 * Plain-language alt text for every expression in the weekly course content.
 *
 * Ported in spirit from `../build/math_render.py`, which is where this course
 * settled the question on 2026-09-04. The rule there and here: every expression
 * supplies `alt` regardless of which renderer is active, so switching the
 * renderer can never silently drop it, and a `<math>` element that a sanitizer
 * strips still leaves a sentence behind on the wrapper.
 *
 * Keys are the TeX source with runs of whitespace collapsed, exactly as it
 * appears between the dollar signs in the weekly MDX content files. A display formula
 * is keyed with a `DISPLAY:` prefix. An expression with no entry here is a
 * BUILD FAILURE, not a silent omission — see `assertAltCoverage` in math.mjs.
 *
 * `atomic` marks a single symbol rather than a statement. Padding one out
 * produces worse screen-reader output, not better, so they are exempt from the
 * minimum length by declaration rather than by being short enough to slip under
 * it. Same carve-out, same reason, as math_render.py.
 */

const atomic = (alt) => ({ alt, atomic: true });

export const MATH_ALT = {
  // Single symbols and bare numbers.
  f: atomic('f.'),
  a: atomic('a.'),
  x: atomic('x.'),
  c: atomic('c.'),
  N: atomic('N.'),
  0: atomic('0.'),
  1: atomic('1.'),
  2: atomic('2.'),
  3: atomic('3.'),
  4: atomic('4.'),
  5: atomic('5.'),
  6: atomic('6.'),
  7: atomic('7.'),
  8: atomic('8.'),
  9: atomic('9.'),
  10: atomic('10.'),
  11: atomic('11.'),
  12: atomic('12.'),
  '-1': atomic('negative 1.'),
  '+1': atomic('positive 1.'),
  '-2': atomic('negative 2.'),
  '-3': atomic('negative 3.'),
  '-7': atomic('negative 7.'),
  0.1: atomic('0.1.'),
  1.1: atomic('1.1.'),
  0.0047: atomic('0.0047.'),
  0.307: atomic('0.307.'),

  // Named values and short function references.
  'f(a)': atomic('f of a.'),
  'f(b)': atomic('f of b.'),
  'f(x)': atomic('f of x.'),
  "f'(a)": atomic('f prime of a.'),
  'L(x)': atomic('L of x.'),
  '\\ln(x)': atomic('the natural logarithm of x.'),
  '\\ln(1.1)': atomic('the natural logarithm of 1.1.'),
  "f'(x)": atomic('f prime of x.'),
  "g'(x)": atomic('g prime of x.'),
  "s'(0)": atomic('s prime of 0.'),
  'p(t)': atomic('p of t.'),
  "p'(0)": atomic('p prime of 0.'),
  'p(x)': atomic('p of x.'),
  'p(2)': atomic('p of 2.'),
  "p'(x)": atomic('p prime of x.'),
  "p'(2)": atomic('p prime of 2.'),
  'P(t)': atomic('capital P of t.'),
  "P'(t)": atomic('capital P prime of t.'),
  'h(t)': atomic('h of t.'),
  "h'(t)": atomic('h prime of t.'),
  '\\frac{dy}{dx}': atomic('d y d x.'),
  '\\frac{d}{dx}\\left[f(x)\\right]': {
    alt: 'the derivative with respect to x of f of x.',
  },
  '\\frac{d}{dx}[\\cos(x)]': {
    alt: 'the derivative with respect to x of cosine of x.',
  },
  '\\sin(x)': atomic('sine of x.'),
  '\\cos(x)': atomic('cosine of x.'),
  '-\\sin(x)': atomic('negative sine of x.'),
  '\\sin(t)': atomic('sine of t.'),
  '\\cos(t)': atomic('cosine of t.'),
  '-\\sin(t)': atomic('negative sine of t.'),
  '\\sqrt{x}': atomic('the square root of x.'),
  '5^x\\ln(5)': atomic('5 to the x power times the natural logarithm of 5.'),
  '(2,5)': atomic('the point 2 comma 5.'),
  '\\cos(0)': atomic('cosine of 0.'),
  '\\cos(\\pi/2)': atomic('cosine of pi over 2.'),
  's(t) = \\sin(t)': {
    alt: 's of t equals the sine of t as a position function.',
  },
  'p(t) = \\cos(t)': {
    alt: 'p of t equals the cosine of t as a position function.',
  },
  'x^3 + x': atomic('x cubed plus x.'),
  'x^2': atomic('x squared.'),
  'x^3': atomic('x cubed.'),
  'x^4': atomic('x to the fourth power.'),
  'x^5': atomic('x to the fifth power.'),
  'x^7': atomic('x to the seventh power.'),
  'x^n': atomic('x to the n power.'),
  'a^x': atomic('a to the x power.'),
  '5^x': atomic('5 to the x power.'),
  '2x': atomic('2 x.'),
  '-2x': atomic('negative 2 x.'),
  '6x': atomic('6 x.'),
  '-6x': atomic('negative 6 x.'),
  '-7x': atomic('negative 7 x.'),
  '3x^2': atomic('3 x squared.'),
  '-3x^2': atomic('negative 3 x squared.'),
  '4x^3': atomic('4 x cubed.'),
  '4x^3 + 12': atomic('4 x cubed plus 12.'),
  '4x^7': atomic('4 x to the seventh power.'),
  '5x^4': atomic('5 x to the fourth power.'),
  '7x^6': atomic('7 x to the sixth power.'),
  '9x^5': atomic('9 x to the fifth power.'),
  '24x^3 - 2': atomic('24 x cubed minus 2.'),
  '28x^6': atomic('28 x to the sixth power.'),
  '45x^4': atomic('45 x to the fourth power.'),
  '3x^2 - 7': atomic('3 x squared minus 7.'),
  '6x^4 - 2x + 5': {
    alt: '6 x to the fourth power minus 2 x plus 5.',
  },
  '9 \\cdot 5x^4 = 45x^4': {
    alt: '9 times 5 x to the fourth power equals 45 x to the fourth power.',
  },
  'f(x) = x^4 + 12': {
    alt: 'f of x equals x to the fourth power plus 12.',
  },
  '3\\sin(x)': atomic('3 sine of x.'),
  '3\\cos(x)': atomic('3 cosine of x.'),
  '-2\\cos(x)': atomic('negative 2 cosine of x.'),
  '-2(-\\sin(x))': atomic('negative 2 times negative sine of x.'),
  '2\\sin(x)': atomic('2 sine of x.'),
  '5\\sin(x)': atomic('5 sine of x.'),
  '5\\cos(x)': atomic('5 cosine of x.'),
  '7\\cos(x)': atomic('7 cosine of x.'),
  '-7\\sin(x)': atomic('negative 7 sine of x.'),
  "p'(0) = -\\sin(0) = 0": {
    alt: 'p prime of 0 equals negative sine of 0, which equals 0.',
  },
  '(x - a)': atomic('the quantity x minus a.'),

  // Intervals. The bracket is the whole point, so each one says which it is.
  '[a, b]': atomic('the closed interval from a to b.'),
  '(a, b)': atomic('the open interval from a to b.'),
  '[1, 2]': atomic('the closed interval from 1 to 2.'),

  // Points on the line.
  'x = a': atomic('x equals a.'),
  'x = 1': atomic('x equals 1.'),
  'x = 2': atomic('x equals 2.'),
  'x = 4': atomic('x equals 4.'),
  't = 0': atomic('t equals 0.'),
  't = \\pi/2': atomic('t equals pi over 2.'),
  't = \\pi/3': atomic('t equals pi over 3.'),
  'a = 1': atomic('a equals 1.'),

  // Statements.
  'g(x) = |x - 2|': {
    alt: 'g of x equals the absolute value of x minus 2.',
  },
  '\\lim_{x \\to a^-} f(x)': {
    alt: 'the limit, as x approaches a from the left, of f of x.',
  },
  '\\lim_{x \\to a^+} f(x)': {
    alt: 'the limit, as x approaches a from the right, of f of x.',
  },
  'f(c) = N': atomic('f of c equals N.'),
  'f(1) = 2': atomic('f of 1 equals 2.'),
  'f(2) = 10': atomic('f of 2 equals 10.'),
  'L(2) = 1': atomic('L of 2 equals 1.'),
  "f'(1) = 1": atomic('f prime of 1 equals 1.'),
  'x^3 + x = 5': {
    alt: 'the equation x cubed plus x equals 5.',
  },
  'f(x) = x^3 + x': {
    alt: 'f of x equals x cubed plus x.',
  },
  'f(x) = \\ln(x)': {
    alt: 'f of x equals the natural logarithm of x.',
  },
  "f'(x) = 1/x": {
    alt: 'f prime of x equals 1 divided by x.',
  },
  "DISPLAY:f'(x)": atomic('f prime of x.'),
  'DISPLAY:\\frac{dy}{dx}': atomic('d y d x.'),
  'DISPLAY:\\frac{d}{dx}\\left[f(x)\\right]': {
    alt: 'the derivative with respect to x of f of x.',
  },
  'DISPLAY:\\frac{d}{dx}\\left[c\\right] = 0': {
    alt: 'the derivative with respect to x of a constant c equals zero.',
  },
  'DISPLAY:\\frac{d}{dx}\\left[x^n\\right] = n x^{n-1}': {
    alt: 'the derivative with respect to x of x to the n equals n times x to the n minus 1.',
  },
  "DISPLAY:\\frac{d}{dx}\\left[k f(x)\\right] = k f'(x)": {
    alt: 'the derivative with respect to x of k times f of x equals k times f prime of x.',
  },
  "DISPLAY:\\frac{d}{dx}\\left[f(x) + g(x)\\right] = f'(x) + g'(x)": {
    alt: 'the derivative with respect to x of f of x plus g of x equals f prime of x plus g prime of x.',
  },
  'DISPLAY:\\frac{d}{dx}\\left[a^x\\right] = a^x \\ln(a)': {
    alt: 'the derivative with respect to x of a to the x equals a to the x times the natural logarithm of a.',
  },
  'DISPLAY:g(x) = 4x^7 - 3x^2 + 8': {
    alt: 'g of x equals 4 x to the seventh power minus 3 x squared plus 8.',
  },
  "DISPLAY:g'(x) = 28x^6 - 6x": {
    alt: 'g prime of x equals 28 x to the sixth power minus 6 x.',
  },
  "DISPLAY:f'(x) = 4x^3": {
    alt: 'f prime of x equals 4 x cubed.',
  },
  'DISPLAY:\\sqrt{x} = x^{1/2} \\quad\\Longrightarrow\\quad \\frac{d}{dx}\\left[\\sqrt{x}\\right] = \\frac{1}{2}x^{-1/2} = \\frac{1}{2\\sqrt{x}}':
    {
      alt: 'The square root of x equals x to the one-half power; therefore its derivative is one-half x to the negative one-half power, or 1 divided by 2 square root of x.',
    },
  'DISPLAY:\\frac{1}{x} = x^{-1} \\quad\\Longrightarrow\\quad \\frac{d}{dx}\\left[\\frac{1}{x}\\right] = -x^{-2} = -\\frac{1}{x^2}':
    {
      alt: '1 divided by x equals x to the negative 1 power; therefore its derivative is negative x to the negative 2 power, or negative 1 divided by x squared.',
    },
  'DISPLAY:p(x) = x^3 - 2x + 1': {
    alt: 'p of x equals x cubed minus 2 x plus 1.',
  },
  'DISPLAY:p(2) = 2^3 - 2(2) + 1 = 5': {
    alt: 'p of 2 equals 2 cubed minus 2 times 2 plus 1, which equals 5.',
  },
  "DISPLAY:p'(x) = 3x^2 - 2": {
    alt: 'p prime of x equals 3 x squared minus 2.',
  },
  "DISPLAY:p'(2) = 3(2)^2 - 2 = 10": {
    alt: 'p prime of 2 equals 3 times 2 squared minus 2, which equals 10.',
  },
  'DISPLAY:y = 5 + 10(x - 2)': {
    alt: 'y equals 5 plus 10 times the quantity x minus 2.',
  },
  'DISPLAY:\\frac{d}{dx}\\left[\\sin(x)\\right] = \\cos(x)': {
    alt: 'the derivative with respect to x of sine of x equals cosine of x.',
  },
  'DISPLAY:\\frac{d}{dx}\\left[\\cos(x)\\right] = -\\sin(x)': {
    alt: 'the derivative with respect to x of cosine of x equals negative sine of x.',
  },
  'DISPLAY:P(t) = \\left(\\cos(t),\\sin(t)\\right)': {
    alt: 'capital P of t equals the ordered pair cosine of t comma sine of t.',
  },
  "DISPLAY:P'(t) = \\left(-\\sin(t),\\cos(t)\\right)": {
    alt: 'capital P prime of t equals the ordered pair negative sine of t comma cosine of t.',
  },
  "DISPLAY:s'(0) = \\cos(0) = 1": {
    alt: 's prime of 0 equals cosine of 0, which equals 1.',
  },
  "DISPLAY:s'(\\pi/2) = \\cos(\\pi/2) = 0": {
    alt: 's prime of pi over 2 equals cosine of pi over 2, which equals 0.',
  },
  'DISPLAY:f(x) = 3\\sin(x) - 2\\cos(x) + x^4': {
    alt: 'f of x equals 3 sine of x minus 2 cosine of x plus x to the fourth power.',
  },
  "DISPLAY:f'(x) = 3\\cos(x) + 2\\sin(x) + 4x^3": {
    alt: 'f prime of x equals 3 cosine of x plus 2 sine of x plus 4 x cubed.',
  },
  'DISPLAY:h(t) = 12 + 10\\sin(t)': {
    alt: 'h of t equals 12 plus 10 sine of t.',
  },
  "DISPLAY:h'(t) = 10\\cos(t)": {
    alt: 'h prime of t equals 10 cosine of t.',
  },
  "DISPLAY:h'(\\pi/3) = 10\\cos(\\pi/3) = 5": {
    alt: 'h prime of pi over 3 equals 10 times cosine of pi over 3, which equals 5.',
  },
  'DISPLAY:\\sin(x) \\longrightarrow \\cos(x) \\longrightarrow -\\sin(x) \\longrightarrow -\\cos(x) \\longrightarrow \\sin(x)':
    {
      alt: 'sine of x differentiates to cosine of x, then to negative sine of x, then to negative cosine of x, and then back to sine of x.',
    },
  '\\ln(1) = 0': {
    alt: 'the natural logarithm of 1 equals 0.',
  },
  '\\ln(1.1) \\approx 0.0953': {
    alt: 'the natural logarithm of 1.1 is approximately 0.0953.',
  },
  '\\ln(2) \\approx 0.693': {
    alt: 'the natural logarithm of 2 is approximately 0.693.',
  },
  '\\ln(1.1) \\approx L(1.1) = 0.1': {
    alt: 'the natural logarithm of 1.1 is approximately L of 1.1, which equals 0.1.',
  },
  'L(x) = 0 + 1 \\cdot (x - 1) = x - 1': {
    alt: 'L of x equals 0 plus 1 times the quantity x minus 1, which is x minus 1.',
  },

  // Not on any page. The paste test uses it because a fraction and a limit are
  // the two shapes plain text cannot fake, so they are the ones worth watching
  // when the question is whether Blackboard kept the markup.
  'DISPLAY:\\lim_{h \\to 0} \\frac{f(a+h) - f(a)}{h}': {
    alt: 'the limit, as h approaches zero, of f of a plus h minus f of a, all divided by h.',
  },

  // The one display formula. Same wording as math_render.py's linear_approx,
  // deliberately: a student who meets it on a Week 3 page and again here should
  // hear the same sentence.
  "DISPLAY:L(x) = f(a) + f'(a)(x - a)": {
    alt: 'L of x equals f of a plus f prime of a times the quantity x minus a.',
  },
};
