const serviceTiers = [
  {
    code: "M",
    name: "維護型",
    price: "20萬",
    scope: "定期巡檢、清洗安排、故障通報與基礎排除、年度報告。",
    pr: "PR >= 80",
    promise: "參考，不保證",
    customer: "預算導向業主、中小型場站",
  },
  {
    code: "OM",
    name: "營運型",
    price: "35萬",
    scope: "M 全包 + 遠端監控、預防性維護排程、妥善率追蹤、月報。",
    pr: "PR >= 82",
    promise: "保證，未達標提改善計畫",
    customer: "有績效要求的中大型業主",
  },
  {
    code: "AM",
    name: "資產管理型",
    price: "45萬",
    scope: "OM 全包 + IEC 61724-1 溫度修正 PR 保證、財務級月報、平台可稽核報告、保發電量合約管理。",
    pr: "PR >= 84",
    promise: "保證加賠償",
    customer: "策略型機構投資人",
  },
];

const portfolio = [
  { year: 2026, m: 48, om: 39, am: 12, rate: 28.65, capacity: 209 },
  { year: 2027, m: 39, om: 44, am: 16, rate: 30.4, capacity: 395 },
  { year: 2028, m: 30, om: 46, am: 23, rate: 32.45, capacity: 740 },
  { year: 2029, m: 23, om: 47, am: 30, rate: 34.55, capacity: 868 },
];

const regions = [
  { year: 2026, south: 94, central: 69, north: 46, total: 209 },
  { year: 2027, south: 178, central: 130, north: 87, total: 395 },
  { year: 2028, south: 333, central: 244, north: 163, total: 740 },
  { year: 2029, south: 391, central: 286, north: 191, total: 868 },
];

const income = [
  { year: 2026, revenue: 1.0, service: 0.6, engineering: 0.4, net: 0.15 },
  { year: 2027, revenue: 2.0, service: 1.2, engineering: 0.8, net: 0.3 },
  { year: 2028, revenue: 4.0, service: 2.4, engineering: 1.6, net: 0.6 },
  { year: 2029, revenue: 5.0, service: 3.0, engineering: 2.0, net: 0.75 },
];

const ops = [
  { year: 2026, sites: 234, projects: 8, capacity: 209 },
  { year: 2027, sites: 374, projects: 16, capacity: 395 },
  { year: 2028, sites: 580, projects: 32, capacity: 740 },
  { year: 2029, sites: 570, projects: 40, capacity: 868 },
];

const people = [
  { year: 2026, service: 9, engineering: 2, total: 11 },
  { year: 2027, service: 16, engineering: 3, total: 19 },
  { year: 2028, service: 30, engineering: 6, total: 36 },
  { year: 2029, service: 35, engineering: 7, total: 42 },
];

const risks = [
  { id: "H-1", title: "台中以南案源", body: "2027 Q3 前南部與中部 Pipeline 達 800MW+。" },
  { id: "H-2", title: "17 人招募", body: "2028 Q1 前至少 8 人到職，支撐容量跳升。" },
  { id: "H-3", title: "工程 SOP 複製", body: "用 2026 年 8 件試點建立標準化交付能力。" },
  { id: "F-1", title: "15% 淨利率", body: "三業務線毛利率回測，確認 25% 毛利率成立。" },
  { id: "G-3", title: "PR84 能力", body: "南部 2 個 AM 試點連續 6 個月追蹤 PR。" },
];

const milestones = [
  { id: "M0", date: "2026/06/30", title: "現況盤點", standard: "毛利率誤差小於 5%；現有 PR >= 78；分工完成。" },
  { id: "M1", date: "2026/07/31", title: "進能服商務確認", standard: "平台授權書面確認；若未通過，啟動替代 Tier 3 評估。" },
  { id: "M2", date: "2026/11/30", title: "AM 試點上線", standard: "PR >= 82 且有上升趨勢；客戶確認報告格式。" },
  { id: "M3", date: "2026/12/31", title: "市場意向確認", standard: "取得 AM MOU；淨利率 >= 12%；2027 招募確認。" },
  { id: "M4", date: "2027/03/31", title: "首件 AM 合約", standard: "費率 >= 45萬/MW；年值 >= 500萬；含 PR84 賠償條款。" },
  { id: "M5", date: "2027/12/31", title: "年度驗證", standard: "收入 >= 1.8億；淨利率 >= 13%；人力達 19 人。" },
  { id: "M6", date: "2029/12/31", title: "四年總結算", standard: "累計淨利 1.8 億；AM 佔比 30%；總人力 42 人。" },
];

function renderServices() {
  document.querySelector("#serviceCards").innerHTML = serviceTiers
    .map(
      (item) => `
        <article class="service-card">
          <header>
            <span>${item.code}</span>
            <h3>${item.name}</h3>
            <strong class="price">${item.price}<small>/MW/年</small></strong>
          </header>
          <div class="body">
            <p>${item.scope}</p>
            <dl>
              <dt>PR 保證</dt><dd>${item.pr}</dd>
              <dt>責任</dt><dd>${item.promise}</dd>
              <dt>客群</dt><dd>${item.customer}</dd>
            </dl>
          </div>
        </article>
      `
    )
    .join("");
}

