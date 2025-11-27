import 'package:flutter/material.dart';
import 'package:speech_to_text/speech_to_text.dart' as stt;
import '../config/app_theme.dart';
import '../l10n/app_localizations.dart';

class VoiceSearchButton extends StatefulWidget {
  final Function(String) onResult;
  final String locale;
  final bool enabled;
  
  const VoiceSearchButton({
    super.key,
    required this.onResult,
    this.locale = 'en_IN',
    this.enabled = true,
  });

  @override
  State<VoiceSearchButton> createState() => _VoiceSearchButtonState();
}

class _VoiceSearchButtonState extends State<VoiceSearchButton>
    with SingleTickerProviderStateMixin {
  final stt.SpeechToText _speech = stt.SpeechToText();
  bool _isListening = false;
  bool _isAvailable = false;
  String _currentText = '';
  late AnimationController _animationController;
  late Animation<double> _pulseAnimation;

  @override
  void initState() {
    super.initState();
    _initSpeech();
    _animationController = AnimationController(
      duration: const Duration(milliseconds: 1000),
      vsync: this,
    );
    _pulseAnimation = Tween<double>(begin: 1.0, end: 1.2).animate(
      CurvedAnimation(
        parent: _animationController,
        curve: Curves.easeInOut,
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    _speech.stop();
    super.dispose();
  }

  Future<void> _initSpeech() async {
    try {
      _isAvailable = await _speech.initialize(
        onStatus: _onSpeechStatus,
        onError: _onSpeechError,
      );
      if (mounted) {
        setState(() {});
      }
    } catch (e) {
      debugPrint('Speech initialization error: $e');
    }
  }

  void _onSpeechStatus(String status) {
    if (status == 'done' || status == 'notListening') {
      if (mounted) {
        setState(() {
          _isListening = false;
        });
        _animationController.stop();
        _animationController.reset();
        
        if (_currentText.isNotEmpty) {
          widget.onResult(_currentText);
        }
      }
    }
  }

  void _onSpeechError(dynamic error) {
    debugPrint('Speech error: $error');
    if (mounted) {
      setState(() {
        _isListening = false;
      });
      _animationController.stop();
      _animationController.reset();
    }
  }

  Future<void> _startListening() async {
    if (!_isAvailable || !widget.enabled) return;
    
    setState(() {
      _isListening = true;
      _currentText = '';
    });
    
    _animationController.repeat(reverse: true);
    
    // Show listening dialog
    _showListeningDialog();
    
    await _speech.listen(
      onResult: (result) {
        setState(() {
          _currentText = result.recognizedWords;
        });
      },
      localeId: widget.locale,
      listenFor: const Duration(seconds: 30),
      pauseFor: const Duration(seconds: 3),
      partialResults: true,
      cancelOnError: true,
    );
  }

  Future<void> _stopListening() async {
    await _speech.stop();
    if (mounted) {
      setState(() {
        _isListening = false;
      });
      _animationController.stop();
      _animationController.reset();
      Navigator.of(context).pop(); // Close dialog
    }
  }

  void _showListeningDialog() {
    final l10n = AppLocalizations.of(context);
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (context) => _ListeningDialog(
        animation: _pulseAnimation,
        currentText: _currentText,
        isListening: _isListening,
        onStop: _stopListening,
        l10n: l10n,
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    final l10n = AppLocalizations.of(context);
    
    return IconButton(
      onPressed: widget.enabled && _isAvailable ? _startListening : null,
      icon: Icon(
        Icons.mic_rounded,
        color: widget.enabled && _isAvailable
            ? theme.colorScheme.primary
            : theme.colorScheme.onSurfaceVariant.withOpacity(0.5),
      ),
      iconSize: AppTheme.iconSizeLg,
      tooltip: l10n?.voiceSearchNotAvailable ?? 'Voice Search',
      style: IconButton.styleFrom(
        backgroundColor: theme.colorScheme.primaryContainer,
        minimumSize: const Size(AppTheme.minTouchTarget, AppTheme.minTouchTarget),
      ),
    );
  }
}

class _ListeningDialog extends StatelessWidget {
  final Animation<double> animation;
  final String currentText;
  final bool isListening;
  final VoidCallback onStop;
  final AppLocalizations? l10n;

  const _ListeningDialog({
    required this.animation,
    required this.currentText,
    required this.isListening,
    required this.onStop,
    required this.l10n,
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    
    return Dialog(
      backgroundColor: theme.colorScheme.surface,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(AppTheme.radiusXl),
      ),
      child: Padding(
        padding: const EdgeInsets.all(AppTheme.spacingXl),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            // Animated mic icon
            AnimatedBuilder(
              animation: animation,
              builder: (context, child) {
                return Transform.scale(
                  scale: animation.value,
                  child: Container(
                    width: 80,
                    height: 80,
                    decoration: BoxDecoration(
                      color: theme.colorScheme.primary.withOpacity(0.2),
                      shape: BoxShape.circle,
                    ),
                    child: Icon(
                      Icons.mic_rounded,
                      size: 40,
                      color: theme.colorScheme.primary,
                    ),
                  ),
                );
              },
            ),
            
            const SizedBox(height: AppTheme.spacingLg),
            
            // Listening text
            Text(
              l10n?.listening ?? 'Listening...',
              style: theme.textTheme.titleLarge,
            ),
            
            const SizedBox(height: AppTheme.spacingSm),
            
            Text(
              l10n?.speakNow ?? 'Speak now',
              style: theme.textTheme.bodyMedium?.copyWith(
                color: theme.colorScheme.onSurfaceVariant,
              ),
            ),
            
            const SizedBox(height: AppTheme.spacingLg),
            
            // Current recognized text
            Container(
              constraints: const BoxConstraints(minHeight: 60),
              padding: const EdgeInsets.all(AppTheme.spacingMd),
              decoration: BoxDecoration(
                color: theme.colorScheme.surfaceVariant,
                borderRadius: BorderRadius.circular(AppTheme.radiusMd),
              ),
              child: Center(
                child: Text(
                  currentText.isEmpty ? '...' : currentText,
                  style: theme.textTheme.bodyLarge?.copyWith(
                    fontStyle: currentText.isEmpty ? FontStyle.italic : FontStyle.normal,
                    color: currentText.isEmpty 
                        ? theme.colorScheme.onSurfaceVariant
                        : theme.colorScheme.onSurface,
                  ),
                  textAlign: TextAlign.center,
                ),
              ),
            ),
            
            const SizedBox(height: AppTheme.spacingLg),
            
            // Stop button
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: onStop,
                icon: const Icon(Icons.stop_rounded),
                label: Text(l10n?.get('stop') ?? 'Stop'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
