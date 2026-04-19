<template>
  <div class="fp-root" @mousedown="handleGlobalMousedown">

    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="fp-hero">
      <div class="fp-hero-bg">
        <div class="fp-orb fp-orb--a"></div>
        <div class="fp-orb fp-orb--b"></div>
      </div>

      <div class="fp-wrap">

        <!-- Dynamic headline -->
        <div class="fp-headline">
          <span class="fp-eyebrow">✦ Flight Search</span>
          <h1 class="fp-h1">
            <template v-if="searchQuery.origin && searchQuery.destination">
              {{ searchQuery.origin }}
              <em>→ {{ searchQuery.destination }}</em>
            </template>
            <template v-else-if="searchQuery.origin">
              Flying from <em>{{ searchQuery.origin }}</em>
            </template>
            <template v-else>
              Search<br><em>any flight.</em>
            </template>
          </h1>
        </div>

        <!-- ── SEARCH BAR ── -->
        <div class="fp-bar">

          <!-- FROM field -->
          <div class="fp-fld fp-fld--from" :class="{ 'fp-fld--active': activeField === 'from' }" ref="fromRef">
            <div class="fp-fld-inner" @click="openField('from')">
              <svg class="fp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
              <div class="fp-fld-text">
                <span class="fp-fld-lbl">From</span>
                <span class="fp-fld-val" :class="{ 'fp-fld-val--set': searchQuery.origin }">
                  {{ searchQuery.origin || 'Origin' }}
                </span>
              </div>
            </div>
            <!-- FROM dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'from'" class="fp-drop fp-drop--loc" @mousedown.stop>
                <div class="fp-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="fromInputRef" v-model="fromQuery" placeholder="Search city or airport…" class="fp-drop-input" @input="searchLocations('from')" />
                  <button v-if="fromQuery" class="fp-drop-clear" @click="fromQuery=''; searchQuery.origin=''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!fromQuery" class="fp-drop-section">
                  <span class="fp-drop-sec-label">Popular airports</span>
                  <div class="fp-drop-grid">
                    <button v-for="p in popularAirports" :key="p.code" class="fp-pop-item" @click="selectLocation('from', p)">
                      <span class="fp-pop-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </span>
                      <span class="fp-pop-name">{{ p.city }}</span>
                      <span class="fp-pop-code">{{ p.code }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="fp-drop-results">
                  <button v-for="r in locationResults" :key="r.code" class="fp-loc-result" @click="selectLocation('from', r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="fp-loc-city">{{ r.city }}</span>
                    <span class="fp-loc-code">{{ r.code }}</span>
                  </button>
                  <div v-if="!locationResults.length" class="fp-drop-empty">No results for "{{ fromQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <!-- SWAP -->
          <button class="fp-swap" @click="swapLocations" title="Swap">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4"/></svg>
          </button>

          <!-- TO field -->
          <div class="fp-fld fp-fld--to" :class="{ 'fp-fld--active': activeField === 'to' }" ref="toRef">
            <div class="fp-fld-inner" @click="openField('to')">
              <svg class="fp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              <div class="fp-fld-text">
                <span class="fp-fld-lbl">To</span>
                <span class="fp-fld-val" :class="{ 'fp-fld-val--set': searchQuery.destination }">
                  {{ searchQuery.destination || 'Destination' }}
                </span>
              </div>
            </div>
            <!-- TO dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'to'" class="fp-drop fp-drop--loc" @mousedown.stop>
                <div class="fp-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="toInputRef" v-model="toQuery" placeholder="Search city or airport…" class="fp-drop-input" @input="searchLocations('to')" />
                  <button v-if="toQuery" class="fp-drop-clear" @click="toQuery=''; searchQuery.destination=''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!toQuery" class="fp-drop-section">
                  <span class="fp-drop-sec-label">Popular airports</span>
                  <div class="fp-drop-grid">
                    <button v-for="p in popularAirports" :key="p.code" class="fp-pop-item" @click="selectLocation('to', p)">
                      <span class="fp-pop-icon">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                      </span>
                      <span class="fp-pop-name">{{ p.city }}</span>
                      <span class="fp-pop-code">{{ p.code }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="fp-drop-results">
                  <button v-for="r in locationResults" :key="r.code" class="fp-loc-result" @click="selectLocation('to', r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="fp-loc-city">{{ r.city }}</span>
                    <span class="fp-loc-code">{{ r.code }}</span>
                  </button>
                  <div v-if="!locationResults.length" class="fp-drop-empty">No results for "{{ toQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="fp-bar-sep"></div>

          <!-- DATE field -->
          <div class="fp-fld fp-fld--date" :class="{ 'fp-fld--active': activeField === 'date' }" ref="dateRef">
            <div class="fp-fld-inner" @click="openField('date')">
              <svg class="fp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="fp-fld-text">
                <span class="fp-fld-lbl">Departure</span>
                <span class="fp-fld-val" :class="{ 'fp-fld-val--set': searchQuery.departureDate }">
                  {{ searchQuery.departureDate ? formatDate(searchQuery.departureDate) : 'Select date' }}
                </span>
              </div>
            </div>
            <!-- Calendar dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'date'" class="fp-drop fp-drop--cal" @mousedown.stop>
                <div class="fp-cal-nav-row">
                  <button class="fp-cal-arrow" @click="prevMonth">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="fp-cal-title">{{ calMonthLabel }}</span>
                  <button class="fp-cal-arrow" @click="nextMonth">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="fp-cal-grid">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="fp-cal-dow">{{ d }}</div>
                  <div v-for="c in calCells" :key="c.key"
                    class="fp-cal-cell"
                    :class="{
                      'fp-cal-cell--blank': !c.date,
                      'fp-cal-cell--past': c.past,
                      'fp-cal-cell--sel': c.selected,
                      'fp-cal-cell--today': c.today
                    }"
                    @click="c.date && !c.past && pickDate(c.date)"
                  >{{ c.day }}</div>
                </div>
              </div>
            </Transition>
          </div>

          <div class="fp-bar-sep"></div>

          <!-- TRAVELERS field -->
          <div class="fp-fld fp-fld--pax" :class="{ 'fp-fld--active': activeField === 'pax' }" ref="paxRef">
            <div class="fp-fld-inner" @click="openField('pax')">
              <svg class="fp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              <div class="fp-fld-text">
                <span class="fp-fld-lbl">Travelers</span>
                <span class="fp-fld-val fp-fld-val--set">{{ summary }}</span>
              </div>
            </div>
            <!-- Pax dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'pax'" class="fp-drop fp-drop--pax" @mousedown.stop>
                <div class="fp-pax-rows">
                  <div class="fp-pax-item">
                    <div class="fp-pax-info"><span class="fp-pax-type">Adults</span><span class="fp-pax-sub">12+</span></div>
                    <div class="fp-pax-ctrl">
                      <button class="fp-pax-btn" @click="searchQuery.adults = Math.max(1, searchQuery.adults - 1)" :disabled="searchQuery.adults <= 1">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                      </button>
                      <span class="fp-pax-num">{{ searchQuery.adults }}</span>
                      <button class="fp-pax-btn" @click="searchQuery.adults = Math.min(9, searchQuery.adults + 1)">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="fp-pax-item">
                    <div class="fp-pax-info"><span class="fp-pax-type">Children</span><span class="fp-pax-sub">2-12</span></div>
                    <div class="fp-pax-ctrl">
                      <button class="fp-pax-btn" @click="searchQuery.children = Math.max(0, searchQuery.children - 1)" :disabled="searchQuery.children <= 0">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                      </button>
                      <span class="fp-pax-num">{{ searchQuery.children }}</span>
                      <button class="fp-pax-btn" @click="searchQuery.children = Math.min(8, searchQuery.children + 1)">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                  </div>
                  <div class="fp-pax-item">
                    <div class="fp-pax-info"><span class="fp-pax-type">Infants</span><span class="fp-pax-sub">Under 2</span></div>
                    <div class="fp-pax-ctrl">
                      <button class="fp-pax-btn" @click="searchQuery.infants = Math.max(0, searchQuery.infants - 1)" :disabled="searchQuery.infants <= 0">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                      </button>
                      <span class="fp-pax-num">{{ searchQuery.infants }}</span>
                      <button class="fp-pax-btn" @click="searchQuery.infants = Math.min(searchQuery.adults, searchQuery.infants + 1)">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div class="fp-pax-divider"></div>
                <div class="fp-pax-class">
                  <span class="fp-pax-sub tracking-wider font-bold mb-2 block">Cabin Class</span>
                  <div class="fp-pax-class-grid">
                    <button v-for="c in ['economy','premium_economy','business','first']" :key="c" @click="searchQuery.cabinClass = c" class="fp-class-chip" :class="{ 'fp-class-chip--on': searchQuery.cabinClass === c }">
                      {{ c.replace('_',' ') }}
                    </button>
                  </div>
                </div>
                <button class="fp-pax-done mt-4" @click="activeField = null">Done</button>
              </div>
            </Transition>
          </div>

          <!-- SEARCH BTN -->
          <button class="fp-search-btn" :class="{ 'fp-search-btn--busy': loading }" @click="handleSearch">
            <span class="fp-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="fp-spin"></span>
              <span>{{ loading ? 'Searching' : 'Search' }}</span>
            </span>
          </button>

        </div><!-- /fp-bar -->
      </div><!-- /fp-wrap -->
    </section>

    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="fp-wrap fp-main">

      <!-- Purpose strip -->
      <Transition name="fp-fade">
        <div v-if="prediction && !purposeLoading" class="fp-purpose">
          <span class="fp-purpose-pip" :class="prediction.result === 'BUSINESS' ? 'pip--biz' : 'pip--lei'"></span>
          <span class="fp-purpose-copy">
            <strong>{{ prediction.result === 'BUSINESS' ? 'Business trip detected' : 'Leisure mode' }}</strong>
            · {{ prediction.result === 'BUSINESS' ? 'Prioritising comfort and schedule reliability.' : 'Curating best-value routes and local experiences.' }}
          </span>
          <NuxtLink v-if="prediction.result !== 'BUSINESS'" to="/things-to-do" class="fp-purpose-cta">Explore →</NuxtLink>
        </div>
      </Transition>

      <!-- Fare cards -->
      <div v-if="displayedFlights.length" class="fp-fares">
        <div v-for="f in fareTypes" :key="f.key" class="fp-fare" :class="{ 'fp-fare--on': activeFare === f.key }" @click="activeFare = f.key">
          <span class="fp-fare-tag" :class="`fp-fare-tag--${f.key}`">{{ f.badge }}</span>
          <div class="fp-fare-price">${{ getMatrixPrice(f.key) }}</div>
          <div class="fp-fare-label">{{ f.label }}</div>
        </div>
      </div>

      <!-- Airline × Stops matrix -->
      <div v-if="displayedFlights.length && airlineMeta.length" class="fp-matrix">
        <div class="fp-matrix-hd">
          <span class="fp-sec-label">Price matrix</span>
          <span class="fp-sec-hint">Click a cell to jump to results</span>
        </div>
        <div class="fp-matrix-scroll">
          <table class="fp-mtable">
            <thead>
              <tr>
                <th class="fp-mth fp-mth--first"></th>
                <th class="fp-mth" v-for="al in airlineMeta" :key="al.name">
                  <div class="fp-al-box">
                    <img v-if="al.logo" :src="al.logo" :alt="al.name" class="fp-al-img" />
                    <span v-else class="fp-al-abbr">{{ al.name.slice(0,2).toUpperCase() }}</span>
                  </div>
                  <span class="fp-al-nm">{{ al.name }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="sl in stopLabels" :key="sl">
                <td class="fp-mstop">{{ sl }}</td>
                <td v-for="al in airlineMeta" :key="al.name" class="fp-mcell" @click="jumpTo(al.name)">
                  <span v-if="getMatrixPriceFor(al.name, sl)" class="fp-mprice">${{ getMatrixPriceFor(al.name, sl) }}</span>
                  <span v-else class="fp-mdash">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Body grid -->
      <div class="fp-body">

        <!-- Sidebar -->
        <aside class="fp-sidebar" :class="{ 'fp-sidebar--open': mobileFilters }">
          <div class="fp-sbar">
            <div class="fp-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine results</span>
              <button class="fp-reset" @click="clearFilters">Reset</button>
            </div>

            <div class="fp-sb-block">
              <p class="fp-sb-label">Stops</p>
              <div class="fp-chips">
                <button v-for="s in stopOptions" :key="s.value" class="fp-chip" :class="{ 'fp-chip--on': activeStops.includes(s.value) }" @click="toggleStop(s.value)">{{ s.label }}</button>
              </div>
            </div>

            <div class="fp-sb-block" v-if="availableAirlines.length">
              <p class="fp-sb-label">Airlines</p>
              <label v-for="al in availableAirlines" :key="al" class="fp-chk-row">
                <span class="fp-chk" :class="{ 'fp-chk--on': activeAirlines.includes(al) }" @click="toggleAirline(al)">
                  <svg v-if="activeAirlines.includes(al)" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="fp-chk-label">{{ al }}</span>
              </label>
            </div>

            <div class="fp-sb-block">
              <p class="fp-sb-label">Max price <strong>${{ maxPriceFilter.toLocaleString() }}</strong></p>
              <div class="fp-range-wrap">
                <input type="range" :min="minPrice" :max="maxPrice" step="1" v-model.number="maxPriceFilter" class="fp-range" />
                <div class="fp-range-ends">
                  <span>${{ minPrice.toLocaleString() }}</span>
                  <span>${{ maxPrice.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        <!-- Results -->
        <div class="fp-results">

          <!-- Toolbar -->
          <div v-if="displayedFlights.length" class="fp-toolbar">
            <span class="fp-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.61 6.61l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              {{ Object.values(filteredGrouped).flat().length }} flights found
            </span>
            <div class="fp-toolbar-r">
              <div class="fp-sort-wrap" ref="sortRef">
                <button class="fp-sort-btn" @click.stop="sortOpen = !sortOpen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                  {{ currentSort.label }}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="fp-chev" :class="{ 'fp-chev--up': sortOpen }"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <Transition name="fd">
                  <div v-if="sortOpen" class="fp-sort-panel" @mousedown.stop>
                    <button v-for="o in sortOptions" :key="o.value" class="fp-sort-opt" :class="{ 'fp-sort-opt--on': sortBy === o.value }" @click="sortBy = o.value; sortOpen = false">
                      <span class="fp-sort-dot" :class="{ 'fp-sort-dot--on': sortBy === o.value }"></span>
                      {{ o.label }}
                    </button>
                  </div>
                </Transition>
              </div>
              <button class="fp-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
                <span v-if="activeFilterCount" class="fp-badge">{{ activeFilterCount }}</span>
              </button>
            </div>
          </div>

          <!-- Loading -->
          <div v-if="loading" class="fp-loading">
            <div v-for="n in 4" :key="n" class="fp-skel-card">
              <div class="fp-sk fp-sk--logo"></div>
              <div class="fp-sk-grp">
                <div class="fp-sk fp-sk--lg"></div>
                <div class="fp-sk fp-sk--sm"></div>
              </div>
              <div class="fp-sk fp-sk--price"></div>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="!displayedFlights.length" class="fp-empty">
            <div class="fp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>
            </div>
            <h3 class="fp-empty-h">No flights found</h3>
            <p class="fp-empty-p">Try different airports or dates to unlock better options.</p>
            <button class="fp-empty-btn" @click="searchQuery.origin='LHR'; searchQuery.destination='DXB'; handleSearch()">Try London → Dubai</button>
          </div>

          <!-- No filter match -->
          <div v-else-if="!loading && displayedFlights.length && Object.keys(filteredGrouped).length === 0" class="fp-empty">
            <div class="fp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </div>
            <h3 class="fp-empty-h">No matches</h3>
            <p class="fp-empty-p">Your filters returned nothing. Try widening the criteria.</p>
            <button class="fp-empty-btn" @click="clearFilters">Clear filters</button>
          </div>

          <!-- Results -->
          <div v-if="Object.keys(filteredGrouped).length" class="fp-groups">
            <FlightGroup v-for="(group, name) in filteredGrouped" :key="name"
              :id="`group-${name}`"
              :airlineName="String(name)"
              :airlineLogo="group[0].airlineLogo"
              :flights="group"
              @select="selectFlight"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- Mobile filter overlay -->
    <Transition name="fp-ov">
      <div v-if="mobileFilters" class="fp-overlay" @click.self="mobileFilters = false"></div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })

import { ref, computed, watch, onMounted, onBeforeUnmount, nextTick } from 'vue'
import { useSearchFlights } from '@/composables/modules/flights/useSearchFlights'
import { useFetchPopularFlights } from '@/composables/modules/flights/useFetchPopularFlights'
import { useTripPurpose } from '@/composables/modules/flights/useTripPurpose'
import FlightGroup from '@/components/FlightGroup.vue'

const { loading, flights, searchFlights } = useSearchFlights()
const { popularFlights, fetchPopularFlights } = useFetchPopularFlights()
const { loading: purposeLoading, prediction, predictTripPurpose } = useTripPurpose()

// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const fromRef = ref<HTMLElement | null>(null)
const toRef = ref<HTMLElement | null>(null)
const dateRef = ref<HTMLElement | null>(null)
const paxRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const fromInputRef = ref<HTMLInputElement | null>(null)
const toInputRef = ref<HTMLInputElement | null>(null)
const fromQuery = ref('')
const toQuery = ref('')
const locationResults = ref<any[]>([])
const calViewDate = ref(new Date())
const sortOpen = ref(false)
const mobileFilters = ref(false)
const activeStops = ref<number[]>([])
const activeAirlines = ref<string[]>([])
const maxPriceFilter = ref(99999)
const activeFare = ref('cheapest')
const sortBy = ref('price')

const searchQuery = ref({ origin: '', destination: '', departureDate: '', adults: 1, children: 0, infants: 0, cabinClass: 'economy' })
const summary = computed(() => {
  const t = searchQuery.value.adults + searchQuery.value.children + searchQuery.value.infants
  return `${t} Passenger${t > 1 ? 's' : ''}, ${searchQuery.value.cabinClass.replace('_', ' ')}`
})

// Popular airports list
const popularAirports = [
  { city: 'Lagos', code: 'LOS', country: 'Nigeria' },
  { city: 'Abuja', code: 'ABV', country: 'Nigeria' },
  { city: 'Dubai', code: 'DXB', country: 'UAE' },
  { city: 'London', code: 'LHR', country: 'UK' },
  { city: 'Accra', code: 'ACC', country: 'Ghana' },
  { city: 'Nairobi', code: 'NBO', country: 'Kenya' },
  { city: 'New York', code: 'JFK', country: 'USA' },
  { city: 'Paris', code: 'CDG', country: 'France' },
]

// All airports for search
const allAirports = [
  { city: 'Lagos', code: 'LOS' }, { city: 'Abuja', code: 'ABV' },
  { city: 'Dubai', code: 'DXB' }, { city: 'London', code: 'LHR' },
  { city: 'London Gatwick', code: 'LGW' }, { city: 'Accra', code: 'ACC' },
  { city: 'Nairobi', code: 'NBO' }, { city: 'New York JFK', code: 'JFK' },
  { city: 'New York Newark', code: 'EWR' }, { city: 'Paris CDG', code: 'CDG' },
  { city: 'Amsterdam', code: 'AMS' }, { city: 'Frankfurt', code: 'FRA' },
  { city: 'Istanbul', code: 'IST' }, { city: 'Cairo', code: 'CAI' },
  { city: 'Johannesburg', code: 'JNB' }, { city: 'Cape Town', code: 'CPT' },
  { city: 'Addis Ababa', code: 'ADD' }, { city: 'Doha', code: 'DOH' },
  { city: 'Toronto', code: 'YYZ' }, { city: 'Singapore', code: 'SIN' },
  { city: 'Hong Kong', code: 'HKG' }, { city: 'Mumbai', code: 'BOM' },
  { city: 'Kigali', code: 'KGL' }, { city: 'Dar es Salaam', code: 'DAR' },
  { city: 'Port Harcourt', code: 'PHC' }, { city: 'Enugu', code: 'ENU' },
]

// ── Location search ───────────────────────────────────────────────────
const searchLocations = (field: string) => {
  const q = field === 'from' ? fromQuery.value : toQuery.value
  if (!q) { locationResults.value = []; return }
  const lq = q.toLowerCase()
  locationResults.value = allAirports.filter(a =>
    a.city.toLowerCase().includes(lq) || a.code.toLowerCase().includes(lq)
  ).slice(0, 6)
}

const selectLocation = (field: string, airport: any) => {
  if (field === 'from') {
    searchQuery.value.origin = airport.code
    fromQuery.value = `${airport.city} (${airport.code})`
    activeField.value = null
    // Auto-open destination
    nextTick(() => { activeField.value = 'to'; nextTick(() => toInputRef.value?.focus()) })
  } else {
    searchQuery.value.destination = airport.code
    toQuery.value = `${airport.city} (${airport.code})`
    activeField.value = null
    // Auto-open date
    nextTick(() => { activeField.value = 'date' })
  }
}

// ── Field management ──────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
  if (field === 'from') nextTick(() => fromInputRef.value?.focus())
  if (field === 'to') nextTick(() => toInputRef.value?.focus())
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { from: fromRef, to: toRef, date: dateRef, pax: paxRef }
  if (activeField.value) {
    const currentRef = refs[activeField.value]?.value
    if (currentRef && !currentRef.contains(e.target as Node)) {
      activeField.value = null
    }
  }
  if (sortRef.value && !sortRef.value.contains(e.target as Node)) {
    sortOpen.value = false
  }
}

// ── Calendar ──────────────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

const calMonthLabel = computed(() =>
  `${MONTHS[calViewDate.value.getMonth()]} ${calViewDate.value.getFullYear()}`
)

const calCells = computed(() => {
  const y = calViewDate.value.getFullYear()
  const m = calViewDate.value.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const today = new Date(); today.setHours(0,0,0,0)
  const cells: any[] = []
  for (let i = 0; i < firstDay; i++) cells.push({ key: `b${i}`, date: null, day: '', past: false, selected: false, today: false })
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d)
    const iso = dt.toISOString().split('T')[0]
    cells.push({ key: iso, date: iso, day: d, past: dt < today, selected: searchQuery.value.departureDate === iso, today: dt.getTime() === today.getTime() })
  }
  return cells
})

