---
description: Automatically split a wraparound cover to isolate the front cover while preserving the full image.
---

# Crop Cover

![Crop Cover](../../assets/single/crop.png){: .center-image }

Accessible from the <i class="bi fs-2 bi-three-dots-vertical text-dark"></i> menu on any comic card in the [File Manager](../file-management/index.md) or [Collection view](../collection/index.md).

Many digital releases feature a two-page wraparound spread as the first image in the archive (combining the back cover, spine, and front cover into a single wide image). This can cause readers and thumbnail generators to display the entire spread or the back cover instead of the front cover.

The **Crop Cover** tool automatically fixes this layout:

- **Isolates the front cover**: Crops the right-hand half of the lead image and sets it as the primary cover (`00a.jpg`).
- **Preserves the original spread**: The uncropped wraparound image is retained and repositioned as the second page (`00b.jpg`), ensuring no artwork is lost.

| Before (Full Wraparound Spread) | After (Isolated Front Cover) |
| :---: | :---: |
| ![Crop Before](https://github.com/allaboutduncan/comic-utils/raw/main/images/crop01.png) | ![Crop After](https://github.com/allaboutduncan/comic-utils/raw/main/images/crop02.png) |

For tri-fold covers or freeform cropping, use the interactive crop tools available in [Edit CBZ File](edit.md#crop-images).
