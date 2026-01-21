<script setup lang="ts">
import { saveAs } from 'file-saver'
import { Document, Packer, Paragraph, TextRun } from 'docx'
import { jsPDF } from 'jspdf'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'

// DMP state
const dmpStore = useState('dmp-data')
const dmp = computed(() => dmpStore.value)

// Redirect if no DMP
if (!dmp.value) {
  navigateTo('/app/dmp')
}

// Download format options
const downloadItems = ref([
  { label: 'DOCX', value: 'docx', description: 'Word document' },
  { label: 'PDF', value: 'pdf', description: 'PDF file' },
  { label: 'JSON', value: 'json', description: 'Structured JSON' }
])
const selectedFormat = ref('json')

const isFeedbackModalOpen = ref(false)
const feedbackStep = ref(1) // 1 = Faces, 2 = Comment box
const userRating = ref<'yes' | 'no' | null>(null)
const userComment = ref('')

// Update the handleDownload function to open the modal
async function handleDownload() {
  if (!dmp.value) return

  // 1. Perform the actual download
  switch (selectedFormat.value) {
    case 'json':
      downloadJSON()
      break
    case 'docx':
      await downloadDOCX()
      break
    case 'pdf':
      downloadPDF()
      break
  }

  // 2. Open the feedback modal (Reset state first)
  feedbackStep.value = 1
  userRating.value = null
  userComment.value = ''
  isFeedbackModalOpen.value = true
}

// Handle the user clicking a Face button
function handleRating(rating: 'yes' | 'no') {
  userRating.value = rating
  feedbackStep.value = 2 // Move to next step
}

// Final Submit
function submitFeedback() {
  // Logic to send data to backend would go here later
  console.log('Feedback:', { rating: userRating.value, comment: userComment.value })
  
  // Close modal
  isFeedbackModalOpen.value = false
}

// JSON
function downloadJSON() {
  const blob = new Blob([JSON.stringify(dmp.value, null, 2)], { type: 'application/json' })
  saveAs(blob, 'DMP.json')
}

// DOCX
async function downloadDOCX() {
  const response = await fetch('/templates/NIH_Template.docx')
  const content = await response.arrayBuffer()
  const zip = new PizZip(content)
  const doc = new Docxtemplater(zip, { paragraphLoop: true, linebreaks: true })

  // Map the nested AI result to your Word Template Tags
  const d = dmp.value
  doc.setData({
    e1_res1: d["Element 1: Data Type"]["1"].description,
    e1_res2: d["Element 1: Data Type"]["2"].description,
    e1_res3: d["Element 1: Data Type"]["3"].description,
    e2_res:  d["Element 2: Related Tools, Software and/or Code"].description,
    e3_res:  d["Element 3: Standards"].description,
    e4_res1: d["Element 4: Data Preservation, Access, and Associated Timelines"]["1"].description,
    e4_res2: d["Element 4: Data Preservation, Access, and Associated Timelines"]["2"].description,
    e4_res3: d["Element 4: Data Preservation, Access, and Associated Timelines"]["3"].description,
    e5_res1: d["Element 5: Access, Distribution, or Reuse Considerations"]["1"].description,
    e5_res2: d["Element 5: Access, Distribution, or Reuse Considerations"]["2"].description,
    e5_res3: d["Element 5: Access, Distribution, or Reuse Considerations"]["3"].description,
    e6_res:  d["Element 6: Oversight of Data Management and Sharing"].description
  })

  doc.render()
  const out = doc.getZip().generate({ type: 'blob' })
  saveAs(out, 'DMP_Plan.docx')
}

