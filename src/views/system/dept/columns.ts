import { NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { h } from 'vue';
import { statusDict } from './dict';

export const columns = [
  {
    title: '部门名称',
    key: 'dept_name',
  },
  {
    title: '负责人',
    key: 'leader',
    width: 100,
    align: 'center',
  },
  {
    title: '联系电话',
    key: 'mobile',
    width: 160,
  },
  {
    title: '排序',
    key: 'sort',
    width: 160,
    align: 'center',
  },
  {
    title: '状态',
    key: 'status',
    width: 100,
    align: 'center',
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
    width: 200,
    render(row) {
      if (row.createtime) {
        return dayjs(row.createtime).format('YYYY-MM-DD HH:mm');
      }
      return '-';
    },
  },
];
