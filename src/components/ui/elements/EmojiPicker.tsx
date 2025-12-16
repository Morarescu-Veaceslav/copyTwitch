import { Smile } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "../common/Popover"
import { useTranslations } from "next-intl"
import Picker, { EmojiStyle, Theme, type EmojiClickData } from 'emoji-picker-react'
import { useTheme } from "next-themes"

interface EmojiPickerProps {
    onChange: (value: string) => void
    isDisabled: boolean
}

export function EmojiPicker({ onChange, isDisabled }: EmojiPickerProps) {

    const translation = useTranslations('stream.chat.sendMessage')
    const { theme } = useTheme()

    return <Popover>
        <PopoverTrigger className='disabled:cursor-not-allowed'
            disabled={isDisabled}
        >
            <Smile className='size-[22px]' />
        </PopoverTrigger>
        <PopoverContent
            side='top' className='mb-4 mr-28 p-0'>
            <Picker onEmojiClick={(emoji: EmojiClickData) => onChange(emoji.emoji)}
                emojiStyle={EmojiStyle.APPLE}
                searchPlaceHolder={translation('emojiPlaceholder')}
                theme={theme === 'dark' ? Theme.DARK : Theme.LIGHT}
            />
        </PopoverContent>
    </Popover>
}