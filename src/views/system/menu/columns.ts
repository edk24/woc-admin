import { NTag } from 'naive-ui';
import dayjs from 'dayjs';
import { h } from 'vue';
import { typeDict } from './dict';
export const columns = [
  {
    title: '菜单名称',
    key: 'menu_name',
  },
  {
    title: '类型',
    key: 'menu_type',
    width: 100,
    align: 'center',
    render(row) {
      const typeItem = typeDict.find((r) => r.value == row.menu_type);
      return h(
        NTag,
        {
          type: typeItem?.type,
          size: 'small',
        },
        {
          default: () => typeItem?.label,
        }
      );
    },
  },
  {
    title: '路径',
    key: 'path',
    width: 160,
  },
  {
    title: '权限标识',
    key: 'perms',
    width: 100,
    align: 'center',
    render(row) {
      if (row.menu_type != 'P') {
        return '-';
      }

      return h(
        NTag,
        {
          size: 'small',
        },
        {
          default: () => row.perms,
        }
      );
    },
  },
  // TODO 是否显示
  // {
  //   title: '显示',
  //   key: 'visible',
  //   width: 100,
  //   align: 'center',
  //   render(row) {
  //     return h(
  //       NSwitch,
  //       {
  //         size: 'small',
  //         uncheckedValue: 0,
  //         checkedValue: 1,
  //         value: row.visible,
  //       },
  //       {
  //         onUpdate: (value: number) => {
  //           console.log('value :>> ', value);
  //         },
  //       }
  //     );
  //   },
  // },
  {
    title: '排序',
    key: 'sort',
    width: 160,
    align: 'center',
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