// PDF
function downloadPDF() {
  const doc = new jsPDF()
  let y = 20
  const margin = 15
  const pageWidth = 180

  const checkPage = (heightNeeded: number) => {
    if (y + heightNeeded > 275) {
      doc.addPage()
      y = 20
    }
  }

  // Main Title
  doc.setFontSize(20)
  doc.setTextColor(40, 90, 150)
  doc.text("Data Management and Sharing Plan", margin, y)
  y += 15

  for (const [elementKey, elementValue] of Object.entries(dmp.value)) {
    // 1. Element Header
    checkPage(15)
    doc.setFont("helvetica", "bold")
    doc.setFontSize(14)
    doc.setTextColor(43, 87, 151)
    doc.text(elementKey, margin, y)
    y += 8

    const val: any = elementValue

    if (val.description) {
      // Handle simple Element (description only)
      doc.setFont("helvetica", "normal")
      doc.setFontSize(11)
      doc.setTextColor(0, 0, 0)
      const lines = doc.splitTextToSize(val.description, pageWidth)
      checkPage(lines.length * 6)
      doc.text(lines, margin, y)
      y += (lines.length * 6) + 8
    } else {
      // Handle nested Element (1, 2, 3...)
      for (const [subKey, subVal] of Object.entries(val)) {
        const item = subVal as any
        
        // Sub-title
        doc.setFont("helvetica", "bold")
        doc.setFontSize(11)
        doc.setTextColor(60, 60, 60)
        const subTitleLines = doc.splitTextToSize(item.title, pageWidth)
        checkPage(subTitleLines.length * 6)
        doc.text(subTitleLines, margin, y)
        y += (subTitleLines.length * 5) + 2

        // Description text
        doc.setFont("helvetica", "normal")
        doc.setFontSize(11)
        doc.setTextColor(0, 0, 0)
        const descLines = doc.splitTextToSize(item.description, pageWidth)
        checkPage(descLines.length * 6)
        doc.text(descLines, margin, y)
        y += (descLines.length * 6) + 6
      }
    }
    y += 4 // Extra spacing between Elements
  }

  doc.save('DMP_Plan.pdf')
}

const items = ref([
  {
    date: 'Step 1',
    title: 'Project Details',
    description: 'Completed',
    icon: 'line-md:confirm-circle',
    ui: {
      description: 'text-blue-400',
    },
  },
  {
    date: 'Step 2',
    title: 'Draft Review',
    description: 'Completed',
    icon: 'line-md:confirm-circle',
    ui: {
      description: 'text-blue-400',
    },
  },
  {
    date: 'Step 3',
    title: 'Download',
    description: 'In Progress',
    icon: 'line-md:confirm-circle-twotone-to-circle-twotone-transition',
    ui: {
      description: 'text-blue-400',
    },
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
      Ultimately, the DMP Chef pipeline will be integrated in DMPTool.org to provide researchers with a 
      familiar and convenient user interface that does not require any coding knowledge.
      </h3>
      </div>
    </div>
      <UTimeline orientation="horizontal" :default-value="2" :items="items" size="sm" class="w-full mb-6 ml-30" />
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-6 dark:bg-gray-800 dark:border-gray-700">
        <span class="inline-block bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded mb-3 uppercase tracking-wide dark:bg-indigo-500">
          Action Required
        </span>
        <p class="text-lg text-gray-800 font-medium dark:text-gray-100">
          Export the final DMP in your preferred format (JSON, DOCX, or PDF).
        </p>
      </div>

      <!-- Format selection -->
      <div class="space-y-2">
        <p class="text-base text-gray-600 dark:text-gray-400">Select format:</p>
        <URadioGroup
          v-model="selectedFormat"
          color="primary"
          variant="card"
          :items="downloadItems"
        />
      </div>

      
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

        <UModal title="Feedback">
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
              
              <div v-if="feedbackStep === 1" class="flex flex-col items-center space-y-6">
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white">
                  Was this page helpful?
                </h3>
                
                <div class="flex gap-8">
                  <button 
                    @click="handleRating('yes')"
                    class="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border-2 border-transparent hover:border-green-200"
                  >
                    <UIcon name="i-heroicons-face-smile" class="w-16 h-16 text-gray-400 group-hover:text-green-500 transition-colors" />
                    <span class="font-medium text-gray-600 dark:text-gray-300 group-hover:text-green-600">Yes</span>
                  </button>

                  <button 
                    @click="handleRating('no')"
                    class="group flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-all border-2 border-transparent hover:border-red-200"
                  >
                    <UIcon name="i-heroicons-face-frown" class="w-16 h-16 text-gray-400 group-hover:text-red-500 transition-colors" />
                    <span class="font-medium text-gray-600 dark:text-gray-300 group-hover:text-red-600">No</span>
                  </button>
                </div>
              </div>

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
