import { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

type KPIData = {
  revenue: number;
  cost: number;
  profit: number;
  orders: number;
  margin: number;
};

type KPICardsProps = {
  country: string;
  region: string;
  product: string;
  month: string;
};

const EMPTY_KPI: KPIData = {
  revenue: 0,
  cost: 0,
  profit: 0,
  orders: 0,
  margin: 0,
};

function KPICards({
  country,
  region,
  product,
  month,
}: KPICardsProps) {
  const [kpi, setKpi] = useState<KPIData>(EMPTY_KPI);

  const [displayKpi, setDisplayKpi] =
    useState<KPIData>(EMPTY_KPI);

  const [loading, setLoading] = useState(false);

  // =========================================================
  // FETCH KPI DATA FROM SNOWFLAKE-BACKED API
  // =========================================================

  useEffect(() => {
    let cancelled = false;

    async function fetchKPIs() {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (country?.trim()) {
          params.append(
            "country",
            country.trim()
          );
        }

        if (region?.trim()) {
          params.append(
            "region",
            region.trim()
          );
        }

        if (product?.trim()) {
          params.append(
            "product",
            product.trim()
          );
        }

        if (month?.trim()) {
          params.append(
            "month",
            month.trim()
          );
        }

        const query = params.toString();

        const url =
          `${API_URL}/api/analytics/summary` +
          (query ? `?${query}` : "");

        console.log(
          "Fetching KPI data:",
          url
        );

        const response =
          await fetch(url);

        if (!response.ok) {
          throw new Error(
            `API request failed: ${response.status}`
          );
        }

        const result =
          await response.json();

        if (cancelled) {
          return;
        }

        const newKpi: KPIData = {
          revenue: Number(
            result.revenue || 0
          ),

          cost: Number(
            result.cost || 0
          ),

          profit: Number(
            result.profit || 0
          ),

          orders: Number(
            result.orders || 0
          ),

          margin: Number(
            result.margin || 0
          ),
        };

        console.log(
          "KPI data received:",
          newKpi
        );

        setKpi(newKpi);

        // Reset values so the count-up
        // animation starts from zero.
        setDisplayKpi(EMPTY_KPI);

      } catch (error) {
        if (!cancelled) {
          console.error(
            "Failed to load KPI data:",
            error
          );

          setKpi(EMPTY_KPI);
          setDisplayKpi(EMPTY_KPI);
        }

      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchKPIs();

    return () => {
      cancelled = true;
    };

  }, [
    country,
    region,
    product,
    month,
  ]);

  // =========================================================
  // COUNT-UP ANIMATION
  // =========================================================

  useEffect(() => {
    if (loading) {
      return;
    }

    const duration = 1400;
    const startTime =
      performance.now();

    let animationFrame: number;

    const animate = (
      currentTime: number
    ) => {
      const elapsed =
        currentTime - startTime;

      const progress =
        Math.min(
          elapsed / duration,
          1
        );

      const easedProgress =
        1 -
        Math.pow(
          1 - progress,
          3
        );

      setDisplayKpi({
        revenue:
          kpi.revenue *
          easedProgress,

        cost:
          kpi.cost *
          easedProgress,

        profit:
          kpi.profit *
          easedProgress,

        orders:
          kpi.orders *
          easedProgress,

        margin:
          kpi.margin *
          easedProgress,
      });

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(
            animate
          );
      }
    };

    animationFrame =
      requestAnimationFrame(
        animate
      );

    return () => {
      cancelAnimationFrame(
        animationFrame
      );
    };

  }, [kpi, loading]);

  // =========================================================
  // FORMATTERS
  // =========================================================

  const formatCurrency = (
    value: number
  ) => {
    return `₹${Math.round(
      value
    ).toLocaleString("en-IN")}`;
  };

  const formatOrders = (
    value: number
  ) => {
    return Math.round(
      value
    ).toLocaleString("en-IN");
  };

  const formatMargin = (
    value: number
  ) => {
    return `${value.toFixed(2)}%`;
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="kpi-loading premium-black-loading">
        <div className="kpi-loading-spinner" />

        <span>
          Loading business intelligence...
        </span>
      </div>
    );
  }

  // =========================================================
  // KPI CARDS
  // =========================================================

  return (
    <div className="premium-kpi-grid">

      {/* =====================================================
          REVENUE
      ===================================================== */}

      <div className="premium-kpi-card">

        <div className="kpi-top">

          <div className="kpi-icon">
            ↗
          </div>

          <span className="kpi-status">
            Revenue
          </span>

        </div>

        <div className="kpi-label">
          TOTAL REVENUE
        </div>

        <div className="kpi-value">
          {formatCurrency(
            displayKpi.revenue
          )}
        </div>

        <div className="kpi-bottom">

          <span className="kpi-indicator">
            ↑
          </span>

          <span>
            Business generated
          </span>

        </div>

      </div>

      {/* =====================================================
          COST
      ===================================================== */}

      <div className="premium-kpi-card">

        <div className="kpi-top">

          <div className="kpi-icon">
            ↓
          </div>

          <span className="kpi-status">
            Cost
          </span>

        </div>

        <div className="kpi-label">
          TOTAL COST
        </div>

        <div className="kpi-value">
          {formatCurrency(
            displayKpi.cost
          )}
        </div>

        <div className="kpi-bottom">

          <span className="kpi-indicator">
            •
          </span>

          <span>
            Operating expenditure
          </span>

        </div>

      </div>

      {/* =====================================================
          PROFIT
      ===================================================== */}

      <div className="premium-kpi-card">

        <div className="kpi-top">

          <div className="kpi-icon">
            ↗
          </div>

          <span className="kpi-status">
            Profit
          </span>

        </div>

        <div className="kpi-label">
          TOTAL PROFIT
        </div>

        <div className="kpi-value">
          {formatCurrency(
            displayKpi.profit
          )}
        </div>

        <div className="kpi-bottom">

          <span className="kpi-indicator">
            ↑
          </span>

          <span>
            Net business profit
          </span>

        </div>

      </div>

      {/* =====================================================
          ORDERS
      ===================================================== */}

      <div className="premium-kpi-card">

        <div className="kpi-top">

          <div className="kpi-icon">
            #
          </div>

          <span className="kpi-status">
            Orders
          </span>

        </div>

        <div className="kpi-label">
          TOTAL ORDERS
        </div>

        <div className="kpi-value">
          {formatOrders(
            displayKpi.orders
          )}
        </div>

        <div className="kpi-bottom">

          <span className="kpi-indicator">
            ↑
          </span>

          <span>
            Completed transactions
          </span>

        </div>

      </div>

      {/* =====================================================
          PROFIT MARGIN
      ===================================================== */}

      <div className="premium-kpi-card">

        <div className="kpi-top">

          <div className="kpi-icon">
            %
          </div>

          <span className="kpi-status">
            Efficiency
          </span>

        </div>

        <div className="kpi-label">
          PROFIT MARGIN
        </div>

        <div className="kpi-value">
          {formatMargin(
            displayKpi.margin
          )}
        </div>

        <div className="kpi-bottom">

          <span className="kpi-indicator">
            ↑
          </span>

          <span>
            Profitability ratio
          </span>

        </div>

      </div>

    </div>
  );
}

export default KPICards;