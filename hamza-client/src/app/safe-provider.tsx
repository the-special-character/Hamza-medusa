"use client"
import { useState, useEffect } from "react"

export function SafeWrapper({ children }: { children: React.ReactNode }) {
    console.log("status", status);
    return (
        <div>
            {children}
        </div>
    )
}