import { http } from '@/utils/http/axios';

export interface BasicResponseModel<T = any> {
  code: number;
  message: string;
  data: T;
}

export interface BasicPageParams {
  pageNumber: number;
  pageSize: number;
  total: number;
}

/**
 * @description: 获取用户信息
 */
export function getUserInfo() {
  return http.request({
    url: '/system/user/session',
    method: 'get',
  });
}

/**
 * @description: 用户登录
 */
export function login(params) {
  return http.request<BasicResponseModel>(
    {
      url: '/system/user/login',
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户修改密码
 */
export function changePassword(params, uid) {
  return http.request(
    {
      url: `/user/u${uid}/changepw`,
      method: 'POST',
      params,
    },
    {
      isTransformResponse: false,
    }
  );
}

/**
 * @description: 用户登出
 */
export function logout(params) {
  return http.request({
    url: '/login/logout',
    method: 'POST',
    params,
  });
}

// 创建用户
export function createUser(data: any) {
  return http.request({
    url: '/system/user',
    method: 'POST',
    data,
  });
}

// 修改用户
export function editUser(data: any) {
  return http.request({
    url: '/system/user/' + data.user_id,
    method: 'PUT',
    data,
  });
}

// 删除用户
export function delUser(user_id: number) {
  return http.request({
    url: '/system/user/' + user_id,
    method: 'DELETE',
  });
}

// 查询用户
export function getUser(user_id: number) {
  return http.request({
    url: '/system/user/' + user_id,
    method: 'GET',
  });
}

// 查询用户
export function listUser(params: object) {
  return http.request({
    url: '/system/user',
    method: 'GET',
    params,
  });
}
