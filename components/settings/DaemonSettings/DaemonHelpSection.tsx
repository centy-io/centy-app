import { DaemonHelpConnectionSection } from './DaemonHelpConnectionSection'
import { DaemonHelpManagementSection } from './DaemonHelpManagementSection'

export function DaemonHelpSection() {
  return (
    <div className="daemon-help">
      <DaemonHelpConnectionSection />
      <DaemonHelpManagementSection />
    </div>
  )
}
