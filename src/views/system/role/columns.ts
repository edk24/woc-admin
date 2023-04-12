import { dataScopeDict, statusDict } from './dict';
import { h } from 'vue';
import { NTag } from 'naive-ui';
import dayjs from 'dayjs';

export const columns = [
  {
    title: 'ID',
    key: 'role_id',
  },
  {
    title: '角色名称',
    key: 'role_name',
  },
  {
    title: '角色标识',
    key: 'role_key',
  },
  {
    title: '数据范围',
    key: 'data_scope',
    render(row) {
      const item = dataScopeDict.find((r) => r.value == row.data_scope);
      return h(
        NTag,
        {
          type: item?.type,
          size: 'small',
        },
        {
          default: () => item?.label,
        }
      );
    },
  },
  {
    title: '排序编号',
    key: 'sort',
  },
  {
    title: '状态',
    key: 'status',
    render(row) {
      const item = statusDict.find((r) => r.value == row.status);
      return h(
        NTag,
        {
          type: item?.type,
          size: 'small',
        },
        {
          default: () => item?.label,
        }
      );
    },
  },
  {
    title: '创建时间',
    key: 'createtime',
    render(row) {
      if (row.createtime) {
        return dayjs(row.createtime).format('YYYY-MM-DD HH:mm');
      }
      return '-';
    },
  },
];
