<script setup>
import { ref, computed } from "vue";
import { ZstdCodec } from "zstd-codec";
import ApiUjianKhusus from "@/axios/axiosIst";
import Toast from "@/components/lib/Toast";
import moment from "moment/min/moment-with-locales";
import localization from "moment/locale/id";
import C_ujiankhusus_menu from './C_ujiankhusus_menu.vue'
import { useAdminPagesStore } from '@/stores/admin/adminPagesStore'
import { useRouter, useRoute } from "vue-router";
moment.updateLocale("id", localization);


const router = useRouter();
const route = useRoute();
const sekolah_id = ref(route.params.sekolah_id)
const kelas_id = ref(route.params.kelas_id)
const adminPagesStore = useAdminPagesStore();
const getSekolahAktif = ref({
    sekolah_id: sekolah_id.value,
    kelas_id: kelas_id.value,
})
const kelas_nama = ref(adminPagesStore.getpages_sekolah_aktif ? adminPagesStore.getpages_sekolah_aktif.kelas_nama : "-")
adminPagesStore.$subscribe((mutation, state) => {
    getSekolahAktif.value = adminPagesStore.getpages_sekolah_aktif;
    // console.log(getSekolahAktif.value);
    kelas_nama.value = getSekolahAktif.value.kelas_nama;
    // inputCariKelas.value = getSekolahAktif.value.kelas_id;
});

const formatTanggal = "DD MMMM YYYY HH:mm:ss";


function formatToServerDateTime(localDateTimeString) {
    if (!localDateTimeString) return null;

    // Parse string dari input datetime-local (misal: "2025-09-19T02:12")
    const m = moment(localDateTimeString, "YYYY-MM-DDTHH:mm");

    // Pastikan di-parse dengan benar
    if (!m.isValid()) {
        console.warn("Invalid date:", localDateTimeString);
        return null;
    }

    // Konversi ke UTC dan format ke "2025-09-19T02:12:00.000Z"
    return m.utc().format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");
}
// State
const file = ref(null);
const jsonData = ref(null);
const isLoading = ref(false);
const isError = ref(false);
const tglMulai = ref("");
const tglAkhir = ref("");

// ✅ Tambahkan computed untuk mengecek apakah file sudah dipilih
const isFileSelected = computed(() => {
    return file.value instanceof File;
});

// File input handler
function handleFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile && !selectedFile.name.endsWith('.zst')) {
        alert('Hanya file berekstensi .zst yang diperbolehkan!');
        file.value = null;
        return;
    }
    file.value = selectedFile;
}

// Process the compressed .zst file
async function processFile() {
    if (!file.value) return alert("Pilih file dulu!");

    isLoading.value = true;
    isError.value = false;

    try {
        const arrayBuffer = await file.value.arrayBuffer();
        const compressed = new Uint8Array(arrayBuffer);

        ZstdCodec.run((zstd) => {
            const simple = new zstd.Simple();
            const decompressed = simple.decompress(compressed);

            const jsonString = new TextDecoder().decode(decompressed);
            const parsed = JSON.parse(jsonString);

            // Handle both single object and array
            if (Array.isArray(parsed)) {
                jsonData.value = parsed.map((item, index) => ({
                    no: index + 1,
                    nama: item.nama || "-",
                    tgl_mulai: formatDate(item.tgl_batas_mulai),
                    tgl_akhir: formatDate(item.tgl_batas_terakhir),
                    // v4_ujian_mmpi2_getJawabanBySiswaMapel_multi: Array.isArray(item.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi)
                    //     ? item.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi.length > 0
                    //     : !!item.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi,
                    ...item
                }));
            } else {
                jsonData.value = [{
                    no: 1,
                    nama: parsed.nama || "-",
                    tgl_mulai: formatDate(parsed.tgl_batas_mulai),
                    tgl_akhir: formatDate(parsed.tgl_batas_terakhir),
                    // v4_ujian_mmpi2_getJawabanBySiswaMapel_multi: Array.isArray(parsed.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi)
                    //     ? parsed.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi.length > 0
                    //     : !!parsed.v4_ujian_mmpi2_getJawabanBySiswaMapel_multi,
                    ...parsed
                }];
            }

            isLoading.value = false;
        });
    } catch (err) {
        console.error(err);
        isError.value = true;
        isLoading.value = false;
    }
}

// Format date for display
function formatDate(isoString) {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return new Intl.DateTimeFormat('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Jakarta'
    }).format(date);
}

