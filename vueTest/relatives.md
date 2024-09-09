<template>
  <div class="main-show">
    <el-drawer
      v-model="relativesDrawer"
      :id="selectedId"
      direction="rtl"
      size="75%"
      :title="`會員編號 ${selectedId} - 家庭資料`"
      @opened="handleMemberShow"
      class="show-drawer"
    >
      <div
        class="app-container"
        v-loading.fullscreen.lock="updataLoading"
        element-loading-text="資料上傳中，請稍等"
      >
        <el-form
          :model="updataData"
          ref="updataData"
          v-loading="loading"
          element-loading-text="資料載入中，請稍等"
        >
          <el-row :gutter="24" justify="start">
            <el-col :span="6">
              <el-form-item
                label="會員編號"
                label-width="100"
                prop="cus_no"
                :rules="[{ required: true, message: '必填欄位請輸入資料', trigger: 'blur' }]"
              >
                <el-input v-model="updataData.cus_no" autocomplete="off" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="姓名"
                label-width="100"
                prop="name"
                :rules="[{ required: true, message: '必填欄位請輸入資料', trigger: 'blur' }]"
              >
                <el-input
                  v-model="updataData.name"
                  placeholder="請輸入姓名"
                  autocomplete="off"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                label="有效寶寶"
                label-width="100"
                prop="cus_no"
                :rules="[{ required: false, message: '必填欄位請輸入資料', trigger: 'blur' }]"
              >
                <el-input
                  v-model="updataData.relatives_effective_qty"
                  autocomplete="off"
                  disabled
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <div class="relatives-title">
            <h3>會員親屬資料</h3>
            <span>(單一親屬欄位需填寫完整)</span>
          </div>
          <el-row
            :gutter="24"
            justify="start"
            v-for="(value, index) in updataData.relatives"
            :key="value.key"
          >
            <el-col :span="6">
              <el-form-item
                :label="`親屬姓名 - ${index + 1}`"
                label-width="100"
                :prop="'relatives.' + index + '.name'"
                :rules="[
                  {
                    required:
                      (value.name !== null && value.name !== '') ||
                      (value.birthday !== null && value.birthday !== '') ||
                      (value.idno !== null && value.idno !== '')
                        ? true
                        : false,
                    message: '單一親屬欄位需填寫完整',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-input
                  v-model="value.name"
                  autocomplete="off"
                  placeholder="請輸入親屬姓名"
                  @change="handleRelativesChange(value, index)"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :label="`生日 - ${index + 1}`"
                label-width="100"
                :prop="'relatives.' + index + '.birthday'"
                :rules="[
                  {
                    required:
                      (value.name !== null && value.name !== '') ||
                      (value.birthday !== null && value.birthday !== '') ||
                      (value.idno !== null && value.idno !== '')
                        ? true
                        : false,
                    message: '單一親屬欄位需填寫完整',
                    trigger: 'blur'
                  }
                ]"
              >
                <el-date-picker
                  style="width: 100%"
                  v-model="value.birthday"
                  type="date"
                  placeholder="請輸入生日"
                  value-format="YYYY-MM-DD"
                  @change="handleRelativesChange(value, index)"
                  :disabled="updatePermission"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item
                :label="`身分證字號 - ${index + 1}`"
                label-width="100"
                :prop="'relatives.' + index + '.idno'"
                :rules="[
                  {
                    required:
                      (value.name !== null && value.name !== '') ||
                      (value.birthday !== null && value.birthday !== '') ||
                      (value.idno !== null && value.idno !== '')
                        ? true
                        : false,
                    message: '單一親屬欄位需填寫完整',
                    trigger: 'blur'
                  },
                  { validator: validateRelativesIdno, trigger: 'blur' }
                ]"
              >
                <el-input
                  v-model="value.idno"
                  autocomplete="off"
                  placeholder="請輸入身分證字號"
                  @change="handleRelativesChange(value, index)"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="24" justify="end" class="main-button">
            <div class="button-bottom">
              <el-button
                type="primary"
                @click="actionUpdata"
                style="margin: 5px"
                :disabled="updatePermission"
                >確認修改</el-button
              >
              <el-button @click="closeDrawer" style="margin: 5px" title="返回會員查詢"
                >取消</el-button
              >
            </div>
          </el-row>
        </el-form>
      </div>
    </el-drawer>
    <!-- 輸入員工編號 -->
    <el-dialog
      v-model="employeeDisable"
      title="請輸入員工編號"
      width="450px"
      class="select-member-dialog"
      :before-close="dialogClose"
    >
      <el-form @submit.prevent>
        <el-form-item label="員工編號" label-width="100">
          <el-input
            v-model="updataData.update_emp"
            placeholder="請輸入員工編號"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button type="primary" @click="handleActionEmployee()"> 確認 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { memberDetailed, memberUpdate } from '@/api/functions/customer/search'

