#!/bin/bash

# Create fonts directory if it doesn't exist
mkdir -p assets/fonts

# Download Inter font family
echo "Downloading Inter font family..."
curl -L https://github.com/rsms/inter/releases/download/v4.0/Inter-4.0.zip -o inter.zip
unzip -j inter.zip "Inter Desktop/Inter-Regular.otf" "Inter Desktop/Inter-Medium.otf" "Inter Desktop/Inter-Bold.otf" -d assets/fonts/
rm inter.zip

# Download SF Pro Display
echo "Downloading SF Pro Display..."
curl -L https://devimages-cdn.apple.com/design/resources/download/SF-Pro.dmg -o sf-pro.dmg
# Note: SF Pro needs to be manually installed due to licensing

# Download JetBrains Mono
echo "Downloading JetBrains Mono..."
curl -L https://github.com/JetBrains/JetBrainsMono/releases/download/v2.304/JetBrainsMono-2.304.zip -o jetbrains-mono.zip
unzip -j jetbrains-mono.zip "fonts/ttf/JetBrainsMono-Regular.ttf" -d assets/fonts/
rm jetbrains-mono.zip

echo "Font setup complete!" 