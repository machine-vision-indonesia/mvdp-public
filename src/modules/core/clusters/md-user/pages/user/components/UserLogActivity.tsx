import { MvTypography } from '@/components/atoms/mv-typography'
import { Historical } from '@/components/molecules'
import { SectionGroup } from '@/components/molecules/section-group'
import { UserLogActivityProps } from '../types/ManageUserPage.types'

export function UserLogActivity({ userLogs }: UserLogActivityProps) {
  return (
    <SectionGroup color='default' title="User's Log Activity">
      {userLogs.map(log => (
        <>
          <MvTypography size='BODY_LG_BOLDEST' typeSize='PX'>
            {log.date}
          </MvTypography>
          <Historical data={log.data} color='neutral' type='left' />
        </>
      ))}
    </SectionGroup>
  )
}