function renderPortfolio() {
  document.querySelector("#portfolioChart").innerHTML = portfolio
    .map(
      (row) => `
        <div class="stack-row">
          <strong class="stack-year">${row.year}</strong>
          <div class="stack-track" aria-label="${row.year} M ${row.m}%, OM ${row.om}%, AM ${row.am}%">
            <div class="stack-segment seg-m" style="width:${row.m}%">M ${row.m}%</div>
            <div class="stack-segment seg-om" style="width:${row.om}%">OM ${row.om}%</div>
            <div class="stack-segment seg-am" style="width:${row.am}%">AM ${row.am}%</div>
          </div>
          <span class="stack-meta">${row.rate}萬/MW</span>
        </div>
      `
    )
    .join("");
}

function renderRegionChart() {
  const max = Math.max(...regions.map((row) => row.total));
  document.querySelector("#regionChart").innerHTML = regions
    .map(
      (row) => `
        <div class="vbar">
          <div class="vbar-fill" style="height:${(row.total / max) * 230}px">
            ${row.total}MW
          </div>
          <span class="vbar-label">${row.year}<br>南${row.south} / 中${row.central} / 北${row.north}</span>
        </div>
      `
    )
    .join("");
}

function renderIncomeChart() {
  const max = Math.max(...income.map((row) => row.revenue));
  document.querySelector("#incomeChart").innerHTML = income
    .map(
      (row) => `
        <div class="line-row">
          <strong>${row.year}</strong>
          <div class="track">
            <div class="fill" style="width:${(row.revenue / max) * 100}%"></div>
          </div>
          <span>${row.revenue.toFixed(2)}億</span>
        </div>
      `
    )
    .join("");
}

function renderMarginChart() {
  const rows = [
    { name: "營業收入", value: 100, cls: "" },
    { name: "營業成本", value: 75, cls: "red" },
    { name: "毛利", value: 25, cls: "" },
    { name: "SG&A", value: 10, cls: "gold" },
    { name: "稅前淨利", value: 15, cls: "" },
  ];
  document.querySelector("#marginChart").innerHTML = rows
    .map(
      (row) => `
        <div class="margin-row">
          <strong>${row.name}</strong>
          <div class="track">
            <div class="fill ${row.cls}" style="width:${row.value}%"></div>
          </div>
          <span>${row.value}%</span>
        </div>
      `
    )
    .join("");
}

function renderCapacityChart() {
  const max = Math.max(...portfolio.map((row) => row.capacity));
  document.querySelector("#capacityChart").innerHTML = portfolio
    .map(
      (row) => `
        <div class="vbar">
          <div class="vbar-fill" style="height:${(row.capacity / max) * 205}px">${row.capacity}MW</div>
          <span class="vbar-label">${row.year}</span>
        </div>
      `
    )
    .join("");
}

function renderOpsTable() {
  document.querySelector("#siteProjectChart").innerHTML = `
    <table class="data-table">
      <thead>
        <tr>
          <th>年度</th>
          <th>案場數</th>
          <th>容量</th>
          <th>維運工程件數</th>
          <th>總營收</th>
        </tr>
      </thead>
      <tbody>
        ${ops
          .map((row, index) => {
            const revenue = income[index].revenue.toFixed(2);
            return `
              <tr>
                <td><strong>${row.year}</strong></td>
                <td>${row.sites}案</td>
                <td>${row.capacity}MW</td>
                <td>${row.projects}件</td>
                <td><strong>${revenue}億</strong></td>
              </tr>
            `;
          })
          .join("")}
      </tbody>
    </table>
  `;
}

function renderPeopleChart() {
  const max = Math.max(...people.map((row) => row.total));
  document.querySelector("#peopleChart").innerHTML = people
    .map(
      (row) => `
        <div class="people-row">
          <strong>${row.year}</strong>
          <div class="people-track">
            <div class="people-service" style="width:${(row.service / max) * 100}%">${row.service} 服務</div>
            <div class="people-engineering" style="width:${(row.engineering / max) * 100}%">${row.engineering} 工程</div>
          </div>
          <span>${row.total}人</span>
        </div>
      `
    )
    .join("");
}

function renderRisks() {
  document.querySelector("#riskCards").innerHTML = risks
    .map(
      (risk) => `
        <article class="risk-card">
          <span class="tag">${risk.id}</span>
          <h3>${risk.title}</h3>
          <p>${risk.body}</p>
        </article>
      `
    )
    .join("");
}

function renderMilestones() {
  document.querySelector("#milestoneList").innerHTML = milestones
    .map(
      (item) => `
        <article class="milestone-item">
          <strong class="milestone-date">${item.date}</strong>
          <div>
            <h3>${item.id} ${item.title}</h3>
          </div>
          <div class="milestone-standard">${item.standard}</div>
        </article>
      `
    )
    .join("");
}

renderServices();
renderPortfolio();
renderRegionChart();
renderIncomeChart();
renderMarginChart();
renderCapacityChart();
renderOpsTable();
renderPeopleChart();
renderRisks();
renderMilestones();
