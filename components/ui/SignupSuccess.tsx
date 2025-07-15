"use client"

import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function SignupSuccess() {
  return (
    <CardContent>
      <div className="p-4 bg-green-100 text-green-800 rounded-lg text-center">
        ✅ Verifique seu e-mail para confirmar sua conta antes de fazer login.
      </div>

      <div className="mt-6 text-center">
        <Link href="/login">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Ir para Login
          </Button>
        </Link>
      </div>
    </CardContent>
  )
}
