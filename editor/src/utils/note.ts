type Level = {
  name: string;
  border: string;
  background: string;
};

export const levels: { [type: string]: Level } = {
  default: { name: '默认', border: '#777', background: '#f7f7f7' },
  primary: { name: '主要', border: '#6f42c1', background: '#f5f0fa' },
  success: { name: '成功', border: '#5cb85c', background: '#eff8f0' },
  info: { name: '提示', border: '#428bca', background: '#eef7fa' },
  warning: { name: '注意', border: '#f0ad4e', background: '#fdf8ea' },
  danger: { name: '危险', border: '#d9534f', background: '#fcf1f2' },
};
