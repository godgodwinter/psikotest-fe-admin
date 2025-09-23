<script setup>
import { onBeforeUnmount, onMounted, computed } from "vue";
import { useSseJob } from "@/composables/useSseJob";

const props = defineProps({
    // generator
    startUrl: { type: [String, Function], default: null },
    method: { type: String, default: "POST" },
    body: { type: [Object, Function], default: () => ({}) },
    headers: { type: Object, default: () => ({}) },

    // SSE
    eventUrl: { type: [String, Function], required: true },
    withCredentials: { type: Boolean, default: false },
    authQuery: { type: String, default: "" },

    // Backfill (server-side)
    // async (jobId) => { results:[{index,status}], max, counts, ... }
    fetchSummary: { type: Function, default: null },

    // Viewer-only: auto attach ke job aktif tanpa menekan tombol
    // async () => string|null (jobId sekarang)
    resolveJobId: { type: Function, default: null },
    autoAttachOnMount: { type: Boolean, default: true },

    // UI
    title: { type: String, default: "SSE Job" },
    maxLogs: { type: Number, default: 10 },
    startDisabled: { type: Boolean, default: false }
});

const {
    isStreaming, status, step, max, percent, counts, lastStepStatus, logs, jobId,
    finalLogs, startGenerate, attachSSEByJobId, cleanupSSE, resetUi
} = useSseJob();

async function onStart() {
    await startGenerate({
        startUrl: props.startUrl,
        method: props.method,
        body: props.body,
        headers: props.headers,
        withCredentials: props.withCredentials,
        eventUrl: props.eventUrl,
        authQuery: props.authQuery,
        fetchSummary: props.fetchSummary
    });
}

const statusClass = computed(() => {
    if (status.value === "done") return "text-green-700";
    if (status.value === "failed") return "text-red-700";
    if (status.value === "running") return "text-indigo-700";
    if (status.value === "queued" || lastStepStatus.value === "processing") return "text-amber-600";
    return "text-gray-700";
});

onMounted(async () => {
    if (props.autoAttachOnMount && typeof props.resolveJobId === "function") {
        try {
            const jid = await props.resolveJobId();
            if (jid) {
                await attachSSEByJobId({
                    jobId: jid,
                    eventUrl: props.eventUrl,
                    withCredentials: props.withCredentials,
                    authQuery: props.authQuery,
                    fetchSummary: props.fetchSummary
                });
            }
        } catch (e) {
            console.warn("resolveJobId failed:", e);
        }
    }
});

onBeforeUnmount(() => cleanupSSE());
</script>

<template>
    <div class="p-4 space-y-4 rounded-2xl border bg-white">
        <div class="flex items-center gap-2 justify-between">
            <h3 class="font-semibold text-lg">{{ title }}</h3>
            <div class="flex items-center gap-2">
                <button v-if="startUrl" class="px-4 py-2 rounded-xl text-white font-semibold"
                    :class="(isStreaming || startDisabled) ? 'bg-gray-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'"
                    :disabled="isStreaming || startDisabled" @click="onStart">
                    {{ isStreaming ? 'Sedang berjalan…' : 'Mulai Generate' }}
                </button>
                <button class="px-3 py-2 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200" :disabled="isStreaming"
                    @click="resetUi">
                    Reset
                </button>
            </div>
        </div>

        <div class="flex items-center gap-2 text-sm">
            <span class="text-gray-600">Status:</span>
            <b :class="statusClass">{{ status }}</b>
            <span v-if="jobId" class="text-xs text-gray-500 truncate">• jobId: {{ jobId }}</span>
        </div>

        <div class="space-y-1 max-w-xl">
            <div class="w-full bg-gray-200 rounded h-3 overflow-hidden">
                <div class="h-3 transition-all" :style="{ width: (percent || 0) + '%', background: '#4f46e5' }"></div>
            </div>
            <div class="text-sm text-gray-700">
                Step: <b>{{ step }}</b> / {{ max }} — {{ Math.round(percent || 0) }}%
            </div>
            <div class="text-sm text-gray-700">
                Success: <b class="text-green-700">{{ counts.success }}</b> •
                Failed: <b class="text-red-700">{{ counts.failed }}</b>
            </div>
        </div>

        <!-- Logs lengkap -->
        <div class="max-w-xl">
            <h4 class="font-semibold mb-2">Detail Proses Generate : </h4>
            <ul class="space-y-1 text-sm">
                <li v-for="l in logs.slice(-maxLogs)" :key="`${l.index}-${l.status}-${l.error || ''}`"
                    class="flex items-center gap-2">
                    <span class="w-20 text-gray-500">Step {{ l.index }}</span>
                    <span :class="{
                        'text-amber-600': l.status === 'processing',
                        'text-green-700': l.status === 'success',
                        'text-red-700': l.status === 'failed',
                    }">{{ l.status }}</span>
                    <span v-if="l.error" class="text-xs text-red-500">— {{ l.error }}</span>
                </li>
            </ul>
        </div>

        <!-- Hasil Akhir per Step (selalu lengkap dari 1..N berkat backfill) -->
        <div class="max-w-xl">
            <h4 class="font-semibold mb-2">Logs</h4>
            <ul class="space-y-1 text-sm">
                <li v-for="l in finalLogs" :key="`final-${l.index}`" class="flex items-center gap-2">
                    <span class="w-20 text-gray-500">Step {{ l.index }}</span>
                    <span :class="{
                        'text-green-700': l.status === 'success',
                        'text-red-700': l.status === 'failed',
                    }">{{ l.status }}</span>
                </li>
            </ul>
            <p v-if="!finalLogs.length" class="text-xs text-gray-500">Belum ada hasil akhir (menunggu success/failed).
            </p>
        </div>
    </div>
</template>
