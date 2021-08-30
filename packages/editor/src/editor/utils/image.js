const IMAGE_CACHE = {};

export function resolveImg(src) {
  return new Promise((resolve, reject) => {
    const result = {
      complete: true,
      width: 0,
      height: 0,
      src,
    };

    if (!src) {
      reject(result);
      return;
    }

    if (IMAGE_CACHE[src]) {
      resolve({ ...IMAGE_CACHE[src] });
      return;
    }

    const img = new Image();

    img.onload = () => {
      result.width = img.width;
      result.height = img.height;
      result.complete = true;

      IMAGE_CACHE[src] = { ...result };
      resolve(result);
    };

    img.onerror = () => {
      reject(result);
    };

    img.src = src;
  });
}

// export const IMAGE_DISPLAY = {
//   INLINE_BLOCK: "inline-block",
//   // INLINE = 'inline',
//   // BREAK_TEXT = 'block',
//   // FLOAT_LEFT = 'left',
//   // FLOAT_RIGHT = 'right',
// };

export const RESIZE_DIRECTION = {
  TOP_LEFT: "tl",
  TOP_RIGHT: "tr",
  BOTTOM_LEFT: "bl",
  BOTTOM_RIGHT: "br",
};
