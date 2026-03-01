# Certificate Images Folder

This folder contains certificate images that will be displayed in the certification viewer.

## Instructions

1. **Add your certificate images here** (JPG, PNG, or PDF formats recommended)
2. **Name your files** descriptively, matching the ID in `certificates.json`
3. **Update** `src/assets/data/certificates.json` with the correct image path

## Example

If you have a certificate image named `google-cloud-genai-2024.jpg`, place it in this folder and reference it in `certificates.json`:

```json
{
  "id": "google-cloud-genai-2024",
  "certificateImage": "assets/certifications/google-cloud-genai-2024.jpg",
  ...
}
```

## Current Certificate

- `google-cloud-genai-2024.jpg` - Google Cloud Gen AI: Beyond the Chatbot

## Image Recommendations

- **Format**: JPG or PNG
- **Resolution**: At least 1920x1080 pixels for best quality
- **File size**: Optimize images to keep them under 500KB for faster loading
- **Aspect ratio**: Most certificates are landscape (16:9 or similar)

