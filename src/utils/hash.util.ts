import md5 from 'md5';
export const md5Hex = (buf: Buffer | string) => md5(buf as any);
