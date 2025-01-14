import request from "@/utils/service";


// export async function fetchShipinhaoPay(body: object) {
//     return request("/api/DeclarationForm/SystemFundamentals/GrantAuthorization", {
//       method: "POST",
//       body,
//     });
//   }
  //授权*
  export async function fetchLogin(body: object) {
    return request("/api/DeclarationForm/SystemFundamentals/GrantAuthorization", {
      method: "POST",
      body,
    });
  }
