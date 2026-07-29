export const PHOTO_UPLOAD_CONSTANTS = {
  MAX_STAGED_PHOTOS: 10,
  MAX_FILE_SIZE_BYTES: 15 * 1024 * 1024,
  ACCEPTED_MIME_TYPES: "image/*",
} as const;

export const PHOTO_UPLOAD_MESSAGES = {
  TOO_MANY_PHOTOS: `You can stage up to ${PHOTO_UPLOAD_CONSTANTS.MAX_STAGED_PHOTOS} photos at a time.`,
  FILE_TOO_LARGE: "One or more photos are too large (max 15MB).",
  NO_PHOTOS_YET: "No photos added yet.",
} as const;
