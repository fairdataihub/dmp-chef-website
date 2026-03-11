<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

// User logout
const { clear } = useUserSession();
const route = useRoute();
const logout = async () => {
  clear();
  await navigateTo("/login");
};

// Header menu items
const headerItems = computed<NavigationMenuItem[]>(() => [
  {
    label: "GitHub",
    to: "https://github.com/fairdataihub/dmpchef",
    target: "_blank",
    icon: "i-simple-icons-github",
  },
  {
    label: "Test",
    to: "/app/dmp",
    icon: "i-lucide-box",
    active: route.path.startsWith("/app/dmp"),
  },
  {
    label: "Documentation",
    to: "/documentation", // make sure this page exists
    icon: "i-lucide-book-open",
    active: route.path.startsWith("/documentation"),
  },
  {
    label: "Contact us",
    to: "/app/tallyembed",
    icon: "i-lucide-mail",
    active: route.path.startsWith("/app/tallyembed"),
  },
]);

// Footer items
const footerItems: NavigationMenuItem[] = [
  {
    label: "Made with ♥ by the FAIR Data Innovations Hub",
    to: "https://fairdataihub.org",
    target: "_blank",
  },
];
</script>

<template>
  <div class="flex flex-col min-h-screen">
    <!-- Header -->
    <UHeader
      :toggle="{ color: 'primary', variant: 'subtle', class: 'rounded-full' }"
    >
      <!-- Title / Logo -->
      <template #title>
        <NuxtLink to="/" class="flex text-2xl font-bold">DMP Chef</NuxtLink>
      </template>

      <!-- Horizontal desktop menu -->
      <UNavigationMenu :items="headerItems" />

      <!-- Right-side buttons -->
      <template #right>
        <UColorModeButton />

        <!-- <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/fairdataihub/dmpchef"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
        />

        <AuthState v-slot="{ loggedIn }">
          <UButton
            v-if="loggedIn"
            color="neutral"
            variant="outline"
            @click="logout"
          >
            Logout
          </UButton>

          <div v-else class="flex items-center gap-3">
            <UButton to="/login" color="neutral" variant="outline">Sign in</UButton>
            <UButton to="/signup" color="neutral">Sign up</UButton>
          </div>
        </AuthState> -->
      </template>

      <!-- Vertical mobile menu -->
      <template #body>
        <UNavigationMenu
          :items="headerItems"
          orientation="vertical"
          class="-mx-2.5"
        />
      </template>
    </UHeader>

    <!-- Main content -->
    <UMain class="flex-1 p-4">
      <slot />
    </UMain>

    <!-- Footer -->
    <UFooter>
      <template #left>
        <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
      </template>

      <template #right>
        <UButton
          icon="i-simple-icons-github"
          color="neutral"
          variant="ghost"
          to="https://github.com/fairdataihub/dmpchef"
          target="_blank"
          aria-label="GitHub"
        />
      </template>
    </UFooter>
  </div>
</template>
