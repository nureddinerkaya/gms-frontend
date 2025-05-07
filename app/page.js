"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/home"); // Root URL'den /home'a yönlendir
  }, [router]);

  return null; // Sayfa içeriği gösterilmeyecek
}
