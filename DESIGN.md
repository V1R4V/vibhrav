# Cinematic portfolio design system

Kind: technical personal portfolio. Primary action: explore engineering work.
The palette and sculptural art direction come from the user's approved brief;
they take precedence over randomized palette/layout selection in Taste Skill.

## Material and type

| Token | Value | Purpose |
| --- | --- | --- |
| Obsidian | `#0c0b0c` | Main ground |
| Oxblood | `#48151e` | Architectural light and later leadership stage |
| Antique gold | `#c6a56c` | Sculpture, controls and fine details |
| Warm ivory | `#f2eadc` | Primary type |
| Muted ivory | `#b8afa3` | Supporting copy |

Use upright Space Grotesk for the name, main headings, navigation and body.
Reserve Newsreader for the contact close and JetBrains Mono for technical stack
details. The user rejected the earlier serif name treatment and its alignment.
No name skew, italic or angled rest pose is permitted. The name remains live
accessible text, with each letter rising through its own mask on arrival. Use an
8px spacing rhythm, equal content edges, 4px control corners, and restrained
hairlines. Prefer open compositions over nested cards.

The approved November 19 redesign replaces the split hero with a single full-bleed
stage. Upright uppercase VIBHRAV spans the available width, with Jha aligned below.
Four related open ribbon forms frame the lettering at different depths. Their
antique-gold and oxblood materials use soft studio reflections; leave clear space
for all text and controls. Mobile uses a dedicated object arrangement rather than
shrinking the desktop scene. No name skew or italic treatment.

The latest approved reading order is Hero → Experience → Projects → Leadership
and recognition → About → Contact and the interactive footer. The hero has one
visual name composition, one aligned role/statement block and an experience CTA.
Motion controls belong to the navigation, never a floating content overlay.

Experience stays on obsidian. A luminous gold/oxblood orb carries dimensional
company lettering while eight roles move through readable HTML panels alongside
it. Native scrolling selects the active role; direct links and previous/next
navigation allow shortcuts. Company lettering is a stylized wordmark, not a
fabricated logo asset. Mobile, short viewports and reduced motion use natural flow.

Projects open on a monumental three-line title with letter reveals. Six flagship
panels use real assets or clearly explanatory architecture diagrams on 3D display
planes, with 24px sticky offsets on sufficiently large screens. Hover/focus restores
image colour; mobile/reduced motion remain unpinned. The full catalogue has 33
approved entries, category/search/group controls and URL history. Each project is
listed once even when it belongs to several categories. Private repository links
are omitted. Twenty-five local roots support this inventory; those counts differ.

Leadership keeps its substantial oxblood stage: RecWell preparation and program
improvements, venture relationships and diligence, entrepreneurship and earlier
sports leadership. Academic recognition closes that chapter. Only the approved
public copy is rendered; raw verification stays outside the repository. Project
detail pages share upright type, image staging and an ivory technical narrative.
The footer uses an original flowing ink shader with pointer response and ordinary
keyboard-accessible links. No autoplay audio or custom replacement cursor.

## Motion storyboard

| Beat | Motion and purpose | Fallback |
| --- | --- | --- |
| First session arrival | Readiness counter 0–100; black curtain lifts, followed 150ms later by oxblood | Skip button, Escape, four-second asset timeout; bypass on reduced motion and direct chapter links |
| Name arrival | Upright letters rise through masks with 65ms stagger | Static readable server text without JavaScript or under reduced motion |
| Hero departure | Letter wrappers travel at different speeds as the next stage arrives | Native scrolling and stationary type when motion is disabled |
| Sculptural environment | Four softly turning forms, subtle pointer camera and scroll depth | Matching static vector geometry; no WebGL required |
| Selected work | Letter-by-letter scroll reveal; project panels stack at 24px offsets | Unpinned complete list on mobile, short viewports and reduced motion |
| Experience | Native-scroll role panels with a sticky luminous orb and company lettering | Complete HTML roles, direct links, static orb and natural flow |
| Project details | Transform/opacity heading arrival and restrained image depth | Complete semantic document and verified images/diagrams |
| Contact and footer | Accessible form feedback; flowing gold/oxblood ink responds to pointer movement | Direct email and static pigment fallback |

Use lazy native Three.js for hero, orb and ink scenes and scoped GSAP contexts for authored
scroll motion. Keep native scrolling, clean up effects on navigation, cap pixel
ratio, suspend hidden/offscreen rendering and dispose resources. The visible pause
control stops all live scenes and scroll choreography. Scenes suspend offscreen so
only the visible environment animates. The curtain plays once per
session; it must never block access after an asset failure. No autoplay audio.
The user's cinematic full-width typography and large stage transitions are explicit
exceptions to general-purpose skills' small UI animation and display-size recipes.
Performance statements require actual browser measurements and their limitations.

## Hero review gate

Test 1440×900, 1366×768, 1024×768, 820×1180, 768×1024, 390×844,
and 320×640. Check screenshots, fold, contrast, keyboard, pause/resume,
reduced motion, no-JavaScript readability, WebGL failure, console errors and
resource cleanup. Capture performance locally and label it as local browser
evidence, not field Core Web Vitals. The latest user instruction authorizes full V1 before review; the former
hero-only approval gate is removed.
