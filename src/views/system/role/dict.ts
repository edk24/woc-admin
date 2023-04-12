// 数据范围 (1=全部数据范围,2=自定数据权限,3=本部门数据权限,4=本部门及以下数据权限)
export const dataScopeDict = [
  {
    label: '全部数据',
    value: 1,
    type: 'default',
  },
  {
    label: '自定数据',
    value: 2,
    type: 'warning',
  },
  {
    label: '本部门数据',
    value: 3,
    type: 'success',
  },
  {
    label: '本部门及下级部门',
    value: 4,
    type: 'info',
  },
  {
    label: '仅自己',
    value: 5,
    type: 'default',
  },
];

// 状态字典
export const statusDict = [
  {
    label: '正常',
    value: 'normal',
    type: 'info',
  },
  {
    label: '禁用',
    value: 'disabled',
    type: 'error',
  },
];
