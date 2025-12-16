

const CLOUDINARY_AVATAR_URL =
    'https://res.cloudinary.com/dl8sgz5gl/image/upload/';
export function getMediaSource(src?: string | null) {
    if (!src) return undefined;

    if (src.startsWith('data:image') || src.startsWith('blob:')) {
        return src;
    }

    // URL complet
    if (src.startsWith('http')) {
        return src;
    }

    return `${CLOUDINARY_AVATAR_URL}${src}.webp`;
}
