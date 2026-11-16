# Homepage design review

Screenshots captured while restyling the landing page to the Cheapoair design
language — brand blue `#0450A0`, action orange `#EB4405`, 8px card radii.

| File | Shows |
| --- | --- |
| `search-widget-blur-fix.png` | Before/after: the page scrim was painting above the search card, washing it out to 186/255 and blurring the open date picker. Now 255/255 and sharp. |
| `home-top-after-removal.png` | Top of the page after removing the duplicated accreditation and airline strips (both still exist further down the page). |
| `homepage-cheapoair-restyle.png` | Before/after of the full homepage restyle. |
| `date-picker-cheapoair-theme.png` | Default vs Cheapoair-themed date picker: blue selection circles, light-blue range band, orange Done. |

The theme is opt-in: `SearchWidget` accepts `theme="cheapoair"` and forwards it to
the date, location and occupancy pickers, so only the homepage is affected.
