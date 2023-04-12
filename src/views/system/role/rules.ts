import { FormRules } from 'naive-ui';

export const rules: FormRules = {
  menu_name: {
    required: true,
    trigger: ['blur', 'input'],
    max: 20,
    message: '请输入菜单名称',
  },
  // path: {
  //   required: true,
  //   trigger: ['blur', 'input'],
  //   message: '请输入路由地址',
  // },
  // component: {
  //   required: true,
  //   trigger: ['blur', 'change'],
  //   message: '请输入组件路径',
  // },
  // perms: {
  //   required: true,
  //   trigger: ['blur', 'change'],
  //   max: 20,
  //   min: 3,
  //   message: '请输入权限标识',
  // },
};
