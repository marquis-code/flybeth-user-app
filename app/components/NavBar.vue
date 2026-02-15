<template>
  <nav class="bg-primary shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
             <NuxtLink to="/" class="text-white text-2xl font-bold tracking-tight">flybeth</NuxtLink>
          </div>
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <NuxtLink to="/stays" class="border-transparent text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Stays</NuxtLink>
            <NuxtLink to="/flights" class="border-transparent text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Flights</NuxtLink>
            <NuxtLink to="/cars" class="border-transparent text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Cars</NuxtLink>
            <NuxtLink to="/packages" class="border-transparent text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Packages</NuxtLink>
            <NuxtLink to="/things-to-do" class="border-transparent text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Things to do</NuxtLink>
            <NuxtLink to="/cruises" class="border-transparent text-indigo-100 hover:text-white inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">Cruises</NuxtLink>
          </div>
        </div>
        <div class="hidden sm:ml-6 sm:flex sm:items-center">
          <button type="button" class="bg-indigo-600 p-1 rounded-full text-indigo-200 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white">
            <span class="sr-only">View notifications</span>
            <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div class="ml-3 relative">
            <div>
               <button class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out text-white font-medium">
                  Sign In
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>
