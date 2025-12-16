import { LogoImage } from "@/components/images/LogoImage";
import { Button } from "@/components/ui/common/Button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/common/Card";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";


interface AuthWrapperProps {
    heading: string
    backButtonLabel?: string
    backButtonHref?: string
    homeButtonLabel?: string
    homeButtonHref?: string
}

export function AuthWrapper({ children, heading, backButtonLabel, backButtonHref, homeButtonLabel, homeButtonHref }: PropsWithChildren<AuthWrapperProps>) {
    return <div className="flex h-full items-center justify-center">
        <Card className="w-[450px]">
            <CardHeader className="flex items-center justify-center gap-x-4">
                <LogoImage />
                <CardTitle>{heading}</CardTitle>
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter className="-mt-2 flex flex-col">
                {backButtonLabel && backButtonHref && (
                    <Button variant="link" className="w-full">
                        <Link href={backButtonHref}>{backButtonLabel}</Link>
                    </Button>
                )}

                {homeButtonLabel && homeButtonHref && (
                    <Button variant="link" className="w-full">
                        <Link href={homeButtonHref}>{homeButtonLabel}</Link>
                    </Button>
                )}
            </CardFooter>

        </Card>
    </div>
}