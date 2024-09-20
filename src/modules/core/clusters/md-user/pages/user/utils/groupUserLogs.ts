import { GetUserLogActivityResponseData, UserLog } from '../types/ManageUserPage.types'
import { getTitleAndSub } from './getTitleAndSub'

export function groupUserLogs(userLogs: GetUserLogActivityResponseData[]) {
  return Object.entries(
    userLogs.reduce((acc: any, log) => {
      const dateKey = new Date(log.activity.timestamp).toLocaleDateString('en-GB', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })

      const { title, subTitle } = getTitleAndSub(log.collection, log.delta, log.activity)

      // group initialization
      if (!acc[dateKey as keyof typeof acc]) {
        acc[dateKey] = []
      }
      acc[dateKey as keyof typeof acc].push({
        date: new Date(log.activity.timestamp).toLocaleString(),
        title,
        subTitle,
        profile: {
          name: `${log.activity.user.first_name} ${log.activity.user.last_name}`,
          avatar: log.activity.user.avatar,
          position: log.activity.user?.job_function_id?.name ?? '-'
        }
      })

      return acc
    }, {})
  ).map(([date, data]) => ({ date, data }) as UserLog)
}
