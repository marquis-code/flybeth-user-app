<template>
  <div class="sp-root" @mousedown="handleGlobalMousedown">
 
    <!-- ═══════════════ HERO / SEARCH ═══════════════ -->
    <section class="sp-hero">
      <div class="sp-hero-bg">
        <div class="sp-orb sp-orb--a"></div>
        <div class="sp-orb sp-orb--b"></div>
        <div class="sp-orb sp-orb--c"></div>
      </div>
 
      <div class="sp-wrap">
 
        <!-- Dynamic headline -->
        <div class="sp-headline">
          <span class="sp-eyebrow">✦ Stay Search</span>
          <h1 class="sp-h1">
            <template v-if="searchQuery.location">
              Stays in <em>{{ searchQuery.location }}</em>
            </template>
            <template v-else>
              Find your<br><em>perfect stay.</em>
            </template>
          </h1>
        </div>
 
        <!-- ── SEARCH BAR ── -->
        <div class="sp-bar">
 
          <!-- LOCATION field -->
          <div class="sp-fld sp-fld--loc" :class="{ 'sp-fld--active': activeField === 'loc' }" ref="locRef">
            <div class="sp-fld-inner" @click="openField('loc')">
              <svg class="sp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
              </svg>
              <div class="sp-fld-text">
                <span class="sp-fld-lbl">Where</span>
                <span class="sp-fld-val" :class="{ 'sp-fld-val--set': searchQuery.location }">
                  {{ searchQuery.location || 'City or hotel' }}
                </span>
              </div>
            </div>
            <!-- Location dropdown -->
            <Transition name="fd">
              <div v-if="activeField === 'loc'" class="sp-drop sp-drop--loc" @mousedown.stop>
                <div class="sp-drop-search">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <input ref="locInputRef" v-model="locQuery" placeholder="Search city, area or hotel…" class="sp-drop-input" @input="searchLocations" />
                  <button v-if="locQuery" class="sp-drop-clear" @click="locQuery=''; searchQuery.location=''">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                  </button>
                </div>
                <div v-if="!locQuery" class="sp-drop-section">
                  <span class="sp-drop-sec-label">Popular destinations</span>
                  <div class="sp-drop-grid">
                    <button v-for="p in popularDestinations" :key="p.name" class="sp-pop-item" @click="selectLocation(p)">
                      <span class="sp-pop-icon">{{ p.emoji }}</span>
                      <span class="sp-pop-name">{{ p.name }}</span>
                      <span class="sp-pop-sub">{{ p.country }}</span>
                    </button>
                  </div>
                </div>
                <div v-else class="sp-drop-results">
                  <button v-for="r in locationResults" :key="r.name" class="sp-loc-result" @click="selectLocation(r)">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    <span class="sp-loc-name">{{ r.name }}</span>
                    <span class="sp-loc-country">{{ r.country }}</span>
                  </button>
                  <div v-if="!locationResults.length" class="sp-drop-empty">No results for "{{ locQuery }}"</div>
                </div>
              </div>
            </Transition>
          </div>
 
          <div class="sp-bar-sep"></div>
 
          <!-- CHECK-IN field -->
          <div class="sp-fld sp-fld--date" :class="{ 'sp-fld--active': activeField === 'cin' }" ref="cinRef">
            <div class="sp-fld-inner" @click="openField('cin')">
              <svg class="sp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="sp-fld-text">
                <span class="sp-fld-lbl">Check-in</span>
                <span class="sp-fld-val" :class="{ 'sp-fld-val--set': searchQuery.checkIn }">
                  {{ searchQuery.checkIn ? formatDate(searchQuery.checkIn) : 'Add date' }}
                </span>
              </div>
            </div>
            <Transition name="fd">
              <div v-if="activeField === 'cin'" class="sp-drop sp-drop--cal" @mousedown.stop>
                <div class="sp-cal-nav-row">
                  <button class="sp-cal-arrow" @click="prevMonth('cin')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="sp-cal-title">{{ calMonthLabel(cinViewDate) }}</span>
                  <button class="sp-cal-arrow" @click="nextMonth('cin')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="sp-cal-grid">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="sp-cal-dow">{{ d }}</div>
                  <div v-for="c in calCells(cinViewDate, searchQuery.checkIn)" :key="c.key"
                    class="sp-cal-cell"
                    :class="{
                      'sp-cal-cell--blank': !c.date,
                      'sp-cal-cell--past': c.past,
                      'sp-cal-cell--sel': c.selected,
                      'sp-cal-cell--today': c.today,
                      'sp-cal-cell--inrange': c.inRange
                    }"
                    @click="c.date && !c.past && pickCheckIn(c.date)"
                  >{{ c.day }}</div>
                </div>
              </div>
            </Transition>
          </div>
 
          <!-- CHECK-OUT field -->
          <div class="sp-fld sp-fld--date" :class="{ 'sp-fld--active': activeField === 'cout' }" ref="coutRef">
            <div class="sp-fld-inner" @click="openField('cout')">
              <svg class="sp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div class="sp-fld-text">
                <span class="sp-fld-lbl">Check-out</span>
                <span class="sp-fld-val" :class="{ 'sp-fld-val--set': searchQuery.checkOut }">
                  {{ searchQuery.checkOut ? formatDate(searchQuery.checkOut) : 'Add date' }}
                </span>
              </div>
            </div>
            <Transition name="fd">
              <div v-if="activeField === 'cout'" class="sp-drop sp-drop--cal" @mousedown.stop>
                <div class="sp-cal-nav-row">
                  <button class="sp-cal-arrow" @click="prevMonth('cout')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                  </button>
                  <span class="sp-cal-title">{{ calMonthLabel(coutViewDate) }}</span>
                  <button class="sp-cal-arrow" @click="nextMonth('cout')">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                  </button>
                </div>
                <div class="sp-cal-grid">
                  <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="sp-cal-dow">{{ d }}</div>
                  <div v-for="c in calCells(coutViewDate, searchQuery.checkOut, searchQuery.checkIn)" :key="c.key"
                    class="sp-cal-cell"
                    :class="{
                      'sp-cal-cell--blank': !c.date,
                      'sp-cal-cell--past': c.past || (searchQuery.checkIn && c.date <= searchQuery.checkIn),
                      'sp-cal-cell--sel': c.selected,
                      'sp-cal-cell--today': c.today,
                      'sp-cal-cell--inrange': isInRange(c.date)
                    }"
                    @click="c.date && !c.past && !(searchQuery.checkIn && c.date <= searchQuery.checkIn) && pickCheckOut(c.date)"
                  >{{ c.day }}</div>
                </div>
                <div v-if="searchQuery.checkIn && searchQuery.checkOut" class="sp-cal-footer">
                  <span>{{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }}</span>
                </div>
              </div>
            </Transition>
          </div>
 
          <div class="sp-bar-sep"></div>
 
          <!-- GUESTS field -->
          <div class="sp-fld sp-fld--guests" :class="{ 'sp-fld--active': activeField === 'guests' }" ref="guestsRef">
            <div class="sp-fld-inner" @click="openField('guests')">
              <svg class="sp-fld-ico" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
              <div class="sp-fld-text">
                <span class="sp-fld-lbl">Guests</span>
                <span class="sp-fld-val sp-fld-val--set">{{ guestSummary }}</span>
              </div>
            </div>
            <Transition name="fd">
              <div v-if="activeField === 'guests'" class="sp-drop sp-drop--guests" @mousedown.stop>
                <div class="sp-guests-row" v-for="g in guestTypes" :key="g.key">
                  <div class="sp-guests-info">
                    <span class="sp-guests-type">{{ g.label }}</span>
                    <span class="sp-guests-sub">{{ g.sub }}</span>
                  </div>
                  <div class="sp-guests-ctrl">
                    <button class="sp-guests-btn" @click="adjustGuest(g.key, -1)" :disabled="searchQuery[g.key] <= g.min">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                    </button>
                    <span class="sp-guests-num">{{ searchQuery[g.key] }}</span>
                    <button class="sp-guests-btn" @click="adjustGuest(g.key, 1)" :disabled="searchQuery[g.key] >= 9">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>
                <div class="sp-guests-sep"></div>
                <div class="sp-guests-row">
                  <div class="sp-guests-info">
                    <span class="sp-guests-type">Rooms</span>
                    <span class="sp-guests-sub">Separate rooms</span>
                  </div>
                  <div class="sp-guests-ctrl">
                    <button class="sp-guests-btn" @click="adjustGuest('rooms', -1)" :disabled="searchQuery.rooms <= 1">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                    </button>
                    <span class="sp-guests-num">{{ searchQuery.rooms }}</span>
                    <button class="sp-guests-btn" @click="adjustGuest('rooms', 1)" :disabled="searchQuery.rooms >= 9">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>
                <button class="sp-guests-done" @click="activeField = null">Done</button>
              </div>
            </Transition>
          </div>
 
          <!-- SEARCH BTN -->
          <button class="sp-search-btn" :class="{ 'sp-search-btn--busy': loading }" @click="handleSearch">
            <span class="sp-search-inner">
              <svg v-if="!loading" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <span v-if="loading" class="sp-spin"></span>
              <span>{{ loading ? 'Searching' : 'Search' }}</span>
            </span>
          </button>
 
        </div><!-- /sp-bar -->
 
        <!-- Stay type pills -->
        <div class="sp-type-pills">
          <button v-for="t in stayTypes" :key="t.key"
            class="sp-type-pill"
            :class="{ 'sp-type-pill--on': activeType === t.key }"
            @click="activeType = activeType === t.key ? null : t.key">
            <span>{{ t.icon }}</span>
            <span>{{ t.label }}</span>
          </button>
        </div>
 
      </div><!-- /sp-wrap -->
    </section>
 
    <!-- ═══════════════ MAIN BODY ═══════════════ -->
    <div class="sp-wrap sp-main">
 
      <!-- Summary strip -->
      <Transition name="sp-fade">
        <div v-if="displayedStays.length && !loading" class="sp-summary">
          <div class="sp-summary-left">
            <span class="sp-summary-count">{{ displayedStays.length }}</span>
            <span class="sp-summary-text">properties in <strong>{{ searchQuery.location || 'your area' }}</strong></span>
          </div>
          <div v-if="nightCount > 0" class="sp-summary-right">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
            {{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }}
          </div>
        </div>
      </Transition>
 
      <!-- Body grid -->
      <div class="sp-body">
 
        <!-- Sidebar -->
        <aside class="sp-sidebar" :class="{ 'sp-sidebar--open': mobileFilters }">
          <div class="sp-sbar">
            <div class="sp-sbar-hd">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
              <span>Refine results</span>
              <button class="sp-reset" @click="clearFilters">Reset</button>
            </div>
 
            <!-- Property type -->
            <div class="sp-sb-block">
              <p class="sp-sb-label">Property type</p>
              <div class="sp-chips">
                <button v-for="t in stayTypes" :key="t.key"
                  class="sp-chip sp-chip--icon"
                  :class="{ 'sp-chip--on': activeType === t.key }"
                  @click="activeType = activeType === t.key ? null : t.key">
                  <span>{{ t.icon }}</span>
                  <span>{{ t.label }}</span>
                </button>
              </div>
            </div>
 
            <!-- Star rating -->
            <div class="sp-sb-block">
              <p class="sp-sb-label">Star rating</p>
              <div class="sp-stars-row">
                <button v-for="s in [1,2,3,4,5]" :key="s"
                  class="sp-star-btn"
                  :class="{ 'sp-star-btn--on': activeStars.includes(s) }"
                  @click="toggleStar(s)">
                  {{ s }}★
                </button>
              </div>
            </div>
 
            <!-- Amenities -->
            <div class="sp-sb-block">
              <p class="sp-sb-label">Amenities</p>
              <label v-for="a in amenities" :key="a.key" class="sp-chk-row">
                <span class="sp-chk" :class="{ 'sp-chk--on': activeAmenities.includes(a.key) }" @click="toggleAmenity(a.key)">
                  <svg v-if="activeAmenities.includes(a.key)" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
                </span>
                <span class="sp-chk-label">{{ a.icon }} {{ a.label }}</span>
              </label>
            </div>
 
            <!-- Max price -->
            <div class="sp-sb-block">
              <p class="sp-sb-label">Max price <strong>${{ maxPriceFilter.toLocaleString() }}<span class="sp-per-night">/night</span></strong></p>
              <div class="sp-range-wrap">
                <input type="range" :min="minPrice" :max="maxPrice" step="1" v-model.number="maxPriceFilter" class="sp-range" />
                <div class="sp-range-ends">
                  <span>${{ minPrice.toLocaleString() }}</span>
                  <span>${{ maxPrice.toLocaleString() }}</span>
                </div>
              </div>
            </div>
 
            <!-- Guest rating -->
            <div class="sp-sb-block">
              <p class="sp-sb-label">Guest rating</p>
              <div class="sp-chips">
                <button v-for="r in ratingOptions" :key="r.value"
                  class="sp-chip"
                  :class="{ 'sp-chip--on': minRating === r.value }"
                  @click="minRating = minRating === r.value ? 0 : r.value">
                  {{ r.label }}
                </button>
              </div>
            </div>
 
          </div>
        </aside>
 
        <!-- Results -->
        <div class="sp-results">
 
          <!-- Toolbar -->
          <div v-if="displayedStays.length" class="sp-toolbar">
            <span class="sp-rcount">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              {{ filteredStays.length }} stays found
            </span>
            <div class="sp-toolbar-r">
              <div class="sp-sort-wrap" ref="sortRef">
                <button class="sp-sort-btn" @click.stop="sortOpen = !sortOpen">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M6 12h12M9 18h6"/></svg>
                  {{ currentSort.label }}
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" class="sp-chev" :class="{ 'sp-chev--up': sortOpen }"><path d="M6 9l6 6 6-6"/></svg>
                </button>
                <Transition name="fd">
                  <div v-if="sortOpen" class="sp-sort-panel" @mousedown.stop>
                    <button v-for="o in sortOptions" :key="o.value" class="sp-sort-opt" :class="{ 'sp-sort-opt--on': sortBy === o.value }" @click="sortBy = o.value; sortOpen = false">
                      <span class="sp-sort-dot" :class="{ 'sp-sort-dot--on': sortBy === o.value }"></span>
                      {{ o.label }}
                    </button>
                  </div>
                </Transition>
              </div>
 
              <!-- View toggle -->
              <div class="sp-view-toggle">
                <button class="sp-view-btn" :class="{ 'sp-view-btn--on': viewMode === 'list' }" @click="viewMode = 'list'" title="List view">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                </button>
                <button class="sp-view-btn" :class="{ 'sp-view-btn--on': viewMode === 'compact' }" @click="viewMode = 'compact'" title="Compact view">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
                </button>
              </div>
 
              <button class="sp-filter-mob" @click="mobileFilters = !mobileFilters">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/></svg>
                Filters
                <span v-if="activeFilterCount" class="sp-badge">{{ activeFilterCount }}</span>
              </button>
            </div>
          </div>
 
          <!-- Loading skeletons -->
          <div v-if="loading" class="sp-loading" :class="{ 'sp-loading--compact': viewMode === 'compact' }">
            <div v-for="n in 4" :key="n" class="sp-skel-card" :class="{ 'sp-skel-card--compact': viewMode === 'compact' }">
              <div class="sp-sk sp-sk--img"></div>
              <div class="sp-sk-body">
                <div class="sp-sk sp-sk--tag"></div>
                <div class="sp-sk sp-sk--title"></div>
                <div class="sp-sk sp-sk--sub"></div>
                <div class="sp-sk-row">
                  <div class="sp-sk sp-sk--badge"></div>
                  <div class="sp-sk sp-sk--price"></div>
                </div>
              </div>
            </div>
          </div>
 
          <!-- Empty state -->
          <div v-else-if="!displayedStays.length" class="sp-empty">
            <div class="sp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3 class="sp-empty-h">No stays found</h3>
            <p class="sp-empty-p">Try a different destination or adjust your dates to discover available properties.</p>
            <button class="sp-empty-btn" @click="searchQuery.location='Dubai'; handleSearch()">Try Dubai</button>
          </div>
 
          <!-- No filter match -->
          <div v-else-if="filteredStays.length === 0" class="sp-empty">
            <div class="sp-empty-ico">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
            </div>
            <h3 class="sp-empty-h">No matches</h3>
            <p class="sp-empty-p">Your filters returned nothing. Try widening the criteria.</p>
            <button class="sp-empty-btn" @click="clearFilters">Clear filters</button>
          </div>
 
          <!-- Stay cards -->
          <div v-if="filteredStays.length" class="sp-cards" :class="{ 'sp-cards--compact': viewMode === 'compact' }">
            <div v-for="stay in filteredStays" :key="stay.id || stay.accommodationId || stay._id"
              class="sp-card"
              :class="{ 'sp-card--compact': viewMode === 'compact' }"
              @click="goToDetails(stay)">
 
              <!-- Image -->
              <div class="sp-card-img-wrap">
                <img
                  :src="stay.photos?.[0] || stay.photo || `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80`"
                  :alt="stay.name"
                  class="sp-card-img"
                  loading="lazy"
                />
                <div class="sp-card-badges">
                  <span v-if="stay.featured" class="sp-badge-pill sp-badge-pill--feat">Featured</span>
                  <span v-if="stay.discountPct" class="sp-badge-pill sp-badge-pill--disc">-{{ stay.discountPct }}%</span>
                </div>
                <button class="sp-card-fav" @click.stop="toggleFav(stay.id || stay._id)" :class="{ 'sp-card-fav--on': favs.includes(stay.id || stay._id) }">
                  <svg width="14" height="14" viewBox="0 0 24 24" :fill="favs.includes(stay.id || stay._id) ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                </button>
              </div>
 
              <!-- Body -->
              <div class="sp-card-body">
                <div class="sp-card-top">
                  <span class="sp-card-type">{{ stay.type || stay.propertyType || 'Hotel' }}</span>
                  <div v-if="stay.rating || stay.starRating" class="sp-card-stars">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
                    {{ (stay.rating || stay.starRating || 0).toFixed(1) }}
                    <span v-if="stay.reviewCount" class="sp-card-reviews">({{ stay.reviewCount }})</span>
                  </div>
                </div>
 
                <h3 class="sp-card-name">{{ stay.name }}</h3>
                <p class="sp-card-loc">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                  {{ stay.location?.city || stay.city || stay.address || searchQuery.location }}
                </p>
 
                <!-- Amenity chips -->
                <div v-if="stay.amenities?.length || stay.facilities?.length" class="sp-card-amenities">
                  <span v-for="am in (stay.amenities || stay.facilities || []).slice(0,3)" :key="am" class="sp-card-amen">{{ am }}</span>
                </div>
 
                <!-- Price row -->
                <div class="sp-card-foot">
                  <div class="sp-card-price-wrap">
                    <div class="sp-card-price">
                      ${{ Math.round(stay.priceWithCommission || stay.cheapestPrice || stay.price || 0).toLocaleString() }}
                    </div>
                    <div class="sp-card-per">/ night</div>
                  </div>
                  <button class="sp-card-cta" @click.stop="goToDetails(stay)">View →</button>
                </div>
              </div>
            </div>
          </div>
 
        </div><!-- /sp-results -->
      </div><!-- /sp-body -->
    </div><!-- /sp-main -->
 
    <!-- Pending booking cart pill -->
    <Transition name="sp-cart">
      <div v-if="pendingBooking" class="sp-cart-pill">
        <div class="sp-cart-info">
          <span class="sp-cart-label">Cart</span>
          <span class="sp-cart-name">{{ pendingBooking.stay?.name }}</span>
        </div>
        <div class="sp-cart-price">${{ pendingBooking.price }}</div>
        <button class="sp-cart-checkout" @click="goToCheckout(pendingBooking)">Checkout →</button>
        <button class="sp-cart-close" @click="clearPendingBooking">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
    </Transition>
 
    <!-- Mobile filter overlay -->
    <Transition name="sp-ov">
      <div v-if="mobileFilters" class="sp-overlay" @click.self="mobileFilters = false"></div>
    </Transition>
 
  </div>
