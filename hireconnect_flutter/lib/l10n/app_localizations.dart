import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;
  
  AppLocalizations(this.locale);
  
  static AppLocalizations? of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations);
  }
  
  static const LocalizationsDelegate<AppLocalizations> delegate = _AppLocalizationsDelegate();
  
  static final Map<String, Map<String, String>> _localizedStrings = {
    'en': _englishStrings,
    'hi': _hindiStrings,
  };
  
  String get(String key) {
    return _localizedStrings[locale.languageCode]?[key] ?? 
           _localizedStrings['en']?[key] ?? 
           key;
  }
  
  // App general
  String get appTitle => get('appTitle');
  
  // Navigation
  String get navHome => get('navHome');
  String get navSearch => get('navSearch');
  String get navNearby => get('navNearby');
  String get navMessages => get('navMessages');
  String get navProfile => get('navProfile');
  
  // Login screen
  String get welcomeBack => get('welcomeBack');
  String get signInToAccount => get('signInToAccount');
  String get username => get('username');
  String get enterUsername => get('enterUsername');
  String get password => get('password');
  String get enterPassword => get('enterPassword');
  String get login => get('login');
  String get noAccount => get('noAccount');
  String get register => get('register');
  String get pleaseEnterUsername => get('pleaseEnterUsername');
  String get pleaseEnterPassword => get('pleaseEnterPassword');
  
  // Register screen
  String get createAccount => get('createAccount');
  String get joinMarketplace => get('joinMarketplace');
  String get iAm => get('iAm');
  String get worker => get('worker');
  String get employer => get('employer');
  String get lookingForWork => get('lookingForWork');
  String get hiringWorkers => get('hiringWorkers');
  String get fullName => get('fullName');
  String get enterFullName => get('enterFullName');
  String get chooseUsername => get('chooseUsername');
  String get createPassword => get('createPassword');
  String get phoneNumber => get('phoneNumber');
  String get enterPhoneNumber => get('enterPhoneNumber');
  String get location => get('location');
  String get enterCityArea => get('enterCityArea');
  String get yourSkills => get('yourSkills');
  String get aadharOptional => get('aadharOptional');
  String get enterAadhar => get('enterAadhar');
  String get alreadyHaveAccount => get('alreadyHaveAccount');
  String get pleaseEnterName => get('pleaseEnterName');
  String get usernameMinChars => get('usernameMinChars');
  String get passwordMinChars => get('passwordMinChars');
  String get pleaseEnterPhone => get('pleaseEnterPhone');
  String get enterValidPhone => get('enterValidPhone');
  String get pleaseEnterLocation => get('pleaseEnterLocation');
  String get aadhar12Digits => get('aadhar12Digits');
  String get aadharDigitsOnly => get('aadharDigitsOnly');
  
  // Home screen
  String get hi => get('hi');
  String get findWorkToday => get('findWorkToday');
  String get yourLocation => get('yourLocation');
  String get gettingLocation => get('gettingLocation');
  String get refreshLocation => get('refreshLocation');
  String get activeApps => get('activeApps');
  String get totalEarned => get('totalEarned');
  String get searchPlaceholder => get('searchPlaceholder');
  String get jobCategories => get('jobCategories');
  String get seeAll => get('seeAll');
  String get recommendedJobs => get('recommendedJobs');
  String get noJobsAvailable => get('noJobsAvailable');
  String get toggleTheme => get('toggleTheme');
  String get notifications => get('notifications');
  String get profile => get('profile');
  String get logout => get('logout');
  
  // Search screen
  String get searchJobs => get('searchJobs');
  String get workType => get('workType');
  String get wage => get('wage');
  String get sortBy => get('sortBy');
  String get all => get('all');
  String get any => get('any');
  String get recent => get('recent');
  String get highPay => get('highPay');
  String get lowPay => get('lowPay');
  String get noJobsFound => get('noJobsFound');
  String get tryDifferentSearch => get('tryDifferentSearch');
  String get clearAll => get('clearAll');
  String jobsFound(int count) => get('jobsFound').replaceAll('{count}', count.toString());
  
  // Job card
  String get viewDetails => get('viewDetails');
  String get apply => get('apply');
  String get perDay => get('perDay');
  String get perHour => get('perHour');
  String get total => get('total');
  String workersNeeded(int count) => get('workersNeeded').replaceAll('{count}', count.toString());
  String get daysAgo => get('daysAgo');
  String get hoursAgo => get('hoursAgo');
  String get minutesAgo => get('minutesAgo');
  String get justNow => get('justNow');
  String get inProgress => get('inProgress');
  String get awaitingPayment => get('awaitingPayment');
  String get paid => get('paid');
  String get completed => get('completed');
  String get cancelled => get('cancelled');
  String get open => get('open');
  String get appliedSuccessfully => get('appliedSuccessfully');
  
  // Profile screen
  String get skills => get('skills');
  String get edit => get('edit');
  String get noSkillsAdded => get('noSkillsAdded');
  String get jobsDone => get('jobsDone');
  String get rating => get('rating');
  String get language => get('language');
  String get theme => get('theme');
  String get darkMode => get('darkMode');
  String get lightMode => get('lightMode');
  String get manageNotifications => get('manageNotifications');
  String get help => get('help');
  String get supportCenter => get('supportCenter');
  String get about => get('about');
  String get couldNotLoadProfile => get('couldNotLoadProfile');
  String get retry => get('retry');
  
  // Language selection
  String get selectLanguage => get('selectLanguage');
  String get continueButton => get('continueButton');
  String get changeLanguageAnytime => get('changeLanguageAnytime');
  
  // Voice search
  String get listening => get('listening');
  String get speakNow => get('speakNow');
  String get voiceSearchNotAvailable => get('voiceSearchNotAvailable');
  String get stop => get('stop');
  
  // Onboarding
  String get chooseYourRole => get('chooseYourRole');
  String get workerRoleDescription => get('workerRoleDescription');
  String get employerRoleDescription => get('employerRoleDescription');
  String get selectYourSkills => get('selectYourSkills');
  String get selectAtLeastOneSkill => get('selectAtLeastOneSkill');
  String get whatSkillsDoYouHave => get('whatSkillsDoYouHave');
  String get next => get('next');
  String get back => get('back');
  String get getStarted => get('getStarted');
  String get skip => get('skip');
  String get almostDone => get('almostDone');
  String get letsGetStarted => get('letsGetStarted');
  String get findWorkNearYou => get('findWorkNearYou');
  String get hireSkillWorkers => get('hireSkillWorkers');
  
  // Post Job Screen
  String get postNewJob => get('postNewJob');
  String get jobTitle => get('jobTitle');
  String get enterJobTitle => get('enterJobTitle');
  String get jobTitleHint => get('jobTitleHint');
  String get description => get('description');
  String get enterDescription => get('enterDescription');
  String get descriptionHint => get('descriptionHint');
  String get payment => get('payment');
  String get wageAmount => get('wageAmount');
  String get selectWageType => get('selectWageType');
  String get workerCount => get('workerCount');
  String get selectWorkerCount => get('selectWorkerCount');
  String get startDate => get('startDate');
  String get selectStartDate => get('selectStartDate');
  String get duration => get('duration');
  String get selectDuration => get('selectDuration');
  String get requiredSkills => get('requiredSkills');
  String get selectSkills => get('selectSkills');
  String get postJobButton => get('postJobButton');
  String get saveAsDraft => get('saveAsDraft');
  String get jobPostedSuccess => get('jobPostedSuccess');
  String get jobPostingFailed => get('jobPostingFailed');
  String get pleaseEnterJobTitle => get('pleaseEnterJobTitle');
  String get pleaseEnterDescription => get('pleaseEnterDescription');
  String get enterValidWage => get('enterValidWage');
  String get today => get('today');
  String get tomorrow => get('tomorrow');
  String get thisWeek => get('thisWeek');
  String get oneWeek => get('oneWeek');
  String get twoWeeks => get('twoWeeks');
  String get oneMonth => get('oneMonth');
  String get ongoing => get('ongoing');
  String get postingJob => get('postingJob');
  String get useCurrentLocation => get('useCurrentLocation');
  String get enterLocationManually => get('enterLocationManually');
  String get selectJobCategory => get('selectJobCategory');
  String get workersLabel => get('workersLabel');
  
  // Employer Dashboard
  String get employerHub => get('employerHub');
  String get myJobs => get('myJobs');
  String get applications => get('applications');
  String get activeJobs => get('activeJobs');
  String get totalSpent => get('totalSpent');
  String get workersHired => get('workersHired');
  String get noJobsPosted => get('noJobsPosted');
  String get postFirstJob => get('postFirstJob');
  
  // Messages screen
  String get messages => get('messages');
  String get newChat => get('newChat');
  String get noMessages => get('noMessages');
  String get noConversations => get('noConversations');
  String get startConversation => get('startConversation');
  String get typeMessage => get('typeMessage');
  String get send => get('send');
  
  // Job Details screen
  String get jobDetails => get('jobDetails');
  String get nearbyJobs => get('nearbyJobs');
  String get searchRadius => get('searchRadius');
  
  // Common actions
  String get settings => get('settings');
  String get call => get('call');
  String get message => get('message');
  
  // Error messages
  String get networkError => get('networkError');
  String get tryAgain => get('tryAgain');
  String get somethingWentWrong => get('somethingWentWrong');
  
  // Work types / Skills
  String get mason => get('mason');
  String get electrician => get('electrician');
  String get plumber => get('plumber');
  String get carpenter => get('carpenter');
  String get painter => get('painter');
  String get cleaner => get('cleaner');
  String get driver => get('driver');
  String get helper => get('helper');
  String get cook => get('cook');
  String get gardener => get('gardener');
  String get security => get('security');
  String get tailor => get('tailor');
  String get mechanic => get('mechanic');
  String get welder => get('welder');
  
  String getWorkType(String key) {
    final workTypes = {
      'mason': mason,
      'electrician': electrician,
      'plumber': plumber,
      'carpenter': carpenter,
      'painter': painter,
      'cleaner': cleaner,
      'driver': driver,
      'helper': helper,
      'cook': cook,
      'gardener': gardener,
      'security': security,
      'tailor': tailor,
      'mechanic': mechanic,
      'welder': welder,
    };
    return workTypes[key.toLowerCase()] ?? key;
  }
}

