import axios from 'axios';
import { AnimatePresence, motion } from 'framer-motion';
import { BarChart2, ChevronLeft, ChevronRight, Leaf, Loader2, Pause, Play, RefreshCcw, TrendingUp, Users, Wind } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

const indicators = {
  population: 'SP.POP.TOTL',
  landArea: 'AG.LND.TOTL.K2',
  arableLand: 'AG.LND.ARBL.ZS',
  forestArea: 'AG.LND.FRST.ZS',
  urbanPopulation: 'SP.URB.TOTL.IN.ZS',
  gdpGrowth: 'NY.GDP.MKTP.KD.ZG',
  renewableEnergy: 'EG.FEC.RNEW.ZS'
};

const currentYear = new Date().getFullYear();
const startYear = currentYear - 10;
const AUTOPLAY_INTERVAL = 8000; // 8 seconds

const LandManagementStats = () => {
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [currentYearIndex, setCurrentYearIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const intervalRef = useRef(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const responses = await Promise.all(
        Object.entries(indicators).map(([key, indicator]) =>
          axios.get(`https://api.worldbank.org/v2/country/KEN/indicator/${indicator}`, {
            params: {
              format: 'json',
              date: `${startYear}:${currentYear}`
            },
            withCredentials: false, // This line ensures credentials are not sent
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            }
          })
        )
      );
  
      const newStats = {};
      const years = new Set();
  
      responses.forEach((response, index) => {
        const indicatorName = Object.keys(indicators)[index];
        response.data[1].forEach(item => {
          if (!newStats[item.date]) {
            newStats[item.date] = {};
          }
          newStats[item.date][indicatorName] = item.value;
          years.add(item.date);
        });
      });
  
      const sortedYears = Array.from(years).sort((a, b) => b - a);
      setAvailableYears(sortedYears);
      setStats(newStats);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to fetch data. Please try again later.');
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchStats();
  };

  const formatValue = (value, indicator) => {
    if (value === null || value === undefined) return 'N/A';
    switch (indicator) {
      case 'population':
        return parseInt(value).toLocaleString();
      case 'landArea':
        return `${parseInt(value).toLocaleString()} km²`;
      case 'arableLand':
      case 'forestArea':
      case 'urbanPopulation':
      case 'gdpGrowth':
      case 'renewableEnergy':
        return `${parseFloat(value).toFixed(1)}%`;
      default:
        return value;
    }
  };

  const generateMessage = (year) => {
    const yearStats = stats[year];
    if (!yearStats) return "No data available for this year.";

    return (
      <motion.div 
        className="space-y-2 text-xs sm:text-sm text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="flex flex-col sm:flex-row justify-center items-center">
          <Users className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2 text-blue-500" />
          <span>
            Kenya's population was <span className="font-semibold text-blue-600">{formatValue(yearStats.population, 'population')}</span>, with <span className="font-semibold text-blue-600">{formatValue(yearStats.urbanPopulation, 'urbanPopulation')}</span> living in urban areas.
          </span>
        </p>
        <p className="flex flex-col sm:flex-row justify-center items-center">
          <BarChart2 className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2 text-green-500" />
          <span>
            The total land area was <span className="font-semibold text-green-600">{formatValue(yearStats.landArea, 'landArea')}</span>, of which <span className="font-semibold text-green-600">{formatValue(yearStats.arableLand, 'arableLand')}</span> was arable.
          </span>
        </p>
        <p className="flex flex-col sm:flex-row justify-center items-center">
          <Leaf className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2 text-green-700" />
          <span>
            Forests covered <span className="font-semibold text-green-700">{formatValue(yearStats.forestArea, 'forestArea')}</span> of the land.
          </span>
        </p>
        <p className="flex flex-col sm:flex-row justify-center items-center">
          <TrendingUp className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2 text-purple-500" />
          <span>
            The GDP growth rate was <span className="font-semibold text-purple-600">{formatValue(yearStats.gdpGrowth, 'gdpGrowth')}</span>.
          </span>
        </p>
        <p className="flex flex-col sm:flex-row justify-center items-center">
          <Wind className="w-4 h-4 mb-1 sm:mb-0 sm:mr-2 text-blue-400" />
          <span>
            <span className="font-semibold text-blue-500">{formatValue(yearStats.renewableEnergy, 'renewableEnergy')}</span> of energy came from renewable sources.
          </span>
        </p>
      </motion.div>
    );
  };

  const handlePrevious = useCallback(() => {
    setCurrentYearIndex((prevIndex) => 
      prevIndex === availableYears.length - 1 ? 0 : prevIndex + 1
    );
  }, [availableYears.length]);

  const handleNext = useCallback(() => {
    setCurrentYearIndex((prevIndex) => 
      prevIndex === 0 ? availableYears.length - 1 : prevIndex - 1
    );
  }, [availableYears.length]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        handleNext();
      }, AUTOPLAY_INTERVAL);
    } else {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, handleNext]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="w-8 h-8 text-green-600 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
      </div>
    );
  }

  return (
    <motion.div 
      className="bg-white px-2 sm:px-4 py-2 rounded-lg shadow-md border border-green-200 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-3">
        <h2 className="text-base sm:text-lg font-bold text-green-800 mb-2 sm:mb-0">
          Land Management in Kenya
        </h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={togglePlayPause}
            className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button 
            onClick={handleRefresh}
            className="p-1 rounded-full bg-green-100 text-green-600 hover:bg-green-200 transition-colors duration-200"
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={availableYears[currentYearIndex]}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-r from-green-50 to-blue-50 p-2 sm:p-3 rounded-md"
          >
            <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center text-green-700">
              {availableYears[currentYearIndex]}
            </h3>
            {generateMessage(availableYears[currentYearIndex])}
          </motion.div>
        </AnimatePresence>

        <button
          onClick={handlePrevious}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 sm:-translate-x-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-1 sm:translate-x-3 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors duration-200"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
        </button>
      </div>

      <p className="text-center text-xs text-gray-500 mt-3">
        Data source: World Bank ({availableYears[availableYears.length - 1]}-{availableYears[0]})
      </p>
    </motion.div>
  );
};

export default LandManagementStats;