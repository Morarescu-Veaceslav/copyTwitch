import { PropsWithChildren } from "react";
import { CardContainer } from "./CardContainer";
import { Switch } from "../common/Switch";
import { Skeleton } from "../common/Skeleton";

interface ToggleCardProp {
    heading: string
    description: string
    isDisabled?: boolean
    value: boolean
    onChange: (value: boolean) => void
}

export function ToggleCard({
    children,
    description,
    heading,
    isDisabled,
    value,
    onChange
}: PropsWithChildren<ToggleCardProp>) {
    return <CardContainer heading={heading} description={description} rightContent={
        <Switch checked={value} onCheckedChange={onChange} disabled={isDisabled} />
    }
    />
}


export function ToggleCardSkeleton() {
    return (
        <Skeleton className='mt-6 h-20 w-full' />
    )
}