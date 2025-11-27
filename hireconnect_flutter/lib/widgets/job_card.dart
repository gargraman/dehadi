import 'package:flutter/material.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';
import '../models/job.dart';

class JobCard extends StatelessWidget {
  final Job job;
  final VoidCallback onTap;
  final VoidCallback? onApply;
  final bool showApplyButton;

  const JobCard({
    super.key,
    required this.job,
    required this.onTap,
    this.onApply,
    this.showApplyButton = true,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context)!;
    
    final categoryColor = AppTheme.getCategoryColor(job.workType);
    
    return Card(
      clipBehavior: Clip.antiAlias,
      child: InkWell(
        onTap: onTap,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Category color strip
            Container(
              height: 4,
              width: double.infinity,
              color: categoryColor,
            ),
            
            Padding(
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header: Title and Wage
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Work type icon
                      Container(
                        padding: const EdgeInsets.all(AppTheme.spacingSm),
                        decoration: BoxDecoration(
                          color: categoryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                        ),
                        child: Icon(
                          _getWorkTypeIcon(job.workType),
                          color: categoryColor,
                          size: AppTheme.iconSizeMd,
                        ),
                      ),
                      const SizedBox(width: AppTheme.spacingSm),
                      
                      // Title and work type
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              job.title,
                              style: theme.textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w600,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Text(
                              l10n.getWorkType(job.workType),
                              style: theme.textTheme.bodySmall?.copyWith(
                                color: categoryColor,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),
                      
                      // Wage
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: AppTheme.spacingSm,
                          vertical: AppTheme.spacingXs,
                        ),
                        decoration: BoxDecoration(
                          color: AppTheme.successColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(AppTheme.radiusSm),
                        ),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.end,
                          children: [
                            Text(
                              '\u20B9${job.wage}',
                              style: theme.textTheme.titleMedium?.copyWith(
                                color: AppTheme.successColor,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            Text(
                              _getWageTypeLabel(job.wageType, l10n),
                              style: theme.textTheme.labelSmall?.copyWith(
                                color: AppTheme.successColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  
                  const SizedBox(height: AppTheme.spacingMd),
                  
                  // Location and Time
                  Row(
                    children: [
                      // Location
                      Expanded(
                        child: Row(
                          children: [
                            Icon(
                              Icons.location_on_outlined,
                              size: 16,
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                            const SizedBox(width: 4),
                            Expanded(
                              child: Text(
                                job.location,
                                style: theme.textTheme.bodySmall?.copyWith(
                                  color: theme.colorScheme.onSurfaceVariant,
                                ),
                                maxLines: 1,
                                overflow: TextOverflow.ellipsis,
                              ),
                            ),
                          ],
                        ),
                      ),
                      
                      // Time posted
                      Row(
                        children: [
                          Icon(
                            Icons.access_time_rounded,
                            size: 16,
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                          const SizedBox(width: 4),
                          Text(
                            _formatTimeAgo(job.createdAt, l10n),
                            style: theme.textTheme.bodySmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                  
                  // Headcount if available
                  if (job.headcount > 1) ...[
                    const SizedBox(height: AppTheme.spacingSm),
                    Row(
                      children: [
                        Icon(
                          Icons.group_outlined,
                          size: 16,
                          color: theme.colorScheme.onSurfaceVariant,
                        ),
                        const SizedBox(width: 4),
                        Text(
                          l10n.workersNeeded(job.headcount),
                          style: theme.textTheme.bodySmall?.copyWith(
                            color: theme.colorScheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ],
                  
                  // Skills
                  if (job.skills != null && job.skills!.isNotEmpty) ...[
                    const SizedBox(height: AppTheme.spacingSm),
                    Wrap(
                      spacing: AppTheme.spacingXs,
                      runSpacing: AppTheme.spacingXs,
                      children: job.skills!.take(3).map((skill) {
                        return Container(
                          padding: const EdgeInsets.symmetric(
                            horizontal: AppTheme.spacingSm,
                            vertical: 2,
                          ),
                          decoration: BoxDecoration(
                            color: theme.colorScheme.surfaceVariant,
                            borderRadius: BorderRadius.circular(AppTheme.radiusFull),
                          ),
                          child: Text(
                            skill,
                            style: theme.textTheme.labelSmall?.copyWith(
                              color: theme.colorScheme.onSurfaceVariant,
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                  ],
                  
                  // Status badge
                  if (job.status != 'open') ...[
                    const SizedBox(height: AppTheme.spacingSm),
                    _StatusBadge(status: job.status, l10n: l10n),
                  ],
                  
                  // Action buttons
                  if (showApplyButton && onApply != null) ...[
                    const SizedBox(height: AppTheme.spacingMd),
                    Row(
                      children: [
                        Expanded(
                          child: OutlinedButton(
                            onPressed: onTap,
                            child: Text(l10n.viewDetails),
                          ),
                        ),
                        const SizedBox(width: AppTheme.spacingSm),
                        Expanded(
                          child: ElevatedButton(
                            onPressed: onApply,
                            child: Text(l10n.apply),
                          ),
                        ),
                      ],
                    ),
                  ],
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  IconData _getWorkTypeIcon(String workType) {
    switch (workType.toLowerCase()) {
      case 'mason':
        return Icons.construction_rounded;
      case 'electrician':
        return Icons.electrical_services_rounded;
      case 'plumber':
        return Icons.plumbing_rounded;
      case 'carpenter':
        return Icons.handyman_rounded;
      case 'painter':
        return Icons.format_paint_rounded;
      case 'cleaner':
        return Icons.cleaning_services_rounded;
      case 'driver':
        return Icons.directions_car_rounded;
      case 'helper':
        return Icons.people_rounded;
      case 'cook':
        return Icons.restaurant_rounded;
      case 'gardener':
        return Icons.grass_rounded;
      case 'security':
        return Icons.security_rounded;
      case 'tailor':
        return Icons.checkroom_rounded;
      case 'mechanic':
        return Icons.build_rounded;
      case 'welder':
        return Icons.local_fire_department_rounded;
      default:
        return Icons.work_rounded;
    }
  }

  String _getWageTypeLabel(String wageType, AppLocalizations l10n) {
    switch (wageType.toLowerCase()) {
      case 'daily':
        return l10n.perDay;
      case 'hourly':
        return l10n.perHour;
      case 'fixed':
        return l10n.total;
      default:
        return wageType;
    }
  }

  String _formatTimeAgo(DateTime dateTime, AppLocalizations l10n) {
    final now = DateTime.now();
    final difference = now.difference(dateTime);

    if (difference.inDays > 0) {
      final days = difference.inDays;
      return '$days${l10n.daysAgo}';
    } else if (difference.inHours > 0) {
      final hours = difference.inHours;
      return '$hours${l10n.hoursAgo}';
    } else if (difference.inMinutes > 0) {
      final mins = difference.inMinutes;
      return '$mins${l10n.minutesAgo}';
    } else {
      return l10n.justNow;
    }
  }
}

class _StatusBadge extends StatelessWidget {
  final String status;
  final AppLocalizations l10n;

  const _StatusBadge({
    required this.status,
    required this.l10n,
  });

  @override
  Widget build(BuildContext context) {
    final (color, icon, label) = _getStatusInfo();
    
    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: AppTheme.spacingSm,
        vertical: AppTheme.spacingXs,
      ),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        borderRadius: BorderRadius.circular(AppTheme.radiusFull),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 14, color: color),
          const SizedBox(width: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w500,
              color: color,
            ),
          ),
        ],
      ),
    );
  }

  (Color, IconData, String) _getStatusInfo() {
    switch (status.toLowerCase()) {
      case 'in_progress':
        return (
          AppTheme.primaryColor,
          Icons.play_circle_outline_rounded,
          l10n.inProgress,
        );
      case 'awaiting_payment':
        return (
          AppTheme.warningColor,
          Icons.payment_rounded,
          l10n.awaitingPayment,
        );
      case 'paid':
        return (
          AppTheme.successColor,
          Icons.check_circle_outline_rounded,
          l10n.paid,
        );
      case 'completed':
        return (
          AppTheme.successColor,
          Icons.done_all_rounded,
          l10n.completed,
        );
      case 'cancelled':
        return (
          AppTheme.errorColor,
          Icons.cancel_outlined,
          l10n.cancelled,
        );
      default:
        return (
          AppTheme.infoColor,
          Icons.circle_outlined,
          l10n.open,
        );
    }
  }
}
