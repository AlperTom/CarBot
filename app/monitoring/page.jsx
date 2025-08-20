/**
 * Production Monitoring Page
 * Internal monitoring dashboard for system health
 */

import MonitoringDashboard from '../../components/MonitoringDashboard'

export const metadata = {
  title: 'Production Monitoring - CarBot',
  description: 'Real-time system health and performance monitoring',
  robots: 'noindex, nofollow' // Don't index monitoring pages
}

export default function MonitoringPage() {
  return <MonitoringDashboard />
}