</template>
 
<script setup lang="ts">
definePageMeta({ layout: 'no-footer' })
 
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useSearchStays } from '@/composables/modules/stays/useSearchStays'
 
const { loading, stays, searchStays } = useSearchStays()
 
// ── Refs ──────────────────────────────────────────────────────────────
const activeField = ref<string | null>(null)
const locRef = ref<HTMLElement | null>(null)
const cinRef = ref<HTMLElement | null>(null)
const coutRef = ref<HTMLElement | null>(null)
const guestsRef = ref<HTMLElement | null>(null)
const sortRef = ref<HTMLElement | null>(null)
const locInputRef = ref<HTMLInputElement | null>(null)
const locQuery = ref('')
const locationResults = ref<any[]>([])
const cinViewDate = ref(new Date())
const coutViewDate = ref(new Date())
const sortOpen = ref(false)
const mobileFilters = ref(false)
const viewMode = ref<'list' | 'compact'>('list')
const activeType = ref<string | null>(null)
const activeStars = ref<number[]>([])
const activeAmenities = ref<string[]>([])
const maxPriceFilter = ref(99999)
const minRating = ref(0)
const sortBy = ref('popular')
const favs = ref<string[]>([])
const pendingBooking = ref<any>(null)
 
const searchQuery = ref({
  location: '',
  lat: null as number | null,
  lng: null as number | null,
  checkIn: new Date(Date.now() + 86400000).toISOString().split('T')[0],
  checkOut: new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
  adults: 2,
  children: 0,
  rooms: 1,
})
 