// Submit data to server (with optional dates)
async function fn_submit() {
    if (!file.value) return alert("Pilih file dulu!");

    isLoading.value = true;
    isError.value = false;

    const formData = new FormData();
    formData.append("backupFile", file.value);


    const formattedTglMulai = formatToServerDateTime(tglMulai.value);
    const formattedTglAkhir = formatToServerDateTime(tglAkhir.value);

    if (formattedTglMulai) {
        formData.append("tgl_batas_mulai", formattedTglMulai);
    }
    if (formattedTglAkhir) {
        formData.append("tgl_batas_terakhir", formattedTglAkhir);
    }
    // if (tglMulai.value) {
    //     formData.append("tgl_batas_mulai", moment(tglMulai.value));
    // }
    // if (tglAkhir.value) {
    //     formData.append("tgl_batas_terakhir", moment(tglAkhir.value));
    // }

    // ✅ Debug FormData — karena FormData tidak bisa di-log biasa
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    try {
        // ✅ Kirim formData LANGSUNG, bukan dalam objek { formData }
        const response = await ApiUjianKhusus.post(
            "ujiankhusus/backup/multi/restore",
            formData, // <-- INI YANG BENAR!
            {
                headers: {
                    "Content-Type": "multipart/form-data", // Biarkan browser set boundary otomatis
                },
            }
        );

        Toast.success("Success", "Data berhasil dikirim ke server");
        console.log("Upload success", response);

    } catch (error) {
        console.error("Network error:", error);
        if (error.response) {
            console.error("Server Error:", error.response.data);
            Toast.danger("Error", `Server: ${error.response.data.message || "Gagal menyimpan data"}`);
        } else {
            Toast.danger("Error", "Terjadi kesalahan koneksi");
        }
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div>
        <C_ujiankhusus_menu :sekolah_id="getSekolahAktif?.sekolah_id" :kelas_id="getSekolahAktif?.kelas_id" />
    </div>
    <div>

        <article class="prose lg:prose-sm">
            <h1>UJIAN IQ : KELAS {{ kelas_nama }} </h1>
            <h5>UJIAN KHUSUS - V4</h5>
        </article>
    </div>
    <div class="p-2 space-x-2">
        <!-- <h1 class="text-2xl font-bold mb-4">Menu Import / Restore Data</h1>
        <h1 class="text-2xl font-bold mb-4">Upload File .zst & Tampilkan Data Siswa</h1> -->
        <!-- <h1 class="text-sm font-bold mb-4">Catatan: </h1>
        <h3 class="text-sm font-bold mb-4">- Data Akan direplace jika sudah ada.</h3>
        <h3 class="text-sm font-bold mb-4">- Jika file terlalu besar tidak perlu di tampilkan (dibrowser akan error) ,
            bisa langsung di push.</h3> -->
        <header class="flex items-center gap-3">
            <div class="avatar placeholder">
                <div class="bg-base-200 text-base-content rounded-xl w-10">
                    <span class="text-sm">IR</span>
                </div>
            </div>
            <div>
                <h1 class="text-2xl font-bold leading-tight">Import / Restore Data</h1>
                <p class="text-base-content/70">Upload berkas <kbd class="kbd kbd-sm">.zst</kbd> lalu tampilkan/restore
                    data siswa</p>
            </div>
        </header>
        <div class="divider my-2">Catatan</div>

        <div class="grid gap-3">
            <!-- Catatan utama -->
            <div class="card bg-base-100 shadow-sm">
                <div class="card-body p-4 md:p-5">
                    <div role="alert" class="alert alert-warning">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M12 9v3m0 3h.01M3.1 19h17.8L12 4.5 3.1 19z" />
                        </svg>
                        <div>
                            <h3 class="font-bold">Data akan menimpa (replace) yang sudah ada</h3>
                            <div class="text-sm opacity-80">
                                Saat proses restore, data yang memiliki ID sama akan <span
                                    class="badge badge-warning badge-sm">di-replace</span>.
                                Pastikan cadangan (backup) aman sebelum melanjutkan.
                            </div>
                        </div>
                    </div>

                    <div role="alert" class="alert alert-info mt-3">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.8"
                                d="M13 16h-1v-4h-1m1-4h.01M12 3a9 9 0 100 18 9 9 0 000-18z" />
                        </svg>
                        <div>
                            <h3 class="font-bold">Jika File besar (banyak data) tidak perlu ditampilkan di browser</h3>
                            <div class="text-sm opacity-80">
                                Jika ukuran berkas sangat besar, <span class="badge badge-info badge-sm">langsung
                                    push</span> tanpa pratinjau
                                untuk menghindari error memori di browser.
                            </div>
                        </div>
                    </div>

                    <ul class="mt-4 list-disc pl-5 text-sm leading-relaxed">
                        <li>Dukungan berkas: <code class="px-1 rounded bg-base-200">*.json.zst</code></li>
                        <li>Validasi akan memeriksa struktur JSON dan versi skema (bila ada).</li>
                        <li>Gunakan koneksi stabil; proses unggah tidak dapat di-undo.</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- File Input -->
        <input type="file" @change="handleFileChange" accept=".zst" />

        <!-- Optional Date Fields -->
        <div class="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium mb-1">Tanggal Mulai (Opsional)</label>
                <input type="datetime-local" v-model="tglMulai" class="border rounded px-3 py-2 w-full" />
            </div>
            <div>
                <label class="block text-sm font-medium mb-1">Tanggal Akhir (Opsional)</label>
                <input type="datetime-local" v-model="tglAkhir" class="border rounded px-3 py-2 w-full" />
            </div>
        </div>

        <!-- Buttons -->
        <div class="mt-4 flex flex-wrap gap-2">
            <button @click="processFile"
                class="btn btn-primary px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                :disabled="isLoading">
                {{ isLoading ? 'Memproses...' : 'Tampilkan Data File' }}
            </button>
            <button @click="fn_submit"
                class="btn btn-primary px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                :disabled="isLoading || !isFileSelected">
                {{ isLoading ? 'Memproses...' : 'Simpan Ke Server (Replace)' }}
            </button>
        </div>

        <!-- Loading / Error Messages -->
        <div v-if="isLoading" class="mt-2 text-blue-600">Loading...</div>
        <div v-if="isError" class="mt-2 text-red-500">Terjadi kesalahan saat membaca file</div>

        <!-- Display Data Table -->
        <div v-if="jsonData && jsonData.length" class="mt-6">
            <h2 class="text-xl font-semibold mb-3">Data Siswa:</h2>
            <div class="overflow-x-auto">
                <table class="min-w-full bg-white border border-gray-300">
                    <thead class="bg-gray-100">
                        <tr>
                            <th class="py-2 px-4 border">No</th>
                            <th class="py-2 px-4 border">Nama</th>
                            <th class="py-2 px-4 border">Tgl Mulai</th>
                            <th class="py-2 px-4 border">Tgl Akhir</th>
                            <th class="py-2 px-4 border">Mongo Proses Lengkap</th>
                            <th class="py-2 px-4 border">Mongo Proses Short</th>
                            <th class="py-2 px-4 border">Redis Proses Lengkap</th>
                            <th class="py-2 px-4 border">Redis Short</th>
                            <th class="py-2 px-4 border">Redis Jawaban</th>
                            <th class="py-2 px-4 border">SQL Siswa</th>
                            <th class="py-2 px-4 border">SQL Kelas</th>
                            <th class="py-2 px-4 border">SQL Sekolah</th>
                            <th class="py-2 px-4 border">username</th>
                            <th class="py-2 px-4 border">pass default</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in jsonData" :key="item.no" class="hover:bg-gray-50">
                            <td class="py-2 px-4 border text-center">{{ item.no }}</td>
                            <td class="py-2 px-4 border">{{ item.nama }}</td>
                            <td class="py-2 px-4 border">{{ item.tgl_mulai }}</td>
                            <td class="py-2 px-4 border">{{ item.tgl_akhir }}</td>
                            <td class="py-2 px-4 border text-center">
                                <span :class="item.ujiankhusus_proses ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.ujiankhusus_proses ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span
                                    :class="item.ujiankhusus_proses_short ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.ujiankhusus_proses_short ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span
                                    :class="item.ujiankhusus_proses_redis ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.ujiankhusus_proses_redis ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span
                                    :class="item.ujiankhusus_proses_redis_short ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.ujiankhusus_proses_redis_short ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span
                                    :class="item.redis_total_jawaban_tersimpan ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.redis_total_jawaban_tersimpan ? item.redis_total_jawaban_tersimpan : '0'
                                    }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span :class="item.data_siswa_sql ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.data_siswa_sql ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span :class="item.data_kelas_sql ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.data_kelas_sql ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span :class="item.data_sekolah_sql ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.data_sekolah_sql ? 'Ada' : 'Tidak Ada' }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span :class="item.data_siswa_sql ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.data_siswa_sql?.username }}
                                </span>
                            </td>
                            <td class="py-2 px-4 border text-center">
                                <span :class="item.data_siswa_sql ? 'text-green-600 font-medium' : 'text-red-600'">
                                    {{ item.data_siswa_sql?.passworddefault }}
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-else-if="jsonData && jsonData.length === 0" class="mt-4 text-gray-500">
            Tidak ada data ditemukan.
        </div>
    </div>
</template>

<style scoped>
.btn {
    cursor: pointer;
}
</style>