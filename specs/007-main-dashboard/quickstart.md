# Quickstart: Main Dashboard

## Overview

This feature provides the main dashboard for a band, displaying aggregated metrics, upcoming events, and recent setlists.

## Setup

No new dependencies are required. The dashboard utilizes the existing Django Rest Framework on the backend and Angular with TailwindCSS on the frontend.

## Key Files

- **Backend Endpoint**: `/api/bands/<id>/dashboard/` (Returns `contracts/dashboard_metrics.json`)
- **Frontend Dashboard**: `sonic-stage-web/src/app/features/dashboard/dashboard.component.ts`
- **Global State**: `sonic-stage-web/src/app/core/stores/band.store.ts`

## Getting Started for Implementation

1. Implement the `BandStore` signal store in the frontend to manage `active_band_id`.
2. Implement the Django DRF view `DashboardMetricsView` inside `core/views.py`.
3. Create the `DashboardComponent` and its child widgets (MetricsCard, EventBanner, SetlistRow) matching the Tailwind mockup.
4. Hook the UI components up to the `BandStore` to automatically reload metrics when the band context changes.
