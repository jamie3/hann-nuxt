export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const apiKey = config.public.googleMapsApiKey;

  if (!apiKey) {
    console.warn(
      'Google Maps API key is not configured. Please add NUXT_PUBLIC_GOOGLE_MAPS_API_KEY to your .env file'
    );
    return;
  }

  // Load Google Maps API script
  const script = document.createElement('script');
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
});
