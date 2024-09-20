import { Gender, Religion } from '../types/ManageUserPage.types'

export const PRIMARY_QUERY_KEY_DEPARTMENTS = 'DEPARTMENTS'
export const PRIMARY_QUERY_KEY_USERS = 'USERS'
export const PRIMARY_QUERY_KEY_JOB_FUNCTION = 'JOB_FUNCTIONS'
export const PRIMARY_QUERY_KEY_ASSETS = 'ASSETS'

export const GENDERS: Gender[] = [
  {
    id: 'MALE',
    label: 'Male'
  },
  {
    id: 'FEMALE',
    label: 'Female'
  }
]

export const RELIGIONS: Religion[] = [
  {
    id: 'ISLAM',
    label: 'Islam'
  },
  {
    id: 'KRISTEN_PROTESTAN',
    label: 'Kristen Protestan'
  },
  {
    id: 'KRISTEN_KATOLIK',
    label: 'Kristen Katolik'
  },
  {
    id: 'HINDU',
    label: 'Hindu'
  },
  {
    id: 'BUDDHA',
    label: 'Buddha'
  },
  {
    id: 'KHONGHUCU',
    label: 'Khonghucu'
  }
]

export const USERLOGS = [
  {
    date: '14 June 2023',
    data: [
      {
        date: '06/14/2023, 08:00',
        title: 'Photo Profile Updated',
        subTitle: 'Success to update photo profile',
        profile: {
          name: 'Machine Vision',
          position: 'Job Function'
        }
      },
      {
        date: '06/14/2023,08:00',
        title: 'Password Changed',
        subTitle: 'Success to update password securely',
        profile: {
          name: 'Machine Vision',
          position: 'Job Function'
        }
      },
      {
        date: '06/14/2023,08:00',
        title: 'Address Updated',
        subTitle: 'Success to update address',
        profile: {
          name: 'Machine Vision',
          position: 'Job Function'
        }
      }
    ]
  },
  {
    date: '13 June 2023',
    data: [
      {
        date: '06/13/2023, 08:00',
        title: 'Photo Profile Updated',
        subTitle: 'Success to update photo profile',
        profile: {
          name: 'Machine Vision',
          position: 'Job Function'
        }
      },
      {
        date: '06/13/2023,08:00',
        title: 'Account Verified',
        subTitle: 'Success to verify account',
        profile: {
          name: 'Admin MV',
          position: 'Job Function'
        }
      }
    ]
  }
]
