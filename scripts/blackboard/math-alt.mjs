/**
 * Plain-language alt text for every expression in the Week 4 content.
 *
 * Ported in spirit from `../build/math_render.py`, which is where this course
 * settled the question on 2026-09-04. The rule there and here: every expression
 * supplies `alt` regardless of which renderer is active, so switching the
 * renderer can never silently drop it, and a `<math>` element that a sanitizer
 * strips still leaves a sentence behind on the wrapper.
 *
 * Keys are the TeX source with runs of whitespace collapsed, exactly as it
 * appears between the dollar signs in `content/week4/*.mdx`. A display formula
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
  4: atomic('4.'),
  5: atomic('5.'),
  '-1': atomic('negative 1.'),
  '+1': atomic('positive 1.'),
  '-2': atomic('negative 2.'),
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
  'x^3 + x': atomic('x cubed plus x.'),
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
