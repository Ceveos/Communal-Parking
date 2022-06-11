export default function ClassNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ');
}