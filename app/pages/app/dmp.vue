<script setup lang="ts">
// definePageMeta({
//   middleware: ["auth"],
// });
import { DotLottieVue } from '@lottiefiles/dotlottie-vue'

const dmpForm = useState('dmp-form', () => ({
  selectedAgency: '',
  agency: '',
  projectSummary: '',
  dataType: '',
  dataSource: '',
  humanSubjects: 'No',
  dataSharing: '',
  dataVolume: ''
}))

const agencyItems = ref([
  { label: 'NIH', value: 'NIH' },
  { label: 'NSF', value: 'NSF', disabled: true }, // grayed out
])
const NIHAgencyItems = [
  "National Cancer Institute (NCI)",
  "National Eye Institute (NEI)",
  "National Heart, Lung, and Blood Institute (NHLBI)",
  "National Human Genome Research Institute (NHGRI)",
  "National Institute on Aging (NIA)",
  "National Institute on Alcohol Abuse and Alcoholism (NIAAA)",
  "National Institute of Allergy and Infectious Diseases (NIAID)",
  "National Institute of Arthritis and Musculoskeletal and Skin Diseases (NIAMS)",
  "National Institute of Biomedical Imaging and Bioengineering (NIBIB)",
  "Eunice Kennedy Shriver National Institute of Child Health and Human Development (NICHD)",
  "National Institute on Deafness and Other Communication Disorders (NIDCD)",
  "National Institute of Dental and Craniofacial Research (NIDCR)",
  "National Institute of Diabetes and Digestive and Kidney Diseases (NIDDK)",
  "National Institute on Drug Abuse (NIDA)",
  "National Institute of Environmental Health Sciences (NIEHS)",
  "National Institute of General Medical Sciences (NIGMS)",
  "National Institute of Mental Health (NIMH)",
  "National Institute on Minority Health and Health Disparities (NIMHD)",
  "National Institute of Neurological Disorders and Stroke (NINDS)",
  "National Institute of Nursing Research (NINR)",
  "National Library of Medicine (NLM)",
  "National Center for Advancing Translational Sciences (NCATS)",
  "National Center for Complementary and Integrative Health (NCCIH)",
  "Fogarty International Center (FIC)",
  "Office of the Director (NIH Office of the Director)",
  // … you can include additional NIH offices/centers as needed
];

const dataTypeItems = ref<string[]>([
  'Imaging',
  'Surveys',
  'Genomic data',
  'Clinical records'
])

function onCreateDataType(value: string) {
  dataTypeItems.value.push(value)
  dmpForm.value.dataType = value
}

const humanSubjectsItems = ref(['Yes', 'No'])
const dmpStore = useState('dmp-data', () => null)
const items = ref([
  {
    date: 'Step 1',
    title: 'Project Details',
    description: 'In Progress',
    icon: 'line-md:confirm-circle-twotone-to-circle-twotone-transition',
    ui: {
      description: 'text-blue-400',
    },
  },
  {
    date: 'Step 2',
    title: 'Draft Review',
    description: 'Pending',
    icon: 'line-md:confirm-circle-twotone-to-circle-transition'
  },
  {
    date: 'Step 3',
    title: 'Download',
    description: 'Pending',
    icon: 'line-md:confirm-circle-twotone-to-circle-transition'
  }
])

// --- Loader State ---
const isGenerating = ref(false)
interface StatusResponse {
  status: 'processing' | 'completed' | 'failed' | 'not_found';
  result?: any;
  error?: string;
}

async function generateDMP() {
  isGenerating.value = true;
  
  const payload = {
    title: "Data Management Plan",
    agency: dmpForm.value.agency,
    projectSummary: dmpForm.value.projectSummary,
    dataType: dmpForm.value.dataType,
    dataSource: dmpForm.value.dataSource,
    humanSubjects: dmpForm.value.humanSubjects,
    dataSharing: dmpForm.value.dataSharing,
    dataVolume: dmpForm.value.dataVolume,
  }

  try {
    const submitRes = await $fetch('https://dev.dmpchef.org/api/query', {
      method: 'POST',
      body: payload
    }) as { job_id: string };

    const jobId = submitRes.job_id;
    console.log("Job submitted! ID:", jobId);

    // --- PART B: POLL FOR RESULTS ---
    let isDone = false;
    while (!isDone) {
      // Wait 60 seconds before checking
      await new Promise(resolve => setTimeout(resolve, 60000));

      console.log("Checking GPU status...");
      const statusRes = await $fetch<StatusResponse>(`https://dev.dmpchef.org/api/status?id=${jobId}`);

      if (statusRes.status === 'completed') {
        // SUCCESS! 
        dmpStore.value = statusRes.result;
        isGenerating.value = false;
        isDone = true;
        navigateTo('/app/dmp1');
      } 
      else if (statusRes.status === 'failed') {
        throw new Error("The GPU encountered an error during generation.");
      }
      // If status is 'processing', the loop naturally continues
    }

  } catch (err) {
    console.error("Generation Workflow Failed:", err);
    isGenerating.value = false;
    // You can add an alert here for the user
  }
}

