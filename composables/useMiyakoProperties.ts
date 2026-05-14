import { ref, computed } from 'vue'
import { useSupabase } from './useSupabase'

// ============================================================
// 型定義
// ============================================================

export interface MiyakoProperty {
  id: string
  project_id: string | null
  customer_id: string | null
  property_code: string | null

  // ライフサイクル
  lifecycle_stage: 'prospect' | 'property' | 'archived'
  master_status: string
  auto_distribution: boolean

  // 基本情報
  property_type: string | null
  property_category: string | null
  transaction_type: string | null
  source: string | null
  pricing_type: string | null
  shop_name: string | null

  // 所在地
  postal_code: string | null
  prefecture: string | null
  city: string | null
  address: string | null
  building_name: string | null
  room_number: string | null

  // アクセス
  nearest_station: string | null
  station_distance: string | null
  station_distance_minutes: number | null
  access_info: string | null

  // 面積・構造
  floor_space_tsubo: number | null
  floor_space_sqm: number | null
  land_area_tsubo: number | null
  land_area_sqm: number | null
  floor: string | null
  total_floors: string | null
  structure: string | null
  built_year: number | null
  built_month: number | null

  // 価格・賃料
  price: number | null
  estimated_price: number | null
  minimum_price: number | null
  rent: number | null
  rent_tax_type: string | null
  management_fee: number | null
  common_fee: number | null
  deposit: string | null
  deposit_amount: number | null
  key_money: string | null
  key_money_amount: number | null
  renewal_fee: string | null
  other_cost: string | null
  water_cost: string | null
  negotiability: string | null
  desired_price_reason: string | null

  // 契約条件
  contract_type: string | null
  contract_period: string | null
  guarantee_company: string | null
  fire_insurance: string | null
  contract_negotiation_status: string | null
  contract_negotiation_detail: string | null
  floor_plan_status: string | null
  floor_plan_detail: string | null
  prior_notice: string | null
  new_conditions: string | null
  declarations: string | null
  new_tenant_conditions: string | null

  // 用途・条件
  usage_type: string | null
  previous_usage: string | null
  skeleton_or_furnished: string | null
  handover_condition: string | null
  handover_amount: number | null
  seats_count: number | null
  parking: string | null
  move_in_timing: string | null
  business_type: string | null
  floor_type: string | null

  // マッチング用
  allowed_business_types: any | null
  area_code: string | null
  property_strengths: any | null
  property_limitations: any | null
  location_weight: number | null
  equipment_weight: number | null
  valuation_amount: number | null

  // 依頼者情報
  requester_name: string | null
  requester_phone: string | null
  requester_phone_other: string | null
  requester_email: string | null

  // 反響情報
  echo_datetime: string | null
  echo_source: string | null
  echo_period: string | null
  echo_memo: string | null
  promotion_timing: string | null

  // 退店状況・理由
  closure_reasons: any | null
  closure_reason_other: string | null
  landlord_notified: string | null
  notified_to_landlord: boolean | null
  notified_to_management: boolean | null
  next_tenant_permission: string | null
  termination_notice: string | null
  employee_notified: string | null
  business_continuation: string | null
  closing_date: string | null
  desired_sale_period: string | null
  desired_sale_date: string | null
  other_consultation: string | null
  consultation_company: string | null
  consultation_start_date: string | null

  // 家主連絡先
  landlord_name: string | null
  landlord_contact: string | null
  landlord_phone: string | null
  landlord_note: string | null

  // 管理会社連絡先
  management_company: string | null
  management_contact: string | null
  management_phone: string | null
  management_note: string | null

  // ライフライン
  electricity_contract_type: string | null
  electricity_company: string | null
  electricity_customer_number: string | null
  gas_contract_type: string | null
  gas_company: string | null
  gas_customer_number: string | null
  water_contract_type: string | null
  water_company: string | null
  water_customer_number: string | null
  garbage_rules: string | null
  garbage_cost: string | null
  landlord_payment: string | null
  landlord_payment_detail: string | null
  other_monthly_costs: string | null
  other_monthly_costs_detail: string | null
  other_monthly_costs_amount: number | null

