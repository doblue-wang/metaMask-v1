
export const px2rem = (px: number | string) => {
  return `${parseFloat(`${px}`) / 10}rem`;
}
