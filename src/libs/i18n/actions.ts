"use server";

import { cookies } from "next/headers";
import { COOKIE_NAME, type Language } from "./config";

export async function setLanguageAction(language: Language) {
    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, language);
}
