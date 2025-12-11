# **App Name**: PromoPulse Dashboard

## Core Features:

- Promo Performance Summary: Interactive dashboard section with charts showing promo vs. non-promo sales trends, incremental lift, offer performance comparison, and promo spend vs. incremental revenue. Includes filtering by offer type, discount bucket, product, region, and week/month.
- Econometric Promo Effect Analysis: Dashboard section displaying econometric analysis charts, including baseline vs. promo sales, price x promo interaction curve, sales uplift attribution (promo vs. marketing vs. seasonality), elasticity of promotions, and promo impact lag curve.
- Offer Type Deep Dive: In-depth analysis section for different offer types, featuring an offer effectiveness heatmap, BOGO uplift curve, and % discount vs. incremental lift scatter plot with LOESS curve.
- ROI & Financial Impact: Business-focused section showcasing financial charts like promo ROI trend and profit during promo vs. non-promo periods.
- KPI Metric Cards: Display of key performance indicators, including total promo spend, total promo revenue, incremental promo revenue, incremental promo sales lift (%), baseline sales, promo elasticity, average discount %, offer effectiveness index, promo ROI, profit during promo, promo cannibalization %, and promo halo effect index.
- Dataset Simulation: Generate 2 years of weekly dummy data matching the specified schema, reflecting realistic promo behavior like spikes during promo weeks, elasticity between -1.2 and -2.0, diminishing returns, competitor price correlation, and seasonality.
- Automated Insight Generator: An AI-powered tool that analyzes dashboard data and generates short, actionable insights based on patterns in the data. It uses MMM results, considers various factors such as offer type, seasonality and pricing to come up with clear findings for the business user.

## Style Guidelines:

- Primary color: Deep Indigo (#3F51B5), a versatile color associated with data and analytics. It provides a strong base for charts and key metrics.
- Background color: Very light gray (#F5F5F5). It creates a clean and professional backdrop for the dashboard.
- Accent color: Soft Orange (#FFAB40). This highlights interactive elements, key performance indicators, and important insights.
- Body and headline font: 'Inter', a sans-serif font for a modern and objective feel, making data easily readable.
- Code font: 'Source Code Pro' for displaying formulas, metrics, and other technical aspects related to the model.
- Use simple, consistent icons to represent different data categories and metrics within the dashboard. Should align to the "Inter" font for cohesiveness.
- Organize dashboard sections using a clear grid layout with ample spacing for readability and ease of navigation. Prioritize the key metrics and summary charts at the top.