import React, { useState, useEffect } from "react";
import ContributionSkyline, {
  type ContributionDay,
  type PaletteName,
} from "./ui/contribution-skyline";
import { Button } from "./ui/button";
import { Github, Sparkles } from "lucide-react";

interface GithubContributionsProps {
  username?: string;
  theme?: "light" | "dark";
}

interface ApiResponse {
  total: Record<string, number>;
  contributions: Array<{
    date: string;
    count: number;
    level: number;
  }>;
}

export function GithubContributions({
  username = "dhruvkasar",
  theme = "dark",
}: GithubContributionsProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState<number | "last">("last");
  const [palette, setPalette] = useState<PaletteName>("mono");
  const [apiData, setApiData] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const availableYears: (number | "last")[] = [
    "last",
    currentYear,
    currentYear - 1,
    currentYear - 2,
  ];

  const paletteOptions: { name: PaletteName; label: string }[] = [
    { name: "mono", label: "Mono" },
    { name: "github", label: "GitHub" },
    { name: "ocean", label: "Ocean" },
    { name: "ember", label: "Ember" },
    { name: "grape", label: "Grape" },
  ];

  useEffect(() => {
    let isCancelled = false;
    setIsLoading(true);

    fetch(`https://github-contributions-api.jogruber.de/v4/${username}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch contributions");
        return res.json();
      })
      .then((data: ApiResponse) => {
        if (!isCancelled) {
          setApiData(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch GitHub contributions, falling back to skyline generator:", err);
        if (!isCancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      isCancelled = true;
    };
  }, [username]);

  // Compute contribution days based on selected year
  const contributionData: ContributionDay[] | undefined = React.useMemo(() => {
    if (!apiData || !apiData.contributions || apiData.contributions.length === 0) {
      return undefined; // Let ContributionSkyline use its generated believable data
    }

    if (selectedYear === "last") {
      // Last 371 days (53 weeks)
      const now = new Date();
      const cutoff = new Date(now.getTime() - 371 * 24 * 60 * 60 * 1000);
      const cutoffStr = cutoff.toISOString().slice(0, 10);
      const filtered = apiData.contributions
        .filter((c) => c.date >= cutoffStr)
        .map((c) => ({ date: c.date, count: c.count }));

      return filtered.length > 0 ? filtered : undefined;
    }

    const yearStr = selectedYear.toString();
    const filtered = apiData.contributions
      .filter((c) => c.date.startsWith(yearStr))
      .map((c) => ({ date: c.date, count: c.count }));

    return filtered.length > 0 ? filtered : undefined;
  }, [apiData, selectedYear]);

  // If a specific year is selected, determine the appropriate endDate
  const endDate = React.useMemo(() => {
    if (selectedYear === "last") {
      return undefined; // defaults to latest date or today
    }
    if (selectedYear === currentYear) {
      return new Date().toISOString().slice(0, 10);
    }
    return `${selectedYear}-12-31`;
  }, [selectedYear, currentYear]);

  const yearTotal = React.useMemo(() => {
    if (!apiData?.total) return null;
    if (selectedYear === "last") {
      if (!contributionData) return null;
      return contributionData.reduce((acc, curr) => acc + curr.count, 0);
    }
    return apiData.total[selectedYear.toString()] ?? null;
  }, [apiData, selectedYear, contributionData]);

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top action controls: Year selector, Palettes & Profile link */}
      <div className="w-full max-w-5xl mb-6 flex flex-wrap items-center justify-between gap-4 px-2">
        {/* Year Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {availableYears.map((year) => (
            <Button
              key={year}
              variant={selectedYear === year ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedYear(year)}
              className="text-xs transition-colors"
            >
              {year === "last" ? "Last Year" : year}
            </Button>
          ))}
        </div>

        {/* Palettes & GitHub link */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs">
            <Sparkles className="w-3.5 h-3.5 ml-1 text-neutral-400" />
            {paletteOptions.map((opt) => (
              <button
                key={opt.name}
                type="button"
                onClick={() => setPalette(opt.name)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium transition-all ${
                  palette === opt.name
                    ? "bg-white dark:bg-neutral-750 text-neutral-900 dark:text-neutral-100 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <a
            href={`https://github.com/${username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-100/60 dark:bg-neutral-900/60 text-xs font-medium text-neutral-700 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
            @{username}
          </a>
        </div>
      </div>

      {/* Skyline Component */}
      <div className="w-full max-w-5xl">
        <ContributionSkyline
          data={contributionData}
          endDate={endDate}
          palette={palette}
          defaultView="3d"
          orbit={true}
          showStats={true}
          showLegend={true}
          showToggle={true}
          heightScale={1.15}
          title={
            <span>
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                {yearTotal !== null
                  ? `${yearTotal} contributions`
                  : `@${username}'s Contributions`}
              </span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {" "}
                in {selectedYear === "last" ? "the last year" : selectedYear}
              </span>
            </span>
          }
          className="shadow-xl backdrop-blur-sm border-neutral-200/80 dark:border-neutral-800/80"
        />
      </div>
    </div>
  );
}
export default GithubContributions;
