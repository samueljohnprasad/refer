// ponytail: remotion build configuration
import { Config } from "@remotion/cli/config";

// The hero art lives in the app's existing asset tree; point Remotion at it
// instead of duplicating 1.3MB of PNGs into a second public/ folder.
Config.setPublicDir("assets");
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.setVideoImageFormat("jpeg");