  // 設備詳細
  ventilation_has_fan: boolean | null
  ventilation_fan_route: any | null
  ventilation_has_duct: boolean | null
  ventilation_duct_route: any | null
  drainage_type: string | null
  kitchenware_status: string | null
  kitchenware_detail: string | null
  kitchen_equipment_units: any | null
  aircon_indoor_units: any | null
  floor_seats: any | null
  duct_detail: string | null
  grease_trap_detail: string | null
  facilities: string | null
  equipment_list: string | null
  facility_memo: string | null
  duct_body_photo: string | null
  grease_trap_body_photo: string | null
  kitchenware_photos: any | null

  // セクションメモ
  section_a_memo: string | null
  section_b_memo: string | null
  section_c_memo: string | null
  section_f_memo: string | null
  section_g_memo: string | null

  // 写真・書類
  lease_contract_photos: any | null
  floor_plan_photos: any | null
  contract_documents: any | null
  electricity_bill_photos: any | null
  gas_bill_photos: any | null
  water_bill_photos: any | null

  // お客様入力データ
  customer_input: any | null

  // メーター情報
  electric_meter_location: string | null
  electric_capacity: string | null
  power_capacity: string | null
  gas_meter_location: string | null
  gas_capacity: string | null
  water_meter_location: string | null
  water_drainage_capacity: string | null

  // 瑕疵・許認可
  defects: any | null
  permits: any | null
  fire_equipment: any | null

  // 売上・営業情報
  highest_sales_month: number | null
  lowest_sales_month: number | null
  lunch_hours: string | null
  dinner_hours: string | null
  lunch_avg_price: number | null
  dinner_avg_price: number | null
  closed_days: string | null
  construction_cost: number | null
  business_years: number | null

  // エリア・客層
  area_types: any | null
  customer_segments: any | null
  main_customer_age: string | null
  main_customer_gender: string | null
  customer_type: string | null
  surrounding_environment: string | null

  // 販売戦略
  sales_schedule: string | null
  property_overview: string | null
  current_tenant_description: string | null
  owner_management_note: string | null
  risks: string | null

  // 担当者
  input_user_id: string | null
  assigned_user_id: string | null
  visit_user_id: string | null
  teleapo_user_id: string | null
  next_action_user_id: string | null

  // 訪問情報
  visit_date: string | null
  visit_time: string | null
  visit_result: string | null

  // テレアポ
  teleapo_status: string | null
  teleapo_content: string | null
  teleapo_memo: string | null

  // NG判断
  ng_decision: string | null
  ng_reason: string | null

  // 次回アクション
  next_action_date: string | null
  next_action_content: string | null

  // メモ
  contact_history: any | null
  memo: string | null
  internal_memo: string | null
  temp_memo: string | null
  notes: string | null
  flag: string | null

  // 成約情報
  final_sales: number | null
  sales_month: string | null
  hearing_sheet_path: string | null

  // 自由記述（キャンバス）
  canvas_pages: string[] | null

  // 退店フォーム全データ（JSONB一括保存）
  exit_form_data: any | null

  // タイムスタンプ
  created_at: string
  updated_at: string
}

// 一覧表示用の簡易型
export interface MiyakoPropertyListItem {
  id: string
  shop_name: string | null
  prefecture: string | null
  city: string | null
  address: string | null
  lifecycle_stage: 'prospect' | 'property' | 'archived'
  master_status: string
  requester_name: string | null
  echo_source: string | null
  created_at: string
}

// 更新用の部分型
export type MiyakoPropertyUpdate = Partial<Omit<MiyakoProperty, 'id' | 'created_at'>>

// ============================================================
// Composable
// ============================================================

