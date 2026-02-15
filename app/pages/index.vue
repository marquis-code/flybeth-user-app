<template>
  <div class="bg-gray-50 min-h-screen font-body">
    <!-- Hero Section -->
    <div class="relative bg-primary pb-48 overflow-hidden">
      <div class="absolute inset-0">
        <img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" alt="Travel background">
        <div class="absolute inset-0 bg-gradient-to-r from-brand-blue to-transparent mix-blend-multiply opacity-80" aria-hidden="true"></div>
      </div>
      <div class="relative max-w-7xl mx-auto py-32 px-4 sm:py-48 sm:px-6 lg:px-8">
        <h1 class="text-6xl font-black tracking-tighter text-white sm:text-7xl lg:text-8xl font-header leading-[0.9]">
          The one place <br/>
          <span class="text-brand-green">you go to go</span> <br/>
          places
        </h1>
        <p class="mt-8 text-xl text-white/70 max-w-2xl font-bold tracking-tight">Plan your perfect trip with our all-in-one travel booking platform, now with our premium brand experience.</p>
        <div class="mt-12 flex gap-6">
          <UiBaseButton variant="green" size="lg">Get Started</UiBaseButton>
          <UiBaseButton variant="outline" size="lg" class="!text-white !border-white/20 hover:!bg-white/10">Learn More</UiBaseButton>
        </div>
      </div>
    </div>

    <!-- Search Widget Section -->
    <div class="-mt-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
      <SearchWidget />
    </div>

    <!-- UI Component Showcase -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
      <div class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 class="text-[10px] font-black text-brand-green uppercase tracking-[0.3em] mb-4">Design System</h2>
          <h3 class="text-5xl font-black text-brand-blue font-header tracking-tighter">Premium UI Library</h3>
        </div>
        <p class="text-brand-gray/60 max-w-md font-bold text-sm leading-relaxed">
          Crafted with precision to ensure a seamless booking experience. Our components are mobile-responsive, brand-aligned, and optimized for minimal user friction.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <!-- Input & Select -->
        <div class="bg-white p-12 rounded-[3rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.05)] border border-gray-50 space-y-12">
          <h4 class="text-xs font-black text-brand-blue/30 uppercase tracking-[0.2em] mb-8">Inputs & Selections</h4>
          <UiBaseInput label="Standard Input" placeholder="Enter your full name" v-model="testInput" />
          <UiBaseSelect 
            label="Dropdown Selection" 
            v-model="testSelect" 
            :options="[
              {label: 'Economy Class', value: 'economy'},
              {label: 'Business Class', value: 'business'},
              {label: 'First Class', value: 'first'}
            ]"
            placeholder="Select your class"
          />
          <UiBaseTimePicker label="Time Selector" v-model="testTime" />
        </div>

        <!-- TextArea & Buttons -->
        <div class="space-y-12">
          <div class="bg-white p-12 rounded-[3rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.05)] border border-gray-50 flex flex-col h-full">
            <h4 class="text-xs font-black text-brand-blue/30 uppercase tracking-[0.2em] mb-8">Text Areas & Actions</h4>
            <UiBaseTextArea label="Additional Requests" placeholder="Tell us more about your preferences..." v-model="testArea" class="flex-grow mb-8" />
            <div class="flex flex-wrap gap-4">
              <UiBaseButton variant="primary">Confirm</UiBaseButton>
              <UiBaseButton variant="green">Success</UiBaseButton>
              <UiBaseButton variant="secondary">Cancel</UiBaseButton>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Date Picker Showcase -->
      <div class="mt-12 bg-white p-12 rounded-[3rem] shadow-[0_30px_90px_-20px_rgba(0,0,0,0.05)] border border-gray-50">
        <div class="flex flex-col md:flex-row gap-12">
          <div class="flex-1">
            <h4 class="text-xs font-black text-brand-blue/30 uppercase tracking-[0.2em] mb-8">Range Picker</h4>
            <UiCustomDatePicker v-model="testRange" mode="range" label="Travel Range" />
          </div>
          <div class="flex-1">
            <h4 class="text-xs font-black text-brand-blue/30 uppercase tracking-[0.2em] mb-8">Single Picker</h4>
            <UiCustomDatePicker v-model="testSingle" mode="single" label="Check-in Date" />
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Gradient Spacer -->
    <div class="h-32 bg-gradient-to-t from-gray-100 to-transparent"></div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const testInput = ref('')
const testSelect = ref('economy')
const testTime = ref('Noon')
const testArea = ref('')
const testRange = ref({ start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 5)) })
const testSingle = ref(new Date())
</script>

<style>
.font-header {
  font-family: 'Spectral', serif;
}
.font-body {
  font-family: 'Roboto', sans-serif;
}
</style>
