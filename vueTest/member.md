<template>
  <div class="app-container">
    <div class="custom-tree-container">
      <div class="block">
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">
            <el-icon>
              <search></search>
            </el-icon>
            選擇篩選條件
          </div>
          <div class="el-divider__text is-right">
            <el-button
              circle
              icon="refresh"
              title="重置搜尋條件"
              @click="resetSearch()"
            ></el-button>
            <el-button
              circle
              :icon="showFilterData ? 'arrow-up' : 'arrow-down'"
              :title="showFilterData ? '關閉篩選資訊' : '打開篩選資訊'"
              @click="showFilterData = !showFilterData"
            ></el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 篩選條件 -->
    <transition name="slide-fade">
      <div class="select" v-show="showFilterData">
        <el-row :gutter="24" align="middle">
          <el-col :span="4">
            <div class="select-box">
              <div class="el-divider__text is-left">手機號碼</div>
              <el-card shadow="hover">
                <el-input
                  :disabled="loading"
                  placeholder="請輸入會員電話號碼"
                  style="width: 100%"
                  v-model.trim="params.phone"
                  @keyup.enter="actionSearch()"
                ></el-input>
              </el-card>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="select-box">
              <div class="el-divider__text is-left">會員編號</div>
              <el-card shadow="hover">
                <el-input
                  :disabled="loading"
                  placeholder="請輸入會員編號"
                  style="width: 100%"
                  v-model.trim="params.cus_no"
                  @keyup.enter="actionSearch()"
                ></el-input>
              </el-card>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="select-box">
              <div class="el-divider__text is-left">身份證字號</div>
              <el-card shadow="hover">
                <el-input
                  :disabled="loading"
                  placeholder="請輸入身份證字號"
                  style="width: 100%"
                  v-model.trim="params.idno"
                  @keyup.enter="actionSearch()"
                ></el-input>
              </el-card>
            </div>
          </el-col>
          <el-col :span="7">
            <div style="display: flex; padding: 20px 20px 20px 0">
              <el-button
                :disabled="params.phone == ''"
                icon="Search"
                type="primary"
                @click="actionSearch()"
                >查詢</el-button
              >
              <el-button
                @click="createMemberDisable = true"
                icon="CirclePlusFilled"
                type="success"
                >新建</el-button
              >
            </div>
          </el-col>
          <el-col :span="5">
            <div class="data-range-wrap">
              <div class="dataRange">資料範圍 :</div>
              <el-radio-group v-model="dataRange" @change="actionSearch()">
                <el-radio label="all" size="large">顯示所有資料</el-radio>
                <el-radio label="huaying" size="large">僅顯示樺穎</el-radio>
              </el-radio-group>
            </div>
          </el-col>
        </el-row>
      </div>
    </transition>

    <div class="custom-tree-container">
      <div class="block">
        <div class="el-divider el-divider--horizontal">
          <div class="el-divider__text is-left">
            <el-icon>
              <notebook />
            </el-icon>
            查詢結果
          </div>
        </div>
      </div>
    </div>

    <!-- 查詢結果列表 -->
    <div style="padding: 0px 20px">
      <el-table
        :data="searchList"
        border
        element-loading-text="資料載入中"
        fit
        style="width: 100%; margin-bottom: 20px"
        tooltip-effect="dark"
        v-loading="loading"
      >
        <el-table-column
          v-for="item of Header"
          :key="item.key"
          :align="item.align"
          :label="item.title"
          :prop="item.key"
          :width="item.width"
          header-align="center"
        >
        </el-table-column>
        <el-table-column align="center" width="100" label="狀態">
          <template #default="scope">
            <span v-if="scope.row.identify == 1" style="color: #67c23a"
              >已驗證</span
            >
            <span v-if="scope.row.identify == 0">未驗證</span>
          </template>
        </el-table-column>
        <el-table-column align="center" width="115" label="功能選項">
          <template #default="scope">
            <!-- <el-button
              size="small"
              type="primary"
              icon="Message"
              plain
              style="margin: 2px;width:100%;display: flex;justify-content: flex-start;"
              v-if="scope.row.identify == 0"
              @click="showCreate_emp=true;verify.cus_no=scope.row.cus_no;"
            >
              發送驗證網址
            </el-button> -->
            <el-button
              size="small"
              type="primary"
              icon="Message"
              plain
              style="margin: 2px"
              v-if="scope.row.show_identify_btn == true"
              @click="handleOTP(scope.row)"
              >發送OTP簡訊</el-button
            >
            <el-button
              size="small"
              type="success"
              icon="Edit"
              plain
              style="
                margin: 2px;
                width: 100%;
                display: flex;
                justify-content: flex-start;
              "
              v-if="scope.row.can_edit == 1"
              @click="handleEdit(scope.row.cus_no)"
              :disabled="detailPermission"
              >詳細資料</el-button
            >
            <el-button
              size="small"
              type="warning"
              icon="Edit"
              plain
              style="margin: 2px"
              v-if="scope.row.can_edit == true"
              @click="handleRelatives(scope.row.cus_no)"
              :disabled="detailPermission"
              >家庭資料</el-button
            >
            <el-popover
              placement="right"
              :width="200"
              trigger="hover"
              title="選擇查看資訊"
            >
              <template #reference>
                <el-button
                  size="small"
                  type="info"
                  icon="CaretLeft"
                  plain
                  style="
                    margin: 2px;
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                  "
                  v-if="scope.row.can_edit == 1"
                >
                  查看更多</el-button
                >
              </template>
              <template #default>
                <el-button
                  size="small"
                  type="info"
                  icon="View"
                  plain
                  style="margin: 8px"
                  v-if="scope.row.can_edit == 1"
                  @click="handleBarcode(scope.row.cus_no)"
                  :disabled="detailPermission"
                  >顯示會員條碼</el-button
                >
                <el-button
                  size="small"
                  type="info"
                  icon="View"
                  plain
                  style="margin: 8px"
                  v-if="scope.row.can_edit == 1"
                  @click="handleLevelHistory(scope.row.cus_no)"
                  :disabled="detailPermission"
                  >會員等級異動紀錄</el-button
                >
                <el-button
                  size="small"
                  type="info"
                  icon="View"
                  plain
                  style="margin: 8px"
                  v-if="scope.row.can_edit == 1"
                  @click="handleHistory(scope.row.cus_no)"
                  :disabled="detailPermission"
                  >基本資料修改歷程</el-button
                >
              </template>
            </el-popover>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-right">
        <Pagination :propPageInfo="pageInfo" @clickHandler="actionGetList" />
      </div>
    </div>

    <!-- <el-dialog
      v-model="showCreate_emp"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      title="發送驗證網址"
      width="500px"
    >
      <el-form :model="verify" ref="verify" onsubmit="return false;">
        <el-row :gutter="24" style="margin: 0 0px 10px 0px">
          <el-form-item
            label="會員編號"
            label-width="80">
            {{ verify.cus_no }}
          </el-form-item>
        </el-row>
        <el-row :gutter="24" style="margin: 0 0px 10px 0px">          
            <el-form-item
              label="員工編號"
              label-width="80"
              prop="create_emp"
              :rules="[
                { required: false, message: '必填欄位請輸入資料', trigger: 'blur' },
                {
                  pattern: /^[Y]?\d{5,}$/,
                  message: '長度須 5 碼以上，請輸入正確員工編號',
                  trigger: 'blur'
                }
              ]"
            >
              <el-input  
                v-model="verify.create_emp"
                placeholder="請輸入員工編號"
                autocomplete="off"
              ></el-input>
            </el-form-item>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="showCreate_emp = false;verify.create_emp=''"> 取消 </el-button>
          <el-button 
            :disabled="verify.create_emp == ''"
            type="primary" 
            @click="handleVerifyURL()"> 送出 </el-button>
        </span>
      </template>
    </el-dialog> -->

    <!-- 選擇新建方式燈箱 -->
    <!-- <el-dialog
      v-model="selectMemberDisable"
      title="選擇新增會員方式"
      width="500px"
      class="select-member-dialog"
      :before-close="dialogClose"
    >
      <el-row :gutter="24" style="margin: 0 0px 10px 0px">
        <p>
          電話號碼 : <span>{{ importQueryItem.phone }}</span>
        </p>
      </el-row>
      <el-row :gutter="24" style="margin: 0 0px 10px 0px">
        <p><span>選擇1</span> : 門市同仁輸入會員資訊(會員無智慧型手機或家用電話適用)</p>
      </el-row>
      <el-row :gutter="24" style="margin: 0px">
        <p><span>選擇2</span> : 寄送簡訊至會員手機，詳細資料由會員填寫。</p>
      </el-row>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="createMemberDisable = true"> 1.門市建立 </el-button>
          <el-button type="primary" @click="handleOTP()"> 2.簡訊驗證 </el-button>
        </span>
      </template>
    </el-dialog> -->

    <!-- 門市新建燈箱 -->
    <el-dialog
      v-model="createMemberDisable"
      title="門市新建資料"
      width="750px"
      :before-close="dialogClose"
    >
      <el-form v-if="createData" :model="createData" ref="createDataRef">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="姓名" label-width="90" prop="name">
              <el-input
                v-model="createData.name"
                placeholder="請輸入姓名"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="線上姓名" label-width="90">
              <el-input
                v-model="createData.nickname"
                placeholder="請輸入線上姓名"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驗證號碼" label-width="90">
              <el-input
                v-model.trim="createData.tel1"
                placeholder="請輸入驗證號碼"
                autocomplete="off"
                @change="changeValidPhone"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手機 1" label-width="90">
              <el-input
                v-model.trim="createData.mobile"
                placeholder="請輸入手機號碼"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家電" label-width="90">
              <el-input
                v-model.trim="createData.tel2"
                placeholder="請輸入家電"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身分證字號" label-width="90">
              <el-input
                v-model.trim="createData.idno"
                placeholder="請輸入身分證字號"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性別" label-width="90">
              <el-radio-group v-model="createData.sex">
                <el-radio label="1" @click.prevent="changeRadio(1)"
                  >男</el-radio
                >
                <el-radio label="2" @click.prevent="changeRadio(2)"
                  >女</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" label-width="90">
              <el-date-picker
                style="width: 100%"
                v-model="createData.birthday"
                type="date"
                placeholder="請輸入日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收DM" label-width="90">
              <el-radio-group v-model="createData.prt_yn">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信箱" label-width="80">
              <el-input
                v-model="createData.email"
                placeholder="請輸入信箱"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-form-item
            label="地址"
            label-width="80"
            style="width: 100%"
            :rules="[
              {
                required: createData.prt_yn,
                message: '必填欄位請輸入資料',
                trigger: 'blur',
              },
            ]"
          >
            <el-col :span="24">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item
                    prop="city"
                    :rules="[
                      {
                        required: createData.prt_yn,
                        message: '必填欄位請輸入資料',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-select
                      v-model="createData.city"
                      placeholder="縣市"
                      @change="handleSelectCity"
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
                <el-col :span="6">
                  <el-form-item
                    prop="area"
                    :rules="[
                      {
                        required: createData.prt_yn,
                        message: '必填欄位請輸入資料',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-select
                      v-model="createData.area"
                      placeholder="區域"
                      @change="handleSelectArea"
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
                <el-col :span="12">
                  <el-form-item
                    prop="street"
                    :rules="[
                      {
                        required: createData.prt_yn,
                        message: '必填欄位請輸入資料',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="createData.street"
                      placeholder="請輸入街道"
                      autocomplete="off"
                      :disabled="createData.area == ''"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
          <el-col :span="12">
            <el-form-item
              label="員工編號"
              label-width="80"
              prop="create_emp"
              :rules="[
                {
                  required: true,
                  message: '必填欄位請輸入資料',
                  trigger: 'blur',
                },
                {
                  pattern: /^[Y]?\d{5,}$/,
                  message: '長度須 5 碼以上，請輸入正確員工編號',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                v-model="createData.create_emp"
                placeholder="請輸入員工編號"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button
            :disabled="
              createData.create_emp == '' ||
              createData.tel1 == '' ||
              validPhoneStatus == false
            "
            icon="Promotion"
            type="success"
            @click="actionCreate(false)"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="資料傳送中，請耐心等候，謝謝"
          >
            建立
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 查無會員新建燈箱 -->
    <el-dialog
      v-model="createSearchDisable"
      title="查無會員新建資料"
      width="750px"
      :before-close="dialogClose"
    >
      <el-form v-if="createData" :model="createData" ref="createDataRef">
        <el-row :gutter="10">
          <el-col :span="12">
            <el-form-item label="姓名" label-width="90" prop="name">
              <el-input
                v-model="createData.name"
                placeholder="請輸入姓名"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="線上姓名" label-width="90">
              <el-input
                v-model="createData.nickname"
                placeholder="請輸入線上姓名"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="驗證號碼" label-width="90">
              <!-- <el-input
                v-model.trim="createData.tel1"
                placeholder="請輸入驗證號碼"
                autocomplete="off"
                @change="changeValidPhone"
              ></el-input> -->
              {{ createData.tel1 }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手機 1" label-width="90">
              <el-input
                v-model.trim="createData.mobile"
                placeholder="請輸入手機號碼"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="家電" label-width="90">
              <el-input
                v-model.trim="createData.tel2"
                placeholder="請輸入家電"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="身分證字號" label-width="90">
              <el-input
                v-model.trim="createData.idno"
                placeholder="請輸入身分證字號"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="性別" label-width="90">
              <el-radio-group v-model="createData.sex">
                <el-radio label="1" @click.prevent="changeRadio(1)"
                  >男</el-radio
                >
                <el-radio label="2" @click.prevent="changeRadio(2)"
                  >女</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="生日" label-width="90">
              <el-date-picker
                style="width: 100%"
                v-model="createData.birthday"
                type="date"
                placeholder="請輸入日期"
                value-format="YYYY-MM-DD"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="收DM" label-width="90">
              <el-radio-group v-model="createData.prt_yn">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="信箱" label-width="80">
              <el-input
                v-model="createData.email"
                placeholder="請輸入信箱"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>

          <el-form-item
            label="地址"
            label-width="80"
            style="width: 100%"
            :rules="[
              {
                required: createData.prt_yn,
                message: '必填欄位請輸入資料',
                trigger: 'blur',
              },
            ]"
          >
            <el-col :span="24">
              <el-row :gutter="24">
                <el-col :span="6">
                  <el-form-item
                    prop="city"
                    :rules="[
                      {
                        required: createData.prt_yn,
                        message: '必填欄位請輸入資料',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-select
                      v-model="createData.city"
                      placeholder="縣市"
                      @change="handleSelectCity"
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
                <el-col :span="6">
                  <el-form-item
                    prop="area"
                    :rules="[
                      {
                        required: createData.prt_yn,
                        message: '必填欄位請輸入資料',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-select
                      v-model="createData.area"
                      placeholder="區域"
                      @change="handleSelectArea"
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
                <el-col :span="12">
                  <el-form-item
                    prop="street"
                    :rules="[
                      {
                        required: createData.prt_yn,
                        message: '必填欄位請輸入資料',
                        trigger: 'blur',
                      },
                    ]"
                  >
                    <el-input
                      v-model="createData.street"
                      placeholder="請輸入街道"
                      autocomplete="off"
                      :disabled="createData.area == ''"
                    ></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-col>
          </el-form-item>
          <el-col :span="12">
            <el-form-item
              label="員工編號"
              label-width="80"
              prop="create_emp"
              :rules="[
                {
                  required: true,
                  message: '必填欄位請輸入資料',
                  trigger: 'blur',
                },
                {
                  pattern: /^[Y]?\d{5,}$/,
                  message: '長度須 5 碼以上，請輸入正確員工編號',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input
                v-model="createData.create_emp"
                placeholder="請輸入員工編號"
                autocomplete="off"
              ></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button
            :disabled="
              createData.create_emp == '' ||
              createData.tel1 == '' ||
              validPhoneStatus == false
            "
            icon="Promotion"
            type="success"
            @click="actionCreate(true)"
            v-loading.fullscreen.lock="fullscreenLoading"
            element-loading-text="資料傳送中，請耐心等候，謝謝"
          >
            建立
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 發送簡訊燈箱 -->
    <el-dialog
      v-model="newsVerifyDisable"
      title="發送簡訊"
      width="500px"
      class="select-member-dialog"
      :before-close="dialogClose"
    >
      <el-row :gutter="24" style="margin: 0 0px 20px 0px">
        <p>
          即將發送簡訊，請確認電話號碼 : <span>{{ verifyData.phone }}</span>
        </p>
      </el-row>
      <el-form :rules="rules" :model="createData" ref="createData">
        <el-form-item
          label="員工編號"
          label-width="80"
          prop="create_emp"
          :rules="[
            { required: false, message: '必填欄位請輸入資料', trigger: 'blur' },
            {
              pattern: /^[Y]?\d{5,}$/,
              message: '長度須 5 碼以上，請輸入正確員工編號',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model="createData.create_emp"
            placeholder="請輸入員工編號"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button
            :disabled="createData.create_emp == ''"
            type="primary"
            @click="actionOTP()"
          >
            發送
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 驗證手機燈箱 -->
    <el-dialog
      v-model="verifyCodeDisable"
      title="驗證手機"
      width="500px"
      class="select-member-dialog"
      :before-close="dialogClose"
    >
      <el-row :gutter="24" style="margin: 0 0px 10px 0px">
        請輸入簡訊驗證碼
      </el-row>
      <el-form :model="verifyData" ref="verifyData">
        <el-form-item
          prop="code"
          :rules="[
            { required: false, message: '請輸入驗證碼', trigger: 'blur' },
            { min: 6, max: 6, message: '驗證碼不足 6 碼', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="verifyData.code"
            placeholder="輸入簡訊驗證碼"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogClose">取消</el-button>
          <el-button
            :disabled="verifyData.code == ''"
            type="primary"
            @click="actionCode()"
          >
            確認
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 詳細資料抽屜 -->
    <MemberDetailed
      v-model:show="showDrawer"
      :id="selectedId"
      :creator="employeeId"
      :resource="options"
      @dataUpdated="handleDataUpdated"
    />

    <!-- 家庭資料抽屜 -->
    <MemberRelatives
      v-model:show="relativesDrawer"
      :id="selectedId"
      :creator="employeeId"
      :resource="options"
      @dataUpdated="handleDataUpdated"
    />

    <!-- 歷程資料抽屜 -->
    <MemberHistory v-model:show="historyDrawer" :id="selectedId" />

    <!-- 歷程等級資料抽屜 -->
    <MemberHistoryLevel v-model:show="historyLevelDrawer" :id="selectedId" />

    <MemberBarcode v-model:show="barcodeDialog" :id="selectedId" />
  </div>
</template>

<script>
// getValidate,
import {
  getList,
  getValidate,
  memberCreate,
} from "@/api/functions/customer/search";
import { getMemberResource } from "@/api/functions/member";
// verificationCreate
import { memberVerify } from "@/api/functions/verification";
import Pagination from "@/components/Pagination/index.vue";
import MemberDetailed from "@/views/customer/search/components/detailed.vue";
import MemberRelatives from "@/views/customer/search/components/relatives.vue";
import MemberHistory from "@/views/customer/search/components/history.vue";
import MemberHistoryLevel from "@/views/customer/search/components/historyLevel.vue";
import MemberBarcode from "@/views/customer/search/components/barcode.vue";

export default {
  name: "CustomerSearch",

  components: {
    Pagination,
    MemberDetailed,
    MemberRelatives,
    MemberHistory,
    MemberHistoryLevel,
    MemberBarcode,
  },
  data() {
    return {
      showFilterData: true,
      shouldCallAPI: true,
      loading: false,
      showDrawer: false,
      relativesDrawer: false,
      historyDrawer: false,
      historyLevelDrawer: false,
      fullscreenLoading: false,
      selectedId: "",
      pageInfo: {},
      params: {
        phone: "",
        cus_no: "",
        idno: "",
        platform: ["huaying"],
      },
      options: [],
      list: [],
      dataRange: "huaying",
      importQueryItem: {},
      importValidateItem: {},
      importCreateItem: {},
      importOTPItem: {},
      importVerifyItem: {},
      validateData: {
        column: ["tel1", "tel2", "mobile"],
        value: "",
      },
      createData: {
        name: "", // 姓名
        nickname: "", // 線上姓名
        tel1: "", // 驗證號碼
        mobile: "", // 手機1
        tel2: "", // 家電
        idno: "", // 身分證字號
        sex: "0", // 性別 ，預設0，男1，女2
        birthday: "", // 生日
        prt_yn: false, // 收DM
        email: "", // 信箱
        zip_no: "", // 郵遞區號
        city: "", // 縣市
        area: "", // 區域
        street: "", // 街道
        create_emp: "", // 建立者
        // inpid: '000011' // 店編
      },
      verifyData: {
        creator: "", //員工編號
        code: "", //驗證碼
        phone: "",
      },
      validPhoneStatus: false, //true 可用 / false 不可用
      // selectMemberDisable: false,
      createMemberDisable: false,
      createSearchDisable: false,
      newsVerifyDisable: false,
      verifyCodeDisable: false,
      barcodeDialog: false,
      rules: {
        tel1: [
          { required: true, message: "必填欄位請輸入資料", trigger: "blur" },
          { validator: this.validateTel1, trigger: "blur" },
        ],
        tel2: [
          { required: false, message: "請輸入家用電話", trigger: "blur" },
          { validator: this.validateTel2, trigger: "blur" },
        ],
        mobile: [
          { required: false, message: "請輸入手機", trigger: "blur" },
          { validator: this.validateMobile, trigger: "blur" },
        ],
        idno: [
          { required: false, message: "請輸入身分證字號", trigger: "blur" },
          { validator: this.validateIdno, trigger: "blur" },
        ],
      },
      verify: {
        cus_no: "",
        create_emp: "",
      },
      showCreate_emp: false,
    };
  },

  created() {
    getMemberResource().then((res) => {
      this.options = res.data;
    });
    // this.createData.create_emp = this.employeeId
  },

  watch: {
    dataRange(newValue) {
      if (newValue == "all") {
        delete this.params.platform;
      } else {
        this.params.platform = ["huaying"];
      }
    },
  },

  computed: {
    employeeId() {
      return this.$store.getters.userInfo.account;
    },
    searchList() {
      let result = [];
      result = this.list.map((i) => {
        const item = {
          cus_no: i.cus_no,
          identify_phone: i.identify_phone,
          mobile: i.mobile,
          phone: i.phone,
          name: i.name,
          gender: i.gender,
          point:
            "可使用: " + i.point_can_use + "\n" + "今年: " + i.point_this_year,
          purchase:
            "今年: " +
            i.purchase_this_year +
            "\n" +
            "去年: " +
            i.purchase_last_year,
          purchase_date: i.purchase_date,
          lvl_id: i.lvl_id,
          lvl_name: i.lvl_name,
          platform: i.platform,
          identify: i.identify,
          can_edit: i.can_edit,
          show_identify_btn: i.show_identify_btn,
        };
        return item;
      });
      return result;
    },
    Header() {
      return {
        cus_no: {
          title: "會員編號",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "cus_no",
        },
        identify_phone: {
          title: "歸戶手機",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "identify_phone",
        },
        mobile: {
          title: "手機",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "mobile",
        },
        name: {
          title: "歸戶姓名",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "name",
        },
        point: {
          title: "累積點數",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "point",
        },
        purchase: {
          title: "累積金額",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "purchase",
        },
        lvl_name: {
          title: "會員等級",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "lvl_name",
        },
        platform: {
          title: "來源",
          show: true,
          width: "auto",
          align: "center",
          export: true,
          key: "platform",
        },
      };
    },
    detailPermission() {
      const permission = this.$store.getters.userInfo.permissions;
      return !permission.includes("api.backend.member.huaying.show");
    },
  },

  methods: {
    /**驗證號碼*/
    validateTel1(_rule, value, callback) {
      let tel1Number = /^[0-9]+$/;
      // this.importValidateItem = {}
      // this.importValidateItem = this.validateData

      if (typeof value === "undefined" || value === null || value === "") {
        callback();
      } else if (value.length < 9) {
        callback(new Error("需輸入區碼 或 10 碼手機號"));
      } else if (tel1Number.test(value) == false) {
        callback(new Error("驗證號碼僅可輸入數字"));
      } else if (value.startsWith("09") && value.length === 10) {
        callback();
      } else if (
        (value.length === 10 || value.length >= 9) &&
        !value.startsWith("09")
      ) {
        callback();
      } else {
        callback(new Error("號碼 09 開頭需輸入 10 碼"));
      }
    },

    /**驗證家電 */
    validateTel2(_rule, value, callback) {
      let tel2Regex = /^0\d{8,}$/;
      let tel2Number = /^[0-9]+$/;

      if (typeof value === "undefined" || value === null || value === "") {
        callback();
      } else if (value.length < 9 && tel2Regex.test(value) == false) {
        callback(new Error("會員家電需輸入區碼"));
      } else if (tel2Number.test(value) == false) {
        callback(new Error("家電號碼僅可輸入數字"));
      } else {
        callback();
      }
    },

    /**驗證手機 */
    validateMobile(_rule, value, callback) {
      let mobileRegex = /^09\d{8}$/;
      let mobileNumber = /^[0-9]+$/;

      if (typeof value === "undefined" || value === null || value === "") {
        callback();
      } else if (mobileNumber.test(value) == false) {
        callback(new Error("手機號碼僅可輸入數字"));
      } else if (mobileRegex.test(value) == false) {
        callback(new Error("號碼需 09 開頭且輸入 10 碼"));
      } else {
        callback();
      }
    },

    /**驗證身分證 */
    validateIdno(_rule, value, callback) {
      let idnoRegex = /^[A-Z]?\d{9}$/;
      if (typeof value === "undefined" || value === null || value === "") {
        callback();
      } else if (value.length < 9) {
        callback(new Error("身分證字號 / 護照號需輸入 9 碼以上"));
      } else if (!idnoRegex.test(value)) {
        callback(new Error("身分證字號需輸入 1 碼英文 9 碼數字"));
      } else {
        callback();
      }
    },

    /**選擇性別 */
    changeRadio(val) {
      val = val.toString();
      this.createData.sex = this.createData.sex == val ? "0" : val;
    },

    /**驗證號碼是否可用 */
    changeValidPhone(val) {
      if (val !== "") {
        getValidate(val)
          .then((res) => {
            this.validPhoneStatus = res.status;
            if (this.validPhoneStatus == false) {
              this.$message.error("此驗證號碼【不可用】");
            }
          })
          .catch((res) => {
            if (res.response.data?.exception) {
              this.$confirm(
                `${res.response.data.exception.message}`,
                "號碼驗證失敗",
                {
                  confirmButtonText: "確定",
                  showCancelButton: false,
                  type: "error",
                  center: true,
                }
              )
                .then(() => {})
                .catch(() => {});
            } else {
              this.$confirm(`${res.response.data.message}`, "號碼驗證失敗", {
                confirmButtonText: "確定",
                showCancelButton: false,
                type: "error",
                center: true,
              })
                .then(() => {})
                .catch(() => {});
            }
          });
      }
    },

    /**更新查詢 */
    handleDataUpdated(dataUpdated) {
      this.loading = true;
      this.importQueryItem = {};
      // 已經沒有號碼 抓不到
      this.params.phone = dataUpdated.tel1;

      for (const key in this.params) {
        if (this.params[key] != "") {
          this.importQueryItem["phone"] = this.params["phone"];
          this.importQueryItem["platform"] = this.params["platform"];
        }
      }
      this.actionGetList();
    },

    /**查詢-手機 */
    // actionSearch() {
    //   this.importQueryItem = {}
    //   if (
    //     this.params['phone'] &&
    //     this.params['phone'].length >= 7 &&
    //     !this.params['phone'].startsWith('09')
    //   ) {
    //     for (const key in this.params) {
    //       if (this.params[key] != '') {
    //         this.importQueryItem['phone'] = this.params['phone']
    //         this.importQueryItem['platform'] = this.params['platform']
    //       }
    //     }
    //     this.actionGetList()
    //   } else if (this.params['phone'].startsWith('09') && this.params['phone'].length === 10) {
    //     for (const key in this.params) {
    //       if (this.params[key] != '') {
    //         this.importQueryItem['phone'] = this.params['phone']
    //         this.importQueryItem['platform'] = this.params['platform']
    //       }
    //     }
    //     this.actionGetList()
    //   } else if (this.params['phone'].startsWith('09') && this.params['phone'].length != 10) {
    //     this.$notify({
    //       title: '電話號碼輸入錯誤',
    //       type: 'error',
    //       message: '手機號碼 09 開頭需為 10 碼'
    //     })
    //   } else {
    //     this.$notify({
    //       title: '電話號碼輸入錯誤',
    //       type: 'error',
    //       message: '請輸入正確電話號碼，如手機號碼須為 10 碼'
    //     })
    //   }
    // },

    /**查詢-手機New */
    actionSearch() {
      this.importQueryItem = {};
      if (
        this.params.phone.startsWith("09") &&
        this.params["phone"].length == 10
      ) {
        for (const key in this.params) {
          if (this.params[key] != "" && this.params[key] != null) {
            this.importQueryItem[key] = this.params[key];
          }
        }
        console.log(this.importQueryItem);
        // this.actionGetList()
      } else {
        this.$notify({
          title: "電話號碼輸入錯誤",
          type: "error",
          message: "手機號碼 09 開頭需為 10 碼",
        });
      }
    },

    /**查詢-清單*/
    actionGetList(data = {}) {
      this.loading = true;
      const postData = Object.assign({}, this.importQueryItem, data);

      getList(postData).then((res) => {
        this.list = res.data;
        if (this.list != "" && this.list.length != 0) {
          const { current_page, last_page, total, per_page } = res.meta;
          this.pageInfo = {
            currentPage: current_page,
            lastPage: last_page,
            total: total,
            perPage: per_page,
          };
          this.loading = false;
        } else {
          this.loading = false;
          this.$confirm(
            '<p>查無<span style="color: #409eff;">' +
              `${this.importQueryItem.phone}` +
              '</span>會員資料，是否以該號碼<span style="color: #409eff;">新建資料</span>?</p>',
            "查無資料",
            {
              dangerouslyUseHTMLString: true,
              confirmButtonText: "確定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              this.validPhoneStatus = true;
              this.createSearchDisable = true;
              this.createData.tel1 = this.importQueryItem.phone;
            })
            .catch(() => {});
        }
      });
    },

    /**篩選區域 */
    handleSelectCity() {
      if (this.createData.city) {
        let cityFilter = this.options.filter((item) => {
          return this.createData.city.includes(item.name);
        });
        let areaOptions = [];
        cityFilter.forEach((item) => {
          areaOptions = areaOptions.concat(item.towns);
        });
        this.createData.area = "";
        this.createData.zip_no = "";
        this.createData.street = "";
        this.options.towns = areaOptions;
      } else {
        this.createData.area = "";
        this.createData.zip_no = "";
        this.createData.street = "";
        this.options.towns = [];
      }
    },

    /**篩選郵遞區號 */
    handleSelectArea() {
      let selectedArea = this.createData.area;
      let findAreaData = this.options.towns.find(
        (town) => town.name === selectedArea
      );
      if (findAreaData) {
        let zipCode = findAreaData.zip_code;
        this.createData.zip_no = zipCode;
      }
    },

    /**門市新建會員 */
    actionCreate(checkVerify) {
      this.shouldCallAPI = false;

      this.$refs["createDataRef"].validate((valid) => {
        if (valid) {
          this.importCreateItem = {};
          for (const key in this.createData) {
            if (key === "city" || key === "area" || key === "street") {
              continue;
            }
            if (
              this.createData[key] !== "" &&
              this.createData[key] !== null &&
              this.createData[key] !== undefined
            ) {
              this.importCreateItem[key] = this.createData[key];
            }
          }
          //組合完整地址，城市、區域、街道
          if (
            this.createData.city !== "" ||
            this.createData.area !== "" ||
            this.createData.street !== ""
          ) {
            this.importCreateItem.adds =
              this.createData.city +
              this.createData.area +
              this.createData.street;
          }
          this.handleCreatMember(checkVerify);
          this.verify.create_emp = this.createData.create_emp;
          this.shouldCallAPI = true;
        } else {
          this.$message.info("必填欄位請輸入資料");
          this.shouldCallAPI = true;
        }
      });
    },

    /**建立是否送URL */
    handleCreatMember(checkVerify) {
      this.fullscreenLoading = true;

      memberCreate(this.importCreateItem).then(
        (res) => {
          this.importQueryItem = {};
          this.createMemberDisable = false;
          this.createSearchDisable = false;
          this.$refs["createDataRef"].resetFields();

          if (
            this.importCreateItem.tel1 != "" &&
            this.importCreateItem.tel1 != undefined &&
            this.importCreateItem.tel1 != null
          ) {
            this.params.phone = this.importCreateItem.tel1;
            this.importQueryItem["phone"] = this.importCreateItem.tel1;
            this.importQueryItem["platform"] = this.params.platform;

            this.$notify({
              title: "新增成功",
              type: "success",
              message: "會員新增成功",
            });

            this.verify.cus_no = res.cus_no;
            this.validPhoneStatus = true;

            if (checkVerify) {
              this.handleVerifyURL();
              console.log("成功送URL");
            }

            setTimeout(() => {
              this.createData.prt_yn = false;
              this.fullscreenLoading = false;
              this.actionGetList();
            }, 3500);
          }
        },
        (res) => {
          this.fullscreenLoading = false;
          if (res.response.data?.exception) {
            this.$confirm(
              `${res.response.data.exception.message}`,
              "新建會員失敗",
              {
                confirmButtonText: "確定",
                showCancelButton: false,
                type: "error",
                center: true,
              }
            )
              .then(() => {})
              .catch(() => {});
          } else {
            this.$confirm(`${res.response.data.message}`, "新建會員失敗", {
              confirmButtonText: "確定",
              showCancelButton: false,
              type: "error",
              center: true,
            })
              .then(() => {})
              .catch(() => {});
          }
        }
      );
    },

    /**發送驗證 URL */
    handleVerifyURL() {
      var self = this;
      var token = this.$store.getters.token;
      var xhr = new XMLHttpRequest();
      var apiEndpoint =
        import.meta.env.VITE_APP_BASE_API + "/api/backend/verify-url";
      xhr.open("POST", apiEndpoint, true);
      xhr.setRequestHeader("Authorization", "Bearer " + token);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        this.showCreate_emp = false;
        if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
          self.$message({
            type: "success",
            message: "發送驗證網址 成功!",
          });
          self.verify.create_emp = "";
          self.verify.cus_no = "";
          this.newsVerifyDisable = false;
        }
      };
      xhr.send(
        '{ "cus_no":"' +
          this.verify.cus_no +
          '", "create_emp":"' +
          this.verify.create_emp +
          '" }'
      );
    },

    /**詳細 */
    handleEdit(id) {
      this.selectedId = id;
      this.showDrawer = true;
    },

    /**家庭 */
    handleRelatives(id) {
      this.selectedId = id;
      this.relativesDrawer = true;
    },

    /**條碼 */
    handleBarcode(id) {
      this.selectedId = id;
      this.barcodeDialog = true;
    },

    /**資料歷程 */
    handleHistory(id) {
      this.selectedId = id;
      this.historyDrawer = true;
    },

    /**等級歷程 */
    handleLevelHistory(id) {
      this.selectedId = id;
      this.historyLevelDrawer = true;
    },

    //處理發送OTP/發送驗證、2.簡訊驗證
    handleOTP(data) {
      this.verify.cus_no = "";
      this.verify.create_emp = "";
      this.newsVerifyDisable = true;
      this.verify.cus_no = data.cus_no;
      this.verifyData.phone = data.identify_phone;

      // this.importOTPItem = {}
      // let strTemp = /^09\d{8}$/
      // if (data != '' && data != undefined && data != null) {
      //   //查詢列，有會員編號
      //   if (strTemp.test(data.identify_phone)) {
      //     this.verifyData.phone = data.identify_phone
      //     this.newsVerifyDisable = true
      //     this.importOTPItem['store_no'] = '000011' //門市代號
      //     this.importOTPItem['phone'] = this.verifyData.phone //電話號碼
      //     this.importOTPItem['model_id'] = data.cus_no //會員編號
      //   } else {
      //     this.$notify({
      //       title: '電話號碼錯誤',
      //       type: 'warning',
      //       message: '號碼 09 開頭需輸入 10 碼'
      //     })
      //   }
      // } else {
      //   //新增會員，無會員編號
      //   if (strTemp.test(this.importQueryItem.phone)) {
      //     this.verifyData.phone = this.importQueryItem.phone
      //     this.newsVerifyDisable = true
      //     this.importOTPItem['store_no'] = '000011'
      //     this.importOTPItem['phone'] = this.verifyData.phone
      //   } else {
      //     this.$notify({
      //
      //       message: '號碼 09 開頭需輸入     title: '電話號碼錯誤',
      //       type: 'warning',10 碼'
      //     })
      //   }
      // }
    },

    /**發送簡訊 */
    actionOTP() {
      if (this.createData.create_emp != "") {
        this.verify.create_emp = this.createData.create_emp;
        this.handleVerifyURL();
      } else {
        this.$message("請輸入員工編號");
      }
    },

    /**輸入驗證碼 */
    actionCode() {
      this.verifyData.creator = this.createData.create_emp;

      for (const key in this.verifyData) {
        if (
          this.verifyData[key] != "" &&
          this.verifyData[key] != undefined &&
          this.verifyData[key] != null
        )
          this.importVerifyItem[key] = this.verifyData[key];
      }

      memberVerify(this.importVerifyItem)
        .then((res) => {
          if (res.status === false) {
            if (res?.exception) {
              this.$confirm(
                `${res.exception.message}! 請重新輸入。`,
                "驗證手機失敗",
                {
                  confirmButtonText: "確定",
                  showCancelButton: false,
                  type: "error",
                  center: true,
                }
              )
                .then(() => {})
                .catch(() => {});
            } else {
              this.$confirm(`${res.message}! 請重新輸入。`, "驗證手機失敗", {
                confirmButtonText: "確定",
                showCancelButton: false,
                type: "error",
                center: true,
              })
                .then(() => {})
                .catch(() => {});
            }
          } else {
            this.newsVerifyDisable = false;
            this.verifyCodeDisable = false;
            this.$notify({
              title: "驗證成功",
              type: "success",
              message: "手機驗證成功",
            });
            this.actionSearch();
          }
        })
        .catch((res) => {
          if (res.response.data?.exception) {
            this.$confirm(
              `${res.response.data.exception.message}! 請重新輸入。`,
              "驗證手機失敗",
              {
                confirmButtonText: "確定",
                showCancelButton: false,
                type: "error",
                center: true,
              }
            )
              .then(() => {})
              .catch(() => {});
          } else {
            this.$confirm(
              `${res.response.data.message}! 請重新輸入。`,
              "驗證手機失敗",
              {
                confirmButtonText: "確定",
                showCancelButton: false,
                type: "error",
                center: true,
              }
            )
              .then(() => {})
              .catch(() => {});
          }
        });
    },

    /**關閉燈箱 */
    dialogClose() {
      if (this.$refs["createDataRef"] != undefined) {
        this.$refs["createDataRef"].resetFields();
      }
      if (this.verifyData.code != undefined) {
        this.verifyData.code = "";
      }
      this.createMemberDisable = false; //門市新增
      this.createSearchDisable = false; //查無新增
      // this.selectMemberDisable = false //選擇
      this.newsVerifyDisable = false; //傳簡訊
      this.verifyCodeDisable = false; //驗證碼
    },

    /**清除參數 */
    resetSearch() {
      this.params.phone = "";
      this.params.cus_no = "";
      this.params.idno = "";
      this.createData.tel1 = "";
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.app-container {
  .el-dialog {
    position: fixed;
    top: 50%;
    left: 0;
    bottom: 0;
    right: 0;
    transform: translate(0, -50%);
    height: max-content;
    .el-form-item__label {
      font-weight: 700;
    }
  }
  .select-member-dialog {
    .el-dialog__body {
      padding: 20px;
      .el-form-item {
        display: flex;
        flex-direction: column;
        .el-form-item__label {
          justify-content: flex-start;
          font-weight: 700;
        }
      }
      .el-row {
        p {
          margin: 0;
          span {
            color: #409eff;
          }
        }
      }
    }
  }

  .el-table {
    .el-button {
      span {
        display: inline-block;
        text-align: justify;
        width: 50px;
      }
    }
    .el-table__body {
      .el-table__row {
        td.el-table__cell {
          .cell {
            word-break: keep-all;
            word-wrap: break-word;
            white-space: pre-wrap;
            line-break: strict;
          }
        }
      }
    }
  }
  .flex-space-between {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .data-range-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .pagination-right {
    margin-top: 15px;
    margin-bottom: 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