export const useMiyakoProperties = () => {
  // State
  const properties = ref<MiyakoPropertyListItem[]>([])
  const selectedProperty = ref<MiyakoProperty | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Supabaseクライアント取得（遅延評価）
  const getSupabase = () => useSupabase()

  // Computed
  const prospects = computed(() =>
    properties.value.filter(p => p.lifecycle_stage === 'prospect')
  )

  const activeProperties = computed(() =>
    properties.value.filter(p => p.lifecycle_stage === 'property')
  )

  // ============================================================
  // 一覧取得
  // ============================================================
  const fetchProperties = async (options?: {
    lifecycleStage?: 'prospect' | 'property' | 'archived' | 'all'
    limit?: number
  }) => {
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      let query = supabase
        .from('MIYAKO_PROPERTIES')
        .select(`
          id,
          shop_name,
          prefecture,
          city,
          address,
          lifecycle_stage,
          master_status,
          requester_name,
          echo_source,
          created_at
        `)
        .order('created_at', { ascending: false })

      // ライフサイクルフィルター
      if (options?.lifecycleStage && options.lifecycleStage !== 'all') {
        query = query.eq('lifecycle_stage', options.lifecycleStage)
      }

      // 件数制限
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error: fetchError } = await query

      if (fetchError) throw fetchError

      properties.value = data as MiyakoPropertyListItem[]
      return data
    } catch (e: any) {
      error.value = e.message || '物件一覧の取得に失敗しました'
      console.error('fetchProperties error:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // 詳細取得
  // ============================================================
  const fetchPropertyById = async (id: string): Promise<MiyakoProperty | null> => {
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()
      const { data, error: fetchError } = await supabase
        .from('MIYAKO_PROPERTIES')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      selectedProperty.value = data as MiyakoProperty
      return data as MiyakoProperty
    } catch (e: any) {
      error.value = e.message || '物件詳細の取得に失敗しました'
      console.error('fetchPropertyById error:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // 更新
  // ============================================================
  const updateProperty = async (id: string, updates: MiyakoPropertyUpdate): Promise<boolean> => {
    loading.value = true
    error.value = null
    console.log('既存物件更新:', { id, updates })

    try {
      const supabase = getSupabase()
      const { error: updateError } = await supabase
        .from('MIYAKO_PROPERTIES')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)

      console.log('UPDATE結果:', { error: updateError })

      if (updateError) throw updateError

      // ローカルのselectedPropertyも更新
      if (selectedProperty.value && selectedProperty.value.id === id) {
        selectedProperty.value = {
          ...selectedProperty.value,
          ...updates,
          updated_at: new Date().toISOString()
        }
      }

      return true
    } catch (e: any) {
      error.value = e.message || '物件情報の更新に失敗しました'
      console.error('updateProperty error:', e)
      return false
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // 退店フォームデータを物件に反映（新規作成/更新両対応）
  // ============================================================
  const updateFromExitForm = async (id: string | null, exitFormData: {
    // 基本情報
    contact?: {
      storeName?: string
      ownerName?: string
      address?: string
      phoneNumber?: string
    }
    // 退店状況
    status?: {
      selectedClosingReasons?: string[]
      reasonOtherText?: string
      landlordNotification?: string
      notifiedLandlord?: boolean
      notifiedManagement?: boolean
      nextTenantPermission?: string
      terminationNotice?: string
      employeeNotification?: string
      businessContinuation?: string
      closingDate?: string
      desiredSalePeriod?: string
      desiredSaleDate?: string
      otherConsultation?: string
      consultationCompany?: string
      desiredPrice?: number
      desiredPriceReason?: string
      consultationStartDate?: string
      // 家主連絡先
      landlordName?: string
      landlordContact?: string
      landlordPhone?: string
      landlordNote?: string
      // 管理会社連絡先
      managementCompany?: string
      managementContact?: string
      managementPhone?: string
      managementNote?: string
    }
    // 簡易査定
    locationInfo?: {
      rent?: number
      area?: number
    }
    equipment?: {
      constructionCost?: number
      businessYears?: number
      handoverCondition?: string
      handoverAmount?: number
    }
    propertyFeatures?: {
      businessType?: string
      floorType?: string
      strengths?: string[]
      limitations?: string[]
    }
    // 詳細チェック
    detailCheck?: any
    // 販売戦略
    salesOverview?: {
      schedule?: string
      propertyOverview?: string
      currentTenant?: string
      ownerManagement?: string
      risks?: string
    }
    strategy?: {
      sellingPrice?: number
      minimumPrice?: number
      negotiability?: string
    }
    // 自由記述（キャンバス）
    canvasPages?: string[]
  }): Promise<boolean> => {
    // 退店フォームのデータをMIYAKO_PROPERTIESのカラムにマッピング
    const updates: MiyakoPropertyUpdate = {}

    // 基本情報
    if (exitFormData.contact) {
      if (exitFormData.contact.storeName) updates.shop_name = exitFormData.contact.storeName
      if (exitFormData.contact.ownerName) updates.requester_name = exitFormData.contact.ownerName
      if (exitFormData.contact.address) updates.address = exitFormData.contact.address
      if (exitFormData.contact.phoneNumber) updates.requester_phone = exitFormData.contact.phoneNumber
    }

    // 退店状況
    if (exitFormData.status) {
      const s = exitFormData.status
      if (s.selectedClosingReasons) updates.closure_reasons = s.selectedClosingReasons
      if (s.reasonOtherText) updates.closure_reason_other = s.reasonOtherText
      if (s.landlordNotification) updates.landlord_notified = s.landlordNotification
      if (s.notifiedLandlord !== undefined) updates.notified_to_landlord = s.notifiedLandlord
      if (s.notifiedManagement !== undefined) updates.notified_to_management = s.notifiedManagement
      if (s.nextTenantPermission) updates.next_tenant_permission = s.nextTenantPermission
      if (s.terminationNotice) updates.termination_notice = s.terminationNotice
      if (s.employeeNotification) updates.employee_notified = s.employeeNotification
      if (s.businessContinuation) updates.business_continuation = s.businessContinuation
      if (s.closingDate) updates.closing_date = s.closingDate
      if (s.desiredSalePeriod) updates.desired_sale_period = s.desiredSalePeriod
      if (s.desiredSaleDate) updates.desired_sale_date = s.desiredSaleDate
      if (s.otherConsultation) updates.other_consultation = s.otherConsultation
      if (s.consultationCompany) updates.consultation_company = s.consultationCompany
      if (s.desiredPrice) updates.estimated_price = s.desiredPrice * 10000 // 万円→円
      if (s.desiredPriceReason) updates.desired_price_reason = s.desiredPriceReason
      if (s.consultationStartDate) updates.consultation_start_date = s.consultationStartDate
      // 家主連絡先
      if (s.landlordName) updates.landlord_name = s.landlordName
      if (s.landlordContact) updates.landlord_contact = s.landlordContact
      if (s.landlordPhone) updates.landlord_phone = s.landlordPhone
      if (s.landlordNote) updates.landlord_note = s.landlordNote
      // 管理会社連絡先
      if (s.managementCompany) updates.management_company = s.managementCompany
      if (s.managementContact) updates.management_contact = s.managementContact
      if (s.managementPhone) updates.management_phone = s.managementPhone
      if (s.managementNote) updates.management_note = s.managementNote
    }

    // 簡易査定
    if (exitFormData.locationInfo) {
      if (exitFormData.locationInfo.rent) updates.rent = exitFormData.locationInfo.rent * 10000
      if (exitFormData.locationInfo.area) updates.floor_space_tsubo = exitFormData.locationInfo.area
    }

    if (exitFormData.equipment) {
      const e = exitFormData.equipment
      if (e.constructionCost) updates.construction_cost = e.constructionCost
      if (e.businessYears) updates.business_years = e.businessYears
      if (e.handoverCondition) updates.handover_condition = e.handoverCondition
      if (e.handoverAmount) updates.handover_amount = e.handoverAmount
    }

    if (exitFormData.propertyFeatures) {
      const p = exitFormData.propertyFeatures
      if (p.businessType) updates.business_type = p.businessType
      if (p.floorType) updates.floor_type = p.floorType
      if (p.strengths) updates.property_strengths = p.strengths
      if (p.limitations) updates.property_limitations = p.limitations
    }

    // 詳細チェック（設備・ライフラインなど）
    if (exitFormData.detailCheck) {
      const d = exitFormData.detailCheck
      // ライフライン
      if (d.electricity_company) updates.electricity_company = d.electricity_company
      if (d.electricity_customer_number) updates.electricity_customer_number = d.electricity_customer_number
      if (d.gas_company) updates.gas_company = d.gas_company
      if (d.gas_customer_number) updates.gas_customer_number = d.gas_customer_number
      if (d.water_company) updates.water_company = d.water_company
      if (d.water_customer_number) updates.water_customer_number = d.water_customer_number
      // 設備
      if (d.ventilation_has_fan !== undefined) updates.ventilation_has_fan = d.ventilation_has_fan
      if (d.ventilation_has_duct !== undefined) updates.ventilation_has_duct = d.ventilation_has_duct
      if (d.drainage_type) updates.drainage_type = d.drainage_type
      if (d.kitchen_equipment_units) updates.kitchen_equipment_units = d.kitchen_equipment_units
      if (d.aircon_indoor_units) updates.aircon_indoor_units = d.aircon_indoor_units
      if (d.floor_seats) updates.floor_seats = d.floor_seats
      if (d.facility_memo) updates.facility_memo = d.facility_memo
      // 売上・営業
      if (d.highest_sales_month) updates.highest_sales_month = parseInt(d.highest_sales_month)
      if (d.lowest_sales_month) updates.lowest_sales_month = parseInt(d.lowest_sales_month)
      if (d.lunch_hours) updates.lunch_hours = d.lunch_hours
      if (d.dinner_hours) updates.dinner_hours = d.dinner_hours
      if (d.lunch_avg_price) updates.lunch_avg_price = parseInt(d.lunch_avg_price)
      if (d.dinner_avg_price) updates.dinner_avg_price = parseInt(d.dinner_avg_price)
      if (d.closed_days) updates.closed_days = d.closed_days
      if (d.seat_count) updates.seats_count = parseInt(d.seat_count)
      // エリア・客層
      if (d.area_types) updates.area_types = d.area_types
      if (d.customer_segments) updates.customer_segments = d.customer_segments
      if (d.main_customer_age) updates.main_customer_age = d.main_customer_age
      if (d.main_customer_gender) updates.main_customer_gender = d.main_customer_gender
      if (d.customer_type) updates.customer_type = d.customer_type
      if (d.access_info) updates.access_info = d.access_info
      if (d.surrounding_environment) updates.surrounding_environment = d.surrounding_environment
      // 瑕疵・許認可
      if (d.defects) updates.defects = d.defects
      if (d.permits) updates.permits = d.permits
      if (d.fire_equipment) updates.fire_equipment = d.fire_equipment
      // セクションメモ
      if (d.sectionAMemo !== undefined) updates.section_a_memo = d.sectionAMemo
      if (d.sectionBMemo !== undefined) updates.section_b_memo = d.sectionBMemo
      if (d.sectionCMemo !== undefined) updates.section_c_memo = d.sectionCMemo
      if (d.sectionFMemo !== undefined) updates.section_f_memo = d.sectionFMemo
      if (d.sectionGMemo !== undefined) updates.section_g_memo = d.sectionGMemo
      // 写真・書類
      if (d.leaseContractPhotos) updates.lease_contract_photos = d.leaseContractPhotos
      if (d.floorPlanPhotos) updates.floor_plan_photos = d.floorPlanPhotos
      if (d.contractDocuments) updates.contract_documents = d.contractDocuments
      if (d.electricityBillPhotos) updates.electricity_bill_photos = d.electricityBillPhotos
      if (d.gasBillPhotos) updates.gas_bill_photos = d.gasBillPhotos
      if (d.waterBillPhotos) updates.water_bill_photos = d.waterBillPhotos
      if (d.ductBodyPhoto) updates.duct_body_photo = d.ductBodyPhoto
      if (d.greaseBodyPhoto) updates.grease_trap_body_photo = d.greaseBodyPhoto
      if (d.kitchenwarePhotos) updates.kitchenware_photos = d.kitchenwarePhotos
      // お客様入力データ（ネスト構造をJSONBで保存）
      if (d.customerInput) updates.customer_input = d.customerInput
    }

    // 販売戦略
    if (exitFormData.salesOverview) {
      const so = exitFormData.salesOverview
      if (so.schedule) updates.sales_schedule = so.schedule
      if (so.propertyOverview) updates.property_overview = so.propertyOverview
      if (so.currentTenant) updates.current_tenant_description = so.currentTenant
      if (so.ownerManagement) updates.owner_management_note = so.ownerManagement
      if (so.risks) updates.risks = so.risks
    }

    if (exitFormData.strategy) {
      const st = exitFormData.strategy
      if (st.sellingPrice) updates.price = st.sellingPrice * 10000
      if (st.minimumPrice) updates.minimum_price = st.minimumPrice * 10000
      if (st.negotiability) updates.negotiability = st.negotiability
    }

    // 自由記述（キャンバス）
    if (exitFormData.canvasPages) {
      updates.canvas_pages = exitFormData.canvasPages
    }

    // ★ formData全体をJSONBで保存（全項目漏れなく保存）
    updates.exit_form_data = exitFormData

    // 新規作成（idがnullの場合）
    if (!id) {
      loading.value = true
      error.value = null
      console.log('新規物件作成:', updates)
      try {
        const supabase = getSupabase()
        const insertData = {
          ...updates,
          lifecycle_stage: 'prospect',
          master_status: '保留中',
          echo_datetime: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
        console.log('INSERT data:', insertData)

        const { data, error: insertError } = await supabase
          .from('MIYAKO_PROPERTIES')
          .insert(insertData)
          .select('id')
          .single()

        console.log('INSERT結果:', { data, error: insertError })

        if (insertError) throw insertError

        // 新規作成したIDを返す（呼び出し元で使用）
        if (data?.id) {
          lastCreatedId.value = data.id
          console.log('新規作成成功 ID:', data.id)
        }
        return true
      } catch (e: any) {
        error.value = e.message || '物件の新規作成に失敗しました'
        console.error('updateFromExitForm create error:', e)
        return false
      } finally {
        loading.value = false
      }
    }

    // 既存更新（idがある場合）
    return await updateProperty(id, updates)
  }

  // 最後に作成した物件のID（新規作成時に使用）
  const lastCreatedId = ref<string | null>(null)

  // ============================================================
  // 物件選択時にフォームデータへ変換
  // ============================================================
  const propertyToFormData = (property: MiyakoProperty) => {
    // ★ exit_form_dataがあればそれを優先して使用（全項目保存されている）
    if (property.exit_form_data && Object.keys(property.exit_form_data).length > 0) {
      const formData = property.exit_form_data
      // canvasPagesは別カラムなので上書き
      return {
        ...formData,
        canvasPages: property.canvas_pages || formData.canvasPages || ['']
      }
    }

    // 旧データの場合は個別カラムから読み込み
    return {
      contact: {
        storeName: property.shop_name || '',
        ownerName: property.requester_name || '',
        address: property.address || '',
        phoneNumber: property.requester_phone || ''
      },
      status: {
        selectedClosingReasons: property.closure_reasons || [],
        reasonOtherText: property.closure_reason_other || '',
        landlordNotification: property.landlord_notified || '',
        notifiedLandlord: property.notified_to_landlord || false,
        notifiedManagement: property.notified_to_management || false,
        nextTenantPermission: property.next_tenant_permission || '',
        terminationNotice: property.termination_notice || '',
        employeeNotification: property.employee_notified || '',
        businessContinuation: property.business_continuation || '',
        closingDate: property.closing_date || '',
        desiredSalePeriod: property.desired_sale_period || '',
        desiredSaleDate: property.desired_sale_date || '',
        otherConsultation: property.other_consultation || '',
        consultationCompany: property.consultation_company || '',
        desiredPrice: property.estimated_price ? property.estimated_price / 10000 : 0,
        desiredPriceReason: property.desired_price_reason || '',
        consultationStartDate: property.consultation_start_date || '',
        // 家主連絡先
        landlordName: property.landlord_name || '',
        landlordContact: property.landlord_contact || '',
        landlordPhone: property.landlord_phone || '',
        landlordNote: property.landlord_note || '',
        // 管理会社連絡先
        managementCompany: property.management_company || '',
        managementContact: property.management_contact || '',
        managementPhone: property.management_phone || '',
        managementNote: property.management_note || ''
      },
      locationInfo: {
        rent: property.rent ? property.rent / 10000 : 0,
        area: property.floor_space_tsubo || 0
      },
      equipment: {
        constructionCost: property.construction_cost || 0,
        businessYears: property.business_years || 0,
        handoverCondition: property.handover_condition || '',
        handoverAmount: property.handover_amount || 0
      },
      propertyFeatures: {
        businessType: property.business_type || '',
        floorType: property.floor_type || '',
        strengths: property.property_strengths || [],
        limitations: property.property_limitations || []
      },
      detailCheck: {
        electricity_company: property.electricity_company || '',
        electricity_customer_number: property.electricity_customer_number || '',
        gas_company: property.gas_company || '',
        gas_customer_number: property.gas_customer_number || '',
        water_company: property.water_company || '',
        water_customer_number: property.water_customer_number || '',
        ventilation_has_fan: property.ventilation_has_fan || false,
        ventilation_has_duct: property.ventilation_has_duct || false,
        drainage_type: property.drainage_type || '',
        kitchen_equipment_units: property.kitchen_equipment_units || [],
        aircon_indoor_units: property.aircon_indoor_units || [],
        floor_seats: property.floor_seats || [],
        facility_memo: property.facility_memo || '',
        highest_sales_month: property.highest_sales_month?.toString() || '',
        lowest_sales_month: property.lowest_sales_month?.toString() || '',
        lunch_hours: property.lunch_hours || '',
        dinner_hours: property.dinner_hours || '',
        lunch_avg_price: property.lunch_avg_price?.toString() || '',
        dinner_avg_price: property.dinner_avg_price?.toString() || '',
        closed_days: property.closed_days || '',
        seat_count: property.seats_count?.toString() || '',
        area_types: property.area_types || [],
        customer_segments: property.customer_segments || [],
        main_customer_age: property.main_customer_age || '',
        main_customer_gender: property.main_customer_gender || '',
        customer_type: property.customer_type || '',
        access_info: property.access_info || '',
        surrounding_environment: property.surrounding_environment || '',
        defects: property.defects || {},
        permits: property.permits || {},
        fire_equipment: property.fire_equipment || {},
        // セクションメモ
        sectionAMemo: property.section_a_memo || '',
        sectionBMemo: property.section_b_memo || '',
        sectionCMemo: property.section_c_memo || '',
        sectionFMemo: property.section_f_memo || '',
        sectionGMemo: property.section_g_memo || '',
        // 写真・書類
        leaseContractPhotos: property.lease_contract_photos || [],
        floorPlanPhotos: property.floor_plan_photos || [],
        contractDocuments: property.contract_documents || [],
        electricityBillPhotos: property.electricity_bill_photos || [],
        gasBillPhotos: property.gas_bill_photos || [],
        waterBillPhotos: property.water_bill_photos || [],
        ductBodyPhoto: property.duct_body_photo || '',
        greaseBodyPhoto: property.grease_trap_body_photo || '',
        kitchenwarePhotos: property.kitchenware_photos || [],
        // お客様入力データ
        customerInput: property.customer_input || {}
      },
      salesOverview: {
        schedule: property.sales_schedule || '',
        propertyOverview: property.property_overview || '',
        currentTenant: property.current_tenant_description || '',
        ownerManagement: property.owner_management_note || '',
        risks: property.risks || ''
      },
      strategy: {
        sellingPrice: property.price ? property.price / 10000 : 0,
        minimumPrice: property.minimum_price ? property.minimum_price / 10000 : 0,
        negotiability: property.negotiability || ''
      },
      // 自由記述（キャンバス）
      canvasPages: property.canvas_pages || ['']
    }
  }

  // ============================================================
  // 水面下物件一覧取得（マイページ表示用）
  // ============================================================
  /**
   * mypage用の物件データを取得 (二段階フェッチでセキュリティ担保)
   *
   * ステップ1: 全物件を「安全な項目のみ」で取得
   *   - 物件名・住所・徒歩時間・業態・設備・構造などの機密項目は取得しない
   * ステップ2: 承認済み(MIYAKO_CLIENT_INQUIRIES.status='approved')物件のIDを取得
   * ステップ3: 承認済み物件だけ全項目で再取得、マージ
   *
   * 未承認ユーザーはそもそも機密項目をNetworkに受け取らないため、
   * devtoolsで見てもデータが存在しない。
   */
  const fetchPropertiesForMypage = async (options?: {
    limit?: number
    userId?: string
  }) => {
    loading.value = true
    error.value = null

    try {
      const supabase = getSupabase()

      // ===== ステップ1: 安全項目のみ全件取得 =====
      // 公開OK: 物件ID, 賃料, 管理費, 面積, 敷金/礼金, 駅名, 階, 現況, PR, 造作有無, 入居時期
      // public_address: DBで生成された公開レベル適用済みの住所文字列(prefecture/city/addressは直接取らない)
      const safeFields = `
        id,
        lifecycle_stage,
        master_status,
        public_address,
        address_public_level,
        nearest_station,
        floor,
        floor_space_tsubo,
        floor_space_sqm,
        rent,
        management_fee,
        deposit,
        deposit_amount,
        key_money,
        key_money_amount,
        handover_condition,
        move_in_timing,
        pr_text,
        created_at,
        updated_at
      `
      // 水面下公開フラグが '公開中' のもののみ表示
      // （2026-05-15 業務フロー切替：物件化 != 水面下公開 に分離）
      // 旧フローでは publish_underground 不問だったが、新フローでは property-list 側で
      // 明示的に「水面下に公開」ボタンを押した物件のみが mypage に出る
      let safeQuery = supabase
        .from('MIYAKO_PROPERTIES')
        .select(safeFields)
        .eq('lifecycle_stage', 'property')
        .in('master_status', ['募集中', '商談中'])
        .eq('publish_underground', '公開中')
        .order('created_at', { ascending: false })

      if (options?.limit) {
        safeQuery = safeQuery.limit(options.limit)
      }

      const { data: safeData, error: safeError } = await safeQuery
      if (safeError) throw safeError
      const safeProps = (safeData || []) as any[]

      // ===== ステップ2: 承認済み物件IDの取得 =====
      const approvedIds = new Set<string>()
      if (options?.userId) {
        const { data: approvedData } = await supabase
          .from('MIYAKO_CLIENT_INQUIRIES')
          .select('property_id')
          .eq('user_id', options.userId)
          .eq('status', 'approved')
        for (const row of (approvedData || []) as any[]) {
          approvedIds.add(row.property_id)
        }
      }

      // ===== ステップ3: 承認済みのみ全項目で再取得 =====
      const fullMap = new Map<string, any>()
      if (approvedIds.size > 0) {
        const { data: fullData, error: fullError } = await supabase
          .from('MIYAKO_PROPERTIES')
          .select('*')
          .in('id', Array.from(approvedIds))
        if (fullError) throw fullError
        for (const p of (fullData || []) as any[]) {
          fullMap.set(p.id, p)
        }
      }

      // ===== マージ =====
      return safeProps.map((s) => {
        const full = fullMap.get(s.id)
        if (full) {
          return { ...full, _isApproved: true, _isLimited: false }
        }
        return { ...s, _isApproved: false, _isLimited: true }
      })
    } catch (e: any) {
      error.value = e.message || '水面下物件の取得に失敗しました'
      console.error('fetchPropertiesForMypage error:', e)
      return []
    } finally {
      loading.value = false
    }
  }

  // ============================================================
  // Return
  // ============================================================
  return {
    // State
    properties,
    selectedProperty,
    loading,
    error,
    lastCreatedId,

    // Computed
    prospects,
    activeProperties,

    // Methods
    fetchProperties,
    fetchPropertyById,
    fetchPropertiesForMypage,
    updateProperty,
    updateFromExitForm,
    propertyToFormData
  }
}
