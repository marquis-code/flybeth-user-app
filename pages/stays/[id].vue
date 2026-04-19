<template>
  <div class="sd-root" @mousedown="handleGlobalMousedown">

    <!-- ── Top nav bar ─────────────────────────────────────────────── -->
    <nav class="sd-nav">
      <div class="sd-wrap sd-nav-inner">
        <button class="sd-back" @click="router.back()">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
          Back
        </button>
        <div class="sd-breadcrumb">
          <NuxtLink to="/" class="sd-bc-link">Home</NuxtLink>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          <NuxtLink to="/stays" class="sd-bc-link">{{ stayDetails?.location?.city || 'Stays' }}</NuxtLink>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
          <span class="sd-bc-current">{{ stayDetails?.name || 'Loading…' }}</span>
        </div>
        <div class="sd-nav-actions">
          <button class="sd-nav-action" @click="toggleFav">
            <svg width="14" height="14" viewBox="0 0 24 24" :fill="isFav ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
            Save
          </button>
          <button class="sd-nav-action">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Share
          </button>
        </div>
      </div>
    </nav>

    <!-- ── Gallery ─────────────────────────────────────────────────── -->
    <div class="sd-wrap">
      <div v-if="loading" class="sd-gallery-skel">
        <div class="sd-sk sd-sk--main"></div>
        <div class="sd-sk-grid">
          <div class="sd-sk" v-for="n in 4" :key="n"></div>
        </div>
      </div>

      <div v-else-if="stayPhotos.length" class="sd-gallery">
        <div class="sd-gallery-main" @click="openGallery(0)">
          <img :src="stayPhotos[0]" :alt="stayDetails?.name" class="sd-gallery-img" />
          <div class="sd-gallery-overlay">
            <span class="sd-gallery-count">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              View all {{ stayPhotos.length }} photos
            </span>
          </div>
        </div>
        <div class="sd-gallery-grid">
          <div v-for="(ph, i) in stayPhotos.slice(1, 5)" :key="i" class="sd-gallery-thumb" @click="openGallery(i+1)">
            <img :src="ph" :alt="`Photo ${i+2}`" class="sd-gallery-img" />
            <div v-if="i === 3 && stayPhotos.length > 5" class="sd-gallery-more">
              +{{ stayPhotos.length - 5 }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ── Lightbox ────────────────────────────────────────────────── -->
    <Transition name="sd-lb">
      <div v-if="lightboxOpen" class="sd-lightbox" @click.self="lightboxOpen = false">
        <button class="sd-lb-close" @click="lightboxOpen = false">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
        <button class="sd-lb-arrow sd-lb-arrow--prev" @click="lightboxIdx = Math.max(0, lightboxIdx-1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
        <img :src="stayPhotos[lightboxIdx]" class="sd-lb-img" />
        <button class="sd-lb-arrow sd-lb-arrow--next" @click="lightboxIdx = Math.min(stayPhotos.length-1, lightboxIdx+1)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
        </button>
        <div class="sd-lb-counter">{{ lightboxIdx + 1 }} / {{ stayPhotos.length }}</div>
      </div>
    </Transition>

    <!-- ── Header: name, location, rating ─────────────────────────── -->
    <div class="sd-wrap sd-header">
      <div class="sd-header-left">
        <div class="sd-property-type">{{ stayDetails?.type || stayDetails?.propertyType || 'Hotel' }}</div>
        <h1 class="sd-h1">{{ stayDetails?.name || 'Stay Details' }}</h1>
        <div class="sd-location">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {{ stayDetails?.location?.address }}{{ stayDetails?.location?.city ? `, ${stayDetails.location.city}` : '' }}
          <button class="sd-map-link" @click="showFullMap = true">· Show on map</button>
        </div>
      </div>
      <div v-if="stayDetails?.rating" class="sd-rating-badge">
        <span class="sd-rating-score">{{ stayDetails.rating.toFixed(1) }}</span>
        <span class="sd-rating-label">{{ ratingLabel(stayDetails.rating) }}</span>
        <span v-if="stayDetails.reviewCount" class="sd-rating-count">{{ stayDetails.reviewCount }} reviews</span>
      </div>
    </div>

    <!-- ── Tabs ────────────────────────────────────────────────────── -->
    <div class="sd-wrap">
      <div class="sd-tabs">
        <button v-for="t in tabs" :key="t" class="sd-tab" :class="{ 'sd-tab--on': activeTab === t }" @click="activeTab = t; scrollToSection(t)">
          {{ t }}
        </button>
      </div>
    </div>

    <!-- ── Body ────────────────────────────────────────────────────── -->
    <div class="sd-wrap sd-body">

      <!-- ══ Left column ══ -->
      <div class="sd-main">

        <!-- Overview -->
        <section id="sec-overview" class="sd-section">
          <h2 class="sd-sec-h">About this property</h2>
          <p class="sd-desc" :class="{ 'sd-desc--clamped': !descExpanded }">
            {{ stayDetails?.description || 'This property offers premium services and comfortable accommodation designed for your convenience. Perfect for both business and leisure travellers.' }}
          </p>
          <button v-if="stayDetails?.description?.length > 300" class="sd-read-more" @click="descExpanded = !descExpanded">
            {{ descExpanded ? 'Show less ↑' : 'Read more ↓' }}
          </button>

          <!-- Quick highlights -->
          <div v-if="highlights.length" class="sd-highlights">
            <div v-for="h in highlights" :key="h.label" class="sd-highlight">
              <span class="sd-hl-icon">{{ h.icon }}</span>
              <div>
                <div class="sd-hl-label">{{ h.label }}</div>
                <div class="sd-hl-sub">{{ h.sub }}</div>
              </div>
            </div>
          </div>
        </section>

        <!-- Amenities -->
        <section v-if="stayAmenities.length" id="sec-amenities" class="sd-section">
          <h2 class="sd-sec-h">Hotel amenities</h2>
          <div class="sd-amenities">
            <div v-for="a in stayAmenities" :key="a.label" class="sd-amenity">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
              {{ a.label }}
            </div>
          </div>
        </section>

        <!-- Availability bar -->
        <section id="sec-rooms" class="sd-section">
          <div class="sd-avail-bar">
            <div class="sd-avail-title">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
              <div>
                <div class="sd-avail-h">Check availability</div>
                <div class="sd-avail-sub">Adjust dates and guests to see live prices</div>
              </div>
            </div>

            <div class="sd-avail-fields">

              <!-- Check-in field -->
              <div class="sd-av-fld" :class="{ 'sd-av-fld--active': avField === 'cin' }" ref="avCinRef">
                <div class="sd-av-fld-inner" @click="openAvField('cin')">
                  <div class="sd-av-lbl">Check-in</div>
                  <div class="sd-av-val" :class="{ 'sd-av-val--set': searchQuery.checkIn }">
                    {{ searchQuery.checkIn ? formatDate(searchQuery.checkIn) : 'Select date' }}
                  </div>
                </div>
                <Transition name="fd">
                  <div v-if="avField === 'cin'" class="sd-av-drop sd-av-drop--cal" @mousedown.stop>
                    <div class="sd-cal-nav">
                      <button class="sd-cal-arr" @click="prevMonth('cin')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <span class="sd-cal-title">{{ calMonthLabel(cinViewDate) }}</span>
                      <button class="sd-cal-arr" @click="nextMonth('cin')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                    <div class="sd-cal-grid">
                      <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="sd-cal-dow">{{ d }}</div>
                      <div v-for="c in calCells(cinViewDate, searchQuery.checkIn)" :key="c.key"
                        class="sd-cal-cell"
                        :class="{ 'sd-cal-cell--blank': !c.date, 'sd-cal-cell--past': c.past, 'sd-cal-cell--sel': c.selected, 'sd-cal-cell--today': c.today, 'sd-cal-cell--range': isInRange(c.date) }"
                        @click="c.date && !c.past && pickCheckIn(c.date)"
                      >{{ c.day }}</div>
                    </div>
                  </div>
                </Transition>
              </div>

              <div class="sd-av-sep"></div>

              <!-- Check-out field -->
              <div class="sd-av-fld" :class="{ 'sd-av-fld--active': avField === 'cout' }" ref="avCoutRef">
                <div class="sd-av-fld-inner" @click="openAvField('cout')">
                  <div class="sd-av-lbl">Check-out</div>
                  <div class="sd-av-val" :class="{ 'sd-av-val--set': searchQuery.checkOut }">
                    {{ searchQuery.checkOut ? formatDate(searchQuery.checkOut) : 'Select date' }}
                  </div>
                </div>
                <Transition name="fd">
                  <div v-if="avField === 'cout'" class="sd-av-drop sd-av-drop--cal" @mousedown.stop>
                    <div class="sd-cal-nav">
                      <button class="sd-cal-arr" @click="prevMonth('cout')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
                      </button>
                      <span class="sd-cal-title">{{ calMonthLabel(coutViewDate) }}</span>
                      <button class="sd-cal-arr" @click="nextMonth('cout')">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M9 18l6-6-6-6"/></svg>
                      </button>
                    </div>
                    <div class="sd-cal-grid">
                      <div v-for="d in ['Su','Mo','Tu','We','Th','Fr','Sa']" :key="d" class="sd-cal-dow">{{ d }}</div>
                      <div v-for="c in calCells(coutViewDate, searchQuery.checkOut)" :key="c.key"
                        class="sd-cal-cell"
                        :class="{
                          'sd-cal-cell--blank': !c.date,
                          'sd-cal-cell--past': c.past || (searchQuery.checkIn && c.date && c.date <= searchQuery.checkIn),
                          'sd-cal-cell--sel': c.selected,
                          'sd-cal-cell--today': c.today,
                          'sd-cal-cell--range': isInRange(c.date)
                        }"
                        @click="c.date && !c.past && !(searchQuery.checkIn && c.date <= searchQuery.checkIn) && pickCheckOut(c.date)"
                      >{{ c.day }}</div>
                    </div>
                    <div v-if="nightCount > 0" class="sd-cal-footer">
                      {{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }}
                    </div>
                  </div>
                </Transition>
              </div>

              <div class="sd-av-sep"></div>

              <!-- Guests field -->
              <div class="sd-av-fld" :class="{ 'sd-av-fld--active': avField === 'guests' }" ref="avGuestsRef">
                <div class="sd-av-fld-inner" @click="openAvField('guests')">
                  <div class="sd-av-lbl">Guests</div>
                  <div class="sd-av-val sd-av-val--set">{{ guestSummary }}</div>
                </div>
                <Transition name="fd">
                  <div v-if="avField === 'guests'" class="sd-av-drop sd-av-drop--guests" @mousedown.stop>
                    <div class="sd-guests-row" v-for="g in guestDefs" :key="g.key">
                      <div class="sd-guests-info">
                        <span class="sd-guests-type">{{ g.label }}</span>
                        <span class="sd-guests-sub">{{ g.sub }}</span>
                      </div>
                      <div class="sd-guests-ctrl">
                        <button class="sd-guests-btn" @click="adjustGuest(g.key, -1)" :disabled="(searchQuery as any)[g.key] <= g.min">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                        </button>
                        <span class="sd-guests-num">{{ (searchQuery as any)[g.key] }}</span>
                        <button class="sd-guests-btn" @click="adjustGuest(g.key, 1)" :disabled="(searchQuery as any)[g.key] >= 9">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>
                    </div>
                    <div class="sd-guests-sep"></div>
                    <div class="sd-guests-row">
                      <div class="sd-guests-info">
                        <span class="sd-guests-type">Rooms</span>
                        <span class="sd-guests-sub">Separate rooms</span>
                      </div>
                      <div class="sd-guests-ctrl">
                        <button class="sd-guests-btn" @click="adjustGuest('rooms', -1)" :disabled="searchQuery.rooms <= 1">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 12h14"/></svg>
                        </button>
                        <span class="sd-guests-num">{{ searchQuery.rooms }}</span>
                        <button class="sd-guests-btn" @click="adjustGuest('rooms', 1)" :disabled="searchQuery.rooms >= 9">
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M12 5v14M5 12h14"/></svg>
                        </button>
                      </div>
                    </div>
                    <button class="sd-guests-done" @click="avField = null">Done</button>
                  </div>
                </Transition>
              </div>

              <!-- Update btn -->
              <button class="sd-avail-btn" :class="{ 'sd-avail-btn--busy': updatingSearch }" @click="handleUpdateSearch">
                <span class="sd-avail-btn-inner">
                  <span v-if="updatingSearch" class="sd-spin"></span>
                  <svg v-else width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
                  <span>{{ updatingSearch ? 'Updating…' : 'Update' }}</span>
                </span>
              </button>
            </div>
          </div>
        </section>

        <!-- Rooms -->
        <section class="sd-section">
          <div class="sd-rooms-hd">
            <h2 class="sd-sec-h" style="margin-bottom:0">Available rooms</h2>
            <label class="sd-refund-check">
              <span class="sd-chk" :class="{ 'sd-chk--on': showRefundable }" @click="showRefundable = !showRefundable">
                <svg v-if="showRefundable" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4"><polyline points="20 6 9 17 4 12"/></svg>
              </span>
              <span>Show refundable deals only</span>
            </label>
          </div>

          <!-- Loading -->
          <div v-if="updatingSearch" class="sd-rooms-loading">
            <div v-for="n in 3" :key="n" class="sd-room-skel">
              <div class="sd-sk sd-sk--room-img"></div>
              <div class="sd-sk-body">
                <div class="sd-sk sd-sk--room-title"></div>
                <div class="sd-sk sd-sk--room-sub"></div>
                <div class="sd-sk sd-sk--room-price"></div>
              </div>
            </div>
          </div>

          <!-- Rooms list -->
          <div v-else-if="filteredRooms.length" class="sd-rooms">
            <div v-for="room in filteredRooms" :key="room.name"
              class="sd-room"
              :class="{ 'sd-room--sel': selectedRoom === room }"
              @click="selectedRoom = room">

              <!-- Room image if available -->
              <div v-if="room.photos?.length || room.photo" class="sd-room-img-wrap">
                <img :src="room.photos?.[0] || room.photo" :alt="room.name" class="sd-room-img" />
              </div>

              <div class="sd-room-body">
                <div class="sd-room-top">
                  <div>
                    <h3 class="sd-room-name">{{ room.name }}</h3>
                    <div class="sd-room-amenities">
                      <span v-for="(am, ai) in (room.amenities || []).slice(0, 4)" :key="ai" class="sd-room-amen">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
                        {{ typeof am === 'string' ? am : am.description }}
                      </span>
                    </div>
                  </div>
                  <div class="sd-room-price-col">
                    <div class="sd-room-price">${{ Math.round(room.rates?.[0]?.priceWithCommission || 0).toLocaleString() }}</div>
                    <div class="sd-room-per">for {{ diffDays }} night{{ diffDays !== 1 ? 's' : '' }}</div>
                    <div class="sd-room-incl">Taxes & fees included</div>
                  </div>
                </div>

                <div class="sd-room-foot">
                  <div class="sd-room-policies">
                    <span class="sd-policy" :class="room.rates?.[0]?.cancellationPolicy === 'NON_REFUNDABLE' ? 'sd-policy--no' : 'sd-policy--yes'">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <path v-if="room.rates?.[0]?.cancellationPolicy !== 'NON_REFUNDABLE'" d="M20 6 9 17 4 12"/>
                        <path v-else d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                      {{ room.rates?.[0]?.cancellationPolicy === 'NON_REFUNDABLE' ? 'Non-refundable' : 'Free cancellation' }}
                    </span>
                    <span v-if="room.rates?.[0]?.boardBasis" class="sd-policy sd-policy--board">
                      🍽 {{ room.rates[0].boardBasis }}
                    </span>
                  </div>
                  <button
                    class="sd-room-cta"
                    :class="selectedRoom === room ? 'sd-room-cta--sel' : ''"
                    @click.stop="selectedRoom = room">
                    {{ selectedRoom === room ? '✓ Selected' : 'Select room' }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- No rooms -->
          <div v-else class="sd-empty">
            <div class="sd-empty-ico">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            </div>
            <h3 class="sd-empty-h">No rooms available</h3>
            <p class="sd-empty-p">Try adjusting your dates or guest count to find available options.</p>
            <button class="sd-empty-btn" @click="handleUpdateSearch">Retry</button>
          </div>
        </section>

      </div><!-- /sd-main -->

      <!-- ══ Right sidebar ══ -->
      <aside class="sd-aside">

        <!-- Booking summary card -->
        <div class="sd-summary-card">
          <div class="sd-summary-hd">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Booking summary
          </div>

          <!-- No room selected -->
          <div v-if="!selectedRoom" class="sd-summary-empty">
            <div class="sd-summary-empty-ico">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="1" y="3" width="15" height="13" rx="2"/><path d="M16 8h5l2 5v3h-7z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <p class="sd-summary-empty-p">Select a room below to see pricing and proceed to book</p>
          </div>

          <!-- Room selected -->
          <div v-else class="sd-summary-body">
            <div class="sd-sum-room-name">{{ (selectedRoom as any).name }}</div>

            <div class="sd-sum-price-block">
              <div class="sd-sum-price">${{ Math.round((selectedRoom as any).rates?.[0]?.priceWithCommission || 0).toLocaleString() }}</div>
              <div class="sd-sum-per">{{ nightCount }} night{{ nightCount !== 1 ? 's' : '' }} · {{ searchQuery.rooms }} room{{ searchQuery.rooms !== 1 ? 's' : '' }}</div>
            </div>

            <div class="sd-sum-details">
              <div class="sd-sum-row">
                <span class="sd-sum-lbl">Check-in</span>
                <span class="sd-sum-val">{{ formatDateShort(searchQuery.checkIn) }}</span>
              </div>
              <div class="sd-sum-row">
                <span class="sd-sum-lbl">Check-out</span>
                <span class="sd-sum-val">{{ formatDateShort(searchQuery.checkOut) }}</span>
              </div>
              <div class="sd-sum-row">
                <span class="sd-sum-lbl">Guests</span>
                <span class="sd-sum-val">{{ searchQuery.adults }} adult{{ searchQuery.adults !== 1 ? 's' : '' }}{{ searchQuery.children ? `, ${searchQuery.children} child${searchQuery.children !== 1 ? 'ren' : ''}` : '' }}</span>
              </div>
            </div>

            <div class="sd-sum-incl">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
              Includes taxes and charges
            </div>

            <button class="sd-book-btn" :class="{ 'sd-book-btn--busy': bookingInProgress }" @click="handleReserve" :disabled="bookingInProgress">
              <span v-if="bookingInProgress" class="sd-spin sd-spin--dark"></span>
              <span>{{ bookingInProgress ? 'Processing…' : 'Proceed to book' }}</span>
              <svg v-if="!bookingInProgress" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Map card -->
        <div class="sd-map-card" @click="showFullMap = true">
          <div id="mini-map" class="sd-mini-map"></div>
          <div class="sd-map-hover">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"/></svg>
            View on map
          </div>
        </div>

        <!-- Help card -->
        <div class="sd-help-card">
          <div class="sd-help-ico">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.61 6.61l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
          </div>
          <div>
            <div class="sd-help-title">Need help?</div>
            <p class="sd-help-p">Our 24/7 concierge team is ready to help with special requests.</p>
          </div>
        </div>

      </aside>

    </div><!-- /sd-body -->

    <!-- ── Full map modal ──────────────────────────────────────────── -->
    <Transition name="sd-map-modal">
      <div v-if="showFullMap" class="sd-fullmap-overlay" @click.self="showFullMap = false">
        <div class="sd-fullmap-box">
          <button class="sd-fullmap-close" @click="showFullMap = false">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
          <div id="full-map" class="sd-fullmap"></div>
        </div>
      </div>
    </Transition>

    <!-- Bundle modal -->
    <SecuredHotelModal
      v-if="showBundleModal"
      :stay="stayDetails"
      :selectedRoom="selectedRoom"
      :quoteData="quoteData"
      @close="showBundleModal = false"
    />

  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStayDetails } from '@/composables/modules/stays/useStayDetails'
