// export const classNames = (...classes) => (
//   return (classes.filter(Boolean).join(' '));
// );

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
