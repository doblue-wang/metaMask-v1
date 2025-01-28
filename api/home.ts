import request from "@/utils/service";



//授权*
export async function fetchLogin (body: object) {
  return request("/api/DeclarationForm/SystemFundamentals/GrantAuthorization", {
    method: "POST",
    body,
  });
}
//首页
export async function fetchGetHome (params: object) {
  return request("/api/DeclarationForm/dxnews/getnews", {
    method: "GET",
    params,
  });
}

//首页进度
export async function fetchGetSpeedOfProgress (params: object) {
  return request("/api/DeclarationForm/dxnews/getspeedofprogress", {
    method: "GET",
    params,
  });
}

//我的
export async function fetchGetMine (params: object) {
  return request("/api/DeclarationForm/myinformation/GetMyInformationInfo", {
    method: "GET",
    params,
  });
}
//获取兑换比例
export async function fetchGetDiva (params: object) {
  return request("/api/DeclarationForm/myinformation/GetDiva", {
    method: "GET",
    params,
  });
}

//矿池汇总
export async function fetchGetMyMineralPoolSummary (params: object) {
  return request("/api/DeclarationForm/myinformation/GetMyMineralPoolSummary", {
    method: "GET",
    params,
  });
}

//矿池列表
export async function fetchGetMyMaxeralPoolList (params: object) {
  return request("/api/DeclarationForm/myinformation/GetMyMaxeralPoolList", {
    method: "GET",
    params,
  });
}

//分享
export async function fetchGetGetMyShare (params: object) {
  return request("/api/DeclarationForm/myinformation/GetMyShare", {
    method: "GET",
    params,
  });
}
//添加绑定关系
export async function fetchBindingRelationship (body: object) {
  return request("/api/DeclarationForm/myinformation/BindingRelationship", {
    method: "POST",
    body,
  });
}

//矿池
export async function fetchGetMiningPool (params: object) {
  return request("/api/DeclarationForm/DxMiningPool/GetMiningPool", {
    method: "GET",
    params,
  });
}
//获取量子矿机下拉
export async function fetchGetGetQuantumTypeList (params: object) {
  return request("/api/DeclarationForm/DxMiningPool/GetQuantumTypeList", {
    method: "GET",
    params,
  });
}
//DTVC兑换DTV
export async function ExchangeDtv (body: object) {
  return request("/api/DeclarationForm/DxMiningPool/ExchangeDtv", {
    method: "POST",
    body,
  });
}
//DTVC兑换DTV记录
export async function ExchangeDtvRecord (body: object) {
  return request("/api/DeclarationForm/DxMiningPool/ExchangeDtvRecord", {
    method: "POST",
    body,
  });
}
//领取收益
export async function ClaimIncome (body: object) {
  return request("/api/DeclarationForm/DxMiningPool/ClaimIncome", {
    method: "POST",
    body,
  });
}

//更改用户信息
export async function MyInformationUploadImage (body: object) {
  return request("/api/DeclarationForm/myinformation/MyInformationUploadImage", {
    method: "POST",
    body,
  });
}