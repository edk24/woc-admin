<template>
  <n-card :bordered="false" class="proCard">
    <BasicTable
      :columns="columns"
      :request="loadDataTable"
      :row-key="(row) => row.menu_id"
      ref="actionRef"
      :actionColumn="actionColumn"
      :scroll-x="1090"
      :style="{ height: `800px` }"
    >
      <template #tableTitle>
        <n-button type="primary" @click="handleAddDialog(0)">
          <template #icon>
            <n-icon>
              <PlusOutlined />
            </n-icon>
          </template>
          新增
        </n-button>
      </template>
    </BasicTable>

    <n-drawer
      v-model:show="showModal"
      :show-icon="false"
      :auto-focus="false"
      placement="right"
      width="500px"
      :on-after-leave="dialogClosed"
    >
      <n-drawer-content :title="formData.menu_id ? '修改' : '新增'" closable>
        <n-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="上级菜单" path="parent_id">
            <n-tree-select
              v-model:value="formData.parent_id"
              :options="menuList"
              default-value="menu_id"
              label-field="menu_name"
              key-field="menu_id"
              children-field="children"
            />
          </n-form-item>
          <n-form-item label="菜单类型" path="menu_type">
            <n-radio-group v-model:value="formData.menu_type">
              <n-space>
                <n-radio v-for="item in typeDict" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
          <n-form-item label="菜单名称" path="menu_name">
            <n-input placeholder="请输入菜单名称" v-model:value="formData.menu_name" />
          </n-form-item>
          <n-form-item v-if="formData.menu_type != 'P'" label="路由" path="path">
            <n-input placeholder="请输入路由" v-model:value="formData.path" />
          </n-form-item>
          <template v-if="formData.menu_type == 'M'">
            <n-form-item label="组件" path="component">
              <n-input placeholder="请输入组件路径" v-model:value="formData.component" />
            </n-form-item>
            <n-form-item label="查询参数" path="query_params">
              <n-input placeholder="请输入查询参数" v-model:value="formData.query_params" />
            </n-form-item>
            <n-form-item label="是否缓存" path="is_cache">
              <n-radio-group v-model:value="formData.is_cache">
                <n-space>
                  <n-radio v-for="item in cacheDict" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
          </template>
          <template v-if="formData.menu_type != 'P'">
            <n-form-item label="图标" path="icon">
              <n-input placeholder="请输入查询参数" v-model:value="formData.icon" />
            </n-form-item>
          </template>
          <template v-if="formData.menu_type == 'P'">
            <n-form-item label="权限标识" path="perms">
              <n-input placeholder="请输入权限标识" v-model:value="formData.perms" />
            </n-form-item>
          </template>
          <n-form-item label="排序权重" path="sort">
            <n-input placeholder="请输入排序权重" v-model:value="formData.sort" />
          </n-form-item>
          <n-form-item label="状态" path="status">
            <n-radio-group v-model:value="formData.status">
              <n-space>
                <n-radio v-for="item in statusDict" :key="item.value" :value="item.value">
                  {{ item.label }}
                </n-radio>
              </n-space>
            </n-radio-group>
          </n-form-item>
        </n-form>

        <template #footer>
          <n-space>
            <n-button type="tertiary" @click="showModal = false">取消</n-button>
            <n-button type="info" :loading="formBtnLoading" @click="handleSubmit">
              确认提交
            </n-button>
          </n-space>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-card>
</template>

<script lang="ts" setup>
  import { h, reactive, ref } from 'vue';
  // import { useMessage } from 'naive-ui';
  import { BasicTable, TableAction } from '@/components/Table';
  import { columns } from './columns';
  import { PlusOutlined } from '@vicons/antd';
  import { getMenuList, delMenu, createMenu, editMenu } from '@/api/system/menu';
  import { NButton, useDialog, useMessage } from 'naive-ui';
  import { typeDict, statusDict, cacheDict } from './dict';
  import { rules } from './rules';
  const dialog = useDialog();
  const message = useMessage();

  const formRef: any = ref(null);
  // const message = useMessage();
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);

  let menuList: any = reactive([]);

  const formOrg = () => {
    return {
      menu_id: null,
      menu_name: '',
      menu_type: 'D',
      parent_id: 0,
      sort: '99',
      path: '',
      component: '',
      query_params: '',
      is_frame: 0,
      is_cache: 1,
      status: 'normal',
      visible: 1,
      perms: '',
      icon: '',
    };
  };
  let formData = reactive(formOrg());

  const actionColumn = reactive({
    width: 220,
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      console.log('object :>> ', record);
      return h(TableAction as any, {
        style: 'button',
        actions: [
          {
            label: '新增',
            secondary: true,
            // type: 'info',
            onClick: handleAddDialog.bind(null, record.menu_id),
            // auth: ['basic_list'],
          },
          {
            label: '修改',
            secondary: true,
            type: 'info',
            onClick: handleEditDialog.bind(null, record),
            // auth: ['basic_list'],
          },
          {
            label: '删除',
            secondary: true,
            type: 'error',
            onClick: handleDelete.bind(null, record),
            // onClick: handleMenuAuth.bind(null, record),
            // auth: ['basic_list'],
          },
        ],
      });
    },
  });

  // 展示创建表单
  function handleAddDialog(parent_id: number) {
    showModal.value = true;
    formData.parent_id = parent_id;
  }

  // 展示修改表单
  function handleEditDialog(record: any) {
    showModal.value = true;
    Object.assign(formData, record);
  }

  // 表单关闭时清空数据
  function dialogClosed() {
    Object.assign(formData, formOrg());
  }

  // 加载菜单数据
  const loadDataTable = async () => {
    const list = await getMenuList();
    menuList = JSON.parse(JSON.stringify(list));
    menuList.unshift({
      menu_id: 0,
      menu_name: '无',
    });
    return {
      list: list,
      total: list.length,
    };
  };

  // 刷新表格数据
  function refreshData() {
    actionRef.value.reload();
  }

  // 处理提交
  function handleSubmit() {
    formBtnLoading.value = true;
    formRef.value.validate((errors: any) => {
      if (errors) {
        formBtnLoading.value = false;
        return;
      }

      const handleFunc = formData.menu_id ? editMenu : createMenu;
      handleFunc(formData)
        .then(() => {
          message.success('操作成功');
          refreshData();
          showModal.value = false;
        })
        .catch((err) => {
          message.error(err.message);
        })
        .finally(() => {
          formBtnLoading.value = false;
        });
    });
  }

  // 处理删除
  function handleDelete(record: Recordable) {
    dialog.warning({
      title: '提示',
      content: '确定删除吗?',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        delMenu(record.menu_id)
          .then(() => {
            message.success('删除成功');
            refreshData();
          })
          .catch((r) => {
            message.error(r.message);
          });
      },
    });
  }
</script>

<style lang="less" scoped></style>