import SecuredHotelModal from '@/components/stays/SecuredHotelModal.vue'

const route = useRoute()
const router = useRouter()
const { loading, rooms, fetchStayRates, selectedRoom, stayDetails, fetchStayDetails, createQuote } = useStayDetails()

const stayId = route.params.id as string
const provider = (route.query.provider as string) || 'duffel'

// ── UI state ──────────────────────────────────────────────────────────
const activeTab = ref('Overview')
const tabs = ['Overview', 'Amenities', 'Rooms']
const descExpanded = ref(false)
const showFullMap = ref(false)
const showBundleModal = ref(false)
const isFav = ref(false)
const showRefundable = ref(false)
const bookingInProgress = ref(false)
const updatingSearch = ref(false)
const quoteData = ref<any>(null)
const lightboxOpen = ref(false)
const lightboxIdx = ref(0)

// ── Calendar / field state ────────────────────────────────────────────
const avField = ref<string | null>(null)
const avCinRef = ref<HTMLElement | null>(null)
const avCoutRef = ref<HTMLElement | null>(null)
const avGuestsRef = ref<HTMLElement | null>(null)
const cinViewDate = ref(new Date())
const coutViewDate = ref(new Date())

// ── Search ────────────────────────────────────────────────────────────
const searchQuery = reactive({
  checkIn: (route.query.checkIn as string) || new Date(Date.now() + 86400000).toISOString().split('T')[0],
  checkOut: (route.query.checkOut as string) || new Date(Date.now() + 2 * 86400000).toISOString().split('T')[0],
  rooms: Number(route.query.rooms) || 1,
  adults: Number(route.query.adults) || 2,
  children: Number(route.query.children) || 0,
})

