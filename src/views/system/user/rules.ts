import { FormRules } from 'naive-ui';

export const rules: FormRules = {
  mobile: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户名',
  },
  role_id: {
    required: true,
    message: '请选择用户角色',
  },
  dept_id: {
    required: true,
    message: '请选择用户所属部门',
  },
  nickname: {
    required: true,
    trigger: ['blur', 'input'],
    message: '请输入用户昵称',
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
