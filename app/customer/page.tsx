"use client";
import React from 'react';
import { CustomerSection } from './Section';

import { AuthGuard } from '@/components/AuthGuard';

export default function Page() {
    return (
        <AuthGuard>
            <CustomerSection />
        </AuthGuard>
    );
}