// ── Computed ──────────────────────────────────────────────────────────
const stayPhotos = computed(() => stayDetails.value?.photos || [])

const stayAmenities = computed(() =>
  (stayDetails.value?.amenities || []).map((a: any) => ({
    label: typeof a === 'string' ? a : (a.description || a.type || a.name),
  }))
)

const diffDays = computed(() => {
  const a = new Date(searchQuery.checkIn), b = new Date(searchQuery.checkOut)
  return Math.max(1, Math.round((b.getTime() - a.getTime()) / 86400000))
})

const nightCount = computed(() => diffDays.value)

const guestSummary = computed(() => {
  const parts = [`${searchQuery.adults} adult${searchQuery.adults !== 1 ? 's' : ''}`]
  if (searchQuery.children) parts.push(`${searchQuery.children} child${searchQuery.children !== 1 ? 'ren' : ''}`)
  if (searchQuery.rooms > 1) parts.push(`${searchQuery.rooms} rooms`)
  return parts.join(', ')
})

const filteredRooms = computed(() =>
  showRefundable.value
    ? rooms.value.filter((r: any) => r.rates?.[0]?.cancellationPolicy !== 'NON_REFUNDABLE')
    : rooms.value
)

const highlights = computed(() => {
  const list: any[] = []
  if (stayDetails.value?.checkInTime) list.push({ icon: '🕐', label: 'Check-in', sub: stayDetails.value.checkInTime })
  if (stayDetails.value?.checkOutTime) list.push({ icon: '🕑', label: 'Check-out', sub: stayDetails.value.checkOutTime })
  if (stayDetails.value?.location?.city) list.push({ icon: '📍', label: 'Location', sub: stayDetails.value.location.city })
  if (stayDetails.value?.starRating) list.push({ icon: '⭐', label: 'Star rating', sub: `${stayDetails.value.starRating} stars` })
  return list
})

