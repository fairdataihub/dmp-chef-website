<script setup lang="ts">
import { saveAs } from 'file-saver'

/* -----------------------------
Global State
------------------------------*/
const dmpStore = useState('dmp-data')
const jobIdStore = useState<string | null>('dmp-job-id')

const dmp = computed(() => dmpStore.value)
const jobId = computed(() => jobIdStore.value)

/* Redirect if missing result */
if (!dmp.value) {
  navigateTo('/app/dmp')
}

/* -----------------------------
Download Format Options
------------------------------*/
const downloadItems = ref([
  { label: 'DOCX', value: 'docx', description: 'Word document' },
  { label: 'Markdown', value: 'md', description: 'Markdown file' },
  { label: 'JSON', value: 'json', description: 'Structured JSON' }
])

const selectedFormat = ref('json')

/* -----------------------------
Feedback Modal
------------------------------*/
const isFeedbackModalOpen = ref(false)
const feedbackStep = ref(1)
const userRating = ref<'yes' | 'no' | null>(null)
const userComment = ref('')

function handleRating(rating: 'yes' | 'no') {
  userRating.value = rating
  feedbackStep.value = 2
}

function submitFeedback() {
  console.log('Feedback:', {
    rating: userRating.value,
    comment: userComment.value
  })

  isFeedbackModalOpen.value = false
}

/* -----------------------------
Download Logic (API Based)
------------------------------*/
async function handleDownload() {
  if (!jobId.value) {
    console.error("Missing job ID")
    return
  }

  try {
    const res = await fetch(
      `https://dev.dmpchef.org/api/download/${jobId.value}/${selectedFormat.value}`
    )

    if (!res.ok) {
      throw new Error("Download failed")
    }

    const blob = await res.blob()
    saveAs(blob, `DMP_Plan.${selectedFormat.value}`)

  } catch (err) {
    console.error("Download error:", err)
  }

  /* Open feedback modal */
  feedbackStep.value = 1
  userRating.value = null
  userComment.value = ''
  isFeedbackModalOpen.value = true
}

/* -----------------------------
Timeline
------------------------------*/
const items = ref([
  {
    date: 'Step 1',
    title: 'Project Details',
    description: 'Completed',
    icon: 'line-md:confirm-circle',
    ui: { description: 'text-blue-400' }
  },
  {
    date: 'Step 2',
    title: 'Draft Review',
    description: 'Completed',
    icon: 'line-md:confirm-circle',
    ui: { description: 'text-blue-400' }
  },
  {
    date: 'Step 3',
    title: 'Download',
    description: 'In Progress',
    icon: 'line-md:confirm-circle-twotone-to-circle-twotone-transition',
    ui: { description: 'text-blue-400' }
  }
])
</script>

<template>
  <div class="relative">

    <!-- Background -->
    <div class="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-300 to-white dark:from-blue-800 dark:to-transparent -z-10"></div>

    <div class="mx-auto flex w-full max-w-screen-xl flex-col gap-6 px-6 pt-6">

      <!-- Header -->
      <h1 class="text-4xl font-bold text-blue-500 dark:text-blue-300 mb-6 mt-6">
        Test DMP Chef
      </h1>

      <div class="p-4 rounded-lg bg-amber-50 dark:bg-amber-900 border border-amber-200 dark:border-amber-800 flex items-start space-x-3">
        <UIcon name="i-heroicons-exclamation-triangle-20-solid" class="w-5 h-5 flex-shrink-0 text-amber-500 dark:text-amber-300" />
        <div>
          <h3 class="text-sm font-medium text-amber-800 dark:text-amber-100">
            This page is meant only for testing and validating the DMP Chef Python pipeline.
            Ultimately, the DMP Chef pipeline will be integrated in DMPTool.org to provide researchers
            with a familiar and convenient user interface that does not require coding knowledge.
          </h3>
        </div>
      </div>

      <!-- Timeline -->
      <UTimeline
        orientation="horizontal"
        :default-value="2"
        :items="items"
        size="sm"
        class="w-full mb-6 ml-30"
      />

      <!-- Download Notice -->
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
        <span class="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wide dark:bg-indigo-500">
          Action Required
        </span>
        <p class="text-lg text-gray-800 font-medium dark:text-gray-100">
          Export the final DMP in your preferred format.
        </p>
      </div>

      <!-- Format Selection -->
      <div class="space-y-2">
        <p class="text-base text-gray-600 dark:text-gray-400">
          Select format:
        </p>

        <URadioGroup
          v-model="selectedFormat"
          color="primary"
          variant="card"
          :items="downloadItems"
        />
      </div>

      <!-- Buttons -->
      <div class="flex items-center justify-between mt-8">

        <UButton
          color="primary"
          size="xl"
          class="w-25"
          icon="ooui:arrow-next-rtl"
          to="/app/dmp1"
        >
          Back
        </UButton>

        <!-- Feedback Modal -->
        <UModal v-model="isFeedbackModalOpen" title="Feedback">

          <UButton
            color="primary"
            size="xl"
            class="w-40"
            icon="material-symbols:download-rounded"
            @click="handleDownload"
          >
            Download
          </UButton>

          <template #body>
            <div class="p-6 sm:p-8">

              <!-- Step 1 -->
              <div v-if="feedbackStep === 1" class="flex flex-col items-center space-y-6">

                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Was this page helpful?
                </h3>

                <div class="flex gap-8">

                  <button
                    @click="handleRating('yes')"
                    class="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border-2 border-transparent hover:border-green-200"
                  >
                    <UIcon name="i-heroicons-face-smile" class="w-16 h-16 text-gray-400 group-hover:text-green-500 transition-colors"/>
                    <span class="font-medium text-gray-600 dark:text-gray-300 group-hover:text-green-600">
                      Yes
                    </span>
                  </button>

                  <button
                    @click="handleRating('no')"
                    class="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border-2 border-transparent hover:border-red-200"
                  >
                    <UIcon name="i-heroicons-face-frown" class="w-16 h-16 text-gray-400 group-hover:text-red-500 transition-colors"/>
                    <span class="font-medium text-gray-600 dark:text-gray-300 group-hover:text-red-600">
                      No
                    </span>
                  </button>

                </div>
              </div>

              <!-- Step 2 -->
              <div v-else class="space-y-4">

                <div class="text-center">
                  <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                    Thank you for your feedback!
                  </h3>
                  <p class="text-sm text-gray-500 mt-1">
                    Would you like to leave any additional comments?
                  </p>
                </div>

                <UTextarea
                  v-model="userComment"
                  :rows="4"
                  autoresize
                  placeholder="Any additional comments?"
                  class="w-full"
                />

                <div class="flex justify-end pt-2">
                  <UButton
                    color="primary"
                    size="lg"
                    block
                    @click="submitFeedback"
                  >
                    Send Feedback
                  </UButton>
                </div>

              </div>

            </div>
          </template>

        </UModal>

      </div>

      <SkyBg />

    </div>
  </div>
</template>