// ── Static data ───────────────────────────────────────────────────────
const popularDestinations = [
  { name: 'Dubai', country: 'UAE', emoji: '🌇', lat: 25.2048, lng: 55.2708 },
  { name: 'London', country: 'United Kingdom', emoji: '🎡', lat: 51.5074, lng: -0.1278 },
  { name: 'Paris', country: 'France', emoji: '🗼', lat: 48.8566, lng: 2.3522 },
  { name: 'Lagos', country: 'Nigeria', emoji: '🌴', lat: 6.5244, lng: 3.3792 },
  { name: 'New York', country: 'USA', emoji: '🗽', lat: 40.7128, lng: -74.0060 },
  { name: 'Nairobi', country: 'Kenya', emoji: '🦁', lat: -1.2921, lng: 36.8219 },
  { name: 'Accra', country: 'Ghana', emoji: '⭐', lat: 5.6037, lng: -0.1870 },
  { name: 'Amsterdam', country: 'Netherlands', emoji: '🌷', lat: 52.3676, lng: 4.9041 },
]
 
const allDestinations = [
  ...popularDestinations,
  { name: 'Istanbul', country: 'Turkey', emoji: '🕌', lat: 41.0082, lng: 28.9784 },
  { name: 'Singapore', country: 'Singapore', emoji: '🦁', lat: 1.3521, lng: 103.8198 },
  { name: 'Tokyo', country: 'Japan', emoji: '⛩️', lat: 35.6762, lng: 139.6503 },
  { name: 'Barcelona', country: 'Spain', emoji: '🏖️', lat: 41.3851, lng: 2.1734 },
  { name: 'Cairo', country: 'Egypt', emoji: '🏺', lat: 30.0444, lng: 31.2357 },
  { name: 'Cape Town', country: 'South Africa', emoji: '🏔️', lat: -33.9249, lng: 18.4241 },
  { name: 'Kigali', country: 'Rwanda', emoji: '🌿', lat: -1.9441, lng: 30.0619 },
  { name: 'Abuja', country: 'Nigeria', emoji: '🏛️', lat: 9.0765, lng: 7.3986 },
  { name: 'Maldives', country: 'Maldives', emoji: '🐠', lat: 3.2028, lng: 73.2207 },
  { name: 'Zanzibar', country: 'Tanzania', emoji: '🌊', lat: -6.1659, lng: 39.2026 },
]
 
