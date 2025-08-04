<template>
  <v-container>
    <commonSupabaseTable
      tableName="subsidies"
      :headers="headers"
      title="補助金管理"
      :defineEditItems="editItems"
    />
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import commonSupabaseTable from "@/components/commonSupabaseTable.vue";

const headers = ref([
  { title: "ID", value: "id" },
  { title: "会社名", value: "company_name", search: "text" },
  { title: "補助金種類", value: "subsidy_type", search: "select", options: ["A補助金", "B補助金", "C補助金"] },
  { title: "申請状況", value: "status", search: "select", options: ["未申請", "申請中", "承認済み", "却下"] },
  { title: "申請日", value: "application_date", search: "datetime" },
  { title: "操作", value: "actions", sortable: false, align: "center" }
]);

const editItems = ref([
  { name: "company_name", label: "会社名", type: "text", required: true },
  { name: "subsidy_type", label: "補助金種類", type: "select", options: ["A補助金", "B補助金", "C補助金"], required: true },
  { name: "status", label: "申請状況", type: "select", options: ["未申請", "申請中", "承認済み", "却下"], required: true },
  { name: "application_date", label: "申請日", type: "date", required: true }
]);
</script>

<style scoped>
h1 {
  font-size: 24px;
}
</style>
