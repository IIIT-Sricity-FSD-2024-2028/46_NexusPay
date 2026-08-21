/**
 * app.js — Analytics Page Entry Point
 */

document.addEventListener('DOMContentLoaded', () => {
  Auth.getCurrentRole();
  Sidebar.render('analytics');
  HeaderBar.render('header-bar', 'Platform Analytics', { showRoleSwitcher: false });

  // Charts
  Charts.renderRevenueChart('chart-revenue', ChartData.revenue);

  Charts.renderVolumeChart('chart-volume', ChartData.transactionVolume, {
    title: 'Transaction Volume',
    color: '#10b981'
  });

  Charts.renderGrowthChart('chart-growth', ChartData.userGrowth);
  Charts.renderCategoryChart('chart-category', ChartData.categoryPerformance);
  Charts.renderHourlyChart('chart-hourly', ChartData.hourlyActivity);

  Charts.renderTopCategories('chart-top-categories', ChartData.topCategories, {
    title: 'Top Performing Categories'
  });

  lucide.createIcons();
});
