# Modern Fit Pilates Website

A beautiful, zen-inspired website for Modern Fit Pilates, founded by Alexis Interdonato.

## Website Features

### Design
- **Color Scheme**: Warm white, muted sage, and soft earth tones
- **Tone**: Calm, editorial, welcoming, and athletic
- **Typography**: Cormorant Garamond (headings) and Montserrat (body)
- **Fully Responsive**: Mobile, tablet, and desktop layouts with a compact mobile menu
- **Motion**: Subtle scroll reveals and image transitions, with reduced-motion support

### Sections
1. **Home** - Studio introduction and clear paths to pricing and instructors
2. **Our Method** - Athletic Pilates philosophy and small-class approach
3. **Founder and Instructors** - Alexis, Elizabeth, Kaylah, and Teresa
4. **Client Reviews** - Testimonial carousel
5. **Studio Gallery** - Studio and team photography
6. **FAQ and Pricing** - Visit information, class packages, and private training rates
7. **Contact** - Location, Glofox booking guidance, Instagram, and embedded map

### Interactive Features
- Smooth anchor navigation and active-section highlighting
- Accessible, keyboard-operable mobile navigation and FAQ accordion
- Reduced-motion-aware scroll reveals and image hover transitions
- Testimonial carousel with touch controls
- Scroll-to-top control

## Business Information

**Modern Fit Pilates**
- **Founder**: Alexis Interdonato
- **Location**: 340 Wheatley Plaza, Greenvale, NY 11548
- **Certifications**: BASI Certified Pilates Instructor, Nutrition Coach
- **Booking**: Glofox Health and Fitness App
- **Instagram**: [@modernfitpilates](https://www.instagram.com/modernfitpilates/)

## Files

- `index.html` - Main HTML structure
- `styles.css` - Complete styling with animations
- `script.js` - Interactive JavaScript functionality
- `logo.png` - Modern Fit Pilates logo
- `README.md` - This file

## How to Use

1. Open `index.html` in a web browser to view the site
2. Keep the site files and image assets in the same folder
3. Update `index.html` when instructor details, pricing, or studio information changes
4. Replace placeholder text with actual bios and story content

## Next Steps

1. **Booking Integration**: Add the studio's direct Glofox booking URL when available
2. **SEO**: Add Open Graph metadata and verify search previews
3. **Domain Setup**: Configure the production domain when ready to go live

## Technical Notes

- Built with vanilla HTML, CSS, and JavaScript (no frameworks required)
- Uses Google Fonts (Cormorant Garamond and Montserrat)
- Fully accessible with ARIA labels and keyboard navigation
- Optimized for performance with debounced scroll events
- Cross-browser compatible
- Mobile-first responsive design

## Debugging

- Enable console debug: append `?debug=1` to the URL (e.g., `index.html?debug=1`), or run `localStorage.setItem('mfp-debug', '1')` in the console and refresh.
- Disable: `localStorage.removeItem('mfp-debug')` or call `window.mfpDebug.disable()`.
- Debug API:
   - `window.mfpDebug.enable()` / `window.mfpDebug.disable()`
   - `window.mfpDebug.log('message', data)`
   - `window.mfpDebug.mark('name')` and `window.mfpDebug.measure('name','start','end')`
- Instrumented events: navigation clicks, section reveal animations, scroll position, load fade-in performance marks, and error/rejection handlers.

## Debugging

- Enable debug logs by adding `?debug=1` to the site URL or setting `localStorage` key `mfp-debug` to `'1'`.
- Use `window.mfpDebug` in the browser console:
   - `window.mfpDebug.enable()` / `window.mfpDebug.disable()`
   - `window.mfpDebug.log('message')` to log with the `[MFP]` prefix
   - `window.mfpDebug.mark('name')` and `window.mfpDebug.measure('name', 'start', 'end')` to record simple performance timings
   - Errors and unhandled promise rejections are logged when debug is enabled.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Created by Digital Web Services**
*Website designed with care for Modern Fit Pilates*
