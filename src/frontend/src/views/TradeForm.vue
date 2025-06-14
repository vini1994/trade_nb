<template>
  <div class="container py-4">
    <div v-if="errorMessage" class="alert alert-danger alert-dismissible fade show mb-3" role="alert">
      {{ errorMessage }}
      <button type="button" class="btn-close" @click="errorMessage = ''" aria-label="Close"></button>
    </div>
    <div class="card shadow-sm">
      <div class="card-header">
        <h5 class="card-title mb-0">{{ isEditing ? 'Edit Trade' : 'Add New Trade' }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="saveTrade">
          <div class="mb-3">
            <label class="form-label">Pair</label>
            <input
              v-model="pairUpperCase"
              type="text"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Type</label>
            <select
              v-model="tradeData.type"
              class="form-select"
              required
            >
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Interval</label>
            <select
              v-model="tradeData.interval"
              class="form-select"
              required
            >
              <option value="5m">5m</option>
              <option value="15m">15m</option>
              <option value="1h">1h</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Entry</label>
            <input
              v-model.number="tradeData.entry"
              type="number"
              step="any"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Stop</label>
            <input
              v-model.number="tradeData.stop"
              type="number"
              step="any"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">TP1</label>
            <input
              v-model.number="tradeData.tp1"
              type="number"
              step="any"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">TP2</label>
            <input
              v-model.number="tradeData.tp2"
              type="number"
              step="any"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">TP3</label>
            <input
              v-model.number="tradeData.tp3"
              type="number"
              step="any"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">TP4</label>
            <input
              v-model.number="tradeData.tp4"
              type="number"
              step="any"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">TP5</label>
            <input
              v-model.number="tradeData.tp5"
              type="number"
              step="any"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <label class="form-label">TP6</label>
            <input
              v-model.number="tradeData.tp6"
              type="number"
              step="any"
              class="form-control"
            />
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input
                v-model="tradeData.volume_required"
                type="checkbox"
                class="form-check-input"
                id="volumeRequiredCheck"
              />
              <label class="form-check-label" for="volumeRequiredCheck">
                Volume Required
              </label>
            </div>
          </div>
          <div class="mb-3">
            <div class="form-check">
              <input
                v-model="tradeData.volume_adds_margin"
                type="checkbox"
                class="form-check-input"
                id="volumeMarginCheck"
              />
              <label class="form-check-label" for="volumeMarginCheck">
                Volume Adds Margin
              </label>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Setup Description</label>
            <textarea
              v-model="tradeData.setup_description"
              class="form-control"
              rows="3"
              placeholder="Describe the trading setup..."
            ></textarea>
          </div>
          <div class="mb-3">
            <label class="form-label">Analysis URL</label>
            <input
              v-model="tradeData.url_analysis"
              type="url"
              class="form-control"
              placeholder="https://www.tradingview.com/symbols/..."
            />
          </div>
          <div class="text-end">
            <router-link
              to="/"
              class="btn btn-secondary me-2"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="btn btn-primary"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Trade } from '../../../utils/types';



const route = useRoute()
const router = useRouter()

const tradeData = ref<Trade>({
  entry: 0,
  stop: 0,
  type: 'LONG',
  tp1: 0,
  tp2: null,
  tp3: null,
  tp4: null,
  tp5: null,
  tp6: null,
  symbol: '',
  volume_required: false,
  volume_adds_margin: false,
  setup_description: null,
  url_analysis: '',
  interval: '1h'
})

const pairUpperCase = computed({
  get: () => tradeData.value.symbol,
  set: (value: string) => {
    tradeData.value.symbol = value.toUpperCase()
  }
})

const isEditing = computed(() => route.params.id !== undefined)

const errorMessage = ref('')

// Load trade data if editing
onMounted(async () => {
  if (isEditing.value) {
    try {
      const response = await fetch(`/api/trades/${route.params.id}`)
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to load trade')
      }
      const trade = await response.json()
      tradeData.value = trade
    } catch (error) {
      console.error('Failed to load trade:', error)
      errorMessage.value = error instanceof Error ? error.message : 'Failed to load trade'
    }
  }
})

const saveTrade = async () => {
  try {
    errorMessage.value = ''
    const url = isEditing.value ? `/api/trades/${route.params.id}` : '/api/trades'
    const method = isEditing.value ? 'PUT' : 'POST'
    
    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tradeData.value)
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Failed to save trade')
    }

    router.push('/')
  } catch (error) {
    console.error('Failed to save trade:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to save trade'
  }
}
</script> 