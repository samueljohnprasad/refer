# Useful Commands Reference

This document contains a quick reference for commonly used CLI commands in this project.

## Local Development
- **Run iOS simulator:** `npm run ios`
- **Run Android emulator:** `npm run android`
- **Start Expo bundler:** `npm start`

## Supabase & Backend
- **Generate Supabase TypeScript types:** `npm run types`
- **Deploy Daily AI edge function:** `npx supabase functions deploy generate-daily-ai`
- **Deploy Weekly AI edge function:** `npx supabase functions deploy generate-weekly-ai`
- **Deploy Monthly AI edge function:** `npx supabase functions deploy generate-monthly-ai`

## EAS Builds (Native Binaries)
- **iOS Development Build:** `npx eas-cli build --profile development --platform ios`
- **Android Development Build:** `npx eas-cli build --profile development --platform android`
- **iOS Preview (Staging) Build:** `npx eas-cli build --profile preview --platform ios`
- **Android Preview (Staging) Build:** `npx eas-cli build --profile preview --platform android`
- **iOS Production Build:** `npx eas-cli build --profile production --platform ios`
- **Android Production Build:** `npx eas-cli build --profile production --platform android`

## EAS OTA Updates (Over-The-Air)
- **Publish to Development:** `npx eas-cli update --branch development --message "dev test update"`
- **Publish to Preview (Staging/TestFlight):** `npx eas-cli update --branch preview --message "staging release candidate"`
- **Publish to Production (Live Users):** `npx eas-cli update --branch production --message "hotfix description"`

## AI Agent Helpers
- **Update Graphify Knowledge Graph:** `graphify update .` (Run this after making code changes)


codex --yolo
