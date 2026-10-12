/** 文中の [[16]] のような数字を取り出す（数え上げる数字は number、それ以外は string） */
export const splitCount = (text: string): (string | number)[] =>
  text.split(/\[\[(\d+)\]\]/).map((part, i) => (i % 2 ? Number(part) : part)).filter((p) => p !== '');
