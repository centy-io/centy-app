import { ProjectDashboard } from '@/components/project/ProjectDashboard'

export async function generateStaticParams() {
  return [{ organization: '_placeholder', project: '_placeholder' }]
}

export default function ProjectPage() {
  return <ProjectDashboard />
}