export default {
  name: 'MemberRelatives',

  props: {
    //父傳子
    show: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: '',
      required: true
    },
    creator: {
      type: String,
      default: '',
      required: true
    }
  },

  data() {
    return {
      dataUpdated: {},
      shouldCallAPI: true,
      loading: true,
      updataLoading: false,
      employeeDisable: false,
      importQueryItem: {},
      importUpdataItem: {},
      importVerifyItem: {},
      validateData: {
        column: ['tel1', 'tel2', 'mobile'],
        value: ''
      },
      params: {},
      employeeNoData: '',
      updataData: {
        cus_no: '', //會員編號
        tel1: '', // 驗證號碼
        name: '', // 姓名
        nickname: '', // 線上姓名
        mobile: '', // 手機
        tel2: '', // 家電
        idno: '', // 身分證字號
        birthday: '', // 生日
        sex: '', // 性別 ，預設0，男1，女2
        email: '', // 信箱
        zip_no: '', // 郵遞區號
        city: '', // 縣市
        area: '', // 區域
        street: '', // 街道
        plateform: '', // 來源
        prt_yn: '', // 收DM
        update_emp: '', // 最後更新人員，店編/員編
        updtime: '', // 最後更新時間
        identify: '', //驗證狀態
        can_edit_tel1: '', //是否有權限修改
        relatives_effective_qty: '', //有效寶寶數
        relatives: [
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null }
        ]
      }
    }
  },

  computed: {
    relativesDrawer: {
      get() {
        return this.$props.show
      },
      set(value) {
        if (!value) {
          this.$emit('update:show', false)
        }
      }
    },
    selectedId() {
      return this.id
    },
    options() {
      return this.resource
    },
    // employeeId() {
    //   return this.creator
    // },
    updatePermission() {
      const permission = this.$store.getters.userInfo.permissions
      return !permission.includes('api.backend.member.huaying.update')
    }
  },

  methods: {
    //親屬驗證身分證
    validateRelativesIdno(_rule, value, callback) {
      let idnoRegex = /^[A-Z]?\d{9}$/
      if (typeof value === 'undefined' || value === null || value === '') {
        callback()
      } else if (value.length < 10) {
        callback(new Error('親屬身分證字號需輸入 1 碼英文 9 碼數字'))
      } else if (!idnoRegex.test(value)) {
        callback(new Error('親屬身分證字號需輸入 1 碼英文 9 碼數字'))
      } else {
        callback()
      }
    },

    //顯示會員資料
    handleMemberShow() {
      this.loading = true
      this.params = {}
      this.$refs['updataData'].resetFields()
      this.importUpdataItem = {}
      let memberId = this.selectedId

      memberDetailed(memberId)
        .then((res) => {
          this.params = res
          for (const key in this.params) {
            if (key === 'relatives') {
              continue // 跳過
            }
            if (
              this.params[key] !== '' &&
              this.params[key] !== null &&
              this.params[key] !== undefined
            ) {
              this.updataData[key] = this.params[key]
              this.updataData.update_emp = ''
            }
          }
          if (
            this.params.relatives !== [] &&
            this.params.relatives !== null &&
            this.params.relatives !== undefined
          ) {
            for (
              let i = 0;
              i < this.params.relatives.length && i < this.updataData.relatives.length;
              i++
            ) {
              this.updataData.relatives[i] = this.params.relatives[i]
            }
          }
          this.loading = false
        })
        .catch((res) => {
          this.$confirm(`${res.response.data?.exception.message}`, '會員資料載入錯誤', {
            confirmButtonText: '確定',
            showCancelButton: false,
            type: 'error',
            center: true
          })
            .then(() => {})
            .catch(() => {})
        })
    },

    closeDrawer() {
      this.relativesDrawer = false
      this.$emit('update:show', false)
    },

    //欄位改變
    handleDataChange(key) {
      if (this.updataData[key] !== this.importUpdataItem[key]) {
        this.importUpdataItem[key] = this.updataData[key]
      }
    },

    //親屬欄位改變
    handleRelativesChange(value, index) {
      let filteredValue = []
      if (
        index &&
        value.name !== '' &&
        value.name !== null &&
        value.birthday !== '' &&
        value.birthday !== null &&
        value.idno !== '' &&
        value.idno !== null
      ) {
        filteredValue.push({
          name: value.name,
          birthday: value.birthday,
          idno: value.idno
        })
        this.importUpdataItem['relatives'] = filteredValue
      }
    },

    //更新 驗證表單
    actionUpdata() {
      this.shouldCallAPI = false

      this.$refs['updataData'].validate((valid) => {
        if (valid) {
          this.employeeDisable = true
        } else {
          this.$message.error('欄位填寫錯誤')
          this.shouldCallAPI = true
        }
      })
    },

    //確認員工編號，確認修改
    handleActionEmployee() {
      this.updataLoading = true
      let memberId = this.selectedId
      console.log(memberId)

      for (const key in this.updataData) {
        if (
          this.updataData[key] !== '' &&
          this.updataData[key] !== null &&
          this.updataData[key] !== undefined
        ) {
          // this.importUpdataItem['name'] = this.updataData['name']
          // this.importUpdataItem['tel1'] = this.updataData['tel1']
          // this.importUpdataItem['sex'] = this.updataData['sex']
          // this.importUpdataItem['prt_yn'] = this.updataData['prt_yn']
          this.importUpdataItem['update_emp'] = this.updataData['update_emp']
        }
        //收DM true false 送地址
        // if (this.updataData['prt_yn'] == true) {
        //   this.importUpdataItem['adds'] = this.updataData['adds']
        //   this.importUpdataItem['zip_no'] = this.updataData['zip_no']
        // }
        if (this.updataData['relatives'] && this.updataData['relatives'].length > 0) {
          let result = []
          this.updataData['relatives'].forEach((i) => {
            if (
              i.name !== '' &&
              i.name !== null &&
              i.birthday !== '' &&
              i.birthday !== null &&
              i.idno !== '' &&
              i.idno !== null
            ) {
              result.push({
                name: i.name,
                birthday: i.birthday,
                idno: i.idno
              })
            }
          })
          if (result.length > 0) {
            this.importUpdataItem['relatives'] = result
          }
        }
      }
      memberUpdate(memberId, this.importUpdataItem)
        .then(() => {
          this.employeeDisable = false
          this.$emit('dataUpdated', this.importUpdataItem)
          this.shouldCallAPI = true
          this.relativesDrawer = false
          this.$notify({
            title: '修改成功',
            type: 'success',
            message: '會員資料修改成功'
          })
          this.updataLoading = false
        })
        .catch((res) => {
          this.employeeDisable = false
          this.updataLoading = false
          if (res.response.data.exception) {
            this.$confirm(`${res.response.data.exception.message}`, '會員資料修改失敗', {
              confirmButtonText: '確定',
              showCancelButton: false,
              type: 'error',
              center: true
            })
              .then(() => {})
              .catch(() => {})
          } else {
            this.$confirm(`${res.response.data.message}`, '會員資料修改失敗', {
              confirmButtonText: '確定',
              showCancelButton: false,
              type: 'error',
              center: true
            })
              .then(() => {})
              .catch(() => {})
          }
        })
      this.shouldCallAPI = true
    },

    //關閉員編
    dialogClose() {
      this.employeeNoData = ''
      this.employeeDisable = false
    }
  }
}
</script>

