<template>
    <div class="min-h-screen bg-gray-50">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between items-center h-16">
                    <div class="flex items-center space-x-6">
                        <button
                            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            @click="toggleProsesUjian">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Proses Ujian IQ</span>
                        </button>

                        <button
                            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            @click="exportData">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            <span>Export</span>
                        </button>

                        <button
                            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            @click="restoreData">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.356-2m15.356 2H15" />
                            </svg>
                            <span>Restore</span>
                        </button>

                        <button
                            class="flex items-center space-x-2 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
                            @click="printData">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4m0 0V5a2 2 0 012-2h6a2 2 0 012 2v4" />
                            </svg>
                            <span>Data Ujian IQ IST / 8KM (CETAK)</span>
                        </button>
                    </div>

                    <div class="flex items-center space-x-4">
                        <div class="relative">
                            <input v-model="searchQuery" type="text" placeholder="Cari..."
                                class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64" />
                            <svg class="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <!-- Main Content -->
            <div class="bg-white rounded-xl shadow-sm border p-6 mb-8">
                <div class="mb-6">
                    <h1 class="text-2xl font-bold text-gray-900 mb-2">UJIAN IQ : KELAS {{ selectedClass }}</h1>
                    <p class="text-sm text-gray-600">UJIAN KHUSUS - V4</p>
                </div>

                <!-- Filters -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Tipe Cita cita:</label>
                        <select v-model="citaCita"
                            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                            <option value="Kelas 9-10">Kelas 9-10</option>
                            <option value="Kelas 11">Kelas 11</option>
                            <option value="Kelas 12">Kelas 12</option>
                        </select>
                    </div>

                    <div class="flex items-center space-x-4">
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Mulai:</label>
                            <input type="datetime-local" v-model="startDate"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                        <div class="flex-1">
                            <label class="block text-sm font-medium text-gray-700 mb-2">Tanggal Selesai:</label>
                            <input type="datetime-local" v-model="endDate"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                        </div>
                    </div>
                </div>

                <div class="flex flex-wrap gap-4 mb-6">
                    <button @click="applyFilters"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>Apply</span>
                    </button>

                    <div class="flex items-center space-x-2 text-sm text-gray-600 mt-2">
                        <span>Ujian Psikologi</span>
                        <span class="font-medium">8KM+HSPQ+MINAT</span>
                    </div>
                </div>

                <!-- Notes -->
                <div class="bg-gray-50 rounded-lg p-4 mb-6">
                    <h3 class="font-medium text-gray-700 mb-2">Catatan:</h3>
                    <ul class="text-sm text-gray-600 space-y-1">
                        <li>- aktifkan paket pada menu Paketsoal</li>
                        <li>- Jika ada susulan, jangan menggunakan generate perkelas</li>
                        <li>- Jika ada susulan, gunakan generate persiswa</li>
                    </ul>
                </div>

                <!-- Action Buttons -->
                <div class="flex flex-wrap gap-2 mb-6">
                    <button @click="deletePerKelas"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete Per Kelas V3
                    </button>

                    <button @click="generateUjian"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                        Generate UJIAN KHUSUS Per Kelas V3
                    </button>

                    <button @click="caching1"
                        class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
                        Caching #1 Perkelas
                    </button>

                    <button @click="caching2"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Caching #2 Perkelas
                    </button>
                </div>

                <!-- Export Buttons -->
                <div class="flex flex-wrap gap-2 mb-6">
                    <button class="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                        EXPORT REKAP V3 (.xlsx) / OLD
                    </button>

                    <button class="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                        EXPORT REKAP V3 (.xlsx) + fakultas / OLD
                    </button>

                    <button class="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                        Export Excel 1010 v4 (.xlsx)
                    </button>

                    <button class="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                        Sinkron Data Redis V3
                    </button>

                    <button class="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors">
                        Export Data Mentah Hasil Ujian V4
                    </button>
                </div>
            </div>

            <!-- Table -->
            <div class="bg-white rounded-xl shadow-sm border overflow-hidden">
                <div class="p-6 border-b">
                    <div class="flex items-center justify-between">
                        <div class="relative flex-1 max-w-md">
                            <input v-model="tableSearch" type="text" placeholder="Search Table"
                                class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <svg class="w-4 h-4 text-gray-500 absolute left-3 top-2.5" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            @click="refreshTable">
                            <svg class="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.356-2m15.356 2H15" />
                            </svg>
                            Refresh
                        </button>
                    </div>
                </div>

                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Hasil</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IQ IST</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    IQ 8KM</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Progress</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Username</th>
                                <th
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Password Default</th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <tr v-for="(student, index) in filteredStudents" :key="index"
                                class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <button
                                            class="px-2 py-1 bg-orange-500 text-white text-xs rounded hover:bg-orange-600 transition-colors">
                                            Caching #1
                                        </button>
                                        <button
                                            class="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                            </svg>
                                        </button>
                                        <button
                                            class="px-2 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                            </svg>
                                        </button>
                                        <button
                                            class="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ student.name }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span class="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded">V4</span>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">-</td>
                                <td class="px-6 py-4 whitespace-nowrap">-</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-sm text-gray-600">{{ student.progress }}/18</span>
                                        <span class="text-sm text-gray-500">Belum</span>
                                    </div>
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">{{ student.username }}</td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center space-x-2">
                                        <span class="text-sm">{{ student.password }}</span>
                                        <button class="p-1 text-gray-500 hover:text-gray-700"
                                            @click="copyPassword(student.password)">
                                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h10a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <!-- Generate Process Modal -->
            <div v-if="showGenerateModal"
                class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div class="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
                    <div class="p-6">
                        <div class="flex justify-between items-start mb-6">
                            <div>
                                <h2 class="text-xl font-semibold text-gray-900">Generate Ujian — Sekolah 2 / Kelas 10
                                </h2>
                                <div class="mt-2 text-sm text-gray-600">
                                    <span>Status: <span class="font-mono text-purple-600">{{ status }}</span></span>
                                    <span class="mx-2">•</span>
                                    <span>jobId: <span class="font-mono text-gray-700">{{ jobId }}</span></span>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button @click="resetProcess"
                                    class="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div class="space-y-4">
                            <div>
                                <div class="w-full bg-gray-200 rounded-full h-2.5">
                                    <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
                                        :style="{ width: `${progress}%` }"></div>
                                </div>
                                <div class="mt-2 text-sm text-gray-600">
                                    Step: {{ currentStep }} / 20 — {{ progress }}%
                                </div>
                                <div class="text-sm text-gray-600">
                                    Success: <span class="text-green-600">{{ successCount }}</span> • Failed: <span
                                        class="text-red-600">{{ failedCount }}</span>
                                </div>
                            </div>

                            <div>
                                <h3 class="font-medium text-gray-900 mb-2">Detail Proses Generate:</h3>
                                <div class="space-y-1">
                                    <div v-for="(step, index) in processSteps" :key="index"
                                        class="flex items-center justify-between text-sm">
                                        <span>Step {{ index + 1 }}</span>
                                        <span :class="{
                                            'text-green-600': step.status === 'success',
                                            'text-orange-600': step.status === 'processing',
                                            'text-red-600': step.status === 'failed'
                                        }">
                                            {{ step.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 class="font-medium text-gray-900 mb-2">Logs:</h3>
                                <div class="space-y-1">
                                    <div v-for="(log, index) in logs" :key="index"
                                        class="flex items-center justify-between text-sm">
                                        <span>Step {{ log.step }}</span>
                                        <span :class="{
                                            'text-green-600': log.status === 'SUCCESS',
                                            'text-red-600': log.status === 'FAILED'
                                        }">
                                            {{ log.status }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: 'App',
    data() {
        return {
            searchQuery: '',
            selectedClass: 'Testing',
            citaCita: 'Kelas 9-10',
            startDate: '2025-05-29T06:05',
            endDate: '2025-09-30T08:50',
            tableSearch: '',
            showGenerateModal: false,
            status: 'running',
            jobId: 'f72e075e-2598-4a56-a649-fc194d4eb22d',
            progress: 10,
            currentStep: 3,
            successCount: 2,
            failedCount: 0,
            processSteps: [
                { status: 'success' },
                { status: 'processing' },
                { status: 'success' },
                { status: 'processing' }
            ],
            logs: [
                { step: 1, status: 'SUCCESS' },
                { step: 2, status: 'SUCCESS' }
            ],
            students: [
                { id: 1, name: 'MUHAMMAD ALIM MAJID', progress: 0, username: 'muhamm579031', password: '8f36d4' },
                { id: 2, name: 'Theresia Oktavia Ariana Putri', progress: 0, username: 'theres9779032', password: 'iobv3n' },
                { id: 3, name: 'THEODORE IVAN DEO RAFAEL', progress: 0, username: 'theodo2799033', password: 'o0xfln' }
            ]
        }
    },
    computed: {
        filteredStudents() {
            if (!this.tableSearch) {
                return this.students;
            }

            const query = this.tableSearch.toLowerCase();
            return this.students.filter(student =>
                student.name.toLowerCase().includes(query) ||
                student.username.toLowerCase().includes(query)
            );
        }
    },
    methods: {
        toggleProsesUjian() {
            // Handle proses ujian toggle
            console.log('Proses Ujian IQ toggled');
        },
        exportData() {
            // Handle export data
            console.log('Exporting data');
        },
        restoreData() {
            // Handle restore data
            console.log('Restoring data');
        },
        printData() {
            // Handle print data
            console.log('Printing data');
        },
        applyFilters() {
            // Handle filter application
            console.log('Applying filters');
        },
        deletePerKelas() {
            // Handle delete per kelas
            console.log('Deleting per kelas');
        },
        generateUjian() {
            this.showGenerateModal = true;
            this.startProcess();
        },
        caching1() {
            // Handle caching 1
            console.log('Caching #1 Perkelas');
        },
        caching2() {
            // Handle caching 2
            console.log('Caching #2 Perkelas');
        },
        refreshTable() {
            // Handle table refresh
            console.log('Refreshing table');
        },
        copyPassword(password) {
            navigator.clipboard.writeText(password);
            alert(`Password copied: ${password}`);
        },
        startProcess() {
            // Simulate process with interval
            this.status = 'running';
            this.currentStep = 1;
            this.progress = 0;
            this.successCount = 0;
            this.failedCount = 0;

            let step = 1;
            const interval = setInterval(() => {
                if (step > 20) {
                    clearInterval(interval);
                    this.status = 'completed';
                    this.progress = 100;
                    this.currentStep = 20;
                    this.processSteps = this.processSteps.map((step, index) => ({
                        ...step,
                        status: index < 20 ? 'success' : 'failed'
                    }));
                    this.logs.push({ step: 20, status: 'SUCCESS' });
                    setTimeout(() => {
                        this.showGenerateModal = false;
                    }, 2000);
                    return;
                }

                this.currentStep = step;
                this.progress = Math.round((step / 20) * 100);

                // Randomly set success or failure for steps
                const randomSuccess = Math.random() > 0.1; // 90% chance of success
                if (randomSuccess) {
                    this.successCount++;
                    this.processSteps[step - 1].status = 'success';
                    this.logs.push({ step, status: 'SUCCESS' });
                } else {
                    this.failedCount++;
                    this.processSteps[step - 1].status = 'failed';
                    this.logs.push({ step, status: 'FAILED' });
                }

                // Update processing status for next step
                if (step < 20) {
                    this.processSteps[step].status = 'processing';
                }

                step++;
            }, 500);
        },
        resetProcess() {
            this.showGenerateModal = false;
            this.status = 'idle';
            this.progress = 0;
            this.currentStep = 1;
            this.successCount = 0;
            this.failedCount = 0;
            this.processSteps = this.processSteps.map(step => ({ ...step, status: 'idle' }));
            this.logs = [];
        }
    }
}
</script>

<style scoped>
/* Add any additional styles here */
</style>
```