export const getTitleAndSub = (collection: string, delta: any, activity: { action: string; timestamp: string }) => {
  const fields = Object.keys(delta).join(', ')
  let title
  let subTitle

  switch (activity.action) {
    case 'create':
      title = `${collection} Created`
      subTitle = `Success to create ${collection}`
      break
    case 'update':
      title = `${collection} Updated`
      subTitle = `Success to update field ${fields} in ${collection}`
      break
    case 'login':
      title = 'Login Success'
      subTitle = `Login Attempt success on ${activity.timestamp}`
      break
    case 'delete':
      title = `${collection} Data Deleted`
      subTitle = `Success to delete data on ${collection}`
      break
  }

  return { title, subTitle }
}
