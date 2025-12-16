import { Link } from "lucide-react";
import { FaDiscord, FaFacebook, FaGithub, FaTelegram, FaTiktok, FaTwitter, FaYoutube } from "react-icons/fa";


export function getSocialIcon(url: string) {
    switch (true) {
        case url.includes('t.me'):
            return FaTelegram
        case url.includes('youtube.com') || url.includes('youtu.be'):
            return FaYoutube
        case url.includes('twitter.com') || url.includes('x.com'):
            return FaTwitter
        case url.includes('discord.com') || url.includes('discord.gg'):
            return FaDiscord
        case url.includes('tiktok.com'):
            return FaTiktok
        case url.includes('github.com'):
            return FaGithub
        case url.includes('facebook.com') || url.includes('f.com'):
            return FaFacebook
        default:
            return Link

    }
}