
export const px2rem = (px: number | string) => {
  return `${parseFloat(`${px}`) / 10}rem`;
}


export const getObfuscatedAccount = (account: string | null) => {
  if (!account) return '************';  // 如果没有账号，则显示 '****'

  const start = account.slice(0, 6);  // 获取前四个字符
  const end = account.slice(-4);      // 获取后四个字符

  return `${start}******${end}`;  // 拼接成：前4个字符 + **** + 后4个字符
};