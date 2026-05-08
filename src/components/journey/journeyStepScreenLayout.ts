interface JourneyStepScreenLayoutParams {
  availableHeight: number;
  windowWidth: number;
  imageAspectRatio: number;
}

export interface JourneyStepScreenLayoutMetrics {
  isCompactScreen: boolean;
  imageWidth: number;
  imageHeight: number;
  copyMaxWidth: number;
}

const COMPACT_HEIGHT_THRESHOLD = 720;
const COMPACT_WIDTH_THRESHOLD = 390;
const HORIZONTAL_CONTENT_PADDING = 48;
const COMPACT_COPY_HEIGHT = 184;
const REGULAR_COPY_HEIGHT = 210;
const COMPACT_VERTICAL_PADDING = 32;
const REGULAR_VERTICAL_PADDING = 48;
const COMPACT_WIDTH_RATIO = 0.76;
const REGULAR_WIDTH_RATIO = 0.82;
const COMPACT_MAX_IMAGE_WIDTH = 310;
const REGULAR_MAX_IMAGE_WIDTH = 340;
const COMPACT_HEIGHT_RATIO = 0.42;
const REGULAR_HEIGHT_RATIO = 0.47;
const MIN_IMAGE_HEIGHT = 280;
const MAX_IMAGE_HEIGHT = 520;
const MAX_COPY_WIDTH = 320;

export const getJourneyStepScreenLayout = ({
  availableHeight,
  windowWidth,
  imageAspectRatio,
}: JourneyStepScreenLayoutParams): JourneyStepScreenLayoutMetrics => {
  const isCompactScreen =
    availableHeight < COMPACT_HEIGHT_THRESHOLD ||
    windowWidth < COMPACT_WIDTH_THRESHOLD;

  const contentWidth = windowWidth - HORIZONTAL_CONTENT_PADDING;
  const reservedCopyHeight = isCompactScreen
    ? COMPACT_COPY_HEIGHT
    : REGULAR_COPY_HEIGHT;
  const reservedVerticalPadding = isCompactScreen
    ? COMPACT_VERTICAL_PADDING
    : REGULAR_VERTICAL_PADDING;
  const maxArtworkHeight = Math.min(
    availableHeight - reservedCopyHeight - reservedVerticalPadding,
    availableHeight * (isCompactScreen ? COMPACT_HEIGHT_RATIO : REGULAR_HEIGHT_RATIO),
    MAX_IMAGE_HEIGHT,
  );
  const targetArtworkWidth = Math.min(
    contentWidth * (isCompactScreen ? COMPACT_WIDTH_RATIO : REGULAR_WIDTH_RATIO),
    isCompactScreen ? COMPACT_MAX_IMAGE_WIDTH : REGULAR_MAX_IMAGE_WIDTH,
  );
  const targetArtworkHeight = targetArtworkWidth / imageAspectRatio;
  const imageHeight = Math.max(
    Math.min(targetArtworkHeight, maxArtworkHeight),
    MIN_IMAGE_HEIGHT,
  );

  return {
    isCompactScreen,
    imageHeight,
    imageWidth: imageHeight * imageAspectRatio,
    copyMaxWidth: Math.min(contentWidth, MAX_COPY_WIDTH),
  };
};