class _AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const _AppLocalizationsDelegate();
  
  @override
  bool isSupported(Locale locale) {
    return ['en', 'hi'].contains(locale.languageCode);
  }
  
  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }
  
  @override
  bool shouldReload(_AppLocalizationsDelegate old) => false;
}

const Map<String, String> _englishStrings = {
  // App general
  'appTitle': 'HireConnect',
  
  // Navigation
  'navHome': 'Home',
  'navSearch': 'Search',
  'navNearby': 'Nearby',
  'navMessages': 'Messages',
  'navProfile': 'Profile',
  
  // Login screen
  'welcomeBack': 'Welcome Back',
  'signInToAccount': 'Sign in to your account',
  'username': 'Username',
  'enterUsername': 'Enter your username',
  'password': 'Password',
  'enterPassword': 'Enter your password',
  'login': 'Login',
  'noAccount': "Don't have an account?",
  'register': 'Register',
  'pleaseEnterUsername': 'Please enter your username',
  'pleaseEnterPassword': 'Please enter your password',
  
  // Register screen
  'createAccount': 'Create Your Account',
  'joinMarketplace': "Join India's largest worker marketplace",
  'iAm': 'I am a:',
  'worker': 'Worker',
  'employer': 'Employer',
  'lookingForWork': 'Looking for work',
  'hiringWorkers': 'Hiring workers',
  'fullName': 'Full Name',
  'enterFullName': 'Enter your full name',
  'chooseUsername': 'Choose a username',
  'createPassword': 'Create a password',
  'phoneNumber': 'Phone Number',
  'enterPhoneNumber': 'Enter your phone number',
  'location': 'Location',
  'enterCityArea': 'Enter your city/area',
  'yourSkills': 'Your Skills:',
  'aadharOptional': 'Aadhar Number (Optional)',
  'enterAadhar': 'Enter your Aadhar number',
  'alreadyHaveAccount': 'Already have an account?',
  'pleaseEnterName': 'Please enter your name',
  'usernameMinChars': 'Username must be at least 3 characters',
  'passwordMinChars': 'Password must be at least 6 characters',
  'pleaseEnterPhone': 'Please enter your phone number',
  'enterValidPhone': 'Please enter a valid phone number',
  'pleaseEnterLocation': 'Please enter your location',
  'aadhar12Digits': 'Aadhar number must be 12 digits',
  'aadharDigitsOnly': 'Aadhar number must contain only digits',
  
  // Home screen
  'hi': 'Hi',
  'findWorkToday': 'Find work for today',
  'yourLocation': 'Your Location',
  'gettingLocation': 'Getting location...',
  'refreshLocation': 'Refresh location',
  'activeApps': 'Active Apps',
  'totalEarned': 'Total Earned',
  'searchPlaceholder': 'Search jobs, skills, location',
  'jobCategories': 'Job Categories',
  'seeAll': 'See All',
  'recommendedJobs': 'Recommended Jobs',
  'noJobsAvailable': 'No jobs available',
  'toggleTheme': 'Toggle theme',
  'notifications': 'Notifications',
  'profile': 'Profile',
  'logout': 'Logout',
  
  // Search screen
  'searchJobs': 'Search Jobs',
  'workType': 'Work Type',
  'wage': 'Wage',
  'sortBy': 'Sort',
  'all': 'All',
  'any': 'Any',
  'recent': 'Recent',
  'highPay': 'High Pay',
  'lowPay': 'Low Pay',
  'noJobsFound': 'No jobs found',
  'tryDifferentSearch': 'Try a different search or change filters',
  'clearAll': 'Clear All',
  'jobsFound': '{count} jobs found',
  
  // Job card
  'viewDetails': 'View Details',
  'apply': 'Apply',
  'perDay': 'per day',
  'perHour': 'per hour',
  'total': 'total',
  'workersNeeded': '{count} workers needed',
  'daysAgo': 'd ago',
  'hoursAgo': 'h ago',
  'minutesAgo': 'm ago',
  'justNow': 'Just now',
  'inProgress': 'In Progress',
  'awaitingPayment': 'Awaiting Payment',
  'paid': 'Paid',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'open': 'Open',
  'appliedSuccessfully': 'Applied to job successfully!',
  
  // Profile screen
  'skills': 'Skills',
  'edit': 'Edit',
  'noSkillsAdded': 'No skills added',
  'jobsDone': 'Jobs Done',
  'rating': 'Rating',
  'language': 'Language',
  'theme': 'Theme',
  'darkMode': 'Dark Mode',
  'lightMode': 'Light Mode',
  'manageNotifications': 'Manage notifications',
  'help': 'Help',
  'supportCenter': 'Support center',
  'about': 'About',
  'couldNotLoadProfile': 'Could not load profile',
  'retry': 'Retry',
  
  // Language selection
  'selectLanguage': 'Select Your Language',
  'continueButton': 'Continue',
  'changeLanguageAnytime': 'You can change this later in settings',
  
  // Voice search
  'listening': 'Listening...',
  'speakNow': 'Speak now',
  'voiceSearchNotAvailable': 'Voice search not available',
  'stop': 'Stop',
  
  // Onboarding
  'chooseYourRole': 'How will you use HireConnect?',
  'workerRoleDescription': 'Find daily wage jobs near you',
  'employerRoleDescription': 'Post jobs and hire skilled workers',
  'selectYourSkills': 'Select Your Skills',
  'selectAtLeastOneSkill': 'Please select at least one skill',
  'whatSkillsDoYouHave': 'What work can you do?',
  'next': 'Next',
  'back': 'Back',
  'getStarted': 'Get Started',
  'skip': 'Skip',
  'almostDone': 'Almost done!',
  'letsGetStarted': "Let's get started",
  'findWorkNearYou': 'Find work opportunities near you',
  'hireSkillWorkers': 'Hire skilled workers quickly',
  
  // Post Job Screen
  'postNewJob': 'Post New Job',
  'jobTitle': 'Job Title',
  'enterJobTitle': 'Enter job title',
  'jobTitleHint': 'e.g. Mason for construction work',
  'description': 'Description',
  'enterDescription': 'Enter job description',
  'descriptionHint': 'Describe the work, requirements, and any special instructions',
  'payment': 'Payment',
  'wageAmount': 'Wage Amount',
  'selectWageType': 'Payment Type',
  'workerCount': 'Workers Needed',
  'selectWorkerCount': 'How many workers?',
  'startDate': 'Start Date',
  'selectStartDate': 'When should work begin?',
  'duration': 'Duration',
  'selectDuration': 'How long is the job?',
  'requiredSkills': 'Required Skills',
  'selectSkills': 'Select skills needed',
  'postJobButton': 'Post Job',
  'saveAsDraft': 'Save as Draft',
  'jobPostedSuccess': 'Job posted successfully!',
  'jobPostingFailed': 'Failed to post job. Please try again.',
  'pleaseEnterJobTitle': 'Please enter a job title',
  'pleaseEnterDescription': 'Please enter a job description',
  'enterValidWage': 'Please enter a valid wage amount',
  'today': 'Today',
  'tomorrow': 'Tomorrow',
  'thisWeek': 'This Week',
  'oneWeek': '1 Week',
  'twoWeeks': '2 Weeks',
  'oneMonth': '1 Month',
  'ongoing': 'Ongoing',
  'postingJob': 'Posting job...',
  'useCurrentLocation': 'Use Current Location',
  'enterLocationManually': 'Enter location manually',
  'selectJobCategory': 'Select Job Category',
  'workersLabel': 'workers',
  
  // Employer Dashboard
  'employerHub': 'Employer Hub',
  'myJobs': 'My Jobs',
  'applications': 'Applications',
  'activeJobs': 'Active Jobs',
  'totalSpent': 'Total Spent',
  'workersHired': 'Workers Hired',
  'noJobsPosted': 'No jobs posted yet',
  'postFirstJob': 'Post your first job to get started',
  
  // Messages screen
  'messages': 'Messages',
  'newChat': 'New Chat',
  'noMessages': 'No messages yet',
  'noConversations': 'No conversations yet',
  'startConversation': 'Start a conversation with an employer',
  'typeMessage': 'Type a message...',
  'send': 'Send',
  
  // Job Details screen
  'jobDetails': 'Job Details',
  'nearbyJobs': 'Nearby Jobs',
  'searchRadius': 'Select Search Radius',
  
  // Common actions
  'settings': 'Settings',
  'call': 'Call',
  'message': 'Message',
  
  // Error messages
  'networkError': 'Network error. Please check your connection.',
  'tryAgain': 'Try Again',
  'somethingWentWrong': 'Something went wrong',
  
  // Work types / Skills
  'mason': 'Mason',
  'electrician': 'Electrician',
  'plumber': 'Plumber',
  'carpenter': 'Carpenter',
  'painter': 'Painter',
  'cleaner': 'Cleaner',
  'driver': 'Driver',
  'helper': 'Helper',
  'cook': 'Cook',
  'gardener': 'Gardener',
  'security': 'Security',
  'tailor': 'Tailor',
  'mechanic': 'Mechanic',
  'welder': 'Welder',
};

