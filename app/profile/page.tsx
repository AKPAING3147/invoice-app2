"use client";
import React from 'react';
import { ProfileSection } from './Section';

import { AuthGuard } from '@/components/AuthGuard';

export default function Page() {
    return (
        <AuthGuard>
            <ProfileSection />
        </AuthGuard>
    );
}
