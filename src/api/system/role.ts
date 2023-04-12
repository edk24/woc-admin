import { http } from '@/utils/http/axios';

/**
 * @description: 角色列表
 */
export function getRoleList() {
  return http.request({
    url: '/system/role',
    method: 'GET',
  });
}

/**
 * @description: 获取单个角色信息
 */
export function getRole(role_id: number) {
  return http.request({
    url: '/system/role/' + role_id,
    method: 'GET',
  });
}

/**
 * 删除角色
 * @param menu_id
 */
export function delRole(roleId: string) {
  return http.request({
    url: '/system/role/' + roleId,
    method: 'DELETE',
  });
}

/**
 * 创建角色
 * @param data
 */
export function createRole(data: any) {
  return http.request({
    url: '/system/role',
    method: 'POST',
    params: data,
  });
}

/**
 * 修改角色
 * @param data
 */
export function editRole(data: any) {
  return http.request({
    url: '/system/role/' + data['role_id'],
    method: 'PUT',
    params: data,
  });
}
