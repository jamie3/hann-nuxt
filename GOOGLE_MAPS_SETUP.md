# Google Maps API Setup Guide

This application uses Google Maps Places API for address autocomplete in the referral forms. Follow these steps to set up the API key:

## 1. Get a Google Maps API Key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the **Places API**:
   - Go to "APIs & Services" > "Library"
   - Search for "Places API"
   - Click on it and press "Enable"
4. Create credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy your API key

## 2. Restrict Your API Key (Recommended)

For security, restrict your API key:

1. In the Credentials page, click on your API key
2. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your domain(s), for example:
     - `localhost:3000/*` (for development)
     - `yourdomain.com/*` (for production)
3. Under "API restrictions":
   - Select "Restrict key"
   - Select "Places API"
4. Save changes

## 3. Configure Your Application

1. Copy `.env.example` to `.env`:

   ```bash
   cp .env.example .env
   ```

2. Add your Google Maps API key to `.env`:

   ```
   NUXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
   ```

3. Restart your development server:
   ```bash
   npm run dev
   ```

## 4. Verify Setup

1. Navigate to either referral form:
   - Self Referral: `/referral/self`
   - Professional Referral: `/referral/professional`

2. Start typing in the "Mailing Address" field
3. You should see address suggestions appear as you type

## Pricing

Google Maps Places API has a free tier:

- First $200/month in usage is free
- Address autocomplete costs approximately $2.83 per 1,000 requests
- This means you get about 70,000 free autocomplete requests per month

## Troubleshooting

### No suggestions appear

- Check browser console for errors
- Verify API key is correctly set in `.env`
- Ensure Places API is enabled in Google Cloud Console
- Check that your domain is allowed in API key restrictions

### "This API project is not authorized" error

- The API key restrictions may be blocking your domain
- Add your domain to the allowed referrers list
- Or temporarily remove restrictions for testing

### Rate limiting

- If you see quota errors, check your usage in Google Cloud Console
- Consider adding billing information to increase limits
- Implement caching if needed

## Support

For more information, visit:

- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
