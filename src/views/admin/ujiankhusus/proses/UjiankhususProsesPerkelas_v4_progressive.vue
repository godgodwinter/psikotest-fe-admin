<script setup>
import { ref, computed } from "vue";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import SseJobPanel from "@/components/SseJobPanel.vue";

moment.updateLocale("id", localization);
const RAW_BASE = import.meta.env.VITE_API_TS_IST_BASE_URL_;
const BASE = (s => (s && s.endsWith("/") ? s : (s || "") + "/"))(RAW_BASE || "http://127.0.0.1:11001/");

const sekolahId = ref(2);
const kelasId = ref(10);
const today = () => moment().format("YYYY-MM-DD");

// === URL builders ===
const buildStartUrl = () =>
    `${BASE}api/v1/ujiankhusus/sse/sekolah/${sekolahId.value}/kelas/${kelasId.value}/siswa/0/generate`;
const buildEventUrl = ({ jobId }) =>
    `${BASE}api/v1/ujiankhusus/sse/sekolah/${sekolahId.value}/kelas/${kelasId.value}/siswa/0/event?jobId=${encodeURIComponent(jobId)}`;

// === Backfill: summary endpoint
async function fetchSummary(jobId) {
    // Contoh endpoint: /summary?jobId=...
    const url = `${BASE}api/v1/ujiankhusus/sse/sekolah/${sekolahId.value}/kelas/${kelasId.value}/siswa/0/summary?jobId=${encodeURIComponent(jobId)}`;
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) throw new Error(`summary ${r.status}`);
    const j = await r.json();
    // Normalisasi payload agar cocok dengan mergeFinalsFrom()
    // Harapkan { results:[{index,status}], max, counts } — sesuaikan jika server-mu beda.
    return j?.data || j;
}

// === Viewer: resolve job aktif (orang lain yang generate)
async function resolveJobId() {
    // Contoh endpoint: /current -> {jobId: "..."} atau 204 jika tidak ada
    const url = `${BASE}api/v1/ujiankhusus/sse/sekolah/${sekolahId.value}/kelas/${kelasId.value}/siswa/0/current`;
    const r = await fetch(url, { credentials: "include" });
    if (!r.ok) return null;
    const j = await r.json();
    return (j?.data?.jobId || j?.jobId || null);
}

function buildBody() {
    return { tanggal: today(), max: 20 };
}
</script>

<template>
    <div class="p-4 space-y-4">
        <SseJobPanel :title="`Generate Ujian — Sekolah ${sekolahId} / Kelas ${kelasId}`" :start-url="buildStartUrl"
            method="POST" :body="buildBody" :with-credentials="true" :event-url="buildEventUrl"
            :fetch-summary="fetchSummary" :resolve-job-id="resolveJobId" :auto-attach-on-mount="true" :max-logs="10" />
    </div>
</template>
