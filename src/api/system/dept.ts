import { http } from '@/utils/http/axios';

/**
 * 获取部门列表
 */
export function listDept(params) {
  return http.request({
    url: '/system/dept',
    method: 'GET',
    params,
  });
}

/**
 * 创建部门
 */
export function createDept(data: any) {
  return http.request({
    url: '/system/dept',
    method: 'POST',
    params: data,
  });
}

/**
 * 编辑部门
 */
export function editDept(data: any) {
  return http.request({
    url: '/system/dept/' + data.dept_id,
    method: 'PUT',
    params: data,
  });
}

/**
 * 获取部门
 */
export function getDept(dept_id: number) {
  return http.request({
    url: '/system/dept/' + dept_id,
    method: 'GET',
  });
}

/**
 * 删除部门
 */
export function delDept(dept_id: number) {
  return http.request({
    url: '/system/dept/' + dept_id,
    method: 'DELETE',
  });
}
