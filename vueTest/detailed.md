<template>
  <div class="main-show">
    <el-drawer
      v-model="showDrawer"
      :id="selectedId"
      :creator="employeeId"
      direction="rtl"
      size="75%"
      title="會員查詢-詳細資料"
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
            <el-col :span="9" style="margin-right: 20px">
              <el-form-item label="手機" label-width="100" prop="tel1" :rules="rules.tel1">
                <el-input v-model.trim="updataData.tel1" :disabled="tel1Permission"></el-input>
              </el-form-item>
              <el-form-item label="姓名" label-width="100" prop="name">
                <el-input
                  v-model="updataData.name"
                  placeholder="請輸入姓名"
                  @change="handleDataChange('name')"
                ></el-input>
              </el-form-item>
              <el-form-item label="歸戶姓名" label-width="100" prop="nickname">
                <el-input
                  v-model="updataData.nickname"
                  placeholder="請輸入歸戶姓名"
                  @change="handleDataChange('nickname')"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
              <el-form-item label="身分證字號" label-width="100" prop="idno" :rules="rules.idno">
                <el-input
                  v-model.trim="updataData.idno"
                  placeholder="請輸入身分證字號"
                  @change="handleDataChange('idno')"
                ></el-input>
                <!-- :disabled="idnoPermission" -->
              </el-form-item>
              <el-form-item label="性別" label-width="100" prop="sex">
                <el-select
                  v-model="updataData.sex"
                  placeholder="請選擇"
                  style="width: 100%"
                  @change="handleDataChange('sex')"
                  :disabled="sexPermission"
                >
                  <el-option value="1" label="男生">男生</el-option>
                  <el-option value="2" label="女生">女生</el-option>
                  <el-option value="0" label="其他">其他</el-option>
                </el-select>
                <!-- <el-radio-group
                  v-model="updataData.sex"
                  @change="handleDataChange('sex')"
                  :disabled="sexPermission"
                >
                  <el-radio label="1" @click.prevent="changeRadio(1)">男</el-radio>
                  <el-radio label="2" @click.prevent="changeRadio(2)">女</el-radio>>
                </el-radio-group> -->
              </el-form-item>
              <el-form-item label="生日" label-width="100" prop="birthday">
                <el-date-picker
                  style="width: 100%"
                  v-model="updataData.birthday"
                  type="date"
                  placeholder="請輸入日期"
                  value-format="YYYY-MM-DD"
                  @change="handleDataChange('birthday')"
                />
                <!-- :disabled="birthdayPermission" -->
              </el-form-item>
              <el-form-item
                label="電子信箱"
                label-width="100"
                prop="email"
                :rules="[
                  { required: false, message: '請輸入完整電子信箱', trigger: 'blur' },
                  { type: 'email', message: '請輸入完整電子信箱', trigger: 'blur' }
                ]"
              >
                <el-input
                  v-model="updataData.email"
                  placeholder="請輸入電子信箱"
                  @change="handleDataChange('email')"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="聯絡地址"
                label-width="100"
                :rules="[
                  { required: updataData.prt_yn, message: '必填欄位請輸入資料', trigger: 'blur' }
                ]"
                style="margin: 0 0 20px"
              >
                <el-row :gutter="24" justify="start">
                  <el-col :span="12">
                    <el-form-item
                      prop="city"
                      :rules="[
                        {
                          required: updataData.prt_yn,
                          message: '必填欄位請輸入資料',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-select
                        v-model="updataData.city"
                        placeholder="縣市"
                        @change="handleSelectCity('city')"
                        :disabled="updatePermission"
                      >
                        <el-option
                          v-for="(value, key) in options"
                          :key="key"
                          :label="value.name"
                          :value="value.name"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      prop="area"
                      :rules="[
                        {
                          required: updataData.prt_yn,
                          message: '必填欄位請輸入資料',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-select
                        v-model="updataData.area"
                        placeholder="區域"
                        @change="handleSelectArea('area')"
                        :disabled="updatePermission"
                      >
                        <el-option
                          v-for="(value, key) in options.towns"
                          :key="key"
                          :label="value.name"
                          :value="value.name"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      prop="street"
                      :rules="[
                        {
                          required: updataData.prt_yn,
                          message: '必填欄位請輸入資料',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-input
                        type="textarea"
                        :rows="2"
                        v-model.trim="updataData.street"
                        placeholder="請輸入街道"
                        @change="handleDataStreet('street')"
                        :disabled="updatePermission || updataData.area == ''"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
            </el-col>
            <el-col :span="9" style="margin-right: 20px">
              <el-form-item
                label="我願意收到郵寄DM"
                label-width="100"
                prop="prt_yn"
                :rules="[{ required: false, trigger: 'blur' }]"
              >
                <el-radio-group v-model="updataData.prt_yn" :disabled="updatePermission">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="我願意收到電子報"
                label-width="100"
                prop="prt_yn"
                :rules="[{ required: false, trigger: 'blur' }]"
              >
                <el-radio-group v-model="updataData.prt_yn" :disabled="updatePermission">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="我願意收到優惠資訊"
                label-width="100"
                prop="prt_yn"
                :rules="[{ required: false, trigger: 'blur' }]"
              >
                <el-radio-group v-model="updataData.prt_yn" :disabled="updatePermission">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="來源" label-width="100" prop="plateform">
                <el-input v-model="updataData.plateform" disabled autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item label="會員等級" label-width="100" prop="lvl_name">
                <el-input v-model="updataData.lvl_name" disabled autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="會員等級到期日"
                label-width="100"
                prop="purchase_record.vip_expired_at"
              >
                <el-input v-model="updataData.purchase_record.vip_expired_at" disabled></el-input>
              </el-form-item>
              <el-form-item
                label="會員等級升等日"
                label-width="100"
                prop="purchase_record.vip_upgraded_at"
              >
                <el-input v-model="updataData.purchase_record.vip_upgraded_at" disabled></el-input>
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

        <!-- <el-form
          :model="updataData"
          ref="updataData"
          v-loading="loading"
          element-loading-text="資料載入中，請稍等"
        >
          <el-row :gutter="24" justify="start">
            <el-col :span="9" style="margin-right: 20px">
              <el-form-item
                label="會員編號"
                label-width="100"
                prop="cus_no"
                :rules="[{ required: true, message: '必填欄位請輸入資料', trigger: 'blur' }]"
              >
                <el-input v-model="updataData.cus_no" autocomplete="off" disabled></el-input>
              </el-form-item>
              <el-form-item
                label="姓名"
                label-width="100"
                prop="name"
              >
                <el-input
                  v-model="updataData.name"
                  placeholder="請輸入姓名"
                  autocomplete="off"
                  @change="handleDataChange('name')"
                ></el-input>
              </el-form-item>
              <el-form-item label="手機 1" label-width="100" prop="mobile" :rules="rules.mobile">
                <el-input
                  v-model.trim="updataData.mobile"
                  placeholder="請輸入手機號碼"
                  autocomplete="off"
                  @change="handleDataChange('mobile')"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
              <el-form-item label="身分證字號" label-width="100" prop="idno" :rules="rules.idno">
                <el-input
                  v-model.trim="updataData.idno"
                  placeholder="請輸入身分證字號"
                  autocomplete="off"
                  @change="handleDataChange('idno')"
                  :disabled="idnoPermission"
                ></el-input>
              </el-form-item>
              <el-form-item label="性別" label-width="100" prop="sex">
                <el-radio-group
                  v-model="updataData.sex"
                  @change="handleDataChange('sex')"
                  :disabled="sexPermission"
                >
                  <el-radio label="1" @click.prevent="changeRadio(1)">男</el-radio>
                  <el-radio label="2" @click.prevent="changeRadio(2)">女</el-radio>>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="收DM"
                label-width="100"
                prop="prt_yn"
                :rules="[{ required: true, message: '必填欄位請輸入資料', trigger: 'blur' }]"
              >
                <el-radio-group v-model="updataData.prt_yn" :disabled="updatePermission">
                  <el-radio :label="true">是</el-radio>
                  <el-radio :label="false">否</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item
                label="地址"
                label-width="100"
                :rules="[
                  { required: updataData.prt_yn, message: '必填欄位請輸入資料', trigger: 'blur' }
                ]"
                style="margin: 0 0 20px"
              >
                <el-row :gutter="24" justify="start">
                  <el-col :span="12">
                    <el-form-item
                      prop="city"
                      :rules="[
                        {
                          required: updataData.prt_yn,
                          message: '必填欄位請輸入資料',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-select
                        v-model="updataData.city"
                        placeholder="縣市"
                        @change="handleSelectCity('city')"
                        :disabled="updatePermission"
                      >
                        <el-option
                          v-for="(value, key) in options"
                          :key="key"
                          :label="value.name"
                          :value="value.name"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item
                      prop="area"
                      :rules="[
                        {
                          required: updataData.prt_yn,
                          message: '必填欄位請輸入資料',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-select
                        v-model="updataData.area"
                        placeholder="區域"
                        @change="handleSelectArea('area')"
                        :disabled="updatePermission"
                      >
                        <el-option
                          v-for="(value, key) in options.towns"
                          :key="key"
                          :label="value.name"
                          :value="value.name"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="24">
                    <el-form-item
                      prop="street"
                      :rules="[
                        {
                          required: updataData.prt_yn,
                          message: '必填欄位請輸入資料',
                          trigger: 'blur'
                        }
                      ]"
                    >
                      <el-input
                        type="textarea"
                        :rows="2"
                        v-model.trim="updataData.street"
                        placeholder="請輸入街道"
                        autocomplete="off"
                        @change="handleDataStreet('street')"
                        :disabled="updatePermission || updataData.area == ''"
                      ></el-input>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item label="來源" label-width="100" prop="plateform">
                <el-input v-model="updataData.plateform" disabled autocomplete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="9">
              <el-form-item label="驗證號碼" label-width="100" prop="tel1" :rules="rules.tel1">
                <el-input
                  v-model.trim="updataData.tel1"
                  :disabled="tel1Permission"
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="線上姓名" label-width="100" prop="nickname">
                <el-input
                  v-model="updataData.nickname"
                  placeholder="請輸入線上姓名"
                  autocomplete="off"
                  @change="handleDataChange('nickname')"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
              <el-form-item label="家電" label-width="100" prop="tel2" :rules="rules.tel2">
                <el-input
                  v-model.trim="updataData.tel2"
                  placeholder="請輸入家電"
                  autocomplete="off"
                  @change="handleDataChange('tel2')"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
              <el-form-item label="生日" label-width="100" prop="birthday">
                <el-date-picker
                  style="width: 100%"
                  v-model="updataData.birthday"
                  type="date"
                  placeholder="請輸入日期"
                  value-format="YYYY-MM-DD"
                  @change="handleDataChange('birthday')"
                  :disabled="birthdayPermission"
                />
              </el-form-item>
              <el-form-item
                label="信箱"
                label-width="100"
                prop="email"
                :rules="[
                  { required: false, message: '請輸入完整信箱', trigger: 'blur' },
                  { type: 'email', message: '請輸入完整信箱', trigger: 'blur' }
                ]"
              >
                <el-input
                  v-model="updataData.email"
                  placeholder="請輸入信箱"
                  autocomplete="off"
                  @change="handleDataChange('email')"
                  :disabled="updatePermission"
                ></el-input>
              </el-form-item>
              <el-form-item label="會員等級" label-width="100" prop="lvl_name">
                <el-input v-model="updataData.lvl_name" disabled autocomplete="off"></el-input>
              </el-form-item>
              <el-form-item
                label="會員到期日"
                label-width="100"
                prop="purchase_record.vip_expired_at"
              >
                <el-input
                  v-model="updataData.purchase_record.vip_expired_at"
                  disabled
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item
                label="會員升等日"
                label-width="100"
                prop="purchase_record.vip_upgraded_at"
              >
                <el-input
                  v-model="updataData.purchase_record.vip_upgraded_at"
                  disabled
                  autocomplete="off"
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
        </el-form> -->
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
import { memberDetailed, memberUpdate, getValidate } from '@/api/functions/customer/search'
import { getMemberResource } from '@/api/functions/member'

export default {
  name: 'MemberDetailed',

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
    // resource: {
    //   type: Array,
    //   required: true
    // },
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
      // validateData: {
      //   column: ['tel1', 'tel2', 'mobile'],
      //   value: ''
      // },
      options: [],
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
        purchase_record: '', //會員消費紀錄
        relatives: [
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null },
          { name: null, birthday: null, idno: null }
        ]
      },
      rules: {
        tel1: [
          { required: true, message: '必填欄位請輸入資料', trigger: 'blur' },
          { validator: this.validateTel1, trigger: 'blur' }
        ],
        tel2: [
          { required: false, message: '請輸入家用電話', trigger: 'blur' },
          { validator: this.validateTel2, trigger: 'blur' }
        ],
        mobile: [
          { required: false, message: '請輸入手機', trigger: 'blur' },
          { validator: this.validateMobile, trigger: 'blur' }
        ],
        idno: [
          { required: false, message: '請輸入身分證字號', trigger: 'blur' },
          { validator: this.validateIdno, trigger: 'blur' }
        ]
      }
    }
  },

  // created() {
  //   getMemberResource().then((res) => {
  //     this.options = res.data
  //     console.log(this.options)
  //   })
  // },

  computed: {
    showDrawer: {
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
    // options() {
    //   return this.resource
    // },
    employeeId() {
      return this.creator
    },
    // 1. 修改會員詳細資料權限
    updatePermission() {
      const permission = this.$store.getters.userInfo.permissions
      return !permission.includes('api.backend.member.huaying.update') //disabled 是 false 才可編輯
    },
    // 2. 驗證碼 有值不能修改
    tel1Permission() {
      if (this.updatePermission == false) {
        if (this.params.tel1 == '' && this.canEditFields == true) {
          return false
        } else {
          return true
        }
      } else {
        return true // true 不可編輯
      }
    },
    // 2. 名字 有值不能修改
    namePermission() {
      if (this.updatePermission == false) {
        if (this.params.name == '' && this.canEditFields == true) {
          return false
        } else {
          return true
        }
      } else {
        return true // true 不可編輯
      }
    },
    // 2. 身分證 有值不能修改
    idnoPermission() {
      if (this.updatePermission == false) {
        if (this.params.idno == '' && this.canEditFields == true) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 2. 性別 有值不能修改
    sexPermission() {
      if (this.updatePermission == false) {
        if (this.params.sex == '0' && this.canEditFields == true) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 2. 生日 有值不能修改
    birthdayPermission() {
      if (this.updatePermission == false) {
        if (this.params.birthday == null && this.canEditFields == true) {
          return false
        } else {
          return true
        }
      } else {
        return true
      }
    },
    // 3. 可否編輯 驗證號碼/姓名/性別/生日/身分證
    canEditFields() {
      return !this.$store.getters.userInfo.expansion_fields.updatable //disabled 是 false 才可編輯
    }
  },

  methods: {
    //驗證號碼
    validateTel1(_rule, value, callback) {
      let tel1Number = /^[0-9]+$/
      this.importValidateItem = {}
      this.importValidateItem = this.validateData

      if (typeof value === 'undefined' || value === null || value === '') {
        callback()
      } else if (value.length < 9) {
        callback(new Error('需輸入區碼 或 10 碼手機號'))
      } else if (tel1Number.test(value) == false) {
        callback(new Error('驗證號碼僅可輸入數字'))
      } else if (value.startsWith('09') && value.length === 10) {
        callback()
        if (value != undefined && value != null && value != '' && this.shouldCallAPI == true) {
          this.importValidateItem.value = value
          getValidate(this.importValidateItem)
            .then((res) => {
              if (res === false) {
                this.$message('驗證號碼，號碼已存在！')
              }
            })
            .catch((res) => {
              if (res.response) {
                this.$message.error(`${res.response.data.message}`)
              }
            })
        }
      } else if ((value.length === 10 || value.length >= 9) && !value.startsWith('09')) {
        callback()
        if (value != undefined && value != null && value != '' && this.shouldCallAPI == true) {
          this.importValidateItem.value = value
          getValidate(this.importValidateItem)
            .then((res) => {
              if (res === false) {
                this.$message('驗證號碼，號碼已存在！')
              }
            })
            .catch((res) => {
              if (res.response) {
                this.$message.error(`${res.response.data.message}`)
              }
            })
        }
      } else {
        callback(new Error('號碼 09 開頭需輸入 10 碼'))
      }
    },

    //家電
    validateTel2(_rule, value, callback) {
      let tel2Regex = /^0\d{8,}$/
      let tel2Number = /^[0-9]+$/
      this.importValidateItem = {}
      this.importValidateItem = this.validateData

      if (typeof value === 'undefined' || value === null || value === '') {
        callback()
      } else if (value.length < 9 && tel2Regex.test(value) == false) {
        callback(new Error('會員家電需輸入區碼'))
      } else if (tel2Number.test(value) == false) {
        callback(new Error('家電號碼僅可輸入數字'))
      } else {
        callback()
        if (value != undefined && value != null && value != '' && this.shouldCallAPI == true) {
          this.importValidateItem.value = value
          getValidate(this.importValidateItem)
            .then((res) => {
              if (res === false) {
                this.$message('家電，號碼已存在！')
              }
            })
            .catch((res) => {
              if (res.response) {
                this.$message.error(`${res.response.data.message}`)
              }
            })
        }
      }
    },

    //手機
    validateMobile(_rule, value, callback) {
      let mobileRegex = /^09\d{8}$/
      let mobileNumber = /^[0-9]+$/
      this.importValidateItem = {}
      this.importValidateItem = this.validateData

      if (typeof value === 'undefined' || value === null || value === '') {
        callback()
      } else if (mobileNumber.test(value) == false) {
        callback(new Error('手機號碼僅可輸入數字'))
      } else if (mobileRegex.test(value) == false) {
        callback(new Error('號碼需 09 開頭且輸入 10 碼'))
      } else {
        callback()
        if (value != undefined && value != null && value != '' && this.shouldCallAPI == true) {
          this.importValidateItem.value = value
          getValidate(this.importValidateItem)
            .then((res) => {
              if (res === false) {
                this.$message('手機 1 ，號碼已存在！')
              }
            })
            .catch((res) => {
              if (res.response) {
                this.$message.error(`${res.response.data.message}`)
              }
            })
        }
      }
    },

    //驗證身分證
    validateIdno(_rule, value, callback) {
      let idnoRegex = /^[A-Z]?\d{9}$/
      if (typeof value === 'undefined' || value === null || value === '') {
        callback()
      } else if (value.length < 9) {
        callback(new Error('身分證字號 / 護照號需輸入 9 碼以上'))
      } else if (!idnoRegex.test(value)) {
        callback(new Error('身分證字號需輸入 1 碼英文 9 碼數字'))
      } else {
        callback()
      }
    },

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

    resource() {
      getMemberResource().then((res) => {
        this.options = res.data
        console.log(this.options)
      })
    },

    //顯示會員資料
    async handleMemberShow() {
      this.loading = true

      await this.resource()

      this.$refs['updataData'].resetFields()
      this.params = {}
      this.importUpdataItem = {}
      let memberId = this.selectedId

      await memberDetailed(memberId)
        .then((res) => {
          this.params = res
          for (const key in this.params) {
            if (key === 'adds' || key === 'relatives') {
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
          //完整地址做拆分，城市、區域、街道
          if (
            this.params['adds'] !== '' &&
            this.params['adds'] !== null &&
            this.params['adds'] !== undefined
          ) {
            const address = this.params['adds']
            const cityKeywords = ['縣', '市']
            const areaKeywords = ['區', '市', '鎮', '鄉', '鄰'] //區域末字不一

            let cityEndIndex = -1
            for (const keyword of cityKeywords) {
              const index = address.indexOf(keyword)
              if (index !== -1) {
                cityEndIndex = index + 1
                break
              }
            }
            let areaEndIndex = -1
            for (const keyword of areaKeywords) {
              const index = address.indexOf(keyword)
              if (index !== -1) {
                areaEndIndex = index + 1
                break
              }
            }

            if (address.length == 3) {
              this.updataData.city = address.substring(0, cityEndIndex)
            } else {
              this.updataData.city = address.substring(0, cityEndIndex)
              this.updataData.area = address.substring(cityEndIndex, areaEndIndex)
              this.updataData.street = address.substring(areaEndIndex)
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
      this.showDrawer = false
      this.$emit('update:show', false)
    },

    //選擇性別
    changeRadio(val) {
      val = val.toString()
      this.updataData.sex = this.updataData.sex == val ? '0' : val
    },

    //篩選區域
    handleSelectCity(key) {
      if (this.updataData.city) {
        let cityFilter = this.options.filter((item) => {
          return this.updataData.city.includes(item.name)
        })
        let areaOptions = []
        cityFilter.forEach((item) => {
          areaOptions = areaOptions.concat(item.towns)
        })
        this.updataData.area = ''
        this.updataData.zip_no = ''
        this.updataData.street = ''
        this.options.towns = areaOptions

        if (this.updataData[key] !== this.importUpdataItem[key]) {
          this.importUpdataItem['adds'] =
            this.updataData['city'] + this.updataData['area'] + this.updataData['street']
          this.importUpdataItem['zip_no'] = this.updataData['zip_no']
        }
      } else {
        this.updataData.area = ''
        this.updataData.zip_no = ''
        this.updataData.street = ''
        this.options.towns = []
      }
    },

    //篩選郵遞區號
    handleSelectArea(key) {
      let selectedArea = this.updataData.area
      let findAreaData = this.options.towns.find((town) => town.name === selectedArea)
      if (findAreaData) {
        let zipCode = findAreaData.zip_code
        this.updataData.zip_no = zipCode
      }
      if (this.updataData[key] !== this.importUpdataItem[key]) {
        this.importUpdataItem['adds'] =
          this.updataData['city'] + this.updataData['area'] + this.updataData['street']
        this.importUpdataItem['zip_no'] = this.updataData['zip_no']
      }
    },

    //街道值變
    handleDataStreet(key) {
      if (this.updataData[key] !== this.importUpdataItem[key]) {
        this.importUpdataItem['adds'] =
          this.updataData['city'] + this.updataData['area'] + this.updataData['street']
        this.importUpdataItem['zip_no'] = this.updataData['zip_no']
      }
    },

    //欄位改變
    handleDataChange(key) {
      if (this.updataData[key] !== this.importUpdataItem[key]) {
        this.importUpdataItem[key] = this.updataData[key]
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

      for (const key in this.updataData) {
        if (
          this.updataData[key] !== '' &&
          this.updataData[key] !== null &&
          this.updataData[key] !== undefined
        ) {
          // this.importUpdataItem['update_emp'] = this.updataData['update_emp']
          this.importUpdataItem[key] = this.updataData[key]
        }
        //收DM true false 送地址
        if (this.updataData['prt_yn'] == true) {
          this.importUpdataItem['adds'] =
            this.updataData['city'] + this.updataData['area'] + this.updataData['street']
          this.importUpdataItem['zip_no'] = this.updataData['zip_no']
        }
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
          this.$emit('dataUpdated', this.updataData)
          this.shouldCallAPI = true
          this.showDrawer = false
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
      padding: 20px 20px 20px;
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
