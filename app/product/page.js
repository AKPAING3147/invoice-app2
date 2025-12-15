"use client"
import React from 'react'
import InventorySection, { Inventory } from '../inventory/Section'


import { AuthGuard } from '@/components/AuthGuard';

export default function Page() {
  return (
    <AuthGuard>
      <Inventory />
    </AuthGuard>
  )
}
