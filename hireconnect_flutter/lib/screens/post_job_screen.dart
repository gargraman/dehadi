import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../models/job.dart';
import '../services/api_service.dart';
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';

class PostJobScreen extends StatefulWidget {
  const PostJobScreen({Key? key}) : super(key: key);

  @override
  State<PostJobScreen> createState() => _PostJobScreenState();
}

class _PostJobScreenState extends State<PostJobScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _titleController = TextEditingController();
  final TextEditingController _descriptionController = TextEditingController();
  final TextEditingController _wageController = TextEditingController(text: '500');
  final TextEditingController _locationController = TextEditingController();
  
  String _selectedWorkType = 'mason';
  String _selectedWageType = 'day';
  int _selectedWorkerCount = 1;
  String _selectedStartDate = 'today';
  String _selectedDuration = 'oneWeek';
  Set<String> _selectedSkills = <String>{};
  
  bool _isLoading = false;
  bool _isGettingLocation = false;
  
  final List<String> _workTypes = [
    'mason', 'electrician', 'plumber', 'carpenter', 
    'painter', 'cleaner', 'driver', 'helper', 
    'cook', 'gardener', 'security', 'tailor',
    'mechanic', 'welder'
  ];
  
  final List<String> _skills = [
    'mason', 'electrician', 'plumber', 'carpenter', 
    'painter', 'cleaner', 'driver', 'helper', 
    'cook', 'gardener', 'security', 'tailor',
    'mechanic', 'welder'
  ];
  
  @override
  void dispose() {
    _titleController.dispose();
    _descriptionController.dispose();
    _wageController.dispose();
    _locationController.dispose();
    super.dispose();
  }
  
  Future<void> _postJob() async {
    if (!_formKey.currentState!.validate()) {
      return;
    }
    
    setState(() {
      _isLoading = true;
    });
    
    try {
      final job = Job(
        id: '',
        employerId: '',
        title: _titleController.text.trim(),
        description: _descriptionController.text.trim(),
        workType: _selectedWorkType,
        location: _locationController.text.trim(),
        wageType: _selectedWageType,
        wage: int.tryParse(_wageController.text) ?? 0,
        headcount: _selectedWorkerCount,
        skills: _selectedSkills.toList(),
        status: 'open',
        createdAt: DateTime.now(),
      );
      
      final createdJob = await ApiService.createJob(job);
      
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        
        if (createdJob != null) {
          final l10n = AppLocalizations.of(context);
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text(l10n?.jobPostedSuccess ?? 'Job posted successfully!'),
              backgroundColor: AppTheme.successColor,
              behavior: SnackBarBehavior.floating,
            ),
          );
          Navigator.pop(context, true);
        } else {
          _showErrorSnackBar();
        }
      }
    } catch (e) {
      if (mounted) {
        setState(() {
          _isLoading = false;
        });
        _showErrorSnackBar();
      }
    }
  }
  
  void _showErrorSnackBar() {
    final l10n = AppLocalizations.of(context);
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(l10n?.jobPostingFailed ?? 'Failed to post job. Please try again.'),
        backgroundColor: AppTheme.errorColor,
        behavior: SnackBarBehavior.floating,
        action: SnackBarAction(
          label: l10n?.tryAgain ?? 'Try Again',
          textColor: Colors.white,
          onPressed: _postJob,
        ),
      ),
    );
  }
  
  @override
  Widget build(BuildContext context) {
    final l10n = AppLocalizations.of(context);
    final theme = Theme.of(context);
    final isDark = theme.brightness == Brightness.dark;
    
    return Scaffold(
      appBar: AppBar(
        title: Text(l10n?.postNewJob ?? 'Post New Job'),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Form(
        key: _formKey,
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppTheme.spacingMd),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildJobCategorySection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildJobTitleSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildLocationSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildPaymentSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildWorkerCountSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildScheduleSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildSkillsSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingLg),
              
              _buildDescriptionSection(l10n, theme, isDark),
              const SizedBox(height: AppTheme.spacingXl),
              
              _buildActionButtons(l10n, theme),
              const SizedBox(height: AppTheme.spacingLg),
            ],
          ),
        ),
      ),
    );
  }
  
  Widget _buildSectionLabel(String label, IconData icon, ThemeData theme) {
    return Row(
      children: [
        Icon(icon, size: AppTheme.iconSizeSm, color: theme.colorScheme.primary),
        const SizedBox(width: AppTheme.spacingSm),
        Text(
          label,
          style: theme.textTheme.titleMedium?.copyWith(
            fontWeight: FontWeight.w600,
          ),
        ),
      ],
    );
  }
  
  Widget _buildJobCategorySection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.selectJobCategory ?? 'Select Job Category', Icons.category, theme),
        const SizedBox(height: AppTheme.spacingMd),
        Wrap(
          spacing: AppTheme.spacingSm,
          runSpacing: AppTheme.spacingSm,
          children: _workTypes.map((type) {
            final isSelected = _selectedWorkType == type;
            final color = AppTheme.categoryColors[type] ?? AppTheme.primaryColor;
            
            return FilterChip(
              label: Text(l10n?.getWorkType(type) ?? type),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  _selectedWorkType = type;
                  if (!_selectedSkills.contains(type)) {
                    _selectedSkills.add(type);
                  }
                });
              },
              selectedColor: color.withOpacity(0.2),
              checkmarkColor: color,
              labelStyle: TextStyle(
                color: isSelected ? color : theme.textTheme.bodyMedium?.color,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
              side: BorderSide(
                color: isSelected ? color : theme.dividerColor,
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.spacingSm,
                vertical: AppTheme.spacingXs,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
  
  Widget _buildJobTitleSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.jobTitle ?? 'Job Title', Icons.work, theme),
        const SizedBox(height: AppTheme.spacingMd),
        TextFormField(
          controller: _titleController,
          decoration: InputDecoration(
            hintText: l10n?.jobTitleHint ?? 'e.g. Mason for construction work',
            filled: true,
            fillColor: isDark ? AppTheme.surfaceDark : AppTheme.surfaceLight,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.colorScheme.primary, width: 2),
            ),
            errorBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: AppTheme.errorColor),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppTheme.spacingMd,
              vertical: AppTheme.spacingMd,
            ),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return l10n?.pleaseEnterJobTitle ?? 'Please enter a job title';
            }
            return null;
          },
          textInputAction: TextInputAction.next,
        ),
      ],
    );
  }
  
  Widget _buildLocationSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.location ?? 'Location', Icons.location_on, theme),
        const SizedBox(height: AppTheme.spacingMd),
        TextFormField(
          controller: _locationController,
          decoration: InputDecoration(
            hintText: l10n?.enterCityArea ?? 'Enter your city/area',
            filled: true,
            fillColor: isDark ? AppTheme.surfaceDark : AppTheme.surfaceLight,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.colorScheme.primary, width: 2),
            ),
            contentPadding: const EdgeInsets.symmetric(
              horizontal: AppTheme.spacingMd,
              vertical: AppTheme.spacingMd,
            ),
            suffixIcon: _isGettingLocation
                ? const Padding(
                    padding: EdgeInsets.all(12),
                    child: SizedBox(
                      width: 20,
                      height: 20,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    ),
                  )
                : IconButton(
                    icon: Icon(Icons.my_location, color: theme.colorScheme.primary),
                    onPressed: () {
                      setState(() {
                        _locationController.text = 'Mumbai, Maharashtra';
                      });
                    },
                    tooltip: l10n?.useCurrentLocation ?? 'Use Current Location',
                  ),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return l10n?.pleaseEnterLocation ?? 'Please enter a location';
            }
            return null;
          },
          textInputAction: TextInputAction.next,
        ),
      ],
    );
  }
  
  Widget _buildPaymentSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.payment ?? 'Payment', Icons.currency_rupee, theme),
        const SizedBox(height: AppTheme.spacingMd),
        Row(
          children: [
            Expanded(
              flex: 2,
              child: TextFormField(
                controller: _wageController,
                keyboardType: TextInputType.number,
                inputFormatters: [FilteringTextInputFormatter.digitsOnly],
                decoration: InputDecoration(
                  prefixText: 'Rs. ',
                  prefixStyle: TextStyle(
                    fontWeight: FontWeight.w600,
                    color: theme.textTheme.bodyLarge?.color,
                  ),
                  hintText: '500',
                  filled: true,
                  fillColor: isDark ? AppTheme.surfaceDark : AppTheme.surfaceLight,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    borderSide: BorderSide(color: theme.dividerColor),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    borderSide: BorderSide(color: theme.colorScheme.primary, width: 2),
                  ),
                  contentPadding: const EdgeInsets.symmetric(
                    horizontal: AppTheme.spacingMd,
                    vertical: AppTheme.spacingMd,
                  ),
                ),
                validator: (value) {
                  if (value == null || value.isEmpty) {
                    return l10n?.enterValidWage ?? 'Enter valid wage';
                  }
                  final wage = int.tryParse(value);
                  if (wage == null || wage <= 0) {
                    return l10n?.enterValidWage ?? 'Enter valid wage';
                  }
                  return null;
                },
              ),
            ),
            const SizedBox(width: AppTheme.spacingMd),
            Expanded(
              flex: 2,
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: AppTheme.spacingMd),
                decoration: BoxDecoration(
                  color: isDark ? AppTheme.surfaceDark : AppTheme.surfaceLight,
                  border: Border.all(color: theme.dividerColor),
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedWageType,
                    isExpanded: true,
                    items: [
                      DropdownMenuItem(
                        value: 'day',
                        child: Text(l10n?.perDay ?? 'per day'),
                      ),
                      DropdownMenuItem(
                        value: 'hour',
                        child: Text(l10n?.perHour ?? 'per hour'),
                      ),
                      DropdownMenuItem(
                        value: 'total',
                        child: Text(l10n?.total ?? 'total'),
                      ),
                    ],
                    onChanged: (value) {
                      if (value != null) {
                        setState(() {
                          _selectedWageType = value;
                        });
                      }
                    },
                  ),
                ),
              ),
            ),
          ],
        ),
      ],
    );
  }
  
  Widget _buildWorkerCountSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.workerCount ?? 'Workers Needed', Icons.people, theme),
        const SizedBox(height: AppTheme.spacingMd),
        Wrap(
          spacing: AppTheme.spacingSm,
          runSpacing: AppTheme.spacingSm,
          children: [1, 2, 3, 5, 10].map((count) {
            final isSelected = _selectedWorkerCount == count;
            
            return ChoiceChip(
              label: Text('$count'),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedWorkerCount = count;
                  });
                }
              },
              selectedColor: theme.colorScheme.primary.withOpacity(0.2),
              labelStyle: TextStyle(
                color: isSelected ? theme.colorScheme.primary : theme.textTheme.bodyMedium?.color,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
              padding: const EdgeInsets.symmetric(
                horizontal: AppTheme.spacingMd,
                vertical: AppTheme.spacingSm,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
  
  Widget _buildScheduleSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    final startDateOptions = [
      ('today', l10n?.today ?? 'Today'),
      ('tomorrow', l10n?.tomorrow ?? 'Tomorrow'),
      ('thisWeek', l10n?.thisWeek ?? 'This Week'),
    ];
    
    final durationOptions = [
      ('oneWeek', l10n?.oneWeek ?? '1 Week'),
      ('twoWeeks', l10n?.twoWeeks ?? '2 Weeks'),
      ('oneMonth', l10n?.oneMonth ?? '1 Month'),
      ('ongoing', l10n?.ongoing ?? 'Ongoing'),
    ];
    
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.startDate ?? 'Start Date', Icons.calendar_today, theme),
        const SizedBox(height: AppTheme.spacingMd),
        Wrap(
          spacing: AppTheme.spacingSm,
          runSpacing: AppTheme.spacingSm,
          children: startDateOptions.map((option) {
            final isSelected = _selectedStartDate == option.$1;
            
            return ChoiceChip(
              label: Text(option.$2),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedStartDate = option.$1;
                  });
                }
              },
              selectedColor: theme.colorScheme.primary.withOpacity(0.2),
              labelStyle: TextStyle(
                color: isSelected ? theme.colorScheme.primary : theme.textTheme.bodyMedium?.color,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            );
          }).toList(),
        ),
        const SizedBox(height: AppTheme.spacingLg),
        _buildSectionLabel(l10n?.duration ?? 'Duration', Icons.timelapse, theme),
        const SizedBox(height: AppTheme.spacingMd),
        Wrap(
          spacing: AppTheme.spacingSm,
          runSpacing: AppTheme.spacingSm,
          children: durationOptions.map((option) {
            final isSelected = _selectedDuration == option.$1;
            
            return ChoiceChip(
              label: Text(option.$2),
              selected: isSelected,
              onSelected: (selected) {
                if (selected) {
                  setState(() {
                    _selectedDuration = option.$1;
                  });
                }
              },
              selectedColor: theme.colorScheme.primary.withOpacity(0.2),
              labelStyle: TextStyle(
                color: isSelected ? theme.colorScheme.primary : theme.textTheme.bodyMedium?.color,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
  
  Widget _buildSkillsSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.requiredSkills ?? 'Required Skills', Icons.handyman, theme),
        const SizedBox(height: AppTheme.spacingMd),
        Wrap(
          spacing: AppTheme.spacingSm,
          runSpacing: AppTheme.spacingSm,
          children: _skills.map((skill) {
            final isSelected = _selectedSkills.contains(skill);
            final color = AppTheme.categoryColors[skill] ?? AppTheme.primaryColor;
            
            return FilterChip(
              label: Text(l10n?.getWorkType(skill) ?? skill),
              selected: isSelected,
              onSelected: (selected) {
                setState(() {
                  if (selected) {
                    _selectedSkills.add(skill);
                  } else {
                    _selectedSkills.remove(skill);
                  }
                });
              },
              selectedColor: color.withOpacity(0.2),
              checkmarkColor: color,
              labelStyle: TextStyle(
                color: isSelected ? color : theme.textTheme.bodyMedium?.color,
                fontWeight: isSelected ? FontWeight.w600 : FontWeight.normal,
              ),
              side: BorderSide(
                color: isSelected ? color : theme.dividerColor,
              ),
            );
          }).toList(),
        ),
      ],
    );
  }
  
  Widget _buildDescriptionSection(AppLocalizations? l10n, ThemeData theme, bool isDark) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSectionLabel(l10n?.description ?? 'Description', Icons.description, theme),
        const SizedBox(height: AppTheme.spacingMd),
        TextFormField(
          controller: _descriptionController,
          maxLines: 4,
          decoration: InputDecoration(
            hintText: l10n?.descriptionHint ?? 'Describe the work, requirements, and any special instructions',
            filled: true,
            fillColor: isDark ? AppTheme.surfaceDark : AppTheme.surfaceLight,
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.dividerColor),
            ),
            focusedBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              borderSide: BorderSide(color: theme.colorScheme.primary, width: 2),
            ),
            contentPadding: const EdgeInsets.all(AppTheme.spacingMd),
          ),
          validator: (value) {
            if (value == null || value.trim().isEmpty) {
              return l10n?.pleaseEnterDescription ?? 'Please enter a job description';
            }
            return null;
          },
        ),
      ],
    );
  }
  
  Widget _buildActionButtons(AppLocalizations? l10n, ThemeData theme) {
    return Row(
      children: [
        Expanded(
          child: OutlinedButton(
            onPressed: _isLoading ? null : () => Navigator.pop(context),
            style: OutlinedButton.styleFrom(
              minimumSize: const Size(0, AppTheme.buttonHeight),
              side: BorderSide(color: theme.colorScheme.primary),
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              ),
            ),
            child: Text(
              l10n?.saveAsDraft ?? 'Save as Draft',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w600,
                color: theme.colorScheme.primary,
              ),
            ),
          ),
        ),
        const SizedBox(width: AppTheme.spacingMd),
        Expanded(
          child: FilledButton(
            onPressed: _isLoading ? null : _postJob,
            style: FilledButton.styleFrom(
              minimumSize: const Size(0, AppTheme.buttonHeight),
              backgroundColor: theme.colorScheme.primary,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              ),
            ),
            child: _isLoading
                ? const SizedBox(
                    width: 24,
                    height: 24,
                    child: CircularProgressIndicator(
                      strokeWidth: 2,
                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                    ),
                  )
                : Text(
                    l10n?.postJobButton ?? 'Post Job',
                    style: const TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w600,
                      color: Colors.white,
                    ),
                  ),
          ),
        ),
      ],
    );
  }
}