function clearForm() {
  dmpForm.value = {
    selectedAgency: '',
    agency: '',
    projectSummary: '',
    dataType: '',
    dataSource: '',
    humanSubjects: 'No',
    dataSharing: '',
    dataVolume: ''
  }
}
</script>

<template>
  <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-300 to-white dark:from-blue-800 dark:to-transparent -z-10"></div>
  <div class="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6">
    <h1 class="text-4xl font-bold text-blue-500 dark:text-blue-300 mb-6 mt-6">
      Test DMP Chef
    </h1>
    <div class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 flex items-start space-x-3">
      <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-5 h-5 flex-shrink-0 text-amber-500 dark:text-amber-300" />
      <div>
        <h3 class="text-sm font-medium text-amber-800 dark:text-amber-100">
          This page is meant only for testing and validating the DMP Chef Python pipeline. 
      Ultimately, the DMP Chef pipeline will be integrated in DMPTool.org to provide researchers with a 
      familiar and convenient user interface that does not require any coding knowledge.
      </h3>
      </div>
    </div>
    

    <UTimeline orientation="horizontal" :default-value="0.5" :items="items" size="sm" class="w-full mb-6 ml-30" />
    <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
      <span class="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wide dark:bg-indigo-500">
        Action Required
      </span>
      <p class="text-lg text-gray-800 font-medium dark:text-gray-100">
        Provide essential information about your research project so DMP Chef can generate a Data Management Plan that meets your funder’s requirements.
      </p>
    </div>
    <div class="flex items-center justify-between gap-6 ml-60 mb-6">
      <h1 class="font-medium text-xl w-1/3">Funding Agency:</h1>
      <div class="w-2/3">
        <URadioGroup
          variant="card"
          orientation="horizontal"
          v-model="dmpForm.selectedAgency"
          :items="agencyItems"
        />
      </div>
    </div>

    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Select Institute/Department:</h1>
      <div class="w-2/3">
        <USelectMenu
          class="w-180 text-base"
          v-model="dmpForm.agency"
          :items="NIHAgencyItems"
          placeholder="Choose department or institute"
        />
      </div>
    </div>

    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Brief summary of the research context:</h1>
      <div class="w-2/3">
        <UTextarea size="xl" placeholder="Provide a short description of the research goals, setting, and scientific background." 
          autoresize class="w-180" v-model="dmpForm.projectSummary" />
      </div>
    </div>

    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Types of data to be collected:</h1>
      <div class="w-2/3">
        <USelectMenu
  class="w-180 text-base"
  v-model="dmpForm.dataType"
  :items="dataTypeItems"
  placeholder="Specify the kinds of data your project will generate (e.g., imaging, surveys, genomic data)."
  searchable
  :create-item="{ when: 'empty', position: 'bottom' }"
  @create="onCreateDataType"
/>

      </div>
    </div>
    
    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Source of data:</h1>
      <div class="w-2/3">
        <UTextarea size="xl" placeholder="Describe where or how the data will be obtained (e.g., participants, sensors, public datasets)." 
          autoresize class="w-180" v-model="dmpForm.dataSource" />
      </div>
    </div>

    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Human subjects:</h1>
      <div class="w-2/3">
        <URadioGroup orientation="horizontal" variant="card" default-value="System" v-model="dmpForm.humanSubjects" :items="humanSubjectsItems" />
      </div>
    </div>

    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Data sharing consent status (if applicable):</h1>
      <div class="w-2/3">
        <UTextarea size="xl" placeholder="Provide the consent status for sharing data collected from human subjects, if relevant." 
          autoresize class="w-180" v-model="dmpForm.dataSharing" />
      </div>
    </div>

    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex items-center justify-between gap-6">
      <h1 class="font-medium text-xl w-1/3">Estimated data volume, modality, and format:</h1>
      <div class="w-2/3">
        <UTextarea size="xl" placeholder="Enter the approximate amount of data and its expected modality (e.g., text, images) and file format (e.g., CSV, JPEG, JSON)." 
          autoresize class="w-180" v-model="dmpForm.dataVolume" />
      </div>
    </div>
    
    <div v-if="dmpForm.selectedAgency === 'NIH'" class="flex justify-center gap-36 pt-4">
      <UModal v-model="isGenerating" prevent-close :ui="{ width: 'sm:max-w-md' }">
        
        <UButton
          :loading="isGenerating"
          @click="generateDMP"
          color="primary"
          size="xl"
          class="w-50"
          icon="i-lucide-sparkles"
        >
          Generate DMP
        </UButton>

        <template #content>
          <div class="p-4 flex flex-col items-center justify-center">
            <DotLottieVue 
              style="height: 200px; width: 200px" 
              autoplay 
              loop 
              src="https://lottie.host/5cf19f5c-069f-4fe3-b34d-d339768dab6e/yqwsIi0a0D.lottie" 
            />
            <p class="text-lg font-medium text-gray-700 dark:text-gray-200 mt-4">Cooking your DMP...</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">This may take a moment.</p>
          </div>
        </template>
      </UModal>
      <UButton
        color="primary"
        variant="outline"
        size="xl"
        icon="i-heroicons-trash"
        @click="clearForm"
      >
        Clear form
      </UButton>
    </div>

    <SkyBg />
  </div>
</template>