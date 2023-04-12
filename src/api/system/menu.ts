import { http } from '@/utils/http/axios';

/**
 * 生成动态路由
 */
export function adminMenus() {
  return http.request({
    url: '/system/menu/router',
    method: 'GET',
  });
}

/**
 * 获取树结构
 */
export function getTree() {
  return http.request({
    url: '/system/menu/tree',
    method: 'GET',
  });
}

/**
 * 获取 tree 菜单列表
 * @param params
 */
export function getMenuList(params?) {
  return http.request({
    url: '/system/menu',
    method: 'GET',
    params,
  });
}

/**
 * 删除菜单
 * @param menu_id
 */
export function delMenu(menuId: string) {
  return http.request({
    url: '/system/menu/' + menuId,
    method: 'DELETE',
  });
}

/**
 * 创建菜单
 * @param data
 */
export function createMenu(data: any) {
  return http.request({
    url: '/system/menu',
    method: 'POST',
    params: data,
  });
}

/**
 * 修改菜单
 * @param data
 */
export function editMenu(data: any) {
  return http.request({
    url: '/system/menu/' + data['menu_id'],
    method: 'PUT',
    params: data,
  });
}
