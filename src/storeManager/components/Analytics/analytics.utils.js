import { defaultAnalyticsData } from "./analytics.data";

export const getStoreAnalyticsData = async (storeId, range = 'Last 6 Months', revenueData = null) => {
  if (!revenueData) {
    return { orders: [] }
  }

  const allOrders = revenueData?.orders || []
  const orders = storeId
    ? allOrders.filter((o) => {
      const orderStoreId = o.storeId || o.id_store || o.items?.[0]?.id_store || o.items?.[0]?.storeId;
      return orderStoreId && String(orderStoreId).trim() === String(storeId).trim();
    })
    : allOrders

  const now = new Date()
  const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)

  // Dùng giá trị đã sync từ API thay vì tính toán lại
  const grossRevenue = revenueData.totalRevenue || 0
  const platformFees = Math.round(grossRevenue * 0.05 * 100) / 100
  const netRevenue = Math.round((grossRevenue - platformFees) * 100) / 100

  const prevGross = orders.filter((item) => {
    if (!item.date) return false
    const d = new Date(item.date)
    return d.getMonth() === prevDate.getMonth() && d.getFullYear() === prevDate.getFullYear()
  }).reduce((sum, item) => sum + (Number(item.totalAmount) || Number(item.total) || 0), 0)

  const currentGross = orders.filter((item) => {
    if (!item.date) return false
    const d = new Date(item.date)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).reduce((sum, item) => sum + (Number(item.totalAmount) || Number(item.total) || 0), 0)

  const preNet = Math.round((prevGross - prevGross * 0.05) * 100) / 100
  const currentNet = Math.round((currentGross - currentGross * 0.05) * 100) / 100

  const safePercent = (curr, prev) => {
    if (!prev || prev === 0) return { delta: '+0.0%', trend: 'positive' }
    const d = Math.round(((curr - prev) / prev * 100) * 100) / 100
    return {
      delta: `${d >= 0 ? '+' : '-'}${Math.abs(d).toFixed(1)}%`,
      trend: d >= 0 ? 'positive' : 'negative',
    }
  }

  const noteLabel = `vs ${prevDate.toLocaleString('default', { month: 'short' })}`
  const { delta: deltaLabelGross, trend: trendGross } = safePercent(currentGross, prevGross)
  const { delta: deltaLabelNet, trend: trendNet } = safePercent(currentNet, preNet)

  const getStartOfWeek = (date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - day + (day === 0 ? -6 : 1)
    const monday = new Date(d.setDate(diff))
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  const groupOrderByWeek = (orders) => {
    const weeks = {}
    orders.forEach((order) => {
      if (!order.date) return
      const monday = getStartOfWeek(order.date)
      const weekKey = monday.toISOString().split('T')[0]
      if (!weeks[weekKey]) {
        weeks[weekKey] = { startDate: monday, grossRevenue: 0, orderCount: 0, items: [] }
      }
      weeks[weekKey].items.push(order)
      weeks[weekKey].grossRevenue += Number(order.totalAmount) || Number(order.total) || 0
      weeks[weekKey].orderCount += 1
    })
    return Object.keys(weeks).map((key, index) => {
      const week = weeks[key]
      const fees = Math.round(week.grossRevenue * 0.05 * 100) / 100
      const net = Math.round((week.grossRevenue - fees) * 100) / 100
      return {
        id: `TRF-${10000 + index}-AX`,
        date: new Date(week.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
        grossAmount: week.grossRevenue,
        feeAmount: fees,
        netTransferred: net,
        orderCount: week.orderCount,
        items: week.items,
      }
    })
  }

  // Group orders theo tháng cho chart dựa trên range
  const groupOrderByMonth = (orders, range = 'Last 6 Months') => {
    const now = new Date()
    const monthBuckets = []

    let monthsCount = 6
    let startIndex = 0
    let currentYear = now.getFullYear()
    let currentMonth = now.getMonth()

    // Xác định số lượng tháng dựa trên range
    if (range === 'Last 12 Months') {
      monthsCount = 12
    } else if (range === 'Year to Date') {
      monthsCount = currentMonth + 1 // Từ tháng 1 đến tháng hiện tại
      startIndex = 0
    } else {
      // Last 6 Months (default)
      monthsCount = 6
    }

    // Tạo buckets cho các tháng
    if (range === 'Year to Date') {
      // Từ tháng 1 đến tháng hiện tại trong năm nay
      for (let i = 0; i < monthsCount; i++) {
        const d = new Date(currentYear, i, 1)
        monthBuckets.push({
          year: d.getFullYear(),
          month: d.getMonth(),
          monthLabel: d.toLocaleString('en-US', { month: 'short' }),
          grossRevenue: 0,
        })
      }
    } else {
      // Các tháng gần nhất (Last 6 Months hoặc Last 12 Months)
      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        monthBuckets.push({
          year: d.getFullYear(),
          month: d.getMonth(),
          monthLabel: d.toLocaleString('en-US', { month: 'short' }),
          grossRevenue: 0,
        })
      }
    }

    // Group orders vào buckets
    orders.forEach((order) => {
      if (!order.date) return
      const orderDate = new Date(order.date)
      const orderYear = orderDate.getFullYear()
      const orderMonth = orderDate.getMonth()

      const bucket = monthBuckets.find(
        (b) => b.year === orderYear && b.month === orderMonth
      )

      if (bucket) {
        bucket.grossRevenue += Number(order.totalAmount) || Number(order.total) || 0
      }
    })

    return monthBuckets.map((bucket) => {
      const fees = Math.round(bucket.grossRevenue * 0.05 * 100) / 100
      const net = Math.round((bucket.grossRevenue - fees) * 100) / 100
      return {
        month: bucket.monthLabel,
        grossRevenue: bucket.grossRevenue,
        platformFees: fees,
        netRevenue: net,
      }
    })
  }

  const summaryCards = [
    {
      id: 'gross-revenue', label: 'GROSS REVENUE',
      value: grossRevenue, valueType: 'currency',
      delta: deltaLabelGross, note: noteLabel,
      trend: trendGross, iconKey: 'revenue', accent: 'purple',
    },
    {
      id: 'platform-fees', label: 'PLATFORM FEES',
      value: platformFees, valueType: 'currency',
      delta: '5%', note: 'Commission',
      trend: 'neutral', iconKey: 'fees', accent: 'rose',
    },
    {
      id: 'net-revenue', label: 'NET REVENUE',
      value: netRevenue, valueType: 'currency',
      delta: deltaLabelNet, note: noteLabel,
      trend: trendNet, iconKey: 'net', accent: 'emerald',
    },
  ]

  const weeklyItems = groupOrderByWeek(orders)
  const transferHistory = { title: 'Transfer History', items: weeklyItems }

  // Tạo series data theo tháng cho chart dựa trên range
  const monthlyData = groupOrderByMonth(orders, range)

  const updatedRevenueBreakdown = {
    ...defaultAnalyticsData.revenueBreakdown,
    activeRange: range,
    series: [
      { name: 'Gross Revenue', data: monthlyData.map(m => m.grossRevenue) },
      { name: 'Net Revenue', data: monthlyData.map(m => m.netRevenue) }
    ]
  }

  return { ...defaultAnalyticsData, revenueBreakdown: updatedRevenueBreakdown, summaryCards, transferHistory, _rawOrders: orders }
}

export const trackProductsView = async (product, allViews, saveViewsData) => {
  if (!product?.id) return
  const current = allViews?.[product.id] || { views: 0 }
  const updated = {
    productId: product.id,
    storeId: product.id_store || product.storeId || "store-001",
    title: product.title,
    imageUrl: product.imageUrl,
    views: (current.views || 0) + 1,
    lastView: new Date().toISOString(),
  }
  await saveViewsData({ productId: product.id, viewEntry: updated, allViews })
}

export const top5BestSellers = (storeId = null, revenueData) => {
  if (!storeId || !revenueData) {
    return []
  }

  const allOrders = revenueData.orders || []
  const orderItems = storeId
    ? allOrders.filter((o) => {
      const orderStoreId = o.storeId || o.id_store || o.items?.[0]?.id_store || o.items?.[0]?.storeId;
      return orderStoreId && String(orderStoreId).trim() === String(storeId).trim();
    })
    : allOrders

  const productSales = {}
  orderItems.forEach((order) => {
    (order.items || []).forEach((item) => {
      const pid = item.id
      if (!productSales[pid]) {
        productSales[pid] = {
          id: pid, title: item.title, imageUrl: item.imageUrl,
          totalRevenue: 0, quantitySold: 0,
        }
      }
      productSales[pid].totalRevenue += (item.price || 0) * (item.quantity || 1)
      productSales[pid].quantitySold += item.quantity || 1
    })
  })

  return Object.values(productSales)
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5)
    .map((p, i) => ({
      id: p.id || `best-${i}`,
      name: p.title,
      imageUrl: p.imageUrl,
      subLabel: `${p.quantitySold} Sales`,
      metricValue: p.totalRevenue,
    }))
}



