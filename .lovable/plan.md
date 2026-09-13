# Cinematic Food Preview

## Build
- हर dish card पर साफ eye icon वाला preview control जोड़ना।
- Preview को full-screen mobile-friendly cinematic experience बनाना, जहाँ dish पहले simple view में दिखे।
- Play करने पर food photo को layered assembly animation देना: ingredients एक-एक करके आएँ, final dish बने, फिर price और quality highlights दिखें।
- Burger, pizza, rolls, snacks, desserts और drinks के लिए अलग ingredient sequences रखना।
- हर preview में ingredients, preparation/quality notes और current menu price दिखाना; अप्रमाणित “100% pure” claims नहीं जोड़ना।
- Preview में pause/replay, close, next/previous dish और add-to-cart controls देना।

## Visual direction
- Existing green, gold और warm food photography look को बिना बाकी layout बदले जारी रखना।
- Mobile पर immersive vertical video-style framing; desktop पर centered cinematic viewer।
- Motion तेज़ लेकिन readable होगी और reduced-motion setting का सम्मान करेगी।

## Technical details
- Reusable food preview modal और per-category animation recipes बनेंगे।
- Existing menu data में structured ingredient और quality fields जुड़ेंगे।
- CSS keyframes से layered assembly, ingredient labels, progress और transitions बनेंगे; dish images वही रहेंगी।
- Home और Menu दोनों जगह existing dish cards से preview खुलेगा।
- सभी content pages की metadata completeness और mobile rendering verify की जाएगी।
