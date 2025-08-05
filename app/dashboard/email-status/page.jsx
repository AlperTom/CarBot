import EmailStatusDashboard from '../../../components/EmailStatusDashboard'

export default function EmailStatusPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <EmailStatusDashboard />
    </div>
  )
}

export const metadata = {
  title: 'Email System Status - CarBot Dashboard',
  description: 'Monitor and test the CarBot email system for German automotive workshops'
}