"use client";
import React from 'react';
import { VoucherSection } from './Section';

import { AuthGuard } from '@/components/AuthGuard';

export default function Page() {
    return (
        <AuthGuard>
            <VoucherSection />
        </AuthGuard>
    );
}
