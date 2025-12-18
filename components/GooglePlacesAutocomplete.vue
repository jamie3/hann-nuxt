<template>
  <div>
    <label :for="inputId" class="block text-sm font-medium text-gray-700 mb-1">
      {{ label }} <span v-if="required" class="text-red-500">*</span>
    </label>
    <input
      :id="inputId"
      ref="autocompleteInput"
      type="text"
      :value="modelValue"
      @input="onInput"
      :placeholder="placeholder"
      class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="{ 'border-red-500': hasError }"
    />
    <p v-if="errorMessage" class="mt-1 text-sm text-red-500">
      {{ errorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: 'Address',
  },
  placeholder: {
    type: String,
    default: 'Start typing your address...',
  },
  required: {
    type: Boolean,
    default: false,
  },
  hasError: {
    type: Boolean,
    default: false,
  },
  errorMessage: {
    type: String,
    default: '',
  },
  inputId: {
    type: String,
    default: 'address-autocomplete',
  },
});

const emit = defineEmits(['update:modelValue', 'place-selected']);

const autocompleteInput = ref<HTMLInputElement | null>(null);
let autocomplete: any = null;

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};

onMounted(() => {
  // Check if Google Maps API is loaded
  if (typeof window !== 'undefined' && (window as any).google) {
    initAutocomplete();
  } else {
    // Wait for Google Maps API to load
    const checkGoogleMaps = setInterval(() => {
      if ((window as any).google) {
        clearInterval(checkGoogleMaps);
        initAutocomplete();
      }
    }, 100);

    // Clear interval after 10 seconds if not loaded
    setTimeout(() => clearInterval(checkGoogleMaps), 10000);
  }
});

const initAutocomplete = () => {
  if (!autocompleteInput.value) return;

  const google = (window as any).google;

  autocomplete = new google.maps.places.Autocomplete(autocompleteInput.value, {
    types: ['address'],
    componentRestrictions: { country: ['ca', 'us'] }, // Restrict to Canada and US
  });

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();

    if (place.formatted_address) {
      emit('update:modelValue', place.formatted_address);

      // Parse address components
      const addressComponents = parseAddressComponents(place.address_components || []);
      emit('place-selected', addressComponents);
    }
  });
};

const parseAddressComponents = (components: any[]) => {
  const result: any = {
    street_number: '',
    route: '',
    city: '',
    province_state: '',
    country: '',
    postal_code: '',
  };

  components.forEach((component) => {
    const types = component.types;

    if (types.includes('street_number')) {
      result.street_number = component.long_name;
    } else if (types.includes('route')) {
      result.route = component.long_name;
    } else if (types.includes('locality')) {
      result.city = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      result.province_state = component.long_name;
    } else if (types.includes('country')) {
      result.country = component.long_name;
    } else if (types.includes('postal_code')) {
      result.postal_code = component.long_name;
    }
  });

  return result;
};
</script>
