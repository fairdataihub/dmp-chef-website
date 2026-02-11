<script setup lang="ts">
useSeoMeta({
  title: "Home",
});

const links = ref([
  {
    label: "View GitHub repo",
    to: "https://github.com/fairdataihub/dmpchef",
    icon: "i-simple-icons-github",
    target: "_blank",
    class: "text-gray-900 dark:text-black bg-white border"
  },
  {
    label: "Test it",
    to: "/app/dmp",
    trailingIcon: "i-lucide-arrow-right",
    class: "text-gray-900 dark:text-black bg-white border"
  },
]);


const snapshots = ref([
  { title: '12,000+ DMPs', description: 'Generated automatically through DMP Chef, helping researchers create funder-compliant plans efficiently.', to: '' },
  { title: '30 Institutions', description: 'Universities, research centers, and data offices actively collaborating and using DMP Chef worldwide.', to: '' },
  { title: '25 Funders', description: 'Supported templates for agencies including NIH, NSF, DOE, and Horizon Europe.', to: '' },
  { title: '4 AI Models', description: 'Fine-tuned and optimized for research data policies and FAIR data principles.', to: '' },
  { title: '10+ Contributors', description: 'Researchers, developers, and data stewards improving the open-source DMP Chef platform.', to: '' }
]);

const technologies = ref([
  { title: 'Prompt Engineering', description: 'Custom-designed prompts ensure precise, context-aware responses that align with funder requirements and research domains.', icon: 'tabler:app-window', to: '' },
  { title: 'Retrieval-Augmented Generation (RAG)', description: 'Combines AI generation with real-time access to structured knowledge bases for accurate, up-to-date content.', icon: 'mdi:database-search', to: '' },
  { title: 'Fine-Tuned Language Models', description: 'Models optimized on research data policy language and DMP examples to improve factuality and style consistency.', icon: 'mdi:chip', to: '' },
  { title: 'Vector Databases', description: 'High-performance semantic search supports retrieval of relevant policy documents and prior DMPs.', icon: 'mdi:vector-arrange-above', to: '' },
  { title: 'Open-Source Infrastructure', description: 'Built with transparency and extensibility in mind, enabling community-driven development and easy institutional adoption.', icon: 'mdi:earth', to: '' }
]);

const roadmapItems = ref([
  { date: 'Oct 2025 – Mar 2026', title: 'Phase 1', description: 'Define the user workflow, test improvement strategies, and build the Alpha prototype to draft NIH-compliant DMPs. This phase ends with internal testing and refinement.', icon: 'i-lucide-git-branch' },
  { date: 'Apr 2026 – Sep 2026', title: 'Phase 2', description: 'Add general-purpose and multi-funder DMP drafting capabilities (e.g., NSF) and deliver the Beta prototype. This phase ends with external user testing and refinement.', icon: 'i-lucide-package-open' },
  { isSpacer: true, date: '', title: '', description: '', icon: 'i-lucide-more-horizontal' },
  { date: 'TBD', title: 'Phase N: Integration with DMP Tools', description: 'Integrate the DMP Chef back-end with <a href="https://dmptool.org" target="_blank" class="text-blue-700 dark:text-white underline">DMPTool.org</a>', icon: 'i-lucide-server' }
]);

const communitylinks = ref([
  { label: 'Contribute via GitHub', icon: 'i-lucide-star', to: 'https://github.com/fairdataihub/dmpchef' },
  { label: 'Provide feedback', icon: 'i-lucide-file-pen', to: '/app/tallyembed' }
]);
</script>

