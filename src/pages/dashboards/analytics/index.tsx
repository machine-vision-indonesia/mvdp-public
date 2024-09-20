// ** MUI Import
import Grid from '@mui/material/Grid'

import AnalyticsEarningReports from 'src/@example/views/___examples/dashboards/analytics/AnalyticsEarningReports'
import AnalyticsMonthlyCampaignState from 'src/@example/views/___examples/dashboards/analytics/AnalyticsMonthlyCampaignState'
import AnalyticsOrderVisits from 'src/@example/views/___examples/dashboards/analytics/AnalyticsOrderVisits'
// ** Demo Component Imports
import AnalyticsProject from 'src/@example/views/___examples/dashboards/analytics/AnalyticsProject'
import AnalyticsSalesByCountries from 'src/@example/views/___examples/dashboards/analytics/AnalyticsSalesByCountries'
import AnalyticsSourceVisits from 'src/@example/views/___examples/dashboards/analytics/AnalyticsSourceVisits'
import AnalyticsSupportTracker from 'src/@example/views/___examples/dashboards/analytics/AnalyticsSupportTracker'
import AnalyticsTotalEarning from 'src/@example/views/___examples/dashboards/analytics/AnalyticsTotalEarning'
import AnalyticsWebsiteAnalyticsSlider from 'src/@example/views/___examples/dashboards/analytics/AnalyticsWebsiteAnalyticsSlider'

import CardStatsWithAreaChart from 'src/@core/components/card-statistics/card-stats-with-area-chart'
// ** Custom Component Import
import KeenSliderWrapper from 'src/@core/styles/libs/keen-slider'
import ApexChartWrapper from 'src/@core/styles/libs/react-apexcharts'

const AnalyticsDashboard = () => {
  return (
    <ApexChartWrapper>
      <KeenSliderWrapper>
        <Grid container spacing={6}>
          <Grid item xs={12} lg={6}>
            <AnalyticsWebsiteAnalyticsSlider />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <AnalyticsOrderVisits />
          </Grid>
          <Grid item xs={12} sm={6} lg={3}>
            <CardStatsWithAreaChart
              stats='97.5k'
              chartColor='success'
              avatarColor='success'
              title='Revenue Generated'
              avatarIcon='tabler:credit-card'
              chartSeries={[{ data: [6, 35, 25, 61, 32, 84, 70] }]}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsEarningReports />
          </Grid>
          <Grid item xs={12} md={6}>
            <AnalyticsSupportTracker />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSalesByCountries />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsTotalEarning />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsMonthlyCampaignState />
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <AnalyticsSourceVisits />
          </Grid>
          <Grid item xs={12} lg={8}>
            <AnalyticsProject />
          </Grid>
        </Grid>
      </KeenSliderWrapper>
    </ApexChartWrapper>
  )
}

export default AnalyticsDashboard