// ── Calendar helpers ──────────────────────────────────────────────────
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const calMonthLabel = (d: Date) => `${MONTHS[d.getMonth()]} ${d.getFullYear()}`

const calCells = (viewDate: Date, selected: string) => {
  const y = viewDate.getFullYear(), m = viewDate.getMonth()
  const firstDay = new Date(y, m, 1).getDay()
  const days = new Date(y, m + 1, 0).getDate()
  const today = new Date(); today.setHours(0,0,0,0)
  const cells: any[] = []
  for (let i = 0; i < firstDay; i++) cells.push({ key: `b${i}`, date: null, day: '', past: false, selected: false, today: false })
  for (let d = 1; d <= days; d++) {
    const dt = new Date(y, m, d)
    const iso = dt.toISOString().split('T')[0]
    cells.push({ key: iso, date: iso, day: d, past: dt < today, selected: selected === iso, today: dt.getTime() === today.getTime() })
  }
  return cells
}

const isInRange = (date: string | null) => {
  if (!date || !searchQuery.checkIn || !searchQuery.checkOut) return false
  return date > searchQuery.checkIn && date < searchQuery.checkOut
}

const prevMonth = (f: string) => {
  if (f === 'cin') { const d = new Date(cinViewDate.value); d.setMonth(d.getMonth()-1); cinViewDate.value = d }
  else { const d = new Date(coutViewDate.value); d.setMonth(d.getMonth()-1); coutViewDate.value = d }
}
const nextMonth = (f: string) => {
  if (f === 'cin') { const d = new Date(cinViewDate.value); d.setMonth(d.getMonth()+1); cinViewDate.value = d }
  else { const d = new Date(coutViewDate.value); d.setMonth(d.getMonth()+1); coutViewDate.value = d }
}

const pickCheckIn = (iso: string) => {
  searchQuery.checkIn = iso
  if (!searchQuery.checkOut || iso >= searchQuery.checkOut) {
    const next = new Date(iso); next.setDate(next.getDate() + 1)
    searchQuery.checkOut = next.toISOString().split('T')[0]
    coutViewDate.value = next
  }
  avField.value = null
  nextTick(() => { avField.value = 'cout' })
}

const pickCheckOut = (iso: string) => {
  searchQuery.checkOut = iso
  avField.value = null
  nextTick(() => { avField.value = 'guests' })
}

const formatDate = (iso: string) => {
  const [y,m,d] = iso.split('-').map(Number)
  return `${d} ${MONTHS[m-1].slice(0,3)} ${y}`
}
const formatDateShort = (dateStr: string) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

// ── Field management ──────────────────────────────────────────────────
const openAvField = (f: string) => {
  avField.value = avField.value === f ? null : f
}

const handleGlobalMousedown = (e: MouseEvent) => {
  const refs: Record<string, any> = { cin: avCinRef, cout: avCoutRef, guests: avGuestsRef }
  if (avField.value) {
    const cur = refs[avField.value]?.value
    if (cur && !cur.contains(e.target as Node)) avField.value = null
  }
}

// ── Guest helpers ─────────────────────────────────────────────────────
const guestDefs = [
  { key: 'adults', label: 'Adults', sub: 'Age 18+', min: 1 },
  { key: 'children', label: 'Children', sub: 'Ages 2–17', min: 0 },
]
const adjustGuest = (key: string, delta: number) => {
  const min = key === 'adults' ? 1 : 0
  ;(searchQuery as any)[key] = Math.max(min, Math.min(9, (searchQuery as any)[key] + delta))
}