const Map<String, String> _hindiStrings = {
  // App general
  'appTitle': 'हायरकनेक्ट',
  
  // Navigation
  'navHome': 'होम',
  'navSearch': 'खोजें',
  'navNearby': 'आस-पास',
  'navMessages': 'संदेश',
  'navProfile': 'प्रोफ़ाइल',
  
  // Login screen
  'welcomeBack': 'वापस स्वागत है',
  'signInToAccount': 'अपने खाते में साइन इन करें',
  'username': 'यूज़रनेम',
  'enterUsername': 'अपना यूज़रनेम दर्ज करें',
  'password': 'पासवर्ड',
  'enterPassword': 'अपना पासवर्ड दर्ज करें',
  'login': 'लॉगिन',
  'noAccount': 'खाता नहीं है?',
  'register': 'रजिस्टर करें',
  'pleaseEnterUsername': 'कृपया यूज़रनेम दर्ज करें',
  'pleaseEnterPassword': 'कृपया पासवर्ड दर्ज करें',
  
  // Register screen
  'createAccount': 'अपना खाता बनाएं',
  'joinMarketplace': 'भारत के सबसे बड़े वर्कर मार्केटप्लेस से जुड़ें',
  'iAm': 'मैं हूं:',
  'worker': 'कामगार',
  'employer': 'नियोक्ता',
  'lookingForWork': 'काम की तलाश में',
  'hiringWorkers': 'कामगार ढूंढ रहा हूं',
  'fullName': 'पूरा नाम',
  'enterFullName': 'अपना पूरा नाम दर्ज करें',
  'chooseUsername': 'यूज़रनेम चुनें',
  'createPassword': 'पासवर्ड बनाएं',
  'phoneNumber': 'फ़ोन नंबर',
  'enterPhoneNumber': 'अपना फ़ोन नंबर दर्ज करें',
  'location': 'स्थान',
  'enterCityArea': 'अपना शहर/क्षेत्र दर्ज करें',
  'yourSkills': 'आपके कौशल:',
  'aadharOptional': 'आधार नंबर (वैकल्पिक)',
  'enterAadhar': 'अपना आधार नंबर दर्ज करें',
  'alreadyHaveAccount': 'पहले से खाता है?',
  'pleaseEnterName': 'कृपया अपना नाम दर्ज करें',
  'usernameMinChars': 'यूज़रनेम कम से कम 3 अक्षर का होना चाहिए',
  'passwordMinChars': 'पासवर्ड कम से कम 6 अक्षर का होना चाहिए',
  'pleaseEnterPhone': 'कृपया फ़ोन नंबर दर्ज करें',
  'enterValidPhone': 'कृपया सही फ़ोन नंबर दर्ज करें',
  'pleaseEnterLocation': 'कृपया स्थान दर्ज करें',
  'aadhar12Digits': 'आधार नंबर 12 अंकों का होना चाहिए',
  'aadharDigitsOnly': 'आधार नंबर में केवल अंक होने चाहिए',
  
  // Home screen
  'hi': 'नमस्ते',
  'findWorkToday': 'आज के लिए काम खोजें',
  'yourLocation': 'आपका स्थान',
  'gettingLocation': 'स्थान प्राप्त कर रहे हैं...',
  'refreshLocation': 'स्थान रीफ्रेश करें',
  'activeApps': 'सक्रिय आवेदन',
  'totalEarned': 'कुल कमाई',
  'searchPlaceholder': 'नौकरी, कौशल या स्थान खोजें',
  'jobCategories': 'नौकरी श्रेणियां',
  'seeAll': 'सभी देखें',
  'recommendedJobs': 'सुझाई गई नौकरियां',
  'noJobsAvailable': 'कोई नौकरी उपलब्ध नहीं',
  'toggleTheme': 'थीम बदलें',
  'notifications': 'सूचनाएं',
  'profile': 'प्रोफ़ाइल',
  'logout': 'लॉगआउट',
  
  // Search screen
  'searchJobs': 'नौकरी खोजें',
  'workType': 'काम का प्रकार',
  'wage': 'वेतन',
  'sortBy': 'क्रम',
  'all': 'सभी',
  'any': 'कोई भी',
  'recent': 'सबसे नया',
  'highPay': 'ज़्यादा वेतन',
  'lowPay': 'कम वेतन',
  'noJobsFound': 'कोई नौकरी नहीं मिली',
  'tryDifferentSearch': 'कोई और खोज आज़माएं या फ़िल्टर बदलें',
  'clearAll': 'सभी हटाएं',
  'jobsFound': '{count} नौकरियां मिलीं',
  
  // Job card
  'viewDetails': 'विवरण देखें',
  'apply': 'आवेदन करें',
  'perDay': 'प्रति दिन',
  'perHour': 'प्रति घंटा',
  'total': 'कुल',
  'workersNeeded': '{count} कामगारों की ज़रूरत',
  'daysAgo': 'दिन पहले',
  'hoursAgo': 'घंटे पहले',
  'minutesAgo': 'मिनट पहले',
  'justNow': 'अभी',
  'inProgress': 'प्रगति में',
  'awaitingPayment': 'भुगतान बाकी',
  'paid': 'भुगतान हो गया',
  'completed': 'पूर्ण',
  'cancelled': 'रद्द',
  'open': 'खुला',
  'appliedSuccessfully': 'नौकरी के लिए आवेदन किया गया!',
  
  // Profile screen
  'skills': 'कौशल',
  'edit': 'संपादित करें',
  'noSkillsAdded': 'कोई कौशल नहीं जोड़ा गया',
  'jobsDone': 'पूर्ण नौकरियां',
  'rating': 'रेटिंग',
  'language': 'भाषा',
  'theme': 'थीम',
  'darkMode': 'डार्क मोड',
  'lightMode': 'लाइट मोड',
  'manageNotifications': 'सूचनाएं प्रबंधित करें',
  'help': 'मदद',
  'supportCenter': 'सहायता केंद्र',
  'about': 'हमारे बारे में',
  'couldNotLoadProfile': 'प्रोफ़ाइल लोड नहीं हो सकी',
  'retry': 'पुनः प्रयास करें',
  
  // Language selection
  'selectLanguage': 'अपनी भाषा चुनें',
  'continueButton': 'जारी रखें',
  'changeLanguageAnytime': 'आप इसे बाद में सेटिंग्स में बदल सकते हैं',
  
  // Voice search
  'listening': 'सुन रहा हूं...',
  'speakNow': 'अब बोलिए',
  'voiceSearchNotAvailable': 'वॉयस सर्च उपलब्ध नहीं है',
  'stop': 'रोकें',
  
  // Onboarding
  'chooseYourRole': 'आप HireConnect का उपयोग कैसे करेंगे?',
  'workerRoleDescription': 'अपने पास काम खोजें',
  'employerRoleDescription': 'नौकरी पोस्ट करें और कुशल कामगार भर्ती करें',
  'selectYourSkills': 'अपने कौशल चुनें',
  'selectAtLeastOneSkill': 'कृपया कम से कम एक कौशल चुनें',
  'whatSkillsDoYouHave': 'आप कौन सा काम कर सकते हैं?',
  'next': 'आगे',
  'back': 'वापस',
  'getStarted': 'शुरू करें',
  'skip': 'छोड़ें',
  'almostDone': 'लगभग हो गया!',
  'letsGetStarted': 'चलिए शुरू करते हैं',
  'findWorkNearYou': 'अपने पास काम के अवसर खोजें',
  'hireSkillWorkers': 'जल्दी से कुशल कामगार भर्ती करें',
  
  // Post Job Screen
  'postNewJob': 'नई नौकरी पोस्ट करें',
  'jobTitle': 'नौकरी का शीर्षक',
  'enterJobTitle': 'नौकरी का शीर्षक दर्ज करें',
  'jobTitleHint': 'जैसे: निर्माण कार्य के लिए राजमिस्त्री',
  'description': 'विवरण',
  'enterDescription': 'नौकरी का विवरण दर्ज करें',
  'descriptionHint': 'काम, आवश्यकताएं और कोई विशेष निर्देश बताएं',
  'payment': 'भुगतान',
  'wageAmount': 'वेतन राशि',
  'selectWageType': 'भुगतान प्रकार',
  'workerCount': 'कामगारों की संख्या',
  'selectWorkerCount': 'कितने कामगार चाहिए?',
  'startDate': 'शुरुआत की तारीख',
  'selectStartDate': 'काम कब शुरू होना चाहिए?',
  'duration': 'अवधि',
  'selectDuration': 'नौकरी कितने समय की है?',
  'requiredSkills': 'आवश्यक कौशल',
  'selectSkills': 'आवश्यक कौशल चुनें',
  'postJobButton': 'नौकरी पोस्ट करें',
  'saveAsDraft': 'ड्राफ्ट सेव करें',
  'jobPostedSuccess': 'नौकरी सफलतापूर्वक पोस्ट हो गई!',
  'jobPostingFailed': 'नौकरी पोस्ट करने में विफल। कृपया पुनः प्रयास करें।',
  'pleaseEnterJobTitle': 'कृपया नौकरी का शीर्षक दर्ज करें',
  'pleaseEnterDescription': 'कृपया नौकरी का विवरण दर्ज करें',
  'enterValidWage': 'कृपया सही वेतन राशि दर्ज करें',
  'today': 'आज',
  'tomorrow': 'कल',
  'thisWeek': 'इस हफ्ते',
  'oneWeek': '1 हफ्ता',
  'twoWeeks': '2 हफ्ते',
  'oneMonth': '1 महीना',
  'ongoing': 'चालू',
  'postingJob': 'नौकरी पोस्ट हो रही है...',
  'useCurrentLocation': 'वर्तमान स्थान उपयोग करें',
  'enterLocationManually': 'स्थान मैन्युअल रूप से दर्ज करें',
  'selectJobCategory': 'नौकरी श्रेणी चुनें',
  'workersLabel': 'कामगार',
  
  // Employer Dashboard
  'employerHub': 'नियोक्ता हब',
  'myJobs': 'मेरी नौकरियां',
  'applications': 'आवेदन',
  'activeJobs': 'सक्रिय नौकरियां',
  'totalSpent': 'कुल खर्च',
  'workersHired': 'भर्ती कामगार',
  'noJobsPosted': 'अभी तक कोई नौकरी पोस्ट नहीं की',
  'postFirstJob': 'शुरू करने के लिए अपनी पहली नौकरी पोस्ट करें',
  
  // Messages screen
  'messages': 'संदेश',
  'newChat': 'नई चैट',
  'noMessages': 'अभी तक कोई संदेश नहीं',
  'noConversations': 'अभी तक कोई बातचीत नहीं',
  'startConversation': 'किसी नियोक्ता से बातचीत शुरू करें',
  'typeMessage': 'संदेश लिखें...',
  'send': 'भेजें',
  
  // Job Details screen
  'jobDetails': 'नौकरी विवरण',
  'nearbyJobs': 'आस-पास की नौकरियां',
  'searchRadius': 'खोज दायरा चुनें',
  
  // Common actions
  'settings': 'सेटिंग्स',
  'call': 'कॉल करें',
  'message': 'संदेश',
  
  // Error messages
  'networkError': 'नेटवर्क त्रुटि। कृपया अपना कनेक्शन जांचें।',
  'tryAgain': 'पुनः प्रयास करें',
  'somethingWentWrong': 'कुछ गलत हो गया',
  
  // Work types / Skills
  'mason': 'राजमिस्त्री',
  'electrician': 'इलेक्ट्रीशियन',
  'plumber': 'प्लंबर',
  'carpenter': 'बढ़ई',
  'painter': 'पेंटर',
  'cleaner': 'सफाईकर्मी',
  'driver': 'ड्राइवर',
  'helper': 'हेल्पर',
  'cook': 'रसोइया',
  'gardener': 'माली',
  'security': 'सुरक्षा गार्ड',
  'tailor': 'दर्ज़ी',
  'mechanic': 'मैकेनिक',
  'welder': 'वेल्डर',
};
