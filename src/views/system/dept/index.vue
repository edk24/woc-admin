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
      <n-drawer-content :title="formData.dept_id ? '修改' : '新增'" closable>
        <n-form
          :model="formData"
          :rules="rules"
          ref="formRef"
          label-placement="left"
          :label-width="80"
          class="py-4"
        >
          <n-form-item label="上级部门" path="parent_id" v-if="formData.dept_id != 1">
            <n-tree-select
              v-model:value="formData.parent_id"
              :options="deptList"
              default-value="dept_id"
              label-field="dept_name"
              key-field="dept_id"
              children-field="children"
            />
          </n-form-item>
          <n-form-item label="部门名称" path="dept_name">
            <n-input placeholder="请输入部门名称" v-model:value="formData.dept_name" />
          </n-form-item>
          <n-form-item label="负责人" path="leader">
            <n-input placeholder="请输入负责人姓名" v-model:value="formData.leader" />
          </n-form-item>
          <n-form-item label="联系电话" path="mobile">
            <n-input placeholder="请输入负责人联系电话" v-model:value="formData.mobile" />
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
  import { listDept, delDept, createDept, editDept } from '@/api/system/dept';
  import { NButton, useDialog, useMessage } from 'naive-ui';
  import { statusDict } from './dict';
  import { rules } from './rules';
  const dialog = useDialog();
  const message = useMessage();

  const formRef: any = ref(null);
  // const message = useMessage();
  const actionRef = ref();

  const showModal = ref(false);
  const formBtnLoading = ref(false);

  let deptList: any = reactive([]);

  const formOrg = () => {
    return {
      dept_id: null,
      dept_name: '',
      parent_id: 0,
      status: 'normal',
      sort: '99',
      leader: '',
      mobile: '',
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
            onClick: handleAddDialog.bind(null, record.menu_id),
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
            onPositiveClick: handleDelete.bind(null, record),
            isConfirm: true,
            confirmContent: '您确定要删除吗？',
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
    const list = await listDept({});
    deptList = JSON.parse(JSON.stringify(list));
    // expandedDeptIds.values = list.map((r: any) => r.dept_id);
    // console.log(
    //   'expandedDeptIds :>> ',
    //   deptList.map((r: any) => r.dept_id)
    // );
    // expandedDeptIds.value = list.map((r: any) => r.dept_id);
    // console.log(
    //   'list.map((r: any) => r.dept_id) :>> ',
    //   list.map((r) => r.dept_id)
    // );
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

      const handleFunc = formData.dept_id ? editDept : createDept;
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
    delDept(record.menu_id)
      .then(() => {
        message.success('删除成功');
        refreshData();
      })
      .catch((r) => {
        message.error(r.message);
      });
  }
</script>

<style lang="less" scoped></style>
