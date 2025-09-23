// composables/useSseJob.js
import { ref, computed, onMounted } from "vue";

export function useSseJob() {
  const isStreaming = ref(false);
  const status = ref("idle");
  const step = ref(0);
  const max = ref(0);
  const percent = ref(0);
  const counts = ref({ success: 0, failed: 0 });
  const lastStepStatus = ref(null);
  const logs = ref([]);
  const jobId = ref(null);
  const jobKey = ref(null);
  let es = null;

  // === FINAL RESULTS (tanpa localStorage) ===
  // { [stepNumber]: "success"|"failed" }
  const finalMap = ref({});
  const finalLogs = computed(() =>
    Object.entries(finalMap.value)
      .map(([k, v]) => ({ index: Number(k), status: v }))
      .sort((a, b) => a.index - b.index)
  );

  function setFinal(index, statusStr) {
    if (!index) return;
    if (statusStr !== "success" && statusStr !== "failed") return;
    // tulis/overwrite status final per step
    finalMap.value = { ...finalMap.value, [index]: statusStr };
  }

  // Terima ringkasan dari server dalam berbagai bentuk
  function mergeFinalsFrom(payload) {
    if (!payload) return;
    // Bentuk A: { results: [{index,status}] } atau { results: [{step,status}] }
    const arr =
      payload.results || payload.finals || payload.history || payload.steps;
    if (Array.isArray(arr)) {
      for (const it of arr) {
        const idx = it.index ?? it.step;
        const st = it.status;
        setFinal(idx, st);
      }
    }
    // Bentuk B: { finals: { "1":"success","2":"failed",... } }
    if (
      payload.finals &&
      !Array.isArray(payload.finals) &&
      typeof payload.finals === "object"
    ) {
      for (const [k, v] of Object.entries(payload.finals))
        setFinal(Number(k), v);
    }
    // muat meta jika ada
    if (typeof payload.max === "number") max.value = payload.max;
    if (payload.counts) counts.value = payload.counts;
  }

  function updateFromPayload(d) {
    if (!d) return;
    if (d.jobId != null) jobId.value = d.jobId;
    if (d.key != null) jobKey.value = d.key;
    if (typeof d.step === "number") step.value = d.step;
    if (typeof d.max === "number") max.value = d.max;
    if (typeof d.percent === "number") percent.value = d.percent;
    if (d.counts) counts.value = d.counts;

    // Jika snapshot membawa ringkasan, merge
    if (d.results || d.finals || d.history || d.steps) mergeFinalsFrom(d);
  }

  function resetUi() {
    status.value = "idle";
    step.value = 0;
    max.value = 0;
    percent.value = 0;
    counts.value = { success: 0, failed: 0 };
    lastStepStatus.value = null;
    logs.value = [];
    // finalMap TIDAK direset otomatis; biar viewer tetap lihat hasil final
    // gunakan resetFinals() kalau ingin bersihkan manual
  }
  function resetFinals() {
    finalMap.value = {};
  }

  function cleanupSSE() {
    isStreaming.value = false;
    if (es) {
      try {
        es.close();
      } catch {}
      es = null;
    }
  }

  // === START job baru (opsional, untuk generator) ===
  async function startGenerate({
    startUrl,
    method = "POST",
    body,
    headers,
    withCredentials = false,
    eventUrl,
    authQuery,
    fetchSummary, // <-- function async (jobId) => summaryPayload
  } = {}) {
    if (isStreaming.value) return;
    resetUi();
    resetFinals();

    const finalStartUrl =
      typeof startUrl === "function" ? startUrl() : startUrl;
    const payload = typeof body === "function" ? body() : body || undefined;

    try {
      const r = await fetch(finalStartUrl, {
        method,
        headers: { "Content-Type": "application/json", ...(headers || {}) },
        credentials: withCredentials ? "include" : "same-origin",
        body: method === "GET" ? undefined : JSON.stringify(payload || {}),
      });
      if (!r.ok) throw new Error(`Start failed: ${r.status} ${r.statusText}`);
      const json = await r.json();
      const out = json?.data || json;

      jobId.value = out.jobId || out.id || out.job_id || null;
      jobKey.value = out.key ?? null;
      status.value = out.status ?? "queued";

      await attachSSEByJobId({
        jobId: jobId.value,
        eventUrl,
        withCredentials,
        authQuery,
        fetchSummary,
      });
    } catch (e) {
      console.error(e);
      status.value = "failed";
      cleanupSSE();
    }
  }

  // === ATTACH ke job yang sudah berjalan (viewer) ===
  async function attachSSEByJobId({
    jobId: jid,
    eventUrl,
    withCredentials = false,
    authQuery,
    fetchSummary, // <-- backfill di sini
  } = {}) {
    if (!jid) {
      status.value = "failed";
      return;
    }
    jobId.value = jid;

    // 1) Backfill ringkasan dari REST (jika tersedia)
    try {
      if (typeof fetchSummary === "function") {
        const summary = await fetchSummary(jid);
        mergeFinalsFrom(summary);
      }
    } catch (e) {
      console.warn("fetchSummary failed:", e);
    }

    // 2) Buka SSE
    if (es) cleanupSSE();
    let url =
      typeof eventUrl === "function" ? eventUrl({ jobId: jid }) : eventUrl;
    if (!url.includes("jobId=")) {
      url +=
        (url.includes("?") ? "&" : "?") + `jobId=${encodeURIComponent(jid)}`;
    }
    if (authQuery) {
      url += (url.includes("?") ? "&" : "?") + authQuery.replace(/^\?/, "");
    }

    try {
      // eslint-disable-next-line no-undef
      es = new EventSource(
        url,
        withCredentials ? { withCredentials: true } : undefined
      );
    } catch (e) {
      console.error("Failed to open SSE:", e);
      status.value = "failed";
      return;
    }
    isStreaming.value = true;

    es.addEventListener("snapshot", (ev) => {
      try {
        updateFromPayload(JSON.parse(ev.data));
      } catch {}
      status.value = "running";
    });

    es.addEventListener("progress", (ev) => {
      try {
        const d = JSON.parse(ev.data);
        updateFromPayload(d);
        lastStepStatus.value = d.stepStatus ?? null;

        // catat log lengkap (opsional)
        if (d.stepStatus) {
          logs.value.push({
            index: d.step,
            status: d.stepStatus,
            error: d.error ?? null,
          });
          if (logs.value.length > 2000) logs.value.shift();
        }
        // tulis hasil final per step
        if (d.stepStatus === "success" || d.stepStatus === "failed") {
          setFinal(d.step, d.stepStatus);
        }
      } catch {}
    });

    es.addEventListener("done", (ev) => {
      try {
        const d = JSON.parse(ev.data);
        if (d.counts) counts.value = d.counts;
        // merge ringkasan terakhir jika server kirim finals di "done"
        mergeFinalsFrom(d);
      } catch {}
      status.value = "done";
      cleanupSSE();
    });

    es.addEventListener("error", (ev) => {
      console.error("SSE error:", ev);
      status.value = "failed";
      cleanupSSE();
    });
  }

  return {
    // state
    isStreaming,
    status,
    step,
    max,
    percent,
    counts,
    lastStepStatus,
    logs,
    jobId,
    finalLogs,
    finalMap,
    // actions
    startGenerate,
    attachSSEByJobId,
    resetUi,
    resetFinals,
    cleanupSSE,
  };
}