export const getMostViewProducts = (storeId, allViews, revenueData) => {
  const views = Object.values(allViews || {}).filter(
    (view) => storeId && String(view.storeId) === String(storeId)
  )
  const orders = revenueData?.orders || []

  const productSalesMap = {}
  orders.forEach((order) => {
    (order.items || []).forEach((item) => {
      productSalesMap[item.id] = (productSalesMap[item.id] || 0) + (item.quantity || 1)
    })
  })

  return views
    .map((view, i) => {
      const sales = productSalesMap[view.productId] || 0
      const convRate = view.views > 0 ? Math.round((sales / view.views) * 100) / 100 : 0
      return {
        id: `view-${i}`,
        name: view.title,
        imageUrl: view.imageUrl,
        subLabel: `Conv. Rate: ${convRate}%`,
        metricValue: view.views,
      }
    })
    .sort((a, b) => b.metricValue - a.metricValue)
    .slice(0, 5)
}


export const exportAnalyticsReportCSV = (analyticsData, storeName = "Store") => {
  const cards = analyticsData.summaryCards || []
  const transfers = analyticsData.transferHistory?.items || []

  let csvContent = "data:text/csv;charset=utf-8,"
  csvContent += `Analytics & Financials Report - ${storeName}\n`
  csvContent += `Generated Date: ${new Date().toLocaleString()}\n\n`
  csvContent += "METRIC,VALUE,DELTA,NOTE\n"
  cards.forEach((c) => {
    csvContent += `"${c.label}","$${Number(c.value).toLocaleString()}","${c.delta || ""}","${c.note || ""}"\n`
  })
  csvContent += "\nTRANSFER HISTORY\n"
  csvContent += "TRANSFER ID,DATE,GROSS AMOUNT,FEES (5%),NET TRANSFERRED\n"
  transfers.forEach((t) => {
    csvContent += `"${t.id}","${t.date}","$${t.grossAmount}","-$${t.feeAmount}","$${t.netTransferred}"`
  })

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `analytics_report_${new Date().toISOString().slice(0, 10)}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
