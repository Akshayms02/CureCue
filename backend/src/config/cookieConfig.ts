
export const cookieSettings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
};

export const docCookieSettings = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000,
}

export const adminCookieSettings = {
    httpOnly: true,
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "strict" as const,
}