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
        <n-button type="primary" @click="handleAddDialog()">
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
      <n-drawer-content :title="formData.role_id ? '修改' : '新增'" closable>
        <n-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="角色名称" path="role_name">
            <n-input placeholder="请输入角色名称" v-model:value="formData.role_name" />
          </n-form-item>
          <n-form-item label="角色标识" path="role_key">
            <n-input placeholder="请输入角色标识" v-model:value="formData.role_key" />
          </n-form-item>
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
          <n-form-item label="数据权限" path="data_scope">
            <n-select v-model:value="formData.data_scope" :options="dataScopeDict" />
          </n-form-item>
          <n-form-item label="菜单权限" path="menu">
            <n-tree
              block-line
              :data="menuTree"
              ref="menuRef"
              checkable
              expand-on-click
              selectable
              key-field="menu_id"
              label-field="menu_name"
              children-field="children"
              :default-checked-keys="formData.menus"
            />
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
  import { PlusOutlined } from '@vicons/antd';
  import { BasicTable, TableAction } from '@/components/Table';
  import { reactive, ref, h } from 'vue';
  import { useMessage, useDialog } from 'naive-ui';
  import { getRoleList, delRole, createRole, editRole, getRole } from '@/api/system/role';
  import { getTree } from '@/api/system/menu';
  import { columns } from './columns';
  import { statusDict, dataScopeDict } from './dict';
  import { rules } from './rules';
  const formRef: any = ref(null);
  const actionRef = ref();
  const menuRef = ref();

  const message = useMessage();
  const dialog = useDialog();

  const showModal = ref(false);
  const formBtnLoading = ref(false);

  const menuTree = ref([]);

  const formOrg = () => {
    return {
      role_id: null,
      role_name: '',
      role_key: '',
      data_scope: 5,
      sort: '99',
      status: 'normal',
      menus: [],
    };
  };
  let formData = reactive(formOrg());

  const actionColumn = reactive({
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record) {
      return h(TableAction, {
        style: 'button',
        actions: [
          // {
          //   label: '菜单权限',
          //   onClick: handleMenuAuth.bind(null, record),
          //   // 根据业务控制是否显示 isShow 和 auth 是并且关系
          //   ifShow: () => {
          //     return true;
          //   },
          //   // 根据权限控制是否显示: 有权限，会显示，支持多个
          //   auth: ['basic_list'],
          // },
          {
            label: '编辑',
            onClick: handleEditDialog.bind(null, record),
          },
          {
            label: '删除',
            onClick: handleDelete.bind(null, record),
          },
        ],
      });
    },
  });

  // 加载角色数据
  async function loadDataTable() {
    menuTree.value = await getTree();
    return await getRoleList();
  }

  // 处理打开添加弹出层
  function handleAddDialog() {
    showModal.value = true;
  }

  // 展示修改表单
  async function handleEditDialog(record: any) {
    const data = await getRole(record.role_id);
    Object.assign(formData, data);

    showModal.value = true;
  }

  // 表单关闭时清空数据
  function dialogClosed() {
    Object.assign(formData, formOrg());
  }

  // 处理提交
  function handleSubmit() {
    formBtnLoading.value = true;
    formRef.value.validate((errors: any) => {
      if (errors) {
        formBtnLoading.value = false;
        return;
      }

      const handleFunc = formData.role_id ? editRole : createRole;
      handleFunc(Object.assign({}, formData, { menus: menuRef.value.getCheckedData().keys }))
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

  // 刷新表格数据
  function refreshData() {
    actionRef.value.reload();
  }

  // 处理删除
  function handleDelete(record: Recordable) {
    dialog.warning({
      title: '提示',
      content: '确定删除吗?',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        delRole(record.role_id)
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