<template>
  <div>
    <!-- Hero background -->
    <div class="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-blue-300 to-white dark:from-blue-800 dark:to-transparent -z-10"></div>

    <!-- Logo -->
    <div class="flex flex-col items-center mt-16">
      <img src="/../public/logos/logo-dmpchef-transparent.svg" alt="DMP Chef Logo" class="h-40 w-auto" />
    </div>

    <!-- Page hero -->
    <UPageHero 
      class="-mt-24" 
      title="DMP Chef" 
      description="A Python pipeline for crafting Data Management Plans (DMPs)" 
      orientation="vertical" 
      :links="links" 
      :ui="{
        links: 'text-slate-900 dark:text-white'
      }"
    >
      <SkyBg />
    </UPageHero>

    <!-- Overview section -->
    <UContainer class="mb-12">
      <section class="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-xl">
        <div class="absolute inset-0 pointer-events-none">
          <div class="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-blue-200 dark:bg-blue-900/30 blur-3xl opacity-50" />
          <div class="absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-indigo-200 dark:bg-indigo-900/30 blur-3xl opacity-50" />
        </div>
        <div class="relative z-10 px-6 py-8 md:px-10 md:py-12 text-center">
          <h2 class="mb-6 text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Overview</h2>
          <div class="mx-auto max-w-4xl space-y-4 text-base leading-relaxed text-gray-700 dark:text-gray-300">
            <p>
              <span class="font-semibold text-blue-700 dark:text-blue-400">DMP Chef</span> is an open-source (MIT License), Python-based pipeline that leverages AI to draft funder-compliant 
              Data Management Plans (DMPs). Researchers often struggle to write DMPs because they require advance knowledge 
              of data types, metadata standards, repositories, and funder-specific sharing requirements. 
              DMP Chef addresses this challenge by translating high-level project descriptions into funder-compliant DMP, 
              using a tailored prompt, funder templates, funder guidelines, and an open source large language model (LLM) enhanced with a custom RAG pipeline.  
              This project is part of a broader extension of the 
              <a href="https://dmptool.org" target="_blank" rel="noopener noreferrer" class="font-semibold underline text-blue-700 hover:text-blue-800 dark:text-blue-300 dark:hover:text-blue-200 transition-colors">DMP Tool</a> platform.
            </p>
            <p>
              This website is meant to provide information about the DMP Chef pipeline and also provide a testing interface. 
              The ultimate goal is to integrate the DMP Chef pipeline into the DMP Tool platform, providing researchers with a familiar 
              and convenient user interface that does not require any coding knowledge.
            </p>
          </div>
        </div>
      </section>
    </UContainer>

    <!-- Team section -->
    <UContainer class="py-12">
      <div class="text-center space-y-6">
        <h2 class="text-3xl font-bold">Team</h2>
        <p class="max-w-4xl mx-auto text-base leading-relaxed text-gray-700 dark:text-gray-300">
          <span class="font-bold text-blue-700 dark:text-white">DMP Chef</span> is developed by the 
          <span class="font-semibold text-gray-900 dark:text-white">FAIR Data Innovations Hub</span> 
          in collaboration with the 
          <span class="font-semibold text-gray-900 dark:text-white">California Digital Library (CDL)</span> 
          who are developing and maintaining 
          <span class="font-semibold text-gray-900 dark:text-white">DMP Tool</span> platform.
        </p>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center justify-items-center pt-6">
          <!-- Team cards -->
          <a href="https://fairdataihub.org" target="_blank" class="group flex flex-col h-48 w-full items-center justify-center gap-3 rounded-2xl border border-transparent bg-white p-4 transition-all hover:border-gray-200 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20">
            <div class="flex h-32 w-full items-center justify-center rounded-xl bg-white/90 dark:bg-white p-2 shadow-sm">
              <img src="/../public/logos/fair_logo.svg" alt="FAIR Data Innovations Hub" class="h-full w-auto object-contain" />
            </div>
            <span class="font-bold text-gray-900 dark:text-white text-sm">FAIR Data Innovations Hub</span>
          </a>

          <a href="https://cdlib.org" target="_blank" class="group flex flex-col h-48 w-full items-center justify-center gap-3 rounded-2xl border border-transparent bg-white p-4 transition-all hover:border-gray-200 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20">
            <div class="flex h-32 w-full items-center justify-center rounded-xl bg-white/90 dark:bg-white p-2 shadow-sm">
              <img src="/../public/logos/logo_cdl.svg" alt="California Digital Library" class="h-full w-auto object-contain" />
            </div>
            <span class="font-bold text-gray-900 dark:text-white text-sm">California Digital Library</span>
          </a>

          <a href="https://dmptool.org" target="_blank" class="group flex flex-col h-48 w-full items-center justify-center gap-3 rounded-2xl border border-transparent bg-white p-4 transition-all hover:border-gray-200 hover:bg-gray-100/80 dark:bg-white/5 dark:hover:bg-white/10 dark:hover:border-white/20">
            <div class="flex h-32 w-full items-center justify-center rounded-xl bg-white/90 dark:bg-white p-2 shadow-sm">
              <img src="/../public/logos/dmp_tool_logo.svg" alt="DMPTool" class="h-full w-auto object-contain" />
            </div>
            <span class="font-bold text-gray-900 dark:text-white text-sm">DMP Tool</span>
          </a>
        </div>
      </div>
    </UContainer>

    <!-- Roadmap section -->
    <UContainer class="my-12">
      <h2 class="text-3xl font-bold text-center mb-8">Project Roadmap</h2>
      <div class="p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-gray-50 dark:bg-gray-800/50 shadow-lg">
        <UTimeline :items="roadmapItems" :ui="{ wrapper: 'space-y-4', container: 'min-h-10', date: 'text-sm text-gray-700 dark:text-gray-400 font-medium', title: 'text-xl font-bold text-gray-900 dark:text-white', description: 'text-base text-gray-700 dark:text-gray-300' }">
          <template #description="{ item }">
            <div v-if="item.isSpacer" style="height: 3rem;"></div>
            <div v-else v-html="item.description" class="text-base text-gray-700 dark:text-gray-300"></div>
          </template>
        </UTimeline>
      </div>
    </UContainer>

    <!-- Funding -->
    <section class="py-8">
      <UContainer>
        <div class="mx-auto max-w-4xl text-center">
          <h2 class="text-3xl font-bold mb-4">Funding</h2>
          <p class="text-base leading-relaxed text-gray-800 dark:text-white">
            This project is a 
            <a href="https://new.nsf.gov/" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-blue-400 hover:text-blue-700 transition-colors">National Science Foundation (NSF)</a> 
            and 
            <a href="https://chanzuckerberg.com" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-blue-400 hover:text-blue-700 transition-colors">Chan Zuckerberg Initiative (CZI)</a>-funded collaboration between the 
            <a href="https://fairdataihub.org" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-blue-400 hover:text-blue-700 transition-colors">FAIR Data Innovations Hub</a> 
            and 
            <a href="https://cdlib.org" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-blue-400 hover:text-blue-700 transition-colors">California Digital Library</a> 
            (University of California Office of the President) as part of a broader extension of the 
            <a href="https://dmptool.org" target="_blank" rel="noopener noreferrer" class="font-semibold underline decoration-blue-400 hover:text-blue-700 transition-colors">DMP Tool</a> platform.
          </p>
        </div>
      </UContainer>
    </section>

    <!-- Community -->
    <USeparator icon="i-simple-icons-nuxtdotjs" />
    <UContainer class="my-6">
      <UPageLinks title="Community" :links="communitylinks" />
    </UContainer>
  </div>
</template>
