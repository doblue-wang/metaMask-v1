import request from "@/utils/service";



  //授权*
  export async function fetchLogin(body: object) {
    return request("/api/DeclarationForm/SystemFundamentals/GrantAuthorization", {
      method: "POST",
      body,
    });
  }
  //首页
  export async function fetchGetHome(params: object) {
    return request("/api/DeclarationForm/dxnews/getnews", {
      method: "GET",
      params,
    });
  }

    //首页进度
    export async function fetchGetSpeedOfProgress(params: object) {
      return request("/api/DeclarationForm/dxnews/getspeedofprogress", {
        method: "GET",
        params,
      });
    }