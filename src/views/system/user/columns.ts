import { statusDict } from '@/dict/status';
import { h } from 'vue';
import { NImage, NTag } from 'naive-ui';
import dayjs from 'dayjs';

export const columns = [
  {
    width: 100,
    title: 'ID',
    key: 'user_id',
    align: 'center',
  },
  {
    width: 100,
    title: '头像',
    key: 'avatar',
    align: 'center',
    render(row: any) {
      return h(
        NImage,
        {
          width: 32,
          src: row.avatar || 'http://dummyimage.com/100x100',
          lazy: true,
          style: {
            backgroundColor: '#f3f3f3',
          },
        },
        {}
      );
    },
  },
  {
    title: '昵称',
    key: 'nickname',
  },
  {
    title: '手机号',
    key: 'mobile',
  },
  {
    title: '所属部门',
    key: 'dept',
  },
  {
    title: '角色',
    key: 'nickname',
  },
  {
    title: '每日领取限制',
    key: 'order_limit',
  },
  {
    width: 80,
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
    width: 170,
    title: '最后登录时间',
    key: 'lastlogintime',
    render(row) {
      if (row.createtime) {
        return dayjs(row.createtime).format('YYYY-MM-DD HH:mm');
      }
      return '-';
    },
  },
  {
    width: 170,
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