const stayTypes = [
  { key: 'hotel', label: 'Hotel', icon: '🏨' },
  { key: 'apartment', label: 'Apartment', icon: '🏢' },
  { key: 'villa', label: 'Villa', icon: '🏡' },
  { key: 'resort', label: 'Resort', icon: '🌴' },
  { key: 'boutique', label: 'Boutique', icon: '✨' },
]
 
const amenities = [
  { key: 'wifi', label: 'Free WiFi', icon: '📶' },
  { key: 'pool', label: 'Swimming pool', icon: '🏊' },
  { key: 'parking', label: 'Free parking', icon: '🚗' },
  { key: 'breakfast', label: 'Breakfast incl.', icon: '🍳' },
  { key: 'gym', label: 'Fitness centre', icon: '💪' },
  { key: 'spa', label: 'Spa', icon: '🧖' },
  { key: 'restaurant', label: 'Restaurant', icon: '🍽️' },
  { key: 'ac', label: 'Air conditioning', icon: '❄️' },
]
 
const guestTypes = [
  { key: 'adults', label: 'Adults', sub: 'Age 18+', min: 1 },
  { key: 'children', label: 'Children', sub: 'Ages 2–17', min: 0 },
]
 
const ratingOptions = [
  { value: 9, label: '9+ Superb' },
  { value: 8, label: '8+ Excellent' },
  { value: 7, label: '7+ Good' },
]
 
const sortOptions = [
  { value: 'popular', label: 'Popular first' },
  { value: 'price', label: 'Price — low to high' },
  { value: 'rating', label: 'Guest rating' },
]
 
// ── Computed ──────────────────────────────────────────────────────────
const guestSummary = computed(() => {
  const parts = [`${searchQuery.value.adults} adult${searchQuery.value.adults !== 1 ? 's' : ''}`]
  if (searchQuery.value.children > 0) parts.push(`${searchQuery.value.children} child${searchQuery.value.children !== 1 ? 'ren' : ''}`)
  if (searchQuery.value.rooms > 1) parts.push(`${searchQuery.value.rooms} rooms`)
  return parts.join(', ')
})
 
const nightCount = computed(() => {
  if (!searchQuery.value.checkIn || !searchQuery.value.checkOut) return 0
  const a = new Date(searchQuery.value.checkIn)
  const b = new Date(searchQuery.value.checkOut)
  return Math.max(0, Math.round((b.getTime() - a.getTime()) / 86400000))
})
 
const displayedStays = computed(() => {
  const src = stays.value
  return Array.isArray(src) ? src.filter(Boolean) : []
})
 
const minPrice = computed(() => {
  if (!displayedStays.value.length) return 0
  return Math.floor(Math.min(...displayedStays.value.map((s: any) => s.priceWithCommission || s.cheapestPrice || s.price || 0)))
})
const maxPrice = computed(() => {
  if (!displayedStays.value.length) return 2000
  return Math.ceil(Math.max(...displayedStays.value.map((s: any) => s.priceWithCommission || s.cheapestPrice || s.price || 0)))
})
watch(maxPrice, v => { maxPriceFilter.value = v }, { immediate: true })
 
const filteredStays = computed(() => {
  let list = [...displayedStays.value]
  // Type
  if (activeType.value) {
    list = list.filter((s: any) => (s.type || s.propertyType || '').toLowerCase().includes(activeType.value!))
  }
  // Stars
  if (activeStars.value.length) {
    list = list.filter((s: any) => activeStars.value.includes(Math.round(s.starRating || s.rating || 0)))
  }
  // Price
  list = list.filter((s: any) => (s.priceWithCommission || s.cheapestPrice || s.price || 0) <= maxPriceFilter.value)
  // Rating
  if (minRating.value > 0) {
    list = list.filter((s: any) => (s.guestRating || s.rating || 0) >= minRating.value)
  }
  // Sort
  if (sortBy.value === 'price') list.sort((a: any, b: any) => (a.priceWithCommission||a.cheapestPrice||a.price||0) - (b.priceWithCommission||b.cheapestPrice||b.price||0))
  else if (sortBy.value === 'rating') list.sort((a: any, b: any) => (b.guestRating||b.rating||0) - (a.guestRating||a.rating||0))
  return list
})
 
const currentSort = computed(() => sortOptions.find(o => o.value === sortBy.value)!)
const activeFilterCount = computed(() =>
  (activeType.value ? 1 : 0) + activeStars.value.length + activeAmenities.value.length +
  (maxPriceFilter.value < maxPrice.value ? 1 : 0) + (minRating.value > 0 ? 1 : 0)
)
 
// ── Calendar helpers ──────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
 
