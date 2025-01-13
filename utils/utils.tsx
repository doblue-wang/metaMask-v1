import moment from 'dayjs';

// 当前浏览器域名截取
export const getDomain = () => {
  const DomainRegular = [/(.+\.)?(([^.]+)\.(com.cn|net.cn|org.cn|gov.cn))/, /(.+\.)?(([^.]+)\.([^.]+))/];
  const domain = globalThis.location.host;
  if (domain.indexOf('localhost') >= 0) {
    return 'localhost';
  }
  if (domain.indexOf('127.0.0.1') >= 0) {
    return '127.0.0.1';
  }
  const ret = DomainRegular.map((r) => domain.match(r)).filter((r) => r !== null)[0];

  return ret?.[2] || '';
};

//设置cookie
export const setCookie = (c_name: string, value: string, addTime?: number) => {
  const domain = getDomain();
  document.cookie = `${c_name}=${escape(value)};expires=${moment()
    .add(addTime as number, 'days')
    .toString()};domain=${domain};path=/`;
};

// 获取cookie
export const getCookie = (c_name: string): string => {
  var c_start, c_end;
  if (document.cookie.length > 0) {
    c_start = document.cookie.indexOf(c_name + '=');
    if (c_start !== -1) {
      c_start = c_start + c_name.length + 1;
      c_end = document.cookie.indexOf(';', c_start);
      if (c_end === -1) c_end = document.cookie.length;
      return unescape(document.cookie.substring(c_start, c_end));
    }
  }
  return '';
};

// 删除cookie
export const deleteCookie = (name: string) => {
  const domain = getDomain();
  const cval = getCookie(name);
  if (cval != null) {
    document.cookie = `${name}=${''};expires=${moment().toString()};domain=${domain};path=/`;
  }
};

/**
 * @description 判断data的值是否为''、undefined、长度为0
 * @param {Object,Number,String} data
 */
export const isEmpty = (data: any) => {
  if (data === '' || data === undefined || data === null || data.length === 0) {
    return true;
  }
  return false;
};

/**
 * @description 判断json的值是否为''、undefined、null，并筛选数据
 * @param {Object} json json对象
 */
export const filterKeys = (json: any) => {
  const result: any = {};
  for (const key in json) {
    if (json[key] !== '' && json[key] !== null && json[key] !== undefined) {
      result[key] = json[key];
    }
  }
  return result;
};