<style lang="scss" scoped>
::v-deep.main-show {
  .el-drawer {
    .el-drawer__header {
      padding: 20px 20px 10px;
      margin: 0;
      .el-drawer__title {
        font-size: 18px;
        font-weight: 600;
        color: #181818;
        letter-spacing: 1px;
      }
    }
    .el-drawer__body {
      padding: 20px;
    }
  }
}

::v-deep.app-container {
  position: relative;
  .title-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .back {
      opacity: 0.5;
      &:hover {
        opacity: 1;
      }
    }
  }
  .relatives-title {
    letter-spacing: 1px;
    margin: 80px 0 20px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;

    h3 {
      font-size: 16px;
      font-weight: 900;
      color: #606266;
      margin: 0;
    }
    span {
      font-size: 14px;
      font-weight: 600;
      color: #888888;
      margin-left: 10px;
    }
  }
  .el-form {
    .el-form-item {
      display: flex;
      flex-direction: column;
      .el-form-item__label {
        width: 140px !important;
        font-weight: 700;
        justify-content: flex-start;
        height: 30px;
      }
      .el-form-item__content {
        .el-select {
          width: 100%;
          margin-bottom: 10px;
        }
      }
    }
    .el-row {
      .el-col {
        margin-right: 20px;
        .select-wrap {
          display: flex;
          justify-content: space-between;
          .el-form-item {
            width: 48%;
          }
        }
      }

      &.main-button {
        position: fixed;
        z-index: 20;
        right: 4%;
        bottom: 6%;
        width: 10%;
        .button-bottom {
          display: flex;
          justify-content: center;
          align-items: flex-end;
        }
      }
    }
  }
}
</style>
