// src/lib/branding.ts

export const BRAND_CONFIG = {
    // 1. Core Identity
    name: process.env.NEXT_PUBLIC_INSTITUTE_NAME || "NexGen OS",
    shortName: process.env.NEXT_PUBLIC_INSTITUTE_SHORT_NAME || "NexGen",
    description: process.env.NEXT_PUBLIC_DESCRIPTION || "Advanced Academic Management System",

    // 2. Visual Identity
    logoUrl: process.env.NEXT_PUBLIC_LOGO_URL || "/logo.png",
    faviconUrl: process.env.NEXT_PUBLIC_FAVICON_URL || "/favicon.ico",

    // 3. System Branding
    parentCompany: "NexGen Operating Systems India",
    linkEncrypted: true,
    version: "v1.0.4-PROD" // <--- ADD THIS LINE TO FIX THE ERROR
};