const calMonthLabel = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`
 
const calCells = (viewDate: Date, selected: string, minDate?: string) => {
  const y = viewDate.getFullYear()
  const m = viewDate.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const today = new Date(); today.setHours(0,0,0,0)
  const cells: any[] = []
  for (let i = 0; i < firstDay; i++) cells.push({ key: `b${i}`, date: null, day: '', past: false, selected: false, today: false, inRange: false })
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d)
    const iso = dt.toISOString().split('T')[0]
    cells.push({
      key: iso, date: iso, day: d,
      past: dt < today,
      selected: selected === iso,
      today: dt.getTime() === today.getTime(),
      inRange: false
    })
  }
  return cells
}
 
const isInRange = (date: string | null) => {
  if (!date || !searchQuery.value.checkIn || !searchQuery.value.checkOut) return false
  return date > searchQuery.value.checkIn && date < searchQuery.value.checkOut
}
 
const prevMonth = (field: string) => {
  if (field === 'cin') { const d = new Date(cinViewDate.value); d.setMonth(d.getMonth()-1); cinViewDate.value = d }
  else { const d = new Date(coutViewDate.value); d.setMonth(d.getMonth()-1); coutViewDate.value = d }
}
const nextMonth = (field: string) => {
  if (field === 'cin') { const d = new Date(cinViewDate.value); d.setMonth(d.getMonth()+1); cinViewDate.value = d }
  else { const d = new Date(coutViewDate.value); d.setMonth(d.getMonth()+1); coutViewDate.value = d }
}
 
const pickCheckIn = (iso: string) => {
  searchQuery.value.checkIn = iso
  // Auto-advance to checkout
  if (!searchQuery.value.checkOut || iso >= searchQuery.value.checkOut) {
    const next = new Date(iso); next.setDate(next.getDate() + 1)
    searchQuery.value.checkOut = next.toISOString().split('T')[0]
    coutViewDate.value = next
  }
  activeField.value = null
  nextTick(() => { activeField.value = 'cout' })
}
 
const pickCheckOut = (iso: string) => {
  searchQuery.value.checkOut = iso
  activeField.value = null
  nextTick(() => { activeField.value = 'guests' })
}
 
const formatDate = (iso: string) => {
  const [y,m,d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m-1].slice(0,3)} ${y}`
}
 
// ── Location search ───────────────────────────────────────────────────
const searchLocations = () => {
  const q = locQuery.value
  if (!q) { locationResults.value = []; return }
  const lq = q.toLowerCase()
  locationResults.value = allDestinations.filter(d =>
    d.name.toLowerCase().includes(lq) || d.country.toLowerCase().includes(lq)
  ).slice(0, 6)
}
 
const selectLocation = (dest: any) => {
  searchQuery.value.location = dest.name
  searchQuery.value.lat = dest.lat
  searchQuery.value.lng = dest.lng
  locQuery.value = dest.name
  activeField.value = null
  nextTick(() => { activeField.value = 'cin' })
}
 
// ── Field management ──────────────────────────────────────────────────
const openField = (field: string) => {
  activeField.value = activeField.value === field ? null : field
  if (field === 'loc') nextTick(() => locInputRef.value?.focus())
}
 
const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { loc: locRef, cin: cinRef, cout: coutRef, guests: guestsRef }
  if (activeField.value) {
    const cur = refs[activeField.value]?.value
    if (cur && !cur.contains(e.target as Node)) activeField.value = null
  }
  if (sortRef.value && !sortRef.value.contains(e.target as Node)) sortOpen.value = false
}
 
// ── Actions ───────────────────────────────────────────────────────────
const handleSearch = async () => {
  activeField.value = null
  await searchStays(searchQuery.value)
}
 
const adjustGuest = (key: string, delta: number) => {
  const min = key === 'adults' ? 1 : 0
  const cur = (searchQuery.value as any)[key]
  const next = Math.max(min, Math.min(9, cur + delta))
  ;(searchQuery.value as any)[key] = next
}
 
const toggleStar = (s: number) => {
  const i = activeStars.value.indexOf(s)
  if (i >= 0) activeStars.value.splice(i, 1); else activeStars.value.push(s)
}
const toggleAmenity = (k: string) => {
  const i = activeAmenities.value.indexOf(k)
  if (i >= 0) activeAmenities.value.splice(i, 1); else activeAmenities.value.push(k)
}
const clearFilters = () => {
  activeType.value = null; activeStars.value = []; activeAmenities.value = []
  maxPriceFilter.value = maxPrice.value; minRating.value = 0
}
 
const toggleFav = (id: string) => {
  const i = favs.value.indexOf(id)
  if (i >= 0) favs.value.splice(i, 1); else favs.value.push(id)
}
 
const goToDetails = (stay: any) => {
  const id = stay._id || stay.id || stay.accommodationId
  const provider = stay.provider || 'duffel'
  navigateTo({ path: `/stays/${id}`, query: {
    provider, checkIn: searchQuery.value.checkIn, checkOut: searchQuery.value.checkOut,
    adults: searchQuery.value.adults, children: searchQuery.value.children, rooms: searchQuery.value.rooms
  }})
}
 
const goToCheckout = (booking: any) => {
  navigateTo({ path: '/checkout', query: {
    type: 'stay', roomId: booking.roomId, provider: booking.provider,
    id: booking.id, price: booking.price, currency: booking.currency || 'USD', hotelName: booking.stay?.name
  }})
}
 
const clearPendingBooking = () => {
  try { sessionStorage.removeItem('pendingStayBooking') } catch {}
  pendingBooking.value = null
}
 
onMounted(() => {
  const route = useRoute()
  if (route.query.location) { searchQuery.value.location = String(route.query.location); locQuery.value = String(route.query.location) }
  if (route.query.lat) searchQuery.value.lat = parseFloat(String(route.query.lat))
  if (route.query.lng) searchQuery.value.lng = parseFloat(String(route.query.lng))
  if (route.query.checkIn) searchQuery.value.checkIn = String(route.query.checkIn)
  if (route.query.checkOut) searchQuery.value.checkOut = String(route.query.checkOut)
  if (route.query.adults) searchQuery.value.adults = parseInt(String(route.query.adults)) || 2
  if (route.query.children) searchQuery.value.children = parseInt(String(route.query.children)) || 0
  if (route.query.rooms) searchQuery.value.rooms = parseInt(String(route.query.rooms)) || 1
 
  if (!searchQuery.value.location) {
    searchQuery.value.location = 'Dubai'
    locQuery.value = 'Dubai'
    Object.assign(searchQuery.value, { lat: 25.2048, lng: 55.2708 })
  }
  handleSearch()
 
  try {
    const saved = sessionStorage.getItem('pendingStayBooking')
    if (saved) pendingBooking.value = JSON.parse(saved)
  } catch {}
})
</script>
 
<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');
 
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
 
.sp-root {
  min-height: 100vh;
  background: #fff;
  font-family: 'Sora', system-ui, sans-serif;
  color: #111;
}
 
.sp-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}
 
/* ── Hero ──────────────────────────────────────────────────────────── */
.sp-hero {
  background: #f8f9f7;
  border-bottom: 1px solid #e8e8e2;
  padding: 40px 0 56px;
  position: relative;
  overflow: visible;
}
 
