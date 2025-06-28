#!/bin/bash

# Create fonts directory if it doesn't exist
mkdir -p assets/fonts

# Download Inter font files directly
echo "Downloading Inter font files..."

# Download Inter Regular
curl -L https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Regular.otf -o assets/fonts/Inter-Regular.otf

# Download Inter Medium
curl -L https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Medium.otf -o assets/fonts/Inter-Medium.otf

# Download Inter Bold
curl -L https://github.com/rsms/inter/raw/master/docs/font-files/Inter-Bold.otf -o assets/fonts/Inter-Bold.otf

echo "Inter fonts downloaded successfully!" 