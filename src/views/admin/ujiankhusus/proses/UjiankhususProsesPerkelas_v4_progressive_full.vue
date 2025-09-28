<script setup lang="ts">
import ApiUjianKhusus from "@/axios/axiosIst";
import { ref, onBeforeUnmount, computed } from "vue";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
moment.updateLocale("id", localization);

// === Konfigurasi dasar ===
// Pastikan BASE_URL berakhiran "/"
function withTrailingSlash(s: string | undefined) {
    if (!s) return "/";
    return s.endsWith("/") ? s : s + "/";
}
const RAW_BASE = import.meta.env.VITE_API_TS_IST_BASE_URL_; // contoh: http://127.0.0.1:11001/
const BASE_URL = withTrailingSlash(RAW_BASE);               // -> pastikan ada trailing slash

const sekolah_id = ref(2); // SESUAIKAN sumbernya
const getSekolahAktif = ref({ kelas_id: 10 }); // SESUAIKAN sumbernya

// === State UI SSE ===
const isStreaming = ref(false);
const status = ref<"idle" | "queued" | "running" | "done" | "failed">("idle");
const step = ref(0);
const max = ref(0);
const percent = ref(0);
const counts = ref({ success: 0, failed: 0 });
const lastStepStatus = ref<"processing" | "success" | "failed" | null>(null);
const logs = ref<Array<{ index: number; status: string; error?: string | null }>>([]);

const jobId = ref<string | null>(null);
const jobKey = ref<string | null>(null);
let es: EventSource | null = null;

const kelasId = computed(() => getSekolahAktif.value.kelas_id);
const today = () => moment().format("YYYY-MM-DD");

// === Start job ===
async function startGenerate() {
    if (isStreaming.value) return; // sudah streaming

    resetUi();

    const body = {
        tanggal: today(),
        max: 20,
    };

    try {
        // ⛔ sebelumnya: GET + body (body diabaikan)
        // ✅ gunakan POST untuk memulai job
        const url = `${BASE_URL}api/v1/ujiankhusus/sse/sekolah/${sekolah_id.value}/kelas/${kelasId.value}/siswa/0/generate`;
        const r = await ApiUjianKhusus.get(url, body);
        const out = r.data?.data || r.data;

        jobId.value = out.jobId;
        jobKey.value = out.key;
        status.value = out.status ?? "queued";

        // Attach SSE secepat mungkin
        attachSSEByJobId(out.jobId);
    } catch (e) {
        status.value = "failed";
        console.error(e);
    }
}

// === Subscribe SSE ===
function attachSSEByJobId(jid: string) {
    const url = `${BASE_URL}api/v1/ujiankhusus/sse/sekolah/${sekolah_id.value}/kelas/${kelasId.value}/siswa/0/event?jobId=${encodeURIComponent(jid)}`;

    if (es) { es.close(); es = null; }

    // Jika pakai cookie sesi di backend (disarankan), aktifkan withCredentials
    // ⚠️ standar EventSource hanya support argumen kedua di sebagian browser modern.
    // Jika tidak support di environment-mu, alternatif: taruh token di query (?token=)
    // @ts-ignore
    es = new EventSource(url, { withCredentials: true });

    isStreaming.value = true;

    es.addEventListener("snapshot", (ev) => {
        const d = JSON.parse((ev as MessageEvent).data);
        updateFromPayload(d);
        status.value = d.status || "running";
    });

    es.addEventListener("progress", (ev) => {
        const d = JSON.parse((ev as MessageEvent).data);
        updateFromPayload(d);
        lastStepStatus.value = d.stepStatus ?? null;

        if (d.stepStatus === "success" || d.stepStatus === "failed") {
            logs.value.push({ index: d.step, status: d.stepStatus, error: d.error ?? null });
        }
    });

    es.addEventListener("done", (ev) => {
        const d = JSON.parse((ev as MessageEvent).data);
        if (d.counts) counts.value = d.counts;
        status.value = "done";
        cleanupSSE();
    });

    es.addEventListener("error", (ev) => {
        console.error("SSE error:", ev);
        status.value = "failed";
        cleanupSSE();
    });
}

function updateFromPayload(d: any) {
    jobId.value = d.jobId ?? jobId.value;
    jobKey.value = d.key ?? jobKey.value;
    if (typeof d.step === "number") step.value = d.step;
    if (typeof d.max === "number") max.value = d.max;
    if (typeof d.percent === "number") percent.value = d.percent;
    if (d.counts) counts.value = d.counts;
}

function resetUi() {
    status.value = "idle";
    step.value = 0;
    max.value = 0;
    percent.value = 0;
    counts.value = { success: 0, failed: 0 };
    lastStepStatus.value = null;
    logs.value = [];
}

function cleanupSSE() {
    isStreaming.value = false;
    if (es) { es.close(); es = null; }
}

onBeforeUnmount(() => cleanupSSE());
</script>


<template>
    <div class="p-4 space-y-4">
        <div class="flex items-center gap-2">
            <button class="px-4 py-2 rounded-xl text-white font-semibold"
                :class="isStreaming ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'"
                :disabled="isStreaming" @click="startGenerate">
                {{ isStreaming ? 'Sedang berjalan…' : 'Generate Ujian' }}
            </button>

            <span class="text-sm text-gray-600">
                Status:
                <b :class="{
                    'text-amber-600': status === 'queued' || lastStepStatus === 'processing',
                    'text-indigo-700': status === 'running',
                    'text-green-700': status === 'done',
                    'text-red-700': status === 'failed'
                }">{{ status }}</b>
            </span>
        </div>

        <!-- Progress bar -->
        <div class="space-y-1 max-w-xl">
            <div class="w-full bg-gray-200 rounded h-3 overflow-hidden">
                <div class="h-3 transition-all" :style="{ width: percent + '%', background: '#4f46e5' }"></div>
            </div>
            <div class="text-sm text-gray-700">
                Step: <b>{{ step }}</b> / {{ max }} — {{ Math.round(percent) }}%
            </div>
            <div class="text-sm text-gray-700">
                Success: <b class="text-green-700">{{ counts.success }}</b> •
                Failed: <b class="text-red-700">{{ counts.failed }}</b>
            </div>
            <div v-if="jobId" class="text-xs text-gray-500 break-all">jobId: {{ jobId }}</div>
        </div>

        <!-- Logs ringkas -->
        <div class="max-w-xl">
            <h3 class="font-semibold mb-2">Logs</h3>
            <ul class="space-y-1 text-sm">
                <li v-for="l in logs.slice(-10)" :key="l.index" class="flex items-center gap-2">
                    <span class="w-16 text-gray-500">Step {{ l.index }}</span>
                    <span :class="{
                        'text-amber-600': l.status === 'processing',
                        'text-green-700': l.status === 'success',
                        'text-red-700': l.status === 'failed',
                    }">
                        {{ l.status }}
                    </span>
                    <span v-if="l.error" class="text-xs text-red-500">— {{ l.error }}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
