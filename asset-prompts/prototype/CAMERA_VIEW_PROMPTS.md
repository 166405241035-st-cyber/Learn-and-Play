# External image prompts: four camera views

Revision 0.2, 9 October 2026. Extends [base prompts](PROTOTYPE_PROMPTS.md) and [production specification](../../docs/art-audio/PROTOTYPE_PRODUCTION.md). No images generated in this revision. Runtime still uses geometry.

Use the same approved style reference, palette, canvas and anchor as the base spec. Generate one PNG per view/layer/frame, never a sheet or combined scene unless cutting is explicitly planned. Transparent background; no baked text, logos, prices, ground/contact shadows. View remains 2:1 isometric; keep upright vertical edges.

## Buildings and asymmetric fixed objects

Filename convention: append `-view-0`, `-view-1`, `-view-2`, `-view-3` before `.png` to the corresponding base filename, including separate body/roof layers. View is camera orientation, not physical object rotation. Keep original prompt/asset IDs; log prompt version 0.2 and source reference.

Append to the base prompt for each individual building/object:

> Create camera view {VIEW} of the SAME object in the reference, not a new design. Orthographic 2:1 isometric projection with upright vertical edges. Camera view 0 is the baseline. For each other view use the physical-to-screen direction table below; do not simply rotate the flattened PNG. Keep the object's physical front, door, windows, footprint dimensions, colors, proportions and identity unchanged. Show the appropriate sides of the same object. Keep light from screen upper-left for this stylized prototype. Use the exact requested canvas and align the bottom contact corner to the specified pixel anchor. Transparent background, one isolated object, no lettering or contact shadow.

The runtime rotation convention is defined by the projection, not by an ambiguous camera-orbit label:

| View | Physical front S points toward | Physical E points toward |
| --- | --- | --- |
| 0 | screen SW | screen SE |
| 1 | screen NW | screen SW |
| 2 | screen NE | screen NW |
| 3 | screen SE | screen NE |

A door on the far side may be hidden; do not move the door to a different physical wall to make it visible.

For roofs, include the approved body reference and request the matching roof layer, identical view/canvas/anchor; do not include the body pixels in the roof PNG. Do not mirror signs with baked writing; lettering remains code.

For view 0 only, the baseline contact corner corresponds to logical (x+w,y+h). For other views, runtime selects the front-most projected footprint corner. Test every view against the same logical base and interaction cell before approval.

## Characters

Existing screen-direction NE/SE/SW/NW filenames remain. Generate the original four standing and two walking frames per direction. The runtime will map world movement + camera view to these frames. Do not make another 4× multiplier of character images. Canvas 160×192, foot anchor (80,176), no geometry drift.

## Furniture

Existing logical N/E/S/W artwork is reused as view-relative artwork: a physically south-facing item uses S/W/N/E for camera 0/1/2/3. Do not change its actual footprint or front-access rule to match a filename. Confirm base dimensions after rotating the view; use consistent anchors, no flip of text.

## Review before bulk generation

- Start with the original 5 samples; then one building in view 0/1 as a pair to check camera orientation and anchor.
- Verify same doors/windows and structural identity, upright proportions, transparent pixels, canvas, contact anchor, body/roof alignment and direction.
- Proposed upper bound for this set is 119 unique PNGs under the assumptions in [change-impact design](../../docs/ui/GAME_UI_REVISION.md); not all symmetry decisions are approved yet.
- No PNG loader or actual approved images exist from this task. Final filenames/manifest are integrated only after files and source/use terms are provided.