const prevMonth = () => { const d = new Date(calViewDate.value); d.setMonth(d.getMonth()-1); calViewDate.value = d }
const nextMonth = () => { const d = new Date(calViewDate.value); d.setMonth(d.getMonth()+1); calViewDate.value = d }
const pickDate = (iso: string) => {
  searchQuery.value.departureDate = iso
  activeField.value = null
  nextTick(() => { activeField.value = 'pax' })
}

const formatDate = (iso: string) => {
  const [y,m,d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m-1].slice(0,3)} ${y}`
}

// ── Flight data ───────────────────────────────────────────────────────
const displayedFlights = computed(() => {
  const src = flights.value?.length ? flights.value : (popularFlights.value || [])
  return Array.isArray(src) ? src.filter(Boolean) : []
})

const availableAirlines = computed(() =>
  [...new Set(displayedFlights.value.map((f: any) => f.airline).filter(Boolean))]
)

const minPrice = computed(() => {
  if (!displayedFlights.value.length) return 0
  return Math.floor(Math.min(...displayedFlights.value.map((f: any) => f.priceWithCommission || f.price || 0)))
})
const maxPrice = computed(() => {
  if (!displayedFlights.value.length) return 10000
  return Math.ceil(Math.max(...displayedFlights.value.map((f: any) => f.priceWithCommission || f.price || 0)))
})
watch(maxPrice, v => { maxPriceFilter.value = v }, { immediate: true })

const filteredFlights = computed(() =>
  displayedFlights.value.filter((f: any) => {
    const price = f.priceWithCommission || f.price || 0
    if (price > maxPriceFilter.value) return false
    if (activeStops.value.length) {
      const stops = f.stops ?? 0
      const ns = stops >= 2 ? 2 : stops
      if (!activeStops.value.includes(ns)) return false
    }
    if (activeAirlines.value.length && !activeAirlines.value.includes(f.airline)) return false
    return true
  })
)

const sortedFlights = computed(() =>
  [...filteredFlights.value].sort((a: any, b: any) => {
    if (sortBy.value === 'price') return (a.priceWithCommission||a.price||0) - (b.priceWithCommission||b.price||0)
    if (sortBy.value === 'duration') return (a.duration||9999) - (b.duration||9999)
    return 0
  })
)

const filteredGrouped = computed(() =>
  sortedFlights.value.reduce((acc: any, f: any) => {
    const k = f.airline || 'Other'
    if (!acc[k]) acc[k] = []
    acc[k].push(f)
    return acc
  }, {})
)

const airlineMeta = computed(() =>
  Object.keys(filteredGrouped.value).slice(0,5).map(name => ({
    name, logo: filteredGrouped.value[name][0]?.airlineLogo
  }))
)

const activeFilterCount = computed(() =>
  activeStops.value.length + activeAirlines.value.length + (maxPriceFilter.value < maxPrice.value ? 1 : 0)
)

// ── Fare matrix ───────────────────────────────────────────────────────
const stopLabels = ['Non-stop', '1 Stop', '1+ Stops']
const stopOptions = [{ label: 'Non-stop', value: 0 }, { label: '1 stop', value: 1 }, { label: '2+ stops', value: 2 }]
const fareTypes = [
  { key: 'cheapest', label: 'Cheapest fare', badge: 'Best price' },
  { key: 'fastest', label: 'Fastest route', badge: 'Quickest' },
  { key: 'recommended', label: 'Top pick', badge: 'Recommended' },
]
const sortOptions = [
  { value: 'price', label: 'Price — low to high' },
  { value: 'duration', label: 'Duration — shortest' },
  { value: 'recommended', label: 'Recommended' },
]
const currentSort = computed(() => sortOptions.find(o => o.value === sortBy.value)!)

const getMatrixPrice = (type: string) => {
  const fl = displayedFlights.value
  if (!fl.length) return '—'
  const prices = fl.map((f: any) => f.priceWithCommission || f.price || 0)
  if (type === 'cheapest') return Math.min(...prices).toLocaleString()
  if (type === 'fastest') {
    const f = [...fl].sort((a: any, b: any) => (a.duration||9999)-(b.duration||9999))[0]
    return (f.priceWithCommission || f.price || 0).toLocaleString()
  }
  return (fl[0].priceWithCommission || fl[0].price || 0).toLocaleString()
}

const getMatrixPriceFor = (airline: string, sl: string) => {
  const sc = sl === 'Non-stop' ? 0 : sl === '1 Stop' ? 1 : 2
  const fl = filteredGrouped.value[airline] || []
  const f2 = fl.filter((f: any) => sc === 2 ? (f.stops||0) >= 2 : (f.stops||0) === sc)
  if (!f2.length) return null
  return Math.min(...f2.map((f: any) => f.priceWithCommission || f.price || 0)).toLocaleString()
}

const jumpTo = (airline: string) => {
  const el = document.getElementById(`group-${airline}`)
  if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
}

// ── Actions ───────────────────────────────────────────────────────────
const handleSearch = () => {
  activeField.value = null
  searchFlights(searchQuery.value)
  predictTripPurpose({ origin: searchQuery.value.origin, destination: searchQuery.value.destination, departureDate: searchQuery.value.departureDate })
}

const swapLocations = () => {
  const t = searchQuery.value.origin; searchQuery.value.origin = searchQuery.value.destination; searchQuery.value.destination = t
  const tq = fromQuery.value; fromQuery.value = toQuery.value; toQuery.value = tq
}

const adjustPax = (d: number) => {
  const n = searchQuery.value.passengers + d
  if (n >= 1 && n <= 9) searchQuery.value.passengers = n
}

const toggleStop = (v: number) => {
  const i = activeStops.value.indexOf(v)
  if (i >= 0) activeStops.value.splice(i, 1); else activeStops.value.push(v)
}
const toggleAirline = (al: string) => {
  const i = activeAirlines.value.indexOf(al)
  if (i >= 0) activeAirlines.value.splice(i, 1); else activeAirlines.value.push(al)
}
const clearFilters = () => { activeStops.value = []; activeAirlines.value = []; maxPriceFilter.value = maxPrice.value }

const selectFlight = (flight: any) => {
  if (!flight) return
  try { sessionStorage.setItem('selectedFlight', JSON.stringify(flight)) } catch {}
  const provider = flight.provider || (flight.slices ? 'duffel' : 'amadeus')
  navigateTo({ path: '/checkout', query: { type: 'flight', id: String(flight.offerId||flight._id||flight.id||'unknown'), name: String(flight.flightNumbers?.[0]||`${flight.airline} flight`), price: String(flight.priceWithCommission||flight.price||0), provider } })
}

onMounted(() => {
  const route = useRoute()
  if (!route.query.origin && !route.query.destination) {
    searchQuery.value = { origin: 'LHR', destination: 'DXB', departureDate: new Date(Date.now() + 14*86400000).toISOString().split('T')[0], passengers: 1 }
    fromQuery.value = 'London (LHR)'
    toQuery.value = 'Dubai (DXB)'
    handleSearch()
  } else {
    if (route.query.origin) { searchQuery.value.origin = String(route.query.origin); fromQuery.value = String(route.query.origin) }
    if (route.query.destination) { searchQuery.value.destination = String(route.query.destination); toQuery.value = String(route.query.destination) }
    if (route.query.departureDate) searchQuery.value.departureDate = String(route.query.departureDate)
    
    // Support both old 'passengers' and new granular props
    if (route.query.adults) searchQuery.value.adults = parseInt(String(route.query.adults)) || 1
    else if (route.query.passengers) searchQuery.value.adults = parseInt(String(route.query.passengers)) || 1
    
    if (route.query.children) searchQuery.value.children = parseInt(String(route.query.children)) || 0
    if (route.query.infants) searchQuery.value.infants = parseInt(String(route.query.infants)) || 0
    if (route.query.infantsOnLap || route.query.infantsInSeat) {
      searchQuery.value.infants = (parseInt(String(route.query.infantsOnLap)) || 0) + (parseInt(String(route.query.infantsInSeat)) || 0)
    }
    
    if (route.query.cabinClass) searchQuery.value.cabinClass = String(route.query.cabinClass)
    else if (route.query.class) searchQuery.value.cabinClass = String(route.query.class)

    handleSearch()
  }
  fetchPopularFlights()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@1,700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.fp-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Sora', system-ui, sans-serif;
  color: #111;
}

.fp-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Hero ──────────────────────────────────────────────────────────── */
.fp-hero {
  background: #f8f9f7;
  border-bottom: 1px solid #e8e8e2;
  padding: 40px 0 56px;
  position: relative;
  overflow: visible;
}

.fp-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.fp-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.28; }
.fp-orb--a { width: 420px; height: 420px; background: radial-gradient(circle, #b8e8cc, transparent); top: -180px; right: -60px; }
.fp-orb--b { width: 300px; height: 300px; background: radial-gradient(circle, #d4e6ff, transparent); bottom: -100px; left: 8%; }

/* Headline */
.fp-headline { margin-bottom: 28px; }
.fp-eyebrow { font-size: 14px; font-weight: 600; letter-spacing: 0.18em; color: #999; display: block; margin-bottom: 10px; }
.fp-h1 { font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; color: #111; letter-spacing: -0.03em; }
.fp-h1 em { font-style: normal; color: #1d7a4f; }

/* ── Search bar ────────────────────────────────────────────────────── */
.fp-bar {
  background: #fff;
  border: 1.5px solid #e0e0d8;
  border-radius: 16px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.06);
  display: flex;
  align-items: stretch;
  position: relative;
  z-index: 50;
  overflow: visible;
  gap: 0;
}

/* Fields */
.fp-fld {
  position: relative;
  flex: 1;
  min-width: 0;
}

.fp-fld--from { flex: 1.4; }
.fp-fld--to { flex: 1.4; }
.fp-fld--date { flex: 1.1; }
.fp-fld--pax { flex: 0 0 auto; }

.fp-fld-inner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  height: 100%;
  cursor: pointer;
  border-radius: 14px;
  transition: background 0.15s;
  min-width: 0;
}

.fp-fld-inner:hover { background: #f5f5f0; }
.fp-fld--active .fp-fld-inner { background: #f0f7f3; }

.fp-fld-ico { color: #aaa; flex-shrink: 0; }

.fp-fld-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
}

.fp-fld-lbl {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.14em;
  color: #bbb;
  white-space: nowrap;
}

.fp-fld-val {
  font-size: 14px;
  font-weight: 500;
  color: #bbb;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.fp-fld-val--set { color: #111; }

.fp-bar-sep {
  width: 1px;
  background: #ebebe5;
  flex-shrink: 0;
  margin: 10px 0;
}

/* Swap button */
.fp-swap {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 1.5px solid #e0e0d8;
  background: #fff;
  color: #888;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  align-self: center;
  margin: 0 4px;
  transition: all 0.2s;
  z-index: 2;
}
.fp-swap:hover { background: #111; color: #fff; border-color: #111; transform: rotate(180deg); }

/* Search button — compact */
.fp-search-btn {
  flex-shrink: 0;
  background: #111;
  border: none;
  border-radius: 12px;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 24px;
  margin: 6px;
  min-width: 100px;
  transition: background 0.2s, transform 0.15s;
  align-self: stretch;
}
.fp-search-btn:hover { background: #1d7a4f; }
.fp-search-btn--busy { opacity: 0.75; cursor: wait; }
.fp-search-inner { display: flex; align-items: center; justify-content: center; gap: 7px; white-space: nowrap; }
.fp-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── Dropdowns — attached to parent field ──────────────────────────── */
.fp-drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #e0e0d8;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.05);
  z-index: 999;
  overflow: hidden;
}

/* Location dropdown */
.fp-drop--loc {
  width: max(280px, 100%);
  min-width: 280px;
  max-width: 360px;
}

.fp-drop-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0ea;
  background: #fafaf8;
  color: #aaa;
}

.fp-drop-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #111;
  outline: none;
  min-width: 0;
}
.fp-drop-input::placeholder { color: #ccc; }

.fp-drop-clear {
  background: none;
  border: none;
  color: #bbb;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}
.fp-drop-clear:hover { color: #111; }

.fp-drop-section { padding: 14px; }
.fp-drop-sec-label { font-size: 14px; font-weight: 600; letter-spacing: 0.14em; color: #bbb; display: block; margin-bottom: 10px; }

.fp-drop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}

.fp-pop-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 10px;
  background: #f8f8f5;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.12s;
  text-align: left;
}
.fp-pop-item:hover { background: #edf5f1; }

.fp-pop-icon {
  width: 28px;
  height: 28px;
  border-radius: 8px;
  background: #fff;
  border: 1px solid #e8e8e0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #888;
  flex-shrink: 0;
}

.fp-pop-name { font-size: 14px; font-weight: 600; color: #111; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fp-pop-code { font-size: 12px; font-weight: 600; color: #999; background: #f0f0ea; padding: 2px 6px; border-radius: 4px; }

.fp-drop-results { padding: 8px; }
.fp-loc-result {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  background: none;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: background 0.12s;
  color: #555;
  text-align: left;
}
.fp-loc-result:hover { background: #f5f5f0; }
.fp-loc-city { font-size: 14px; font-weight: 500; color: #111; flex: 1; text-align: left; }
.fp-loc-code { font-size: 12px; font-weight: 700; color: #1d7a4f; background: #edf5f1; padding: 3px 7px; border-radius: 5px; }
.fp-drop-empty { padding: 16px; text-align: center; font-size: 12px; color: #bbb; }

/* Calendar dropdown */
.fp-drop--cal {
  width: 300px;
  padding: 16px;
}

.fp-cal-nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.fp-cal-title { font-size: 13px; font-weight: 600; color: #111; }

.fp-cal-arrow {
  width: 30px; height: 30px;
  border-radius: 8px;
  border: 1px solid #e8e8e0;
  background: #fff;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s;
}
.fp-cal-arrow:hover { background: #111; color: #fff; border-color: #111; }

.fp-cal-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.fp-cal-dow { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; color: #bbb; text-align: center; padding: 4px 0 8px; }

.fp-cal-cell {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  border-radius: 7px;
  cursor: pointer;
  transition: all 0.1s;
}
.fp-cal-cell:not(.fp-cal-cell--blank):not(.fp-cal-cell--past):hover { background: #edf5f1; color: #1d7a4f; }
.fp-cal-cell--blank { pointer-events: none; }
.fp-cal-cell--past { color: #ddd; cursor: not-allowed; }
.fp-cal-cell--today { font-weight: 700; color: #1d7a4f; }
.fp-cal-cell--sel { background: #1d7a4f !important; color: #fff !important; font-weight: 700; }

/* Pax dropdown */
.fp-drop--pax {
  width: 280px;
  right: 0;
  left: auto;
  padding: 18px;
}

.fp-pax-rows { display: flex; flex-direction: column; gap: 14px; }
.fp-pax-item { display: flex; align-items: center; justify-content: space-between; }
.fp-pax-divider { height: 1px; background: #f0f0ea; margin: 16px 0; }
.fp-pax-class-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
.fp-class-chip {
  padding: 8px;
  border-radius: 8px;
  border: 1.5px solid #e8e8e0;
  background: #f8f8f5;
  font-family: 'Sora', sans-serif;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #888;
  cursor: pointer;
  transition: all 0.15s;
}
.fp-class-chip:hover { border-color: #ccc; color: #555; }
.fp-class-chip--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; }

.fp-pax-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 14px;
}

.fp-pax-info { display: flex; flex-direction: column; gap: 2px; }
.fp-pax-type { font-size: 14px; font-weight: 600; color: #111; }
.fp-pax-sub { font-size: 13px; color: #aaa; }

.fp-pax-ctrl { display: flex; align-items: center; gap: 12px; }

.fp-pax-btn {
  width: 30px; height: 30px;
  border-radius: 50%;
  border: 1.5px solid #e0e0d8;
  background: #fff;
  color: #555;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.14s;
}
.fp-pax-btn:hover:not(:disabled) { border-color: #111; color: #111; }
.fp-pax-btn:disabled { opacity: 0.3; cursor: not-allowed; }

.fp-pax-num { font-size: 16px; font-weight: 700; color: #111; min-width: 20px; text-align: center; }

.fp-pax-done {
  width: 100%;
  padding: 10px;
  background: #111;
  border: none;
  border-radius: 9px;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.15s;
}
.fp-pax-done:hover { background: #1d7a4f; }

/* ── Main content ──────────────────────────────────────────────────── */
.fp-main { padding-top: 36px; padding-bottom: 60px; }

/* Purpose strip */
.fp-purpose {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 16px;
  background: #f5fbf7;
  border: 1px solid #cce8d8;
  border-radius: 10px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.fp-purpose-pip { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pip--biz { background: #111; }
.pip--lei { background: #1d7a4f; }
.fp-purpose-copy { font-size: 12px; color: #555; flex: 1; }
.fp-purpose-copy strong { color: #111; }
.fp-purpose-cta { font-size: 12px; font-weight: 600; color: #1d7a4f; text-decoration: none; white-space: nowrap; }

/* Fare cards */
.fp-fares {
  display: grid;
  grid-template-columns: repeat(3,1fr);
  gap: 10px;
  margin-bottom: 24px;
}

.fp-fare {
  background: #fff;
  border: 1.5px solid #eaeae3;
  border-radius: 14px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.18s;
}
.fp-fare:hover { border-color: #1d7a4f; }
.fp-fare--on { border-color: #1d7a4f; background: #f5fbf7; }

.fp-fare-tag {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.1em;
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
  margin-bottom: 10px;
}
.fp-fare-tag--cheapest { background: #e8f5ef; color: #1d7a4f; }
.fp-fare-tag--fastest { background: #fef3e8; color: #c06010; }
.fp-fare-tag--recommended { background: #eef0ff; color: #4050c0; }

.fp-fare-price {
  font-size: 24px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.03em;
  margin-bottom: 3px;
}
.fp-fare-label { font-size: 11px; color: #aaa; }

/* Matrix */
.fp-matrix { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; overflow: hidden; margin-bottom: 28px; }
.fp-matrix-hd { display: flex; align-items: center; justify-content: space-between; padding: 14px 18px; border-bottom: 1px solid #f0f0ea; }
.fp-sec-label { font-size: 14px; font-weight: 700; letter-spacing: 0.1em; color: #111; }
.fp-sec-hint { font-size: 11px; color: #bbb; }
.fp-matrix-scroll { overflow-x: auto; }
.fp-mtable { width: 100%; border-collapse: collapse; }
.fp-mth { padding: 12px 14px; background: #fafaf8; text-align: center; border-bottom: 1px solid #f0f0ea; }
.fp-mth--first { min-width: 90px; text-align: left; }
.fp-al-box { width: 28px; height: 28px; border-radius: 7px; background: #fff; border: 1px solid #eaeae3; display: flex; align-items: center; justify-content: center; margin: 0 auto 3px; overflow: hidden; }
.fp-al-img { width: 20px; height: 20px; object-fit: contain; }
.fp-al-abbr { font-size: 12px; font-weight: 700; color: #333; }
.fp-al-nm { display: block; font-size: 12px; color: #bbb; max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.fp-mstop { padding: 11px 14px; font-size: 11px; color: #999; border-bottom: 1px solid #f8f8f5; font-weight: 500; }
.fp-mcell { padding: 11px 14px; text-align: center; border-bottom: 1px solid #f8f8f5; cursor: pointer; transition: background 0.12s; }
.fp-mcell:hover { background: #f0f7f3; }
.fp-mprice { font-size: 12px; font-weight: 600; color: #111; }
.fp-mdash { font-size: 13px; color: #e0e0da; }

/* Body grid */
.fp-body { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }

/* Sidebar */
.fp-sidebar { position: sticky; top: 20px; }
.fp-sbar {
  background: #fff;
  border: 1px solid #eaeae3;
  border-radius: 14px;
  padding: 18px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}

.fp-sbar-hd {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: 0.1em;
  color: #111;
  padding-bottom: 14px;
  border-bottom: 1px solid #f0f0ea;
  margin-bottom: 18px;
}
.fp-reset { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; color: #bbb; background: none; border: none; cursor: pointer; transition: color 0.15s; }
.fp-reset:hover { color: #1d7a4f; }

.fp-sb-block { margin-bottom: 20px; }
.fp-sb-label { font-size: 14px; font-weight: 700; letter-spacing: 0.14em; color: #bbb; display: block; margin-bottom: 10px; }
.fp-sb-label strong { color: #111;  letter-spacing: 0; font-size: 12px; }

.fp-chips { display: flex; flex-direction: column; gap: 5px; }
.fp-chip {
  padding: 8px 12px;
  background: #fafaf7;
  border: 1.5px solid transparent;
  border-radius: 8px;
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  text-align: left;
  transition: all 0.14s;
}
.fp-chip:hover { border-color: #cce8d8; color: #1d7a4f; }
.fp-chip--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }

.fp-chk-row { display: flex; align-items: center; gap: 9px; padding: 6px 0; cursor: pointer; }
.fp-chk { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #d8d8d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; transition: all 0.14s; cursor: pointer; }
.fp-chk--on { background: #1d7a4f; border-color: #1d7a4f; }
.fp-chk-label { font-size: 12px; color: #333; }

.fp-range-wrap { display: flex; flex-direction: column; gap: 7px; }
.fp-range { width: 100%; -webkit-appearance: none; height: 3px; background: #e8e8e0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #1d7a4f; }
.fp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border: 2px solid #1d7a4f; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 6px rgba(29,122,79,0.2); }
.fp-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }

/* Toolbar */
.fp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.fp-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #aaa; }
.fp-toolbar-r { display: flex; align-items: center; gap: 8px; }

.fp-sort-wrap { position: relative; }
.fp-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e0e0d8; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 14px; font-weight: 500; color: #333; cursor: pointer; white-space: nowrap; transition: border-color 0.14s; }
.fp-sort-btn:hover { border-color: #aaa; }
.fp-chev { transition: transform 0.18s; color: #aaa; }
.fp-chev--up { transform: rotate(180deg); }

.fp-sort-panel { position: absolute; right: 0; top: calc(100% + 5px); background: #fff; border: 1px solid #e0e0d8; border-radius: 12px; padding: 5px; min-width: 210px; z-index: 100; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.fp-sort-opt { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; border-radius: 7px; background: none; font-family: 'Sora', sans-serif; font-size: 14px; color: #333; cursor: pointer; text-align: left; transition: background 0.12s; }
.fp-sort-opt:hover { background: #f5f5f0; }
.fp-sort-opt--on { font-weight: 600; color: #1d7a4f; }
.fp-sort-dot { width: 5px; height: 5px; border-radius: 50%; background: #d8d8d0; flex-shrink: 0; }
.fp-sort-dot--on { background: #1d7a4f; }

.fp-filter-mob { display: none; align-items: center; gap: 6px; padding: 7px 12px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; position: relative; }
.fp-badge { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background: #1d7a4f; border-radius: 50%; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }

/* Loading */
.fp-loading { display: flex; flex-direction: column; gap: 10px; }
.fp-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 12px; padding: 18px; display: flex; align-items: center; gap: 14px; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.fp-sk { background: #f0f0ea; border-radius: 5px; }
.fp-sk--logo { width: 40px; height: 40px; border-radius: 9px; flex-shrink: 0; }
.fp-sk-grp { flex: 1; display: flex; flex-direction: column; gap: 7px; }
.fp-sk--lg { height: 13px; width: 65%; }
.fp-sk--sm { height: 11px; width: 38%; }
.fp-sk--price { width: 65px; height: 20px; }

/* Empty */
.fp-empty { display: flex; flex-direction: column; align-items: center; padding: 72px 24px; gap: 10px; text-align: center; background: #fff; border: 1px solid #eaeae3; border-radius: 14px; }
.fp-empty-ico { width: 56px; height: 56px; border-radius: 14px; background: #f5fbf7; display: flex; align-items: center; justify-content: center; color: #1d7a4f; margin-bottom: 4px; }
.fp-empty-h { font-size: 20px; font-weight: 700; color: #111; }
.fp-empty-p { font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.6; }
.fp-empty-btn { margin-top: 6px; padding: 10px 22px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.fp-empty-btn:hover { background: #1d7a4f; }

.fp-groups { display: flex; flex-direction: column; gap: 10px; }

/* Overlay */
.fp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 150; backdrop-filter: blur(2px); }

/* ── Transitions ───────────────────────────────────────────────────── */
.fd-enter-active, .fd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.fd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }

.fp-fade-enter-active, .fp-fade-leave-active { transition: opacity 0.28s ease; }
.fp-fade-enter-from, .fp-fade-leave-to { opacity: 0; }

.fp-ov-enter-active, .fp-ov-leave-active { transition: opacity 0.22s ease; }
.fp-ov-enter-from, .fp-ov-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .fp-body { grid-template-columns: 1fr; }
  .fp-sidebar { position: static; }
  .fp-sbar { display: none; }
  .fp-sidebar--open .fp-sbar {
    display: block;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    border-radius: 18px 18px 0 0;
    z-index: 200;
    max-height: 85vh;
    overflow-y: auto;
  }
  .fp-filter-mob { display: flex; }
}

@media (max-width: 860px) {
  /* Compact bar on tablet — wrap fields into 2 rows */
  .fp-bar {
    flex-wrap: wrap;
    border-radius: 14px;
    padding: 6px;
    gap: 0;
  }
  .fp-fld--from, .fp-fld--to {
    flex: 1 0 calc(50% - 20px);
    min-width: 0;
  }
  .fp-swap { order: 3; align-self: flex-start; margin: 6px 2px; }
  .fp-bar-sep:first-of-type { display: none; }
  .fp-bar-sep { height: 1px; width: 100%; margin: 0; }
  .fp-fld--date { flex: 1 0 50%; }
  .fp-fld--pax { flex: 1 0 40%; }
  .fp-search-btn { flex: 1 0 100%; margin: 4px 0 0; border-radius: 10px; min-height: 46px; }
  .fp-fares { grid-template-columns: 1fr 1fr; }
  .fp-fares > :last-child { grid-column: 1 / -1; }
}

@media (max-width: 580px) {
  .fp-wrap { padding: 0 14px; }
  .fp-hero { padding: 28px 0 44px; }
  .fp-fld--from, .fp-fld--to, .fp-fld--date, .fp-fld--pax { flex: 1 0 100%; }
  .fp-swap { order: 2; margin: 2px 0; }
  .fp-bar-sep { display: none; }
  /* Keep dropdowns inside viewport on mobile */
  .fp-drop--loc { max-width: calc(100vw - 28px); left: 0; }
  .fp-drop--cal { width: calc(100vw - 28px); left: 0; }
  .fp-drop--pax { left: 0; right: auto; width: calc(100vw - 28px); }
  .fp-fares { grid-template-columns: 1fr; }
}
</style>