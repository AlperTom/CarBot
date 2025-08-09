'use client';

import { useState, useEffect, useCallback } from 'react';
import { getWorkshopPackage, checkFeatureAccess, checkPackageLimit } from '@/lib/packageFeatures';

export function usePackageUpgrade(workshopId) {
  const [packageInfo, setPackageInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usageData, setUsageData] = useState({});
  const [upgradeRecommendations, setUpgradeRecommendations] = useState([]);

  // Load package information
  const loadPackageInfo = useCallback(async () => {
    if (!workshopId) return;

    try {
      setLoading(true);
      setError(null);
      
      const info = await getWorkshopPackage(workshopId);
      setPackageInfo(info);
      
      // Load usage data for all metrics
      await loadUsageData(workshopId);
      
      // Generate upgrade recommendations
      await generateUpgradeRecommendations(info);
    } catch (err) {
      console.error('Error loading package info:', err);
      setError('Failed to load package information');
    } finally {
      setLoading(false);
    }
  }, [workshopId]);

  // Load usage data for all metrics
  const loadUsageData = async (workshopId) => {
    try {
      const metrics = ['lead', 'api_call', 'storage'];
      const usageChecks = await Promise.all(
        metrics.map(metric => checkPackageLimit(workshopId, metric))
      );

      const usage = {};
      metrics.forEach((metric, index) => {
        usage[metric] = usageChecks[index];
      });

      setUsageData(usage);
    } catch (error) {
      console.error('Error loading usage data:', error);
    }
  };

  // Generate personalized upgrade recommendations
  const generateUpgradeRecommendations = async (packageInfo) => {
    if (!packageInfo) return;

    const recommendations = [];

    // Check usage-based recommendations
    Object.keys(usageData).forEach(metric => {
      const usage = usageData[metric];
      if (usage && usage.limit !== -1 && usage.current_usage && usage.limit) {
        const percentage = (usage.current_usage / usage.limit) * 100;
        if (percentage >= 80) {
          recommendations.push({
            type: 'usage',
            priority: percentage >= 95 ? 'critical' : percentage >= 90 ? 'high' : 'medium',
            metric,
            message: `Your ${metric} usage is at ${percentage.toFixed(0)}%`,
            suggestion: packageInfo.id === 'basic' ? 'professional' : 'enterprise'
          });
        }
      }
    });

    // Check feature-based recommendations
    const importantFeatures = [
      'advancedAnalytics',
      'apiAccess',
      'phoneSupport',
      'customIntegrations',
      'personalSupport',
      'whiteLabel'
    ];

    for (const feature of importantFeatures) {
      const access = await checkFeatureAccess(workshopId, feature);
      if (!access.allowed && access.upgrade_required) {
        recommendations.push({
          type: 'feature',
          priority: 'medium',
          feature,
          message: `Unlock ${feature} with an upgrade`,
          suggestion: access.upgrade_suggestion || 'professional'
        });
      }
    }

    // Sort by priority
    const priorityOrder = { critical: 3, high: 2, medium: 1, low: 0 };
    recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    setUpgradeRecommendations(recommendations);
  };

  // Check if upgrade is recommended
  const isUpgradeRecommended = () => {
    return upgradeRecommendations.some(rec => rec.priority === 'critical' || rec.priority === 'high');
  };

  // Get suggested upgrade target
  const getSuggestedUpgrade = () => {
    if (!packageInfo) return 'professional';
    
    const criticalRecs = upgradeRecommendations.filter(rec => rec.priority === 'critical' || rec.priority === 'high');
    if (criticalRecs.length > 0) {
      return criticalRecs[0].suggestion;
    }
    
    return packageInfo.id === 'basic' ? 'professional' : 'enterprise';
  };

  // Check if specific feature needs upgrade
  const needsUpgradeForFeature = (feature) => {
    return upgradeRecommendations.some(rec => rec.type === 'feature' && rec.feature === feature);
  };

  // Get usage percentage for metric
  const getUsagePercentage = (metric) => {
    const usage = usageData[metric];
    if (!usage || usage.limit === -1) return 0;
    return usage.current_usage && usage.limit ? (usage.current_usage / usage.limit) * 100 : 0;
  };

  // Check if metric is approaching limit
  const isApproachingLimit = (metric, threshold = 80) => {
    return getUsagePercentage(metric) >= threshold;
  };

  // Initiate upgrade process
  const initiateUpgrade = async (targetPackage, billingCycle = 'monthly') => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'initiate_upgrade',
          workshop_id: workshopId,
          target_package: targetPackage,
          billing_cycle: billingCycle
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate upgrade');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error initiating upgrade:', error);
      throw error;
    }
  };

  // Get upgrade pricing
  const getUpgradePricing = async (targetPackage, billingCycle = 'monthly') => {
    try {
      const response = await fetch('/api/packages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'calculate_proration',
          workshop_id: workshopId,
          target_package: targetPackage,
          billing_cycle: billingCycle
        })
      });

      if (response.ok) {
        const data = await response.json();
        return data.pricing;
      }
    } catch (error) {
      console.error('Error getting upgrade pricing:', error);
    }
    return null;
  };

  // Refresh data
  const refresh = useCallback(() => {
    loadPackageInfo();
  }, [loadPackageInfo]);

  useEffect(() => {
    loadPackageInfo();
  }, [loadPackageInfo]);

  // Set up periodic refresh (every 5 minutes)
  useEffect(() => {
    if (workshopId) {
      const interval = setInterval(refresh, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [workshopId, refresh]);

  return {
    // State
    packageInfo,
    loading,
    error,
    usageData,
    upgradeRecommendations,

    // Computed values
    isUpgradeRecommended: isUpgradeRecommended(),
    suggestedUpgrade: getSuggestedUpgrade(),

    // Functions
    needsUpgradeForFeature,
    getUsagePercentage,
    isApproachingLimit,
    initiateUpgrade,
    getUpgradePricing,
    refresh,

    // Utilities
    canUseFeature: async (feature) => {
      const access = await checkFeatureAccess(workshopId, feature);
      return access.allowed;
    },
    canPerformAction: async (action, quantity = 1) => {
      const check = await checkPackageLimit(workshopId, action, quantity);
      return check.allowed;
    }
  };
}

export default usePackageUpgrade;