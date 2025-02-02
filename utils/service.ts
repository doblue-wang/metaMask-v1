import { Toast } from "antd-mobile";
import hash from "hash.js";
import { stringify } from "qs";
import router from "next/router";

import { getCookie } from "./utils";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。",
};

// 拷贝 response
const copyResponse = (response: Response) => response.clone().json();

const checkStatus = (response: Response, newOptions: any) => {
  const { status } = response;
  const { showMessage = true } = newOptions;

  // 正确status，判断code!==0 报错提示
  if (status >= 200 && status < 300) {
    copyResponse(response).then((res) => {
    });

    return response;
  }
  // 报错status，处理报错弹窗
  else if (status < 500 && status != 401 && status != 404) {
    copyResponse(response).then((res) => {
      if (res.msg && showMessage)
        Toast.show({ icon: "fail", content: res.msg });
    });
  }

  // 'POST', 'PUT', 'DELETE'方法，成功通用弹窗
  if (["POST", "PUT", "DELETE"].includes(newOptions.method) && status === 200) {
    copyResponse(response).then((res: any) => {
      // if (res.code === 0 && res.msg && showMessage) Toast.show({ icon: 'success', content: res.msg });
    });
  }
  throw response;
};
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url: string, option: any) {
  if (process.env.NODE_ENV === "production") {
    url = "http://154.19.85.158:85" + url;
  }

  const options = {
    ...option,
  };
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : "");
  const hashcode = hash.sha256().update(fingerprint).digest("hex");
  const defaultOptions = {
    // credentials: 'include',
  };
  const newOptions = {
    ...defaultOptions,
    ...options,
    headers: { Authorization: `${getCookie('token')}` },
  };

  if (["POST", "PUT", "DELETE"].includes(newOptions.method)) {
    const { body } = newOptions;
    if (!(body instanceof FormData)) {
      newOptions.headers = {
        "Content-Type": "application/json; charset=utf-8",
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    }
    else {
      newOptions.headers = {
        Accept: "application/json",
        ...newOptions.headers,
      };
    }
  }

  // 拼接GET请求参数
  if (
    newOptions.method === "GET" &&
    Object.keys(newOptions.params).length > 0
  ) {
    url = `${url}?${stringify(newOptions.params)}`;
  }

  const expirys = options.expirys && 60;
  if (options.expirys !== false) {
    const cached = sessionStorage.getItem(hashcode);
    const whenCached = sessionStorage.getItem(`${hashcode}:timestamp`);
    if (cached !== null && whenCached !== null) {
      // @ts-ignore
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      sessionStorage.removeItem(hashcode);
      sessionStorage.removeItem(`${hashcode}:timestamp`);
    }
  }

  return (
    fetch(url, newOptions)
      .then((response) => checkStatus(response, newOptions))
      .then((response) => {
        return response.json();
      })
      .catch((response: any) => {
        const { status } = response;
        // 无权限访问
        if (status === 401) {
          // router.push("/user/wx-login");
        }
        else if (status === 403) {
          router.push("/user/wx-login");
        } else if (status <= 504 && status >= 500) {
          Toast.show({ icon: "fail", content: codeMessage["500"] });
        } else if (status >= 404 && status < 422) {
          Toast.show({ icon: "fail", content: codeMessage["404"] });
        }
        return response.json();
      })
  );
}