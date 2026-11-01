# Zenith Club — Member Experience

A complete, responsive redesign of the Zenith Club member/NFC experience. Designed for desktop and mobile, with a light clubhouse palette, a dark appearance, custom band imagery and an interactive Three.js product viewer.

This is a **standalone interactive demonstration**. The original marketing website and production membership application are unchanged.

## Explore

| Area | Implemented experience |
| --- | --- |
| Overview | Band colour selection, member pass, upcoming booking, illustrative progress and community games |
| Book | Search, sport filters, saved courts, day selection, duration, player count, member pricing, local reservations and cancellation |
| Tap | Onyx/Ivory imagery, a real interactive 3D band, a QR pass, member ID lookup and a clearly labelled simulated NFC connection |
| Play | Community/friends/my-games filters, joining and leaving demo games, and hosting a game |
| Me | Editable local profile, playstyle, privacy preferences, light/dark/system appearance, friends, teams, tournaments, receipts, results and drafts |
| Rankings | Sport selection and illustrative club standings |
| My bookings | Persistent local history, reservation details and calendar-export code |

All member, venue, price, availability, ranking and activity records in this project are demonstration data. The UI identifies the demo. Booking and social actions update browser storage; they do not call Zenith, reserve a real court, process a payment, send a message or modify a real member account.

## Run

No package installation is required. The application uses plain HTML, CSS and ES modules. Three.js, the QR generator, fonts and images are bundled locally.

```bash
npm run check
npm run build
python3 -m http.server 8080 --directory dist
```

Open `http://localhost:8080/`. Use an HTTP server rather than opening `index.html` directly because browsers restrict ES modules on `file://` URLs.

The root files are also directly deployable static files. Hash routes (`#home`, `#book`, `#tap`, `#play`, `#me`, `#rankings`, `#bookings`) and relative asset paths work under a GitHub Pages repository subdirectory without rewrite rules.

## Publish with GitHub Pages

The requested repository destination is a new repository under **calebdani23**, with suggested name **zenith-club-member-experience**. This source package does not itself imply that the remote repository or live site has been created.

1. Create the repository, upload this source and use `main` as the default branch.
2. Open **Settings → Pages → Build and deployment → Source → GitHub Actions**.
3. Push to `main` or run **Publish Zenith Club to GitHub Pages** in Actions.
4. The included `.github/workflows/pages.yml` checks the JavaScript, builds `dist/` and deploys it with GitHub's official Pages actions.

Alternatively, the root is directly publishable using **Deploy from a branch → main → / (root)**. The `.nojekyll` file avoids unnecessary Jekyll processing.

There are no API keys, environment variables or paid build services to configure for the demo.

## Technical decisions

- **Buildless core:** lightweight static application, with a zero-dependency packaging step.
- **Self-hosted assets:** no remote font or image requests needed to render the interface. Third-party libraries are pinned and included with their licences.
- **Real 3D:** `band3d.js` reconstructs a hollow fabric cuff, terry texture, embroidered monogram, lighting and touch/keyboard rotation. The renderer loads only when the viewer is opened. This is a stylised reconstruction from references, not a scanned manufacturing model.
- **Fallback:** if WebGL is unavailable, the generated product render stays visible and colour selection remains usable. Nonfunctional rotation controls are hidden.
- **Motion:** bounded visual transitions, reduced-motion support, optional automatic rotation, capped pixel ratio and offscreen rendering pause.
- **Accessibility:** semantic landmarks, accessible control names, focus states, native modal dialogs, keyboard operation, legible forms and mobile touch controls.
- **Club time:** booking dates, past-time validation and greetings use `Asia/Kolkata`, independent of the visitor's browser timezone.
- **Local state:** `zenith-member-demo-v1` stores the core demo. `zenith-demo-extras-v1` stores favourites, teams, tournament entries, results and drafts. The settings screen can reset both.
- **QR:** a real QR is generated locally and points to this demo's profile route. It contains no production membership credential. The export is an SVG, not an Apple Wallet pass.
- **NFC:** the interface demonstrates a connection flow. It does not access the camera, read/write NFC hardware or authenticate a member. Original `band` URL parameters are deliberately not treated as authentication.

## Validation completed

- JavaScript syntax checks for the app, state module and 3D component.
- Successful static build and browser rendering.
- Desktop and 390px mobile visual review, followed by responsive layout fixes.
- Browser flow: book a court, select a 90-minute session, calculate the discounted total, confirm, reload and cancel.
- Browser flow: join a community game, inspect My games and host a new sport-compatible game.
- Browser flow: edit a profile, open the QR pass, change appearance and find a demo member by ID.
- Domain checks: duplicate and overlapping reservations, adjacent sessions, invalid dates, past bookings, player limits, joining/leaving, persistence and unavailable local storage.
- Timezone checks covering an India/US date boundary, year rollover and leap day.

### Verification limits

The cloud preview browser disables WebGL. Its fallback path was observed, but the rendered 3D scene still needs a visual check on a WebGL-enabled browser. No alternate browser or security setting was used to bypass that restriction.

The QR was visible in the browser. The preview browser's download capture timed out when exercising the SVG export, so a completed browser download was not verified there. The export and calendar generation code are included; these should be checked in Safari/Chrome on the target device.

GitHub Pages publication must be verified by its actual deployment result and live URL. A prepared workflow or source archive is not evidence of publication.

## Source references and asset provenance

- Original member app: `https://zenith-club-nu.vercel.app/`. Its member route required sign-in in the review browser, so the supplied screenshots were used as the source for member functionality. No authenticated production state was changed.
- Public brand reference: `https://www.zenithclub.online/`.
- Instagram supplied by the user: `https://www.instagram.com/zenithclub.co/`. It is linked in the concierge; no claim of authenticated Instagram access is made.
- The Onyx and Ivory product images were generated with the built-in image generation tool from the supplied black terry wristband reference, preserving the ZC identity. The Ivory variant is a visual interpretation of the requested cream colourway.
- The padel court image is generated editorial imagery for a fictional demo venue.
- Tennis, pickleball and badminton images are original SVG court illustrations; they are not photos of real venues.
- Small Zenith monogram/icon assets come from the public reference site, for this requested redesign. Zenith's identity and product branding remain their owners' property.
- Cormorant Garamond and Inter: Google Fonts, SIL Open Font License; bundled under `assets/fonts/`.
- Three.js 0.180.0: MIT; licence in `vendor/THREE-LICENSE.txt`.
- qrcode-generator 1.4.4: MIT; licence in `vendor/QRCODE-LICENSE.txt`.

Design references: [Apple UI design tips](https://developer.apple.com/design/tips/), [motion](https://developer.apple.com/design/human-interface-guidelines/motion), [accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility). This is an independent web design, not an Apple-certified product.

## Connecting a production service later

Replace the local data boundary with authenticated APIs for profiles, dated events, court inventory, atomic reservation creation/cancellation, server-side pricing, payment intents, signed member credentials, social requests and confirmed match results. A static GitHub Pages site can host this frontend; it does not provide those backend services.

Never use a public NFC band identifier as proof of identity. Real membership access and QR credentials need server-side verification. Demo privacy switches do not constitute an access-control system.

Built-in demo games use relative dates to keep the showcase populated. Real event instances, including joined games, should use fixed dates.
