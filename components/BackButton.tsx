"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

type Props = {
	children: ReactNode;
	className?: string;
};

export function BackButton({ children, className }: Props) {
	const router = useRouter();

	return (
		<button
			type="button"
			onClick={() => router.back()}
			className={`group inline-flex items-center gap-1 ${className}`}
		>
			<ChevronLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" />
			<span>{children}</span>
		</button>
	);
}
