/**
 * Joins class names, dropping anything falsy.
 *
 * Components take a `className` prop and merge it with their own module
 * classes through this helper, which keeps the call sites free of
 * `[a, b].filter(Boolean).join(" ")` noise.
 */
export function cx(...values) {
  return values.filter(Boolean).join(" ");
}