// ── Misc ──────────────────────────────────────────────────────────────
const ratingLabel = (r: number) => r >= 9 ? 'Exceptional' : r >= 8 ? 'Excellent' : r >= 7 ? 'Very good' : 'Good'
const toggleFav = () => { isFav.value = !isFav.value }

const openGallery = (idx: number) => {
  lightboxIdx.value = idx
  lightboxOpen.value = true
}

const scrollToSection = (tab: string) => {
  const map: Record<string, string> = { 'Overview': 'sec-overview', 'Amenities': 'sec-amenities', 'Rooms': 'sec-rooms' }
  const el = document.getElementById(map[tab])
  if (el) window.scrollTo({ top: el.offsetTop - 90, behavior: 'smooth' })
}

// ── Actions ───────────────────────────────────────────────────────────
const handleUpdateSearch = async () => {
  updatingSearch.value = true
  selectedRoom.value = null
  try {
    await fetchStayRates(stayId, provider, searchQuery)
    if (rooms.value.length) selectedRoom.value = rooms.value[0]
  } catch (err) {
    console.error('Failed to fetch rates:', err)
  } finally {
    updatingSearch.value = false
  }
}

const handleReserve = async () => {
  if (!selectedRoom.value) return
  bookingInProgress.value = true
  try {
    const rateId = (selectedRoom.value as any).rates?.[0]?.rateId || (selectedRoom.value as any).id
    if (rateId) {
      try { quoteData.value = await createQuote(rateId, provider) } catch {}
    }
    showBundleModal.value = true
  } catch (err) {
    console.error('Reservation error:', err)
  } finally {
    bookingInProgress.value = false
  }
}

// ── Map ───────────────────────────────────────────────────────────────
let miniMapInstance: any = null
let fullMapInstance: any = null

const initMiniMap = () => {
  if (typeof window === 'undefined') return
  const lat = stayDetails.value?.location?.latitude || 0
  const lng = stayDetails.value?.location?.longitude || 0
  if (!lat || !lng) return
  const google = (window as any).google
  if (!google?.maps) return
  const el = document.getElementById('mini-map')
  if (!el) return
  miniMapInstance = new google.maps.Map(el, {
    center: { lat, lng }, zoom: 15, disableDefaultUI: true,
    styles: [{ featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#7c93a3' }] }]
  })
  new google.maps.Marker({
    position: { lat, lng }, map: miniMapInstance,
    icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: '#1d7a4f', fillOpacity: 1, strokeWeight: 2, strokeColor: '#ffffff', scale: 9 }
  })
}

watch(showFullMap, async (val) => {
  if (!val) return
  await nextTick()
  const lat = stayDetails.value?.location?.latitude || 0
  const lng = stayDetails.value?.location?.longitude || 0
  if (!lat || !lng) return
  const google = (window as any).google
  if (!google?.maps) return
  const el = document.getElementById('full-map')
  if (!el) return
  fullMapInstance = new google.maps.Map(el, {
    center: { lat, lng }, zoom: 15,
    styles: [{ featureType: 'all', elementType: 'labels.text.fill', stylers: [{ color: '#1a2b33' }] }]
  })
  new google.maps.Marker({
    position: { lat, lng }, map: fullMapInstance,
    icon: { path: google.maps.SymbolPath.CIRCLE, fillColor: '#1d7a4f', fillOpacity: 1, strokeWeight: 3, strokeColor: '#ffffff', scale: 12 }
  })
})

watch(() => stayDetails.value, () => setTimeout(initMiniMap, 500), { deep: true })

onMounted(async () => {
  await Promise.all([fetchStayDetails(stayId, provider), handleUpdateSearch()])
  if ((window as any).google?.maps) initMiniMap()
})

useHead({
  script: [{
    src: `https://maps.googleapis.com/maps/api/js?key=AIzaSyCa0Rx0TJ9BGkQ9NC23BZc51zCql_Xrhs0&libraries=places`,
    async: true, defer: true, onload: () => setTimeout(initMiniMap, 500)
  }]
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.sd-root {
  min-height: 100vh;
  background: #f8f9f7;
  font-family: 'Sora', system-ui, sans-serif;
  color: #111;
}

.sd-wrap {
  max-width: 1160px;
  margin: 0 auto;
  padding: 0 24px;
}

/* ── Nav ──────────────────────────────────────────────────────────── */
.sd-nav {
  background: #fff;
  border-bottom: 1px solid #e8e8e2;
  position: sticky;
  top: 0;
  z-index: 80;
}
.sd-nav-inner {
  height: 54px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}
.sd-back {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #888;
  background: none;
  border: none;
  cursor: pointer;
  transition: color 0.15s;
  white-space: nowrap;
  flex-shrink: 0;
}
.sd-back:hover { color: #111; }

.sd-breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  color: #bbb;
  overflow: hidden;
  flex: 1;
  min-width: 0;
}
.sd-bc-link { color: #999; text-decoration: none; transition: color 0.14s; white-space: nowrap; }
.sd-bc-link:hover { color: #111; }
.sd-bc-current { color: #111; font-weight: 600; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.sd-nav-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.sd-nav-action {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  font-family: 'Sora', sans-serif;
  font-size: 11px;
  font-weight: 600;
  color: #555;
  background: #f5f5f0;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.14s;
}
.sd-nav-action:hover { background: #111; color: #fff; }

/* ── Gallery ──────────────────────────────────────────────────────── */
.sd-gallery { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 260px 260px; gap: 6px; border-radius: 16px; overflow: hidden; margin: 24px 0; }
.sd-gallery-main { grid-row: span 2; position: relative; overflow: hidden; cursor: pointer; }
.sd-gallery-grid { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 6px; }
.sd-gallery-thumb { position: relative; overflow: hidden; cursor: pointer; }
.sd-gallery-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s ease; }
.sd-gallery-main:hover .sd-gallery-img,
.sd-gallery-thumb:hover .sd-gallery-img { transform: scale(1.04); }

.sd-gallery-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.32) 0%, transparent 50%);
  display: flex;
  align-items: flex-end;
  padding: 16px;
  pointer-events: none;
}
.sd-gallery-count {
  display: flex;
  align-items: center;
  gap: 7px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(6px);
  color: #111;
  font-size: 11px;
  font-weight: 700;
  padding: 7px 12px;
  border-radius: 8px;
  pointer-events: auto;
  cursor: pointer;
}
.sd-gallery-more {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.48);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 700;
  color: #fff;
}

/* Gallery skeletons */
.sd-gallery-skel { display: flex; gap: 6px; height: 520px; margin: 24px 0; border-radius: 16px; overflow: hidden; }
.sd-sk--main { flex: 1; background: #f0f0ea; }
.sd-sk-grid { width: 50%; display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 1fr 1fr; gap: 6px; }
.sd-sk { background: #f0f0ea; animation: pulse 1.5s ease-in-out infinite; }
@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.45; } }

/* ── Lightbox ──────────────────────────────────────────────────────── */
.sd-lightbox {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.92);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.sd-lb-img { max-width: 90vw; max-height: 85vh; object-fit: contain; border-radius: 8px; }
.sd-lb-close { position: absolute; top: 20px; right: 20px; width: 40px; height: 40px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.14s; }
.sd-lb-close:hover { background: rgba(255,255,255,0.2); }
.sd-lb-arrow { position: absolute; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; background: rgba(255,255,255,0.1); border: none; border-radius: 50%; color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background 0.14s; }
.sd-lb-arrow:hover { background: rgba(255,255,255,0.2); }
.sd-lb-arrow--prev { left: 20px; }
.sd-lb-arrow--next { right: 20px; }
.sd-lb-counter { position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(255,255,255,0.1); color: #fff; font-size: 12px; font-weight: 600; padding: 5px 14px; border-radius: 20px; }

/* ── Header ───────────────────────────────────────────────────────── */
.sd-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; margin-bottom: 20px; flex-wrap: wrap; }
.sd-header-left { flex: 1; min-width: 0; }
.sd-property-type { font-size: 9px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase; color: #999; margin-bottom: 8px; }
.sd-h1 { font-size: clamp(22px, 3vw, 34px); font-weight: 700; color: #111; letter-spacing: -0.03em; line-height: 1.15; margin-bottom: 10px; }
.sd-location { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #888; flex-wrap: wrap; }
.sd-map-link { color: #1d7a4f; font-weight: 600; cursor: pointer; background: none; border: none; font-family: inherit; font-size: inherit; padding: 0; transition: opacity 0.14s; }
.sd-map-link:hover { opacity: 0.7; }

.sd-rating-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #1d7a4f;
  color: #fff;
  border-radius: 12px;
  padding: 12px 18px;
  text-align: center;
  flex-shrink: 0;
}
.sd-rating-score { font-size: 26px; font-weight: 700; letter-spacing: -0.04em; line-height: 1; }
.sd-rating-label { font-size: 10px; font-weight: 700; letter-spacing: 0.08em; margin-top: 3px; }
.sd-rating-count { font-size: 9px; opacity: 0.7; margin-top: 2px; }

/* ── Tabs ─────────────────────────────────────────────────────────── */
.sd-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid #e8e8e2;
  margin-bottom: 0;
}
.sd-tab {
  padding: 12px 20px;
  font-family: 'Sora', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 0.06em;
  color: #aaa;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.16s;
  margin-bottom: -1px;
}
.sd-tab:hover { color: #555; }
.sd-tab--on { color: #111; border-bottom-color: #111; }

/* ── Body grid ────────────────────────────────────────────────────── */
.sd-body {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 28px;
  align-items: start;
  padding-top: 28px;
  padding-bottom: 60px;
}

/* ── Sections ────────────────────────────────────────────────────── */
.sd-section {
  background: #fff;
  border: 1px solid #eaeae3;
  border-radius: 14px;
  padding: 28px;
  margin-bottom: 16px;
}
.sd-sec-h {
  font-size: 17px;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.02em;
  margin-bottom: 16px;
}

.sd-desc {
  font-size: 13px;
  line-height: 1.75;
  color: #555;
}
.sd-desc--clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.sd-read-more {
  font-size: 12px;
  font-weight: 600;
  color: #1d7a4f;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin-top: 10px;
  display: inline-block;
  font-family: inherit;
}

.sd-highlights {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 10px;
  margin-top: 20px;
}
.sd-highlight {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background: #f8f9f7;
  border: 1px solid #eaeae3;
  border-radius: 10px;
}
.sd-hl-icon { font-size: 18px; flex-shrink: 0; }
.sd-hl-label { font-size: 9px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb; }
.sd-hl-sub { font-size: 12px; font-weight: 600; color: #111; margin-top: 2px; }

.sd-amenities {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}
.sd-amenity {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 12px;
  color: #444;
  font-weight: 500;
}
.sd-amenity svg { color: #1d7a4f; flex-shrink: 0; }

/* ── Availability bar ────────────────────────────────────────────── */
.sd-avail-bar { display: flex; flex-direction: column; gap: 16px; }
.sd-avail-title { display: flex; align-items: flex-start; gap: 10px; color: #1d7a4f; }
.sd-avail-h { font-size: 14px; font-weight: 700; color: #111; }
.sd-avail-sub { font-size: 11px; color: #aaa; margin-top: 2px; }

.sd-avail-fields {
  display: flex;
  align-items: stretch;
  background: #f8f9f7;
  border: 1.5px solid #e0e0d8;
  border-radius: 12px;
  overflow: visible;
  position: relative;
}

.sd-av-fld {
  position: relative;
  flex: 1;
  min-width: 0;
}
.sd-av-fld-inner {
  padding: 12px 16px;
  cursor: pointer;
  border-radius: 10px;
  transition: background 0.14s;
  height: 100%;
}
.sd-av-fld-inner:hover { background: #f0f7f3; }
.sd-av-fld--active .sd-av-fld-inner { background: #f0f7f3; }
.sd-av-lbl { font-size: 9px; font-weight: 700; letter-spacing: 0.14em; text-transform: uppercase; color: #bbb; margin-bottom: 2px; }
.sd-av-val { font-size: 13px; font-weight: 500; color: #bbb; }
.sd-av-val--set { color: #111; }

.sd-av-sep { width: 1px; background: #e0e0d8; margin: 8px 0; flex-shrink: 0; }

.sd-avail-btn {
  flex-shrink: 0;
  background: #111;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 0 20px;
  margin: 5px;
  transition: background 0.2s;
  min-width: 90px;
  align-self: stretch;
}
.sd-avail-btn:hover { background: #1d7a4f; }
.sd-avail-btn--busy { opacity: 0.7; cursor: wait; }
.sd-avail-btn-inner { display: flex; align-items: center; justify-content: center; gap: 6px; }

/* ── Dropdowns (reused from index) ─────────────────────────────────── */
.sd-av-drop {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  background: #fff;
  border: 1px solid #e0e0d8;
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  z-index: 200;
  overflow: hidden;
}
.sd-av-drop--cal { width: 300px; padding: 16px; }
.sd-cal-nav { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
.sd-cal-title { font-size: 13px; font-weight: 600; color: #111; }
.sd-cal-arr { width: 30px; height: 30px; border-radius: 8px; border: 1px solid #e8e8e0; background: #fff; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
.sd-cal-arr:hover { background: #111; color: #fff; border-color: #111; }
.sd-cal-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 2px; }
.sd-cal-dow { font-size: 9px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: #bbb; text-align: center; padding: 4px 0 8px; }
.sd-cal-cell { aspect-ratio: 1; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 500; color: #333; border-radius: 7px; cursor: pointer; transition: all 0.1s; }
.sd-cal-cell:not(.sd-cal-cell--blank):not(.sd-cal-cell--past):hover { background: #edf5f1; color: #1d7a4f; }
.sd-cal-cell--blank { pointer-events: none; }
.sd-cal-cell--past { color: #ddd; cursor: not-allowed; pointer-events: none; }
.sd-cal-cell--today { font-weight: 700; color: #1d7a4f; }
.sd-cal-cell--sel { background: #1d7a4f !important; color: #fff !important; font-weight: 700; }
.sd-cal-cell--range { background: #edf5f1; color: #1d7a4f; }
.sd-cal-footer { margin-top: 12px; padding-top: 12px; border-top: 1px solid #f0f0ea; text-align: center; font-size: 11px; color: #888; font-weight: 600; }

.sd-av-drop--guests { width: 260px; right: 0; left: auto; padding: 16px; }
.sd-guests-row { display: flex; align-items: center; justify-content: space-between; padding: 8px 0; }
.sd-guests-sep { height: 1px; background: #f0f0ea; margin: 4px 0; }
.sd-guests-info { display: flex; flex-direction: column; gap: 2px; }
.sd-guests-type { font-size: 13px; font-weight: 600; color: #111; }
.sd-guests-sub { font-size: 11px; color: #aaa; }
.sd-guests-ctrl { display: flex; align-items: center; gap: 12px; }
.sd-guests-btn { width: 30px; height: 30px; border-radius: 50%; border: 1.5px solid #e0e0d8; background: #fff; color: #555; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.14s; }
.sd-guests-btn:hover:not(:disabled) { border-color: #111; color: #111; }
.sd-guests-btn:disabled { opacity: 0.3; cursor: not-allowed; }
.sd-guests-num { font-size: 16px; font-weight: 700; color: #111; min-width: 20px; text-align: center; }
.sd-guests-done { width: 100%; padding: 10px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 13px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.15s; margin-top: 12px; }
.sd-guests-done:hover { background: #1d7a4f; }

/* ── Rooms header ─────────────────────────────────────────────────── */
.sd-rooms-hd { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; flex-wrap: wrap; gap: 10px; }
.sd-refund-check { display: flex; align-items: center; gap: 8px; cursor: pointer; font-size: 12px; color: #555; }
.sd-chk { width: 15px; height: 15px; border-radius: 4px; border: 1.5px solid #d8d8d0; display: flex; align-items: center; justify-content: center; flex-shrink: 0; color: #fff; transition: all 0.14s; cursor: pointer; }
.sd-chk--on { background: #1d7a4f; border-color: #1d7a4f; }

/* Rooms loading */
.sd-rooms-loading { display: flex; flex-direction: column; gap: 10px; }
.sd-room-skel { background: #fff; border: 1px solid #eaeae3; border-radius: 12px; display: flex; overflow: hidden; height: 110px; animation: pulse 1.5s ease-in-out infinite; }
.sd-sk--room-img { width: 140px; background: #f0f0ea; flex-shrink: 0; }
.sd-sk-body { flex: 1; padding: 16px; display: flex; flex-direction: column; gap: 9px; }
.sd-sk--room-title { height: 14px; width: 55%; background: #f0f0ea; border-radius: 4px; }
.sd-sk--room-sub { height: 11px; width: 40%; background: #f0f0ea; border-radius: 4px; }
.sd-sk--room-price { height: 18px; width: 30%; background: #f0f0ea; border-radius: 4px; margin-top: auto; }

/* Room cards */
.sd-rooms { display: flex; flex-direction: column; gap: 10px; }
.sd-room {
  background: #fff;
  border: 1.5px solid #eaeae3;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.18s;
  display: flex;
  flex-direction: column;
}
.sd-room:hover { border-color: #1d7a4f; box-shadow: 0 4px 18px rgba(29,122,79,0.08); }
.sd-room--sel { border-color: #1d7a4f; background: #fafdf9; box-shadow: 0 0 0 3px rgba(29,122,79,0.08); }

.sd-room-img-wrap { height: 160px; overflow: hidden; }
.sd-room-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s; }
.sd-room:hover .sd-room-img { transform: scale(1.03); }

.sd-room-body { padding: 18px; display: flex; flex-direction: column; gap: 14px; flex: 1; }
.sd-room-top { display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
.sd-room-name { font-size: 15px; font-weight: 700; color: #111; margin-bottom: 8px; letter-spacing: -0.01em; }
.sd-room-amenities { display: flex; flex-direction: column; gap: 5px; }
.sd-room-amen { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #666; font-weight: 500; }
.sd-room-amen svg { color: #1d7a4f; flex-shrink: 0; }

.sd-room-price-col { text-align: right; flex-shrink: 0; }
.sd-room-price { font-size: 22px; font-weight: 700; color: #111; letter-spacing: -0.03em; }
.sd-room-per { font-size: 10px; color: #999; font-weight: 500; margin-top: 2px; }
.sd-room-incl { font-size: 9px; color: #bbb; margin-top: 2px; }

.sd-room-foot { display: flex; align-items: center; justify-content: space-between; padding-top: 12px; border-top: 1px solid #f0f0ea; flex-wrap: wrap; gap: 8px; }
.sd-room-policies { display: flex; gap: 8px; flex-wrap: wrap; }
.sd-policy { display: flex; align-items: center; gap: 5px; font-size: 10px; font-weight: 700; padding: 4px 9px; border-radius: 20px; }
.sd-policy--yes { background: #edf5f1; color: #1d7a4f; }
.sd-policy--no { background: #fef2f2; color: #dc2626; }
.sd-policy--board { background: #f5f5f0; color: #555; }

.sd-room-cta {
  font-size: 12px;
  font-weight: 700;
  padding: 8px 16px;
  border: 1.5px solid #e0e0d8;
  border-radius: 8px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: all 0.14s;
  font-family: inherit;
}
.sd-room-cta:hover { border-color: #1d7a4f; color: #1d7a4f; }
.sd-room-cta--sel { background: #1d7a4f; border-color: #1d7a4f; color: #fff; }
.sd-room-cta--sel:hover { background: #186440; }

/* ── Empty ────────────────────────────────────────────────────────── */
.sd-empty { display: flex; flex-direction: column; align-items: center; padding: 52px 24px; gap: 10px; text-align: center; }
.sd-empty-ico { width: 52px; height: 52px; border-radius: 14px; background: #f5fbf7; display: flex; align-items: center; justify-content: center; color: #1d7a4f; margin-bottom: 4px; }
.sd-empty-h { font-size: 18px; font-weight: 700; color: #111; }
.sd-empty-p { font-size: 12px; color: #aaa; max-width: 280px; line-height: 1.6; }
.sd-empty-btn { margin-top: 8px; padding: 9px 20px; background: #111; border: none; border-radius: 9px; font-family: 'Sora', sans-serif; font-size: 12px; font-weight: 600; color: #fff; cursor: pointer; transition: background 0.18s; }
.sd-empty-btn:hover { background: #1d7a4f; }

/* ── Aside ────────────────────────────────────────────────────────── */
.sd-aside { position: sticky; top: 70px; display: flex; flex-direction: column; gap: 14px; }

/* Summary card */
.sd-summary-card {
  background: #fff;
  border: 1.5px solid #eaeae3;
  border-radius: 14px;
  overflow: hidden;
}
.sd-summary-hd {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 14px 18px;
  background: #111;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.sd-summary-empty { padding: 36px 18px; display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; }
.sd-summary-empty-ico { width: 48px; height: 48px; background: #f5f5f0; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: #ccc; }
.sd-summary-empty-p { font-size: 12px; color: #aaa; line-height: 1.6; max-width: 200px; }

.sd-summary-body { padding: 18px; display: flex; flex-direction: column; gap: 16px; }
.sd-sum-room-name { font-size: 12px; font-weight: 700; color: #555; }
.sd-sum-price-block { display: flex; align-items: baseline; gap: 6px; padding: 14px 0; border-top: 1px solid #f0f0ea; border-bottom: 1px solid #f0f0ea; }
.sd-sum-price { font-size: 32px; font-weight: 700; color: #111; letter-spacing: -0.04em; }
.sd-sum-per { font-size: 11px; color: #aaa; }

.sd-sum-details { display: flex; flex-direction: column; gap: 10px; }
.sd-sum-row { display: flex; align-items: center; justify-content: space-between; }
.sd-sum-lbl { font-size: 11px; color: #aaa; font-weight: 500; }
.sd-sum-val { font-size: 12px; font-weight: 700; color: #111; }

.sd-sum-incl { display: flex; align-items: center; gap: 6px; font-size: 10px; color: #1d7a4f; font-weight: 600; }

.sd-book-btn {
  width: 100%;
  background: #111;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 13px;
  font-weight: 700;
  padding: 14px;
  cursor: pointer;
  transition: background 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.sd-book-btn:hover:not(:disabled) { background: #1d7a4f; }
.sd-book-btn:disabled { opacity: 0.6; cursor: not-allowed; }
.sd-book-btn--busy { opacity: 0.75; }

/* Map card */
.sd-map-card {
  height: 140px;
  border-radius: 14px;
  overflow: hidden;
  border: 1px solid #eaeae3;
  position: relative;
  cursor: pointer;
}
.sd-mini-map { width: 100%; height: 100%; }
.sd-map-hover {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: rgba(0,0,0,0.04);
  font-size: 11px;
  font-weight: 700;
  color: #111;
  opacity: 0;
  transition: opacity 0.18s;
  background: linear-gradient(to top, rgba(0,0,0,0.18), transparent);
}
.sd-map-card:hover .sd-map-hover { opacity: 1; }

/* Help card */
.sd-help-card {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
  background: #f8f9f7;
  border: 1.5px dashed #e0e0d8;
  border-radius: 12px;
}
.sd-help-ico { width: 36px; height: 36px; border-radius: 9px; background: #fff; border: 1px solid #e8e8e0; display: flex; align-items: center; justify-content: center; color: #1d7a4f; flex-shrink: 0; }
.sd-help-title { font-size: 12px; font-weight: 700; color: #111; margin-bottom: 4px; }
.sd-help-p { font-size: 11px; color: #888; line-height: 1.6; }

/* Spinners */
.sd-spin { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: #fff; border-radius: 50%; animation: spin 0.7s linear infinite; }
.sd-spin--dark { border-color: rgba(0,0,0,0.15); border-top-color: #111; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Full map modal */
.sd-fullmap-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 500; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(3px); }
.sd-fullmap-box { width: 90vw; height: 80vh; border-radius: 16px; overflow: hidden; position: relative; }
.sd-fullmap { width: 100%; height: 100%; }
.sd-fullmap-close { position: absolute; top: 14px; right: 14px; z-index: 10; width: 38px; height: 38px; background: #fff; border: none; border-radius: 9px; cursor: pointer; display: flex; align-items: center; justify-content: center; color: #111; box-shadow: 0 2px 10px rgba(0,0,0,0.12); transition: all 0.14s; }
.sd-fullmap-close:hover { background: #111; color: #fff; }

/* ── Transitions ───────────────────────────────────────────────────── */
.fd-enter-active, .fd-leave-active { transition: opacity 0.16s ease, transform 0.16s ease; }
.fd-enter-from { opacity: 0; transform: translateY(-6px) scale(0.98); }
.fd-leave-to { opacity: 0; transform: translateY(-3px) scale(0.99); }

.sd-lb-enter-active, .sd-lb-leave-active { transition: opacity 0.2s ease; }
.sd-lb-enter-from, .sd-lb-leave-to { opacity: 0; }

.sd-map-modal-enter-active, .sd-map-modal-leave-active { transition: opacity 0.22s ease; }
.sd-map-modal-enter-from, .sd-map-modal-leave-to { opacity: 0; }

/* ── Responsive ────────────────────────────────────────────────────── */
@media (max-width: 1024px) {
  .sd-body { grid-template-columns: 1fr; }
  .sd-aside { position: static; display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  .sd-summary-card { grid-column: span 2; }
}

@media (max-width: 768px) {
  .sd-gallery { grid-template-columns: 1fr; grid-template-rows: 260px; height: auto; }
  .sd-gallery-grid { display: none; }
  .sd-gallery-main { grid-row: span 1; }
  .sd-amenities { grid-template-columns: repeat(2, 1fr); }
  .sd-avail-fields { flex-direction: column; }
  .sd-av-sep { width: 100%; height: 1px; margin: 0; }
  .sd-avail-btn { margin: 4px; min-height: 44px; border-radius: 9px; }
  .sd-av-drop--cal, .sd-av-drop--guests { width: calc(100vw - 50px); }
  .sd-aside { grid-template-columns: 1fr; }
  .sd-summary-card { grid-column: span 1; }
  .sd-highlights { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 580px) {
  .sd-wrap { padding: 0 14px; }
  .sd-breadcrumb { display: none; }
  .sd-amenities { grid-template-columns: 1fr; }
  .sd-room-top { flex-direction: column; }
  .sd-room-price-col { text-align: left; }
  .sd-tabs { overflow-x: auto; }
  .sd-tab { white-space: nowrap; }
}
</style> 