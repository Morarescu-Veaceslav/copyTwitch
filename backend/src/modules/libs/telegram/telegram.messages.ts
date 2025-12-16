import type { SponsorshipPlan, User } from "@prisma/generated";
import type { SessionMetadata } from "src/shared/types/session-metadata.types";

export const MESSAGES = {
    welcome:
        `<b>👋 Bine ai venit pe Twitch-Test Bot!</b>\n\n` +
        `Pentru a primi <b>notificări în timp real</b> și o <b>experiență mai bună</b> pe platformă, ` +
        `hai să conectăm contul tău de <b>Telegram</b> cu <b>TwitchTest</b>.\n\n` +
        `Apasă pe butonul de mai jos pentru a te adăuga în lista de <b>notificări</b> ` +
        `și a finaliza conectarea.`,

    authSuccess:
        `✅ <b>Autentificare reușită!</b>\n\n` +
        `Contul tău de <b>Telegram</b> a fost conectat cu succes la <b>TwitchTest</b>.\n` +
        `De acum vei primi notificări direct aici, atunci când streamerii tăi preferați sunt live! 🔔`,

    invalidToken:
        `❌ <b>Token invalid sau expirat.</b>\n\n` +
        `Te rugăm să revii pe platformă și să generezi un nou link de conectare.`,
    profile: (user: User, followersCount: number) => {
        return `<b>👤 Profil utilizator</b>
          ────────────────────────────
          📧 <b>Email:</b> ${user.email}
          🪪 <b>Username:</b> ${user.username}
          📅 <b>Cont creat la:</b> ${new Date(user.createdAt).toLocaleDateString('ro-RO')}
          👥 <b>Abonați:</b> ${followersCount}
          💬 <b>Despre:</b> ${user.bio ? user.bio : 'Nu sunt date disponibile.'}
          👉 Apăsați butonul de mai jos pentru a accesa setările profilului.`;
    },
    follows: (user: User) => {
        return `📺 <b>${user.displayName || user.username}</b> (@${user.username})`;
    },

    resetPassword: (token: string, metadata: SessionMetadata) => {
        return `🔒 <b>Resetare parolă</b>\n\n` +
            `Ai solicitat resetarea parolei pentru contul tău de pe <b>TwitchTest</b>.\n\n` +
            `👉 <b>Apasă pe linkul de mai jos pentru a-ți reseta parola:</b>\n` +
            `<a href="https://twitchtest.app/dashboard/settings/${token}">Reset Password</a>\n\n` +
            `🕒 <b>Data cererii:</b> ${new Date().toLocaleString('ro-RO', { dateStyle: 'medium', timeStyle: 'short', })}\n\n` +
            `🌍 <b>Informații despre cerere: </b>\n` +
            `• Țară: ${metadata.location.country || 'Necunoscut'}\n` +
            `• Oraș: ${metadata.location.city || 'Necunoscut'}\n` +
            `• Dispozitiv: ${metadata.device.os || 'Necunoscut'}\n` +
            `• Browser: ${metadata.device.browser || 'Necunoscut'}\n` +
            `• IP: ${metadata.ip || 'Necunoscut'}\n\n` +
            `⚠️ <i>Dacă nu ai solicitat tu această resetare, îți recomandăm să schimbi imediat parola și să verifici securitatea contului tău.</i>`
    },

    deactivate: (token: string, metadata: SessionMetadata) => {
        return (
            `⚠️ <b>Cerere de dezactivare cont</b>\n\n` +
            `Ai inițiat o cerere de <b>dezactivare a contului</b> de pe platforma <b>TwitchTest</b>.\n\n` +
            `👉 <b>Apasă pe linkul de mai jos pentru a confirma dezactivarea:</b>\n` +
            `<b>Codul de confirmare${token}</b>\n\n` +
            `🕒 <b>Data cererii:</b> ${new Date().toLocaleString('ro-RO', { dateStyle: 'medium', timeStyle: 'short', })}\n\n` +
            `🌍 <b>Detalii despre cerere:</b>\n` +
            `• Țară: ${metadata.location.country || 'Necunoscut'}\n` +
            `• Oraș: ${metadata.location.city || 'Necunoscut'}\n` +
            `• Dispozitiv: ${metadata.device.os || 'Necunoscut'}\n` +
            `• Browser: ${metadata.device.browser || 'Necunoscut'}\n` +
            `• IP: ${metadata.ip || 'Necunoscut'}\n\n` +
            `📅 <b>Important:</b> Contul tău va rămâne <b>dezactivat timp de 7 zile</b>. În acest interval îl poți reactiva prin simpla conectare pe platformă.\n\n` +
            `❗ După cele 7 zile, contul va fi <b>șters definitiv</b> împreună cu toate datele asociate.\n\n` +
            `🛡️ <i>Dacă nu ai solicitat această acțiune, ignoră mesajul și schimbă parola imediat pentru a proteja contul tău.</i>`
        );
    },

    accountDeleted:
        `🗑️ <b>Cont șters definitiv</b>\n\n` +
        `Contul tău de pe platforma <b>TwitchTest</b> a fost <b>șters definitiv.</b>\n\n` +
        `Toate datele tale personale, inclusiv istoricul, abonamentele și preferințele, au fost eliminate în conformitate cu politica noastră de confidențialitate.\n\n`,

    streamStart: (channel: User) => {
        return `📺 <b>${channel.displayName || channel.username}</b> a început un stream!\n\n` +
            `➡️ Apasă pe linkul de mai jos pentru a viziona live:\n` +
            `<a href="https://twitchtest.app/${channel.username}">Intră pe stream</a>\n\n` +
            `🔔 Nu rata ocazia să urmărești contentul preferat!`;
    },

    newFollowing: (follower: User, followerCount: number) => {
        return `👤 Ai un nou abonat!\n\n` +
            `📌 <b>${follower.displayName || follower.username}</b> te urmărește acum.\n` +
            `👥 Total abonați: <b>${followerCount}</b>\n\n` +
            `💡 Continuă să creezi conținut grozav pentru a-ți crește comunitatea!`;
    },

    newSponsorship: (plan: SponsorshipPlan, sponsor: User) => `
    🎉 <b>Felicitări!</b> Ați primit un nou sponsor!  
    
    📦 <b>Plan:</b> ${plan.title}  
    💰 <b>Suma:</b> ${plan.price} USD  
    👤 <b>Sponsor:</b> <a href="https://twitchtest.app/${sponsor.username}">${sponsor.displayName}</a>  
    📅 <b>Data sponsorizării:</b> ${new Date().toLocaleString('ro-RO', { dateStyle: 'medium', timeStyle: 'short' })}
    
    🙏 Vă mulțumim pentru implicarea și conținutul pe care îl aduceți comunității! 💜`,

    enableTwoFactor:
        `<b>🔒 Îți poți proteja contul!</b>\n\n` +
        `Activează autentificarea în doi pași pentru o securitate sporită a contului tău.\n\n` +
        `👉 Accesează setările contului tău de aici: <a href='http://twitchtest.app/dashboard/settings'>Account Settings</a>\n\n` +
        `Recomandăm activarea acestei opțiuni pentru a-ți proteja contul împotriva accesului neautorizat.`,

    verifyChannel:
        `<b>✅ Felicitări! Canalul tău a fost verificat.</b>\n\n` +
        `Suntem bucuroși să te anunțăm că ai primit insigna oficială de canal verificat.\n\n` +
        `🔹 Această insignă îți oferă mai multă credibilitate în fața urmăritorilor și confirmă autenticitatea canalului tău.\n\n` +
        `Îți mulțumim că faci parte din comunitatea noastră și că ne ajuți să construim o platformă sigură și de încredere! 💜`

}
