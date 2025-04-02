"use client";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function Callout() {
  const { t } = useTranslation();
  return (
    <Link
      href="https://recollageboxd.vercel.app"
      className="w-fit absolute ~right-20/32 ~top-4/7 animate-pulse group inline-flex items-center gap-1"
    >
      <span className="group-hover:underline ~text-sm/base">
        {t("checkout")}
      </span>
      <ArrowUpRight className="group-hover:translate-x-1 transition group-hover:-translate-y-1" />
    </Link>
  );
}
