'use client';

/**
 * Backward-compatible i18n client entrypoint.
 * The app now uses components/I18nProvider as the canonical implementation.
 * This shim prevents stale imports from breaking production builds.
 */
export { useI18n } from '@/components/I18nProvider';
export type { Locale } from '@/components/I18nProvider';
