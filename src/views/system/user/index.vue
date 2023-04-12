<template>
  <n-grid class="mt-4" cols="1 s:1 m:1 l:5 xl:5 2xl:5" responsive="screen" :x-gap="12">
    <n-gi span="1">
      <template #header>
        <n-space>
          <!-- <n-button type="info" ghost icon-placement="left" @click="packHandle">
            全部{{ expandedKeys.length ? '收起' : '展开' }}
            <template #icon>
              <div class="flex items-center">
                <n-icon size="14">
                  <AlignLeftOutlined />
                </n-icon>
              </div>
            </template>
          </n-button> -->
        </n-space>
      </template>
      <n-card :bordered="false" size="small">
        <div class="w-full menu">
          <n-input type="input" v-model:value="pattern" placeholder="输入部门名称搜索">
            <template #suffix>
              <n-icon size="18" class="cursor-pointer">
                <SearchOutlined />
              </n-icon>
            </template>
          </n-input>
          <div class="py-3 menu-list">
            <template v-if="loading">
              <div class="flex items-center justify-center py-4">
                <n-spin size="medium" />
              </div>
            </template>
            <template v-else>
              <n-tree
                block-line
                cascade
                :virtual-scroll="true"
                :pattern="pattern"
                :data="deptTree"
                v-model:value="queryParams.dept_id"
                key-field="dept_id"
                label-field="dept_name"
                style="max-height: 650px; overflow: hidden"
                :on-update:selected-keys="handleDeptFilter"
              />
            </template>
          </div>
        </div>
      </n-card>
    </n-gi>
    <n-gi span="4">
      <n-card :bordered="false" size="small">
        <BasicTable
          :columns="columns"
          :request="loadDataTable"
          :row-key="(row) => row.user_id"
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
      </n-card>

      <n-drawer
        v-model:show="showModal"
        :show-icon="false"
        :auto-focus="false"
        placement="right"
        width="500px"
        :on-after-leave="dialogClosed"
      >
        <n-drawer-content :title="formData.user_id ? '修改' : '新增'" closable>
          <n-form
            :model="formData"
            :rules="rules"
            ref="formRef"
            label-placement="left"
            :label-width="80"
            class="py-4"
          >
            <n-form-item label="所属部门" path="dept_id">
              <n-tree-select
                v-model:value="formData.dept_id"
                :options="deptTree"
                default-value="dept_id"
                label-field="dept_name"
                key-field="dept_id"
                children-field="children"
              />
            </n-form-item>
            <n-form-item label="角色" path="role_id">
              <n-select
                v-model:value="formData.role_id"
                label-field="role_name"
                value-field="role_id"
                :options="roleList"
              />
            </n-form-item>
            <n-form-item label="昵称" path="nickname">
              <n-input placeholder="请输入昵称" v-model:value="formData.nickname" />
            </n-form-item>
            <n-form-item label="手机号" path="mobile">
              <n-input placeholder="请输入手机号" v-model:value="formData.mobile" />
            </n-form-item>
            <n-form-item label="领取限制" path="order_limit">
              <n-input
                placeholder="请输入订单领取限制"
                type="number"
                v-model:value="formData.order_limit"
              />
            </n-form-item>
            <n-form-item label="密码" path="password">
              <n-input placeholder="需要重置密码时填写" v-model:value="formData.password" />
            </n-form-item>
            <n-form-item label="性别" path="gender">
              <n-radio-group v-model:value="formData.gender">
                <n-space>
                  <n-radio v-for="item in genderDict" :key="item.value" :value="item.value">
                    {{ item.label }}
                  </n-radio>
                </n-space>
              </n-radio-group>
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
    </n-gi>
  </n-grid>
</template>

<script lang="ts" setup>
  import { PlusOutlined } from '@vicons/antd';
  import { ref, reactive, h } from 'vue';
  import { listDept } from '@/api/system/dept';
  import { listUser, getUser, delUser, createUser, editUser } from '@/api/system/user';
  import { columns } from './columns';
  import { useMessage, useDialog } from 'naive-ui';
  import { TableAction, BasicTable } from '@/components/Table';
  import { rules } from './rules';
  import { statusDict } from '@/dict/status';
  import { genderDict } from '@/dict/gender';
  import { getRoleList } from '@/api/system/role';

  const message = useMessage();
  const dialog = useDialog();
  const loading = ref(true);
  const pattern = ref('');
  const actionRef = ref();
  const showModal = ref(false);
  const formBtnLoading = ref(false);
  const formRef: any = ref(null);
  const deptTree: any = ref([]);
  const roleList: any = ref([]); // 角色列表

  const queryParams = ref({
    dept_id: null,
  });

  // const modelRef: {
  //   user_id: number;
  //   nickname: string;
  //   password?: string;
  //   mobile: string;
  //   leader: string;
  //   dept_id: number;
  //   role_id: number;
  //   status: string;
  //   gender: string;
  // } = reactive();

  const formOrg = () => {
    return {
      user_id: null,
      nickname: '',
      password: '',
      mobile: '',
      leader: '',
      dept_id: null,
      role_id: null,
      status: 'normal',
      gender: 'male',
      order_limit: 0,
    };
  };
  let formData = reactive(formOrg());

  const actionColumn = reactive({
    title: '操作',
    key: 'action',
    fixed: 'right',
    render(record: object) {
      return h(TableAction, {
        style: 'button',
        actions: [
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

  // 加载部门数据
  function loadDeptTree() {
    loading.value = true;
    listDept({})
      .then((data) => {
        deptTree.value = data;
      })
      .catch((err) => {
        message.warning(err.message);
      })
      .finally(() => {
        loading.value = false;
      });
  }
  loadDeptTree();

  // 加载角色列表
  function loadRoleTree() {
    getRoleList()
      .then((res) => {
        roleList.value = res.list;
      })
      .catch((err) => {
        message.warning(err.message);
      });
  }
  loadRoleTree();

  // 加载用户数据
  async function loadDataTable(pageInfo) {
    console.log('queryParams.value :>> ', queryParams.value);
    return await listUser({ ...pageInfo, ...queryParams.value });
  }

  // 部门筛选
  function handleDeptFilter(selected) {
    queryParams.value.dept_id = selected[0];
    refreshData();
  }

  // 刷新表格数据
  function refreshData() {
    actionRef.value.reload();
  }

  // 处理新增模态框
  function handleAddDialog() {
    showModal.value = true;
  }

  // 展示修改表单
  async function handleEditDialog(record: any) {
    const data = await getUser(record.user_id);
    Object.assign(formData, data);

    showModal.value = true;
  }

  // 表单关闭时清空数据
  function dialogClosed() {
    Object.assign(formData, formOrg());
  }

  // 处理删除
  function handleDelete(record: Recordable) {
    dialog.warning({
      title: '提示',
      content: '确定删除吗?',
      positiveText: '确定',
      negativeText: '取消',
      onPositiveClick: () => {
        delUser(record.user_id)
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

  // 处理提交
  function handleSubmit() {
    formBtnLoading.value = true;
    formRef.value.validate((errors: any) => {
      if (errors) {
        formBtnLoading.value = false;
        return;
      }

      const handleFunc = formData.user_id ? editUser : createUser;
      let data = Object.assign({}, formData);
      if (!data.password) {
        delete data.password;
      }
      handleFunc(data)
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

  // :expandedKeys="expandedKeys"
  //               @update:selected-keys="selectedTree"
  //               @update:expanded-keys="onExpandedKeys"
</script>