.sp-hero-bg { position: absolute; inset: 0; pointer-events: none; overflow: hidden; }
.sp-orb { position: absolute; border-radius: 50%; filter: blur(70px); opacity: 0.26; }
.sp-orb--a { width: 380px; height: 380px; background: radial-gradient(circle, #b8e8d0, transparent); top: -160px; right: -40px; }
.sp-orb--b { width: 280px; height: 280px; background: radial-gradient(circle, #d4e6ff, transparent); bottom: -100px; left: 6%; }
.sp-orb--c { width: 200px; height: 200px; background: radial-gradient(circle, #ffe8c8, transparent); top: 20px; left: 35%; }
 
/* Headline */
.sp-headline { margin-bottom: 28px; }
.sp-eyebrow { font-size: 10px; font-weight: 500; letter-spacing: 0.18em; text-transform: uppercase; color: #999; display: block; margin-bottom: 10px; }
.sp-h1 { font-family: 'Sora', sans-serif; font-size: clamp(26px, 4vw, 44px); font-weight: 700; line-height: 1.12; color: #111; letter-spacing: -0.03em; }
.sp-h1 em { font-style: normal; color: #1d7a4f; }
 
/* ── Search bar ────────────────────────────────────────────────────── */
.sp-bar {
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
.sp-fld {
  position: relative;
  flex: 1;
  min-width: 0;
}
.sp-fld--loc { flex: 1.6; }
.sp-fld--date { flex: 1.1; }
.sp-fld--guests { flex: 0 0 auto; }
 
.sp-fld-inner {
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
.sp-fld-inner:hover { background: #f5f5f0; }
.sp-fld--active .sp-fld-inner { background: #f0f7f3; }
 
.sp-fld-ico { color: #aaa; flex-shrink: 0; }
 
.sp-fld-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  overflow: hidden;
}
 
.sp-fld-lbl { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; white-space: nowrap; }
.sp-fld-val { font-size: 13px; font-weight: 500; color: #bbb; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.sp-fld-val--set { color: #111; }
 
.sp-bar-sep { width: 1px; background: #ebebe5; flex-shrink: 0; margin: 10px 0; }
 
/* Search button */
.sp-search-btn {
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
.sp-search-btn:hover { background: #1d7a4f; }
.sp-search-btn--busy { opacity: 0.75; cursor: wait; }
.sp-search-inner { display: flex; align-items: center; justify-content: center; gap: 7px; white-space: nowrap; }
.sp-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
 
/* Stay type pills */
.sp-type-pills {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 18px;
}
.sp-type-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: #fff;
  border: 1.5px solid #e0e0d8;
  border-radius: 40px;
  font-family: 'Sora', sans-serif;
  font-size: 12px;
  font-weight: 500;
  color: #555;
  cursor: pointer;
  transition: all 0.16s;
}
.sp-type-pill:hover { border-color: #1d7a4f; color: #1d7a4f; }
.sp-type-pill--on { background: #1d7a4f; border-color: #1d7a4f; color: #fff; }
 
/* ── Dropdowns ────────────────────────────────────────────────────── */
.sp-drop {
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
.sp-drop--loc {
  width: max(320px, 100%);
  min-width: 320px;
  max-width: 400px;
}
 
.sp-drop-search {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 14px;
  border-bottom: 1px solid #f0f0ea;
  background: #fafaf8;
  color: #aaa;
}
.sp-drop-input {
  flex: 1;
  border: none;
  background: transparent;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  color: #111;
  outline: none;
  min-width: 0;
}
.sp-drop-input::placeholder { color: #ccc; }
.sp-drop-clear { background: none; border: none; color: #bbb; cursor: pointer; padding: 2px; display: flex; align-items: center; transition: color 0.15s; }
.sp-drop-clear:hover { color: #111; }
 
.sp-drop-section { padding: 14px; }
.sp-drop-sec-label { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }
 
.sp-drop-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6px;
}
 
.sp-pop-item {
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
.sp-pop-item:hover { background: #edf5f1; }
.sp-pop-icon { font-size: 16px; flex-shrink: 0; }
.sp-pop-name { font-size: 12px; font-weight: 600; color: #111; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sp-pop-sub { font-size: 10px; color: #999; }
 
.sp-drop-results { padding: 8px; }
.sp-loc-result {
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
.sp-loc-result:hover { background: #f5f5f0; }
.sp-loc-name { font-size: 13px; font-weight: 500; color: #111; flex: 1; text-align: left; }
.sp-loc-country { font-size: 10px; font-weight: 600; color: #1d7a4f; background: #edf5f1; padding: 2px 6px; border-radius: 5px; }
.sp-drop-empty { padding: 16px; text-align: center; font-size: 12px; color: #bbb; }
 
/* Calendar */
.sp-drop--cal { width: 300px; padding: 16px; }
.sp-cal-nav-row { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sp-cal-title { font-size: 13px; font-weight: 600; color: #111; }
.sp-cal-arrow { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e8e8e0; background: #fff; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
.sp-cal-arrow:hover { background: #111; color: #fff; border-color: #111; }
.sp-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.sp-cal-dow { font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #bbb; text-align: center; padding: 4px 0 8px; }
.sp-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #333; border-radius: 7px; cursor: pointer; transition: all 0.1s; }
.sp-cal-cell:not(.sp-cal-cell--blank):not(.sp-cal-cell--past):hover { background: #edf5f1; color: #1d7a4f; }
.sp-cal-cell--blank { pointer-events: none; }
.sp-cal-cell--past { color: #ddd; cursor: not-allowed; }
.sp-cal-cell--today { font-weight: 700; color: #1d7a4f; }
.sp-cal-cell--sel { background: #1d7a4f !important; color: #fff !important; font-weight: 700; }
.sp-cal-cell--inrange { background: #edf5f1; color: #1d7a4f; }
.sp-cal-footer { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0ea; text-align: center; font-size: 11px; color: #888; font-weight: 500; }
 
/* Guests dropdown */
.sp-drop--guests { width: 260px; right: 0; left: auto; padding: 16px; }
.sp-guests-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.sp-guests-sep { height: 1px; background: #f0f0ea; margin: 6px 0; }
.sp-guests-info { display: flex; flex-direction: column; gap: 2px; }
.sp-guests-type { font-size: 13px; font-weight: 600; color: #111; }
.sp-guests-sub { font-size: 11px; color: #aaa; }
.sp-guests-ctrl { display: flex; align-items: center; gap: 12px; }
.sp-guests-btn { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid #e0e0d8; background: #fff; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
.sp-guests-btn:hover:not(:disabled) { border-color: #111; color: #111; }
.sp-guests-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.sp-guests-num { font-size: 16px; font-weight: 700; color: #111; min-width: 20px; text-align: center; }
.sp-guests-done { width: 100%; padding: 10px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.15s; margin-top: 12px; }
.sp-guests-done:hover { background: #1d7a4f; }
 
/* ── Main ─────────────────────────────────────────────────────────── */
.sp-main { padding-top: 32px; padding-bottom: 60px; }
 
/* Summary strip */
.sp-summary {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 16px;
  background: #f5fbf7;
  border: 1px solid #cce8d8;
  border-radius: 10px;
  margin-bottom: 24px;
}
.sp-summary-left { display: flex; align-items: center; gap: 7px; font-size: 12px; color: #555; }
.sp-summary-count { font-size: 15px; font-weight: 700; color: #111; }
.sp-summary-right { display: flex; align-items: center; gap: 5px; font-size: 11px; color: #888; font-weight: 500; }
 
/* Body grid */
.sp-body { display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start; }
 
/* Sidebar */
.sp-sidebar { position: sticky; top: 20px; }
.sp-sbar {
  background: #fff;
  border: 1px solid #eaeae3;
  border-radius: 14px;
  padding: 18px;
  max-height: calc(100vh - 100px);
  overflow-y: auto;
}
.sp-sbar-hd { display: flex; align-items: center; gap: 7px; font-size: 10px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: #111; padding-bottom: 14px; border-bottom: 1px solid #f0f0ea; margin-bottom: 18px; }
.sp-reset { margin-left: auto; font-size: 9px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: #bbb; background: none; border: none; cursor: pointer; transition: color 0.15s; }
.sp-reset:hover { color: #1d7a4f; }
 
.sp-sb-block { margin-bottom: 20px; }
.sp-sb-label { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; display: block; margin-bottom: 10px; }
.sp-sb-label strong { color: #111; text-transform: none; letter-spacing: 0; font-size: 12px; }
.sp-per-night { font-size: 9px; color: #bbb; font-weight: 400; }
 
.sp-chips { display: flex; flex-direction: column; gap: 5px; }
.sp-chip { padding: 8px 12px; background: #fafaf7; border: 1.5px solid transparent; border-radius: 8px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 500; color: #555; cursor: pointer; text-align: left; transition: all 0.14s; }
.sp-chip:hover { border-color: #cce8d8; color: #1d7a4f; }
.sp-chip--on { background: #edf5f1; border-color: #1d7a4f; color: #1d7a4f; font-weight: 600; }
.sp-chip--icon { display: flex; align-items: center; gap: 7px; }
 
.sp-stars-row { display: flex; gap: 5px; flex-wrap: wrap; }
.sp-star-btn { padding: 6px 10px; background: #fafaf7; border: 1.5px solid transparent; border-radius: 7px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #888; cursor: pointer; transition: all 0.14s; }
.sp-star-btn:hover { border-color: #f5c518; color: #c09000; background: #fffaed; }
.sp-star-btn--on { background: #fffaed; border-color: #f5c518; color: #c09000; }
 
.sp-chk-row { display: flex; align-items: center; gap: 9px; padding: 6px 0; cursor: pointer; }
.sp-chk { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #d8d8d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; transition: all 0.14s; cursor: pointer; }
.sp-chk--on { background: #1d7a4f; border-color: #1d7a4f; }
.sp-chk-label { font-size: 12px; color: #333; }
 
.sp-range-wrap { display: flex; flex-direction: column; gap: 7px; }
.sp-range { width: 100%; -webkit-appearance: none; height: 3px; background: #e8e8e0; border-radius: 2px; outline: none; cursor: pointer; accent-color: #1d7a4f; }
.sp-range::-webkit-slider-thumb { -webkit-appearance: none; width: 16px; height: 16px; background: #fff; border: 2px solid #1d7a4f; border-radius: 50%; cursor: pointer; box-shadow: 0 1px 6px rgba(29,122,79,0.2); }
.sp-range-ends { display: flex; justify-content: space-between; font-size: 10px; color: #bbb; }
 
/* Toolbar */
.sp-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
.sp-rcount { display: flex; align-items: center; gap: 6px; font-size: 12px; font-weight: 500; color: #aaa; }
.sp-toolbar-r { display: flex; align-items: center; gap: 8px; }
 
.sp-sort-wrap { position: relative; }
.sp-sort-btn { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #fff; border: 1px solid #e0e0d8; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 500; color: #333; cursor: pointer; white-space: nowrap; transition: border-color 0.14s; }
.sp-sort-btn:hover { border-color: #aaa; }
.sp-chev { transition: transform 0.18s; color: #aaa; }
.sp-chev--up { transform: rotate(180deg); }
.sp-sort-panel { position: absolute; right: 0; top: calc(100% + 5px); background: #fff; border: 1px solid #e0e0d8; border-radius: 12px; padding: 5px; min-width: 200px; z-index: 100; box-shadow: 0 8px 28px rgba(0,0,0,0.08); }
.sp-sort-opt { display: flex; align-items: center; gap: 9px; width: 100%; padding: 9px 11px; border: none; border-radius: 7px; background: none; font-family: 'Sora', sans-serif; font-size: 12px; color: #333; cursor: pointer; text-align: left; transition: background 0.12s; }
.sp-sort-opt:hover { background: #f5f5f0; }
.sp-sort-opt--on { font-weight: 600; color: #1d7a4f; }
.sp-sort-dot { width: 5px; height: 5px; border-radius: 50%; background: #d8d8d0; flex-shrink: 0; }
.sp-sort-dot--on { background: #1d7a4f; }
 
/* View toggle */
.sp-view-toggle { display: flex; background: #f5f5f0; border-radius: 8px; padding: 3px; gap: 2px; }
.sp-view-btn { width: 30px; height: 30px; border-radius: 6px; border: none; background: none; color: #888; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
.sp-view-btn--on { background: #fff; color: #111; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
 
.sp-filter-mob { display: none; align-items: center; gap: 6px; padding: 7px 12px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 11px; font-weight: 600; color: #fff; cursor: pointer; position: relative; }
.sp-badge { position: absolute; top: -5px; right: -5px; width: 16px; height: 16px; background: #1d7a4f; border-radius: 50%; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; }
 
/* Loading skeletons */
.sp-loading { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
.sp-loading--compact { grid-template-columns: 1fr; }
.sp-skel-card { background: #fff; border: 1px solid #eaeae3; border-radius: 14px; overflow: hidden; animation: pulse 1.5s ease-in-out infinite; }
.sp-skel-card--compact { display: flex; flex-direction: row; height: 120px; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }
.sp-sk { background: #f0f0ea; border-radius: 5px; }
.sp-sk--img { height: 160px; border-radius: 0; }
.sp-skel-card--compact .sp-sk--img { width: 160px; height: 100%; flex-shrink: 0; }
.sp-sk-body { padding: 14px; display: flex; flex-direction: column; gap: 9px; flex: 1; }
.sp-sk--tag { height: 10px; width: 50px; }
.sp-sk--title { height: 14px; width: 75%; }
.sp-sk--sub { height: 11px; width: 45%; }
.sp-sk-row { display: flex; justify-content: space-between; align-items: center; margin-top: auto; }
.sp-sk--badge { height: 22px; width: 55px; border-radius: 20px; }
.sp-sk--price { height: 18px; width: 60px; }
 
/* Empty */
.sp-empty { display: flex; flex-direction: column; align-items: center; padding: 72px 24px; gap: 10px; text-align: center; background: #fff; border: 1px solid #eaeae3; border-radius: 14px; }
.sp-empty-ico { width: 56px; height: 56px; border-radius: 14px; background: #f5fbf7; display: flex; align-items: center; justify-content: center; color: #1d7a4f; margin-bottom: 4px; }
.sp-empty-h { font-size: 20px; font-weight: 700; color: #111; }
.sp-empty-p { font-size: 13px; color: #aaa; max-width: 300px; line-height: 1.6; }
.sp-empty-btn { margin-top: 6px; padding: 10px 22px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.sp-empty-btn:hover { background: #1d7a4f; }
 
/* ── Stay cards ────────────────────────────────────────────────────── */
.sp-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}
.sp-cards--compact { grid-template-columns: 1fr; }
 
.sp-card {
  background: #fff;
  border: 1.5px solid #eaeae3;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}
.sp-card:hover { border-color: #1d7a4f; box-shadow: 0 8px 28px rgba(29,122,79,0.09); transform: translateY(-2px); }
 
.sp-card--compact {
  display: flex;
  flex-direction: row;
}
 
/* Card image */
.sp-card-img-wrap { position: relative; overflow: hidden; }
.sp-card--compact .sp-card-img-wrap { width: 180px; flex-shrink: 0; }
.sp-card-img { width: 100%; height: 180px; object-fit: cover; display: block; transition: transform 0.3s ease; }
.sp-card--compact .sp-card-img { height: 100%; }
.sp-card:hover .sp-card-img { transform: scale(1.04); }
 
.sp-card-badges { position: absolute; top: 10px; left: 10px; display: flex; gap: 5px; z-index: 2; }
.sp-badge-pill { font-size: 9px; font-weight: 700; padding: 3px 8px; border-radius: 20px; letter-spacing: 0.05em; text-transform: uppercase; }
.sp-badge-pill--feat { background: #111; color: #fff; }
.sp-badge-pill--disc { background: #1d7a4f; color: #fff; }
 
.sp-card-fav {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(4px);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
  z-index: 2;
  transition: all 0.16s;
}
.sp-card-fav:hover { color: #e74c3c; background: #fff; }
.sp-card-fav--on { color: #e74c3c; background: #fff; }
 
/* Card body */
.sp-card-body { padding: 14px; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.sp-card-top { display: flex; align-items: center; justify-content: space-between; }
.sp-card-type { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #999; }
.sp-card-stars { display: flex; align-items: center; gap: 3px; font-size: 11px; font-weight: 700; color: #c09000; }
.sp-card-reviews { font-weight: 400; color: #bbb; font-size: 10px; }
 
.sp-card-name { font-size: 14px; font-weight: 700; color: #111; line-height: 1.3; letter-spacing: -0.01em; }
.sp-card-loc { display: flex; align-items: center; gap: 4px; font-size: 11px; color: #999; }
 
.sp-card-amenities { display: flex; gap: 5px; flex-wrap: wrap; margin-top: 2px; }
.sp-card-amen { font-size: 10px; color: #666; background: #f5f5f0; padding: 3px 8px; border-radius: 5px; font-weight: 500; }
 
.sp-card-foot { display: flex; align-items: flex-end; justify-content: space-between; margin-top: auto; padding-top: 10px; border-top: 1px solid #f5f5f0; }
.sp-card-price-wrap { display: flex; align-items: baseline; gap: 3px; }
.sp-card-price { font-size: 20px; font-weight: 700; color: #111; letter-spacing: -0.03em; }
.sp-card-per { font-size: 10px; color: #bbb; font-weight: 500; }
.sp-card-cta { font-size: 11px; font-weight: 700; color: #1d7a4f; background: #edf5f1; border: none; border-radius: 7px; padding: 7px 12px; cursor: pointer; transition: all 0.14s; white-space: nowrap; }
.sp-card-cta:hover { background: #1d7a4f; color: #fff; }
 
/* Pending cart pill */
.sp-cart-pill {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: #111;
  border-radius: 40px;
  padding: 10px 14px 10px 18px;
  display: flex;
  align-items: center;
  gap: 14px;
  z-index: 300;
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
  white-space: nowrap;
}
.sp-cart-info { display: flex; flex-direction: column; gap: 1px; }
.sp-cart-label { font-size: 9px; font-weight: 600; letter-spacing: 0.14em; text-transform: uppercase; color: #888; }
.sp-cart-name { font-size: 12px; font-weight: 600; color: #fff; max-width: 180px; overflow: hidden; text-overflow: ellipsis; }
.sp-cart-price { font-size: 16px; font-weight: 700; color: #fff; }
.sp-cart-checkout { background: #1d7a4f; border: none; border-radius: 20px; padding: 8px 16px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 700; color: #fff; cursor: pointer; transition: background 0.15s; }
.sp-cart-checkout:hover { background: #186440; }
.sp-cart-close { background: rgba(255,255,255,0.1); border: none; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; transition: background 0.14s; flex-shrink: 0; }
.sp-cart-close:hover { background: rgba(255,255,255,0.2); }
 
/* Overlay */
.sp-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.38); z-index: 150; backdrop-filter: blur(2px); }
 
/* ── Transitions ───────────────────────────────────────────────────── */
.fd-enter-active, .fd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.fd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }
 
.sp-fade-enter-active, .sp-fade-leave-active { transition: opacity 0.28s ease; }
.sp-fade-enter-from, .sp-fade-leave-to { opacity: 0; }
 
.sp-ov-enter-active, .sp-ov-leave-active { transition: opacity 0.22s ease; }
.sp-ov-enter-from, .sp-ov-leave-to { opacity: 0; }
 
.sp-cart-enter-active, .sp-cart-leave-active { transition: opacity 0.24s ease, transform 0.24s ease; }
.sp-cart-enter-from { opacity: 0; transform: translateX(-50%) translateY(20px); }
.sp-cart-leave-to { opacity: 0; transform: translateX(-50%) translateY(20px); }
 
/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .sp-body { grid-template-columns: 1fr; }
  .sp-sidebar { position: static; }
  .sp-sbar { display: none; }
  .sp-sidebar--open .sp-sbar {
    display: block;
    position: fixed;
    bottom: 0; left: 0; right: 0;
    border-radius: 18px 18px 0 0;
    z-index: 200;
    max-height: 85vh;
    overflow-y: auto;
  }
  .sp-filter-mob { display: flex; }
}
 
@media (max-width: 860px) {
  .sp-bar {
    flex-wrap: wrap;
    border-radius: 14px;
    padding: 6px;
    gap: 0;
  }
  .sp-fld--loc { flex: 1 0 100%; }
  .sp-bar-sep { height: 1px; width: 100%; margin: 0; }
  .sp-fld--date { flex: 1 0 45%; }
  .sp-fld--guests { flex: 1 0 50%; }
  .sp-search-btn { flex: 1 0 100%; margin: 4px 0 0; border-radius: 10px; min-height: 46px; }
  .sp-cards { grid-template-columns: 1fr; }
}
 
@media (max-width: 580px) {
  .sp-wrap { padding: 0 14px; }
  .sp-hero { padding: 28px 0 44px; }
  .sp-fld--date { flex: 1 0 100%; }
  .sp-fld--guests { flex: 1 0 100%; }
  .sp-bar-sep { display: none; }
  .sp-drop--loc { max-width: calc(100vw - 28px); left: 0; }
  .sp-drop--cal { width: calc(100vw - 28px); left: 0; }
  .sp-drop--guests { left: 0; right: auto; width: calc(100vw - 28px); }
  .sp-type-pills { gap: 6px; }
  .sp-loading { grid-template-columns: 1fr; }
}
</style>