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

## EAS (Expo Application Services)
- **Create iOS Development Build:** `eas build --profile development --platform ios`
- **Create Android Development Build:** `eas build --profile development --platform android`
- **Publish Preview Update (OTA):** `eas update --branch preview --message "Your update message"`
- **Publish Production Update (OTA):** `eas update --branch production --message "Your update message"`

## AI Agent Helpers
- **Update Graphify Knowledge Graph:** `graphify update .` (Run this after making large code changes